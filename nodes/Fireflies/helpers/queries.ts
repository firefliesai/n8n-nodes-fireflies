export const getAIAppOutputsQuery = `
  query Apps($appId: String, $transcriptId: String, $skip: Float, $limit: Float) {
    apps(app_id: $appId, transcript_id: $transcriptId, skip: $skip, limit: $limit) {
      outputs {
        transcript_id
        user_id
        app_id
        created_at
        title
        prompt
        response
      }
    }
  }
`;

export const uploadAudioMutation = `
  mutation UploadAudio($input: AudioUploadInput) {
    uploadAudio(input: $input) {
      success
      title
      message
    }
}
`;


export const getUsersQuery = `
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
`;

export const getTranscriptsListQuery = `
  query GetTranscriptsList($title: String, $date: Float, $fromDate: DateTime, $toDate: DateTime, $limit: Int, $skip: Int, $hostEmail: String, $organizerEmail: String, $participantEmail: String, $userId: String, $mine: Boolean) {
    transcripts(title: $title, date: $date, fromDate: $fromDate, toDate: $toDate, limit: $limit, skip: $skip, host_email: $hostEmail, organizer_email: $organizerEmail, participant_email: $participantEmail, user_id: $userId, mine: $mine) {
      id
      title
      organizer_email
      participants
      meeting_link
      dateString
    }
  }
`;

export const getTranscriptSummaryQuery = `
  query GetTranscriptSummary($transcriptId: String!) {
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
`;

export const getTranscriptAnalyticsQuery = `
  query GetTranscriptAnalytics($transcriptId: String!) {
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
`;

export const getTranscriptQuery = `
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
`;

export const getCurrentUserQuery = `
  query CurrentUser {
    user {
      user_id
      email
      name
      is_admin
      integrations
      user_groups {
        name
        handle
        id
      }
      num_transcripts
      recent_transcript
      recent_meeting
      minutes_consumed
    }
  }
`;