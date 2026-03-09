import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getActiveMeetingsQuery } from '../../helpers';
import { handleOperationError } from '../../helpers';

export async function getActiveMeetings(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	try {
		const response = await callGraphQLApi.call(ef, getActiveMeetingsQuery, { input: {} });

		return (response.active_meetings ?? []).map((meeting: Record<string, any>) => ({
			json: {
				success: true,
				data: meeting,
			},
		}));
	} catch (error) {
		const errorResponse = handleOperationError(
			ef.getNode(),
			error,
			ef.continueOnFail(),
			'getActiveMeetings',
		);

		return [{ json: errorResponse }];
	}
}
