import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import axios from 'axios';

export async function executeGetTranscript(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
	const transcriptId = this.getNodeParameter('transcriptId', i) as string;

	const response = await axios.post(
		'http://api.fireflies.ai/graphql',
		{
			query: `
        query Transcript($transcriptId: String!) {
          transcript(id: $transcriptId) {
			id
			sentences {
			index
			speaker_name
			speaker_id
			raw_text
			start_time
			end_time
			ai_filters {
				text_cleanup
				task
				pricing
				metric
				question
				date_and_time
				sentiment
			}
			text
			}
			title
			host_email
			organizer_email
			user {
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
			fireflies_users
			privacy
			participants
			date
			duration
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
			meeting_info {
			silent_meeting
			summary_status
			fred_joined
			}
			transcript_url
			audio_url
			video_url
			dateString
			meeting_attendees {
			displayName
			email
			phoneNumber
			name
			location
			}
			speakers {
			id
			name
			}
			calendar_id
			cal_id
			calendar_type
			meeting_link
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
