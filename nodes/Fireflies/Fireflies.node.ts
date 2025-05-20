import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeApiError,
} from 'n8n-workflow';

import { firefliesNodeProperties } from './properties';
import { resourceOperationsFunctions } from './operations';

export class Fireflies implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fireflies',
		name: 'fireflies',
		group: ['transform'],
		icon: 'file:fireflies.svg',
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Interact with the Fireflies.ai API',
		defaults: {
			name: 'Fireflies',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'firefliesApi',
				required: true,
			},
		],
		properties: firefliesNodeProperties,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Look up the function for the selected resource and operation
		const fn = resourceOperationsFunctions[resource]?.[operation];

		// If the function is not found, return an error
		if (!fn) {
			throw new NodeApiError(this.getNode(), {
				message: 'Operation not supported',
				description: `The operation "${operation}" for resource "${resource}" is not supported!`,
			});
		}

		try {
			const responseData = await fn(this);
			
			return [this.helpers.returnJsonArray(responseData)];
		} catch (error) {
			if (this.continueOnFail()) {
				return [[{ json: { error: error.message } }]];
			}
			throw error;
		}
	}
}
