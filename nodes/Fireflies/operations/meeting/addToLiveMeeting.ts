import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { addToLiveMeetingMutation, handleOperationError } from '../../helpers';

export async function addToLiveMeeting(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
	try {
		const meetingLink = ef.getNodeParameter('meetingLink', index) as string;

		const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
			title?: string;
			meetingPassword?: string;
			duration?: number;
			language?: string;
		};

		const variables: Record<string, any> = {
			meetingLink,
			...(additionalFields.title && { title: additionalFields.title }),
			...(additionalFields.meetingPassword && { meetingPassword: additionalFields.meetingPassword }),
			...(additionalFields.duration !== undefined && { duration: additionalFields.duration }),
			...(additionalFields.language && { language: additionalFields.language }),
		};

		const response = await callGraphQLApi.call(ef, addToLiveMeetingMutation, variables);

		const result = response.addToLiveMeeting;
		return {
			json: {
				success: Boolean(result?.success),
				data: result,
			},
		};
	} catch (error) {
		const errorResponse = handleOperationError(
			ef.getNode(),
			error,
			ef.continueOnFail(),
			'addToLiveMeeting',
		);

		return {
			json: errorResponse,
		};
	}
}
