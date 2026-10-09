import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getCurrentUserQuery, handleOperationError } from '../../helpers';

export async function getUser(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const id = ef.getNodeParameter('userId', index) as string;

    const response = await callGraphQLApi.call(ef, getCurrentUserQuery, { id });

    return { json: { success: true, data: response.user } };
  } catch (error) {
    return { json: handleOperationError(ef.getNode(), error, ef.continueOnFail(), 'getUser') };
  }
}
