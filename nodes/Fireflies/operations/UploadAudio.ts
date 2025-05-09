import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import axios from 'axios';

export async function executeUploadAudio(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
  const url = this.getNodeParameter('url', i) as string;
  const title = this.getNodeParameter('title', i) as string;

  const response = await axios.post(
    'https://api.fireflies.ai/graphql',
    {
      query: `
        mutation UploadAudio($input: AudioUploadInput) {
          uploadAudio(input: $input) {
            success
            title
            message
          }
        }
      `,
      variables: {
        input: { url, title },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return { json: response.data.data.uploadAudio };
}
