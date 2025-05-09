import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import axios from 'axios';

export async function executeGetMeetingAnalytics(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
    const transcriptId = this.getNodeParameter('transcriptId', i) as string;

    const response = await axios.post(
        'http://api.fireflies.ai/graphql',
        {
            query: `
            query GetMeetingAnalytics($transcriptId: String!) {
                transcript(id: $transcriptId) {
                    id
                    title
                    analytics {
                        sentiments {
                            negative_pct
                            neutral_pct
                            positive_pct
                        }
                        categories {
                            questions
                            date_times
                            metrics
                            tasks
                        }
                        speakers {
                            speaker_id
                            name
                            duration
                            word_count
                            longest_monologue
                            monologues_count
                            filler_words
                            questions
                            duration_pct
                            words_per_minute
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
