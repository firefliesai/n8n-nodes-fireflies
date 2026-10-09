import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
  NodeApiError,
} from 'n8n-workflow';

import { firefliesNodeProperties } from './resources';
import { resourceOperationsFunctions } from './operations';
import { buildSkippedRateLimitItem, isRateLimitErrorItem } from './helpers/errors';

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
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    // Set once an item comes back rate limited under Continue On Fail: the
    // rest of the run is not sent (each request during a block extends it)
    // and every remaining item gets the same error item, marked `skipped`.
    let rateLimited: INodeExecutionData | undefined;

    for (let i = 0; i < items.length; i++) {
      if (rateLimited) {
        returnData.push(buildSkippedRateLimitItem(rateLimited, i));
        continue;
      }

      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      // Look up the function for the selected resource and operation
      const fn = resourceOperationsFunctions[resource]?.[operation];

      // If the function is not found, return an error
      if (!fn) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: `Operation "${operation}" for resource "${resource}" is not supported!`,
            },
            pairedItem: i,
          });
          continue;
        }
        throw new NodeApiError(this.getNode(), {
          message: 'Operation not supported',
          description: `The operation "${operation}" for resource "${resource}" is not supported!`,
        });
      }

      try {
        const responseData = await fn(this, i);
        const outputItems = this.helpers.returnJsonArray(responseData);
        returnData.push(...outputItems);
        rateLimited = outputItems.find(isRateLimitErrorItem);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: error.message }, pairedItem: i });
          continue;
        }
        throw new NodeApiError(this.getNode(), error, { itemIndex: i });
      }
    }

    return [returnData];
  }
}
