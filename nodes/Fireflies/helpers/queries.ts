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
  query GetTranscriptsList($title: String, $date: Float, $fromDate: DateTime, $toDate: DateTime, $limit: Int, $skip: Int, $hostEmail: String, $organizerEmail: String, $participantEmail: String, $userId: String, $mine: Boolean, $keyword: String, $scope: String, $organizers: [String!], $participants: [String!], $channelId: String) {
    transcripts(title: $title, date: $date, fromDate: $fromDate, toDate: $toDate, limit: $limit, skip: $skip, host_email: $hostEmail, organizer_email: $organizerEmail, participant_email: $participantEmail, user_id: $userId, mine: $mine, keyword: $keyword, scope: $scope, organizers: $organizers, participants: $participants, channel_id: $channelId) {
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
      is_live
      meeting_attendance {
        name
        join_time
        leave_time
      }
      workspace_users
      channels {
        id
        title
        is_private
      }
      shared_with {
        email
        name
        photo_url
        expires_at
      }
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

export const getTranscriptVideoUrlQuery = `
  query GetTranscriptVideoUrl($transcriptId: String!) {
    transcript(id: $transcriptId) {
      id
      title
      video_url
      dateString
    }
  }
`;

export const getTranscriptAudioUrlQuery = `
  query GetTranscriptAudioUrl($transcriptId: String!) {
    transcript(id: $transcriptId) {
      id
      title
      audio_url
      dateString
    }
  }
`;

// AskFred queries and mutations
export const getAskFredThreadsQuery = `
  query AskFredThreads($transcriptId: String) {
    askfred_threads(transcript_id: $transcriptId) {
      id
      title
      transcript_id
      user_id
      created_at
    }
  }
`;

export const getAskFredThreadQuery = `
  query AskFredThread($id: String!) {
    askfred_thread(id: $id) {
      id
      title
      transcript_id
      user_id
      created_at
      messages {
        id
        thread_id
        query
        answer
        suggested_queries
        status
        created_at
        updated_at
      }
    }
  }
`;

export const createAskFredThreadMutation = `
  mutation CreateAskFredThread($input: CreateAskFredThreadInput!) {
    createAskFredThread(input: $input) {
      message {
        id
        thread_id
        query
        answer
        suggested_queries
        status
        created_at
        updated_at
      }
      cost
    }
  }
`;

export const continueAskFredThreadMutation = `
  mutation ContinueAskFredThread($input: ContinueAskFredThreadInput!) {
    continueAskFredThread(input: $input) {
      message {
        id
        thread_id
        query
        answer
        suggested_queries
        status
        created_at
        updated_at
      }
      cost
    }
  }
`;

export const deleteAskFredThreadMutation = `
  mutation DeleteAskFredThread($id: String!) {
    deleteAskFredThread(id: $id) {
      id
      title
      transcript_id
      user_id
      created_at
      messages {
        id
        thread_id
        query
        answer
        suggested_queries
        status
        created_at
        updated_at
      }
    }
  }
`;


export const getActiveMeetingsQuery = `
  query ActiveMeetings($input: GetActiveMeetingsInput) {
    active_meetings(input: $input) {
      id
      title
      organizer_email
      meeting_link
      start_time
      end_time
      privacy
      state
    }
  }
`;

export const getChannelsQuery = `
  query Channels {
    channels {
      id
      title
      is_private
      created_at
      updated_at
      created_by
      members {
        user_id
        email
        name
      }
    }
  }
`;

export const getChannelQuery = `
  query Channel($id: ID!) {
    channel(id: $id) {
      id
      title
      is_private
      created_at
      updated_at
      created_by
      members {
        user_id
        email
        name
      }
    }
  }
`;

export const getContactsQuery = `
  query Contacts {
    contacts {
      email
      name
      picture
      last_meeting_date
    }
  }
`;

export const getBitesQuery = `
  query Bites($mine: Boolean, $transcriptId: ID, $limit: Int, $myTeam: Boolean, $skip: Int) {
    bites(mine: $mine, transcript_id: $transcriptId, limit: $limit, my_team: $myTeam, skip: $skip) {
      id
      transcript_id
      name
      user_id
      start_time
      end_time
      summary
      status
      media_type
      thumbnail
      preview
      summary_status
      created_at
      created_from {
        description
        duration
        id
        name
        type
      }
      captions {
        end_time
        index
        speaker_id
        speaker_name
        start_time
        text
      }
      sources {
        src
        type
      }
      privacies
      user {
        first_name
        last_name
        picture
        name
        id
      }
    }
  }
`;

export const getBiteQuery = `
  query Bite($id: ID!) {
    bite(id: $id) {
      id
      transcript_id
      name
      user_id
      start_time
      end_time
      summary
      status
      media_type
      thumbnail
      preview
      summary_status
      created_at
      created_from {
        description
        duration
        id
        name
        type
      }
      captions {
        end_time
        index
        speaker_id
        speaker_name
        start_time
        text
      }
      sources {
        src
        type
      }
      privacies
      user {
        first_name
        last_name
        picture
        name
        id
      }
    }
  }
`;

export const createBiteMutation = `
  mutation CreateBite($transcriptId: ID!, $name: String, $startTime: Float!, $endTime: Float!, $mediaType: String, $privacies: [BitePrivacy!], $summary: String) {
    createBite(transcript_Id: $transcriptId, name: $name, start_time: $startTime, end_time: $endTime, media_type: $mediaType, privacies: $privacies, summary: $summary) {
      id
      transcript_id
      name
      start_time
      end_time
      summary
      status
    }
  }
`;

export const getTeamAnalyticsQuery = `
  query TeamAnalytics($startTime: String, $endTime: String) {
    analytics(start_time: $startTime, end_time: $endTime) {
      team {
        conversation {
          average_filler_words
          average_filler_words_diff_pct
          average_monologues_count
          average_monologues_count_diff_pct
          average_questions
          average_questions_diff_pct
          average_sentiments {
            negative_pct
            neutral_pct
            positive_pct
          }
          average_silence_duration
          average_silence_duration_diff_pct
          average_talk_listen_ratio
          average_words_per_minute
          longest_monologue_duration_sec
          longest_monologue_duration_diff_pct
          total_filler_words
          total_filler_words_diff_pct
          total_meeting_notes_count
          total_meetings_count
          total_monologues_count
          total_monologues_diff_pct
          teammates_count
          total_questions
          total_questions_diff_pct
          total_silence_duration
          total_silence_duration_diff_pct
        }
        meeting {
          count
          count_diff_pct
          duration
          duration_diff_pct
          average_count
          average_count_diff_pct
          average_duration
          average_duration_diff_pct
        }
      }
      users {
        user_id
        user_name
        user_email
        conversation {
          talk_listen_pct
          talk_listen_ratio
          total_silence_duration
          total_silence_duration_compare_to
          total_silence_pct
          total_silence_ratio
          total_speak_duration
          total_speak_duration_with_user
          total_word_count
          user_filler_words
          user_filler_words_compare_to
          user_filler_words_diff_pct
          user_longest_monologue_sec
          user_longest_monologue_compare_to
          user_longest_monologue_diff_pct
          user_monologues_count
          user_monologues_count_compare_to
          user_monologues_count_diff_pct
          user_questions
          user_questions_compare_to
          user_questions_diff_pct
          user_speak_duration
          user_word_count
          user_words_per_minute
          user_words_per_minute_compare_to
          user_words_per_minute_diff_pct
        }
        meeting {
          count
          count_diff
          count_diff_compared_to
          count_diff_pct
          duration
          duration_diff
          duration_diff_compared_to
          duration_diff_pct
        }
      }
    }
  }
`;

export const getUserGroupsQuery = `
  query UserGroups($mine: Boolean) {
    user_groups(mine: $mine) {
      id
      name
      handle
      members {
        user_id
        first_name
        last_name
        email
      }
    }
  }
`;

export const deleteTranscriptMutation = `
  mutation DeleteTranscript($id: String!) {
    deleteTranscript(id: $id) {
      id
      title
    }
  }
`;

export const updateMeetingTitleMutation = `
  mutation UpdateMeetingTitle($input: UpdateMeetingTitleInput!) {
    updateMeetingTitle(input: $input) {
      id
      title
    }
  }
`;

export const updateMeetingPrivacyMutation = `
  mutation UpdateMeetingPrivacy($input: UpdateMeetingPrivacyInput!) {
    updateMeetingPrivacy(input: $input) {
      id
      title
      privacy
    }
  }
`;

export const updateMeetingChannelMutation = `
  mutation UpdateMeetingChannel($input: UpdateMeetingChannelInput!) {
    updateMeetingChannel(input: $input) {
      id
      title
    }
  }
`;

export const addToLiveMeetingMutation = `
  mutation AddToLiveMeeting($meetingLink: String!, $title: String, $meetingPassword: String, $duration: Int, $language: String, $attendees: [AttendeeInput!]) {
    addToLiveMeeting(meeting_link: $meetingLink, title: $title, meeting_password: $meetingPassword, duration: $duration, language: $language, attendees: $attendees) {
      message
      success
    }
  }
`;

export const shareMeetingMutation = `
  mutation ShareMeeting($input: ShareMeetingInput!) {
    shareMeeting(input: $input) {
      success
      message
    }
  }
`;

export const revokeSharedMeetingAccessMutation = `
  mutation RevokeSharedMeetingAccess($input: RevokeSharedMeetingAccessInput!) {
    revokeSharedMeetingAccess(input: $input) {
      success
      message
    }
  }
`;

export const setUserRoleMutation = `
  mutation SetUserRole($userId: String!, $role: Role!) {
    setUserRole(user_id: $userId, role: $role) {
      user_id
      email
      name
      is_admin
    }
  }
`;
