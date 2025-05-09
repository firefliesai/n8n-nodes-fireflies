import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import axios from 'axios';

export async function executeGetUsers(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
  const response = await axios.post(
    'https://api.fireflies.ai/graphql',
    {
      query: `
        query Users {
          users {
            user_id
            email
            integrations
            user_groups {
              name
              handle
              id
            }
            name
            num_transcripts
            recent_transcript
            recent_meeting
            minutes_consumed
            is_admin
          }
        }
      `,
      variables: {
      },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return { json: response.data.data.users };
}