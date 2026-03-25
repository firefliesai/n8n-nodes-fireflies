import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getContactsQuery, handleOperationError } from '../../helpers';

export async function getContacts(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	try {
		const response = await callGraphQLApi.call(ef, getContactsQuery);

		return (response.contacts ?? []).map((contact: Record<string, any>) => ({
			json: {
				success: true,
				data: contact,
			},
		}));
	} catch (error) {
		const errorResponse = handleOperationError(
			ef.getNode(),
			error,
			ef.continueOnFail(),
			'getContacts'
		);

		return [{ json: errorResponse }];
	}
}
