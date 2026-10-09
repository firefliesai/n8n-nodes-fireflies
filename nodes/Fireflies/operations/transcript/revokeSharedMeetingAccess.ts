import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi, FirefliesRateLimitError } from '../../transport';
import { revokeSharedMeetingAccessMutation, handleOperationError } from '../../helpers';

export async function revokeSharedMeetingAccess(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
    const emails = ef.getNodeParameter('emails', index) as string;

    const emailArray = emails
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean);
    if (emailArray.length === 0) {
      throw new Error('At least one valid email address is required');
    }

    const results: Array<{ email: string; success: boolean; message?: string; error?: string }> =
      [];

    for (const [position, email] of emailArray.entries()) {
      try {
        const response = await callGraphQLApi.call(ef, revokeSharedMeetingAccessMutation, {
          input: { meeting_id: transcriptId, email },
        });
        const result = response.revokeSharedMeetingAccess;
        results.push({
          email,
          success: Boolean(result?.success),
          message: result?.message,
        });
      } catch (perEmailError) {
        // Out of rate-limit retries: every remaining address would be rejected
        // (and retried) the same way, so stop here and surface the structured
        // wait through handleOperationError instead of a per-address message.
        // The addresses already processed and the ones never attempted ride on
        // the error, because the earlier revocations have taken effect and a
        // workflow needs to know which addresses still need the re-run.
        if (perEmailError instanceof FirefliesRateLimitError) {
          const pending = emailArray.slice(position);
          throw perEmailError.withPartialProgress({
            completed: results.map((r) => ({ ...r })),
            pending,
            summary:
              `Before the limit was reached, ${results.length} of ${emailArray.length} addresses were processed` +
              `${results.length ? ` (${results.map((r) => r.email).join(', ')})` : ''}; ` +
              `${pending.length} not attempted (${pending.join(', ')}).`,
          });
        }
        results.push({
          email,
          success: false,
          error: perEmailError instanceof Error ? perEmailError.message : String(perEmailError),
        });
      }
    }

    return {
      json: {
        success: results.every((r) => r.success),
        data: results,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'revokeSharedMeetingAccess',
    );

    return {
      json: errorResponse,
    };
  }
}
