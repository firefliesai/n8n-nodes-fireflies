import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getAIAppOutputsQuery } from '../helpers/queries';

export async function executeGetAIAppOutputs(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
  const appId = this.getNodeParameter('appId', i, '') as string;
  const transcriptId = this.getNodeParameter('transcriptId', i, '') as string;
  const returnAll = this.getNodeParameter('returnAll', i, false) as boolean;
  const limit = returnAll ? null : this.getNodeParameter('limit', i, 10) as number;
  const skip = this.getNodeParameter('skip', i, 0) as number;

  const response = await callGraphQLApi.call(this, getAIAppOutputsQuery, {
    appId: appId || undefined,
    transcriptId: transcriptId || undefined,
    skip,
    limit: limit || undefined,
  });

  return response.apps.outputs.map((output: any) => ({ json: output }));
}

export const GetAIAppOutputsProperties: INodeProperties[] = [
  {
    displayName: 'App ID',
    name: 'appId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        operation: ['getAIAppOutputs'],
      },
    },
    description: 'ID of the app to get outputs for',
  },
  {
    displayName: 'Transcript ID',
    name: 'transcriptId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        operation: ['getAIAppOutputs'],
      },
    },
    description: 'ID of the transcript to get app outputs for',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        operation: ['getAIAppOutputs'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
	typeOptions: {
		minValue: 1,
	},
    displayOptions: {
      show: {
        operation: ['getAIAppOutputs'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Skip',
    name: 'skip',
    type: 'number',
    default: 0,
    displayOptions: {
      show: {
        operation: ['getAIAppOutputs'],
      },
    },
    description: 'Number of results to skip',
  },
];
