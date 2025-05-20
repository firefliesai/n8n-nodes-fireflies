import * as operations from './index';

// Map all operations by resource and operation
export const resourceOperationsFunctions: { [key: string]: { [key: string]: any } } = {
	user: {
		getCurrentUser: operations.user.getCurrentUser,
		getUsers: operations.user.getUsers,
	},
	transcript: {
		getTranscript: operations.transcript.getTranscript,
		getTranscriptAnalytics: operations.transcript.getTranscriptAnalytics,
		getTranscriptSummary: operations.transcript.getTranscriptSummary,
		getTranscriptsList: operations.transcript.getTranscriptsList,
	},
	aiApp: {
		getAIAppOutputs: operations.aiApp.getAIAppOutputs,
	},
	audio: {
		uploadAudio: operations.audio.uploadAudio,
	},
}; 