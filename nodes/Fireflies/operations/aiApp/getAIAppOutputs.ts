import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getAIAppOutputsQuery } from '../../helpers/queries';

export async function getAIAppOutputs(ef: IExecuteFunctions): Promise<INodeExecutionData[]> {
	try {
		const appId = ef.getNodeParameter('appId', 0, '') as string;
		const transcriptId = ef.getNodeParameter('transcriptId', 0, '') as string;
		const returnAll = ef.getNodeParameter('returnAll', 0, false) as boolean;
		const limit = returnAll ? null : ef.getNodeParameter('limit', 0, 50) as number;
		const skip = ef.getNodeParameter('skip', 0, 0) as number;

		const response = await callGraphQLApi.call(ef, getAIAppOutputsQuery, {
			appId: appId || undefined,
			transcriptId: transcriptId || undefined,
			skip,
			limit: limit || undefined,
		});

		return response.apps.outputs.map((output: any) => ({
			json: {
				success: true,
				data: output,
			},
		}));
	} catch (error) {
		const errorData = {
			success: false,
			error: {
				message: error.message,
				details: 'Error retrieving AI app outputs',
				code: error.code || 'UNKNOWN_ERROR',
				timestamp: new Date().toISOString(),
			},
		};

		if (!ef.continueOnFail()) {
			throw new NodeOperationError(ef.getNode(), error.message, {
				message: errorData.error.message,
				description: errorData.error.details,
			});
		}

		return [{ json: errorData }];
	}
} 