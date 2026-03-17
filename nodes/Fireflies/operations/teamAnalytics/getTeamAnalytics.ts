import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getTeamAnalyticsQuery, handleOperationError } from '../../helpers';

export async function getTeamAnalytics(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
	try {
		const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
			startTime?: string;
			endTime?: string;
		};

		const variables: Record<string, string> = {};
		if (additionalFields.startTime) variables.startTime = additionalFields.startTime;
		if (additionalFields.endTime) variables.endTime = additionalFields.endTime;

		const response = await callGraphQLApi.call(ef, getTeamAnalyticsQuery, variables);

		return {
			json: {
				success: true,
				data: response.analytics,
			},
		};
	} catch (error) {
		const errorResponse = handleOperationError(
			ef.getNode(),
			error,
			ef.continueOnFail(),
			'getTeamAnalytics',
		);

		return {
			json: errorResponse,
		};
	}
}
