import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import {
  confirmUploadMutation,
  createUploadUrlMutation,
  handleOperationError,
} from '../../helpers';

/**
 * Direct upload: the three-step flow the API documents for `createUploadUrl`
 * and `confirmUpload`, done in one operation so a workflow can hand the node a
 * binary property instead of a public URL.
 *
 *   1. createUploadUrl -> a pre-signed URL and the meeting id
 *   2. PUT the file bytes to that URL (no Fireflies credentials: the URL is signed)
 *   3. confirmUpload -> transcription is queued
 *
 * The API gates both mutations behind direct-upload access, which is not
 * generally available; without it step 1 fails with `forbidden`.
 */
export async function uploadFile(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
  try {
    const binaryPropertyName = ef.getNodeParameter('binaryPropertyName', index) as string;
    const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
      title?: string;
      custom_language?: string;
      content_type?: string;
      attendees?: {
        attendeeValues: Array<{ displayName: string; email: string; phoneNumber: string }>;
      };
    };

    const binaryData = ef.helpers.assertBinaryData(index, binaryPropertyName);
    const fileBuffer = await ef.helpers.getBinaryDataBuffer(index, binaryPropertyName);
    const contentType = additionalFields.content_type || binaryData.mimeType;
    if (!contentType) {
      throw new NodeOperationError(
        ef.getNode(),
        `The binary property "${binaryPropertyName}" has no MIME type; set Content Type`,
        { itemIndex: index },
      );
    }

    const input: Record<string, unknown> = {
      content_type: contentType,
      file_size: fileBuffer.length,
    };
    const title = additionalFields.title || binaryData.fileName;
    if (title) input.title = title;
    if (additionalFields.custom_language) input.custom_language = additionalFields.custom_language;
    if (additionalFields.attendees?.attendeeValues?.length) {
      input.attendees = additionalFields.attendees.attendeeValues.map((attendee) => ({
        displayName: attendee.displayName,
        email: attendee.email,
        phoneNumber: attendee.phoneNumber,
      }));
    }

    const created = (await callGraphQLApi.call(ef, createUploadUrlMutation, { input }))
      .createUploadUrl as { upload_url: string; meeting_id: string; expires_at: string };

    await ef.helpers.httpRequest({
      method: 'PUT',
      url: created.upload_url,
      body: fileBuffer,
      headers: { 'Content-Type': contentType },
    });

    const confirmed = (
      await callGraphQLApi.call(ef, confirmUploadMutation, {
        input: { meeting_id: created.meeting_id },
      })
    ).confirmUpload;

    return {
      json: {
        success: Boolean(confirmed?.success),
        data: { ...confirmed, meeting_id: confirmed?.meeting_id ?? created.meeting_id },
      },
    };
  } catch (error) {
    return { json: handleOperationError(ef.getNode(), error, ef.continueOnFail(), 'uploadFile') };
  }
}
