import * as user from './user';
import * as transcript from './transcript';
import * as aiApp from './aiApp';
import * as audio from './audio';

export const resourceOperationsFunctions: { [key: string]: { [key: string]: any } } = {
  user: {
    getCurrentUser: user.getCurrentUser,
    getUsers: user.getUsers,
  },
  transcript: {
    getTranscript: transcript.getTranscript,
    getTranscriptAnalytics: transcript.getTranscriptAnalytics,
    getTranscriptAudioUrl: transcript.getTranscriptAudioUrl,
    getTranscriptSummary: transcript.getTranscriptSummary,
    getTranscriptsList: transcript.getTranscriptsList,
    getTranscriptVideoUrl: transcript.getTranscriptVideoUrl,
  },
  aiApp: {
    getAIAppOutputs: aiApp.getAIAppOutputs,
  },
  audio: {
    uploadAudio: audio.uploadAudio,
  },
};
