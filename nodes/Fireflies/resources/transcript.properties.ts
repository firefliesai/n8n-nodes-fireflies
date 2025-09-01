import { INodeProperties } from 'n8n-workflow';

export const transcriptOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transcript'],
    },
  },
  options: [
    {
      name: 'Get',
      action: 'Get a transcript',
      description: 'Get transcript details',
      value: 'getTranscript',
    },
    {
      name: 'Get Analytics',
      action: 'Get analytics of a transcript',
      description: 'Get analytics for a transcript',
      value: 'getTranscriptAnalytics',
    },
    {
      name: 'Get Audio URL',
      action: 'Get audio URL of a transcript',
      description: 'Get the audio URL for a transcript',
      value: 'getTranscriptAudioUrl',
    },
    {
      name: 'Get List',
      action: 'Get a list of transcripts',
      description: 'Get a list of transcripts with optional filters',
      value: 'getTranscriptsList',
    },
    {
      name: 'Get Summary',
      action: 'Get a summary of a transcript',
      description: 'Get a summary of a transcript',
      value: 'getTranscriptSummary',
    },
    {
      name: 'Get Video URL',
      action: 'Get video URL of a transcript',
      description: 'Get the video URL for a transcript',
      value: 'getTranscriptVideoUrl',
    },
  ],
  default: 'getTranscript',
};
