import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { createBiteMutation, handleOperationError } from '../../helpers';

export async function createBite(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
    const startTime = ef.getNodeParameter('startTime', index) as number;
    const endTime = ef.getNodeParameter('endTime', index) as number;

    if (startTime < 0 || endTime <= startTime) {
      throw new Error('Invalid bite range: endTime must be greater than startTime, and startTime must be non-negative');
    }

    const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
      name?: string;
      mediaType?: string;
      privacies?: string;
      summary?: string;
    };

    const variables: Record<string, any> = { transcriptId, startTime, endTime };
    if (additionalFields.name) variables.name = additionalFields.name;
    if (additionalFields.mediaType) variables.mediaType = additionalFields.mediaType;
    if (additionalFields.privacies) {
      const privacies = additionalFields.privacies.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (privacies.length > 0) variables.privacies = privacies;
    }
    if (additionalFields.summary) variables.summary = additionalFields.summary;

    const response = await callGraphQLApi.call(ef, createBiteMutation, variables);

    return {
      json: {
        success: true,
        data: response.createBite,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'createBite'
    );

    return {
      json: errorResponse,
    };
  }
}
