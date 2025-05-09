import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import axios from 'axios';

export async function executeGetMeetingSummary(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
    const transcriptId = this.getNodeParameter('transcriptId', i) as string;

    const response = await axios.post(
        'http://api.fireflies.ai/graphql',
        {
            query: `
            query GetMeetingSummary($transcriptId: String!) {
                transcript(id: $transcriptId) {
                    summary {
                        keywords
                        action_items
                        outline
                        shorthand_bullet
                        overview
                        bullet_gist
                        gist
                        short_summary
                        short_overview
                        meeting_type
                        topics_discussed
                        transcript_chapters
                        extended_sections {
                            title
                            content
                        }
                    }
                }
            }
            `,
            variables: { transcriptId },
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        }
    );

    return { json: response.data.data.transcript };
}
