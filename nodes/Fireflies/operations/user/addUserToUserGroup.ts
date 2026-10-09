import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { addUserToUserGroupMutation, handleOperationError } from '../../helpers';

export async function addUserToUserGroup(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
  try {
    const groupId = ef.getNodeParameter('groupId', index) as string;
    const userEmail = ef.getNodeParameter('userEmail', index) as string;

    const response = await callGraphQLApi.call(ef, addUserToUserGroupMutation, {
      groupId,
      userEmail,
    });

    return { json: { success: true, data: response.addUserToUserGroup } };
  } catch (error) {
    return {
      json: handleOperationError(ef.getNode(), error, ef.continueOnFail(), 'addUserToUserGroup'),
    };
  }
}
