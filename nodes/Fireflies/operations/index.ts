import * as user from './user';
import * as transcript from './transcript';
import * as aiApp from './aiApp';
import * as audio from './audio';
import * as askfred from './askfred';
import * as meeting from './meeting';
import * as channel from './channel';
import * as bite from './bite';
import * as contact from './contact';
import * as teamAnalytics from './teamAnalytics';
import * as auditEvent from './auditEvent';
import * as ruleExecution from './ruleExecution';

export const resourceOperationsFunctions: { [key: string]: { [key: string]: any } } = {
  user: {
    getCurrentUser: user.getCurrentUser,
    getUser: user.getUser,
    getUsers: user.getUsers,
    getUserGroups: user.getUserGroups,
    setUserRole: user.setUserRole,
    addUserToUserGroup: user.addUserToUserGroup,
    removeUserFromUserGroup: user.removeUserFromUserGroup,
  },
  transcript: {
    getTranscript: transcript.getTranscript,
    getTranscriptAnalytics: transcript.getTranscriptAnalytics,
    getTranscriptAudioUrl: transcript.getTranscriptAudioUrl,
    getTranscriptSummary: transcript.getTranscriptSummary,
    getTranscriptsList: transcript.getTranscriptsList,
    getTranscriptVideoUrl: transcript.getTranscriptVideoUrl,
    deleteTranscript: transcript.deleteTranscript,
    updateMeetingTitle: transcript.updateMeetingTitle,
    updateMeetingPrivacy: transcript.updateMeetingPrivacy,
    updateMeetingChannel: transcript.updateMeetingChannel,
    shareMeeting: transcript.shareMeeting,
    revokeSharedMeetingAccess: transcript.revokeSharedMeetingAccess,
  },
  aiApp: {
    getAIAppOutputs: aiApp.getAIAppOutputs,
  },
  audio: {
    uploadAudio: audio.uploadAudio,
    uploadFile: audio.uploadFile,
  },
  askfred: {
    getThreads: askfred.getThreads,
    getThread: askfred.getThread,
    createThread: askfred.createThread,
    continueThread: askfred.continueThread,
    deleteThread: askfred.deleteThread,
  },
  meeting: {
    getActiveMeetings: meeting.getActiveMeetings,
    addToLiveMeeting: meeting.addToLiveMeeting,
    updateMeetingState: meeting.updateMeetingState,
    createLiveActionItem: meeting.createLiveActionItem,
    createLiveSoundbite: meeting.createLiveSoundbite,
    getLiveActionItems: meeting.getLiveActionItems,
  },
  channel: {
    getChannels: channel.getChannels,
    getChannel: channel.getChannel,
  },
  bite: {
    getBites: bite.getBites,
    getBite: bite.getBite,
    createBite: bite.createBite,
  },
  contact: {
    getContacts: contact.getContacts,
  },
  teamAnalytics: {
    getTeamAnalytics: teamAnalytics.getTeamAnalytics,
  },
  auditEvent: {
    getAuditEvents: auditEvent.getAuditEvents,
  },
  ruleExecution: {
    getRuleExecutions: ruleExecution.getRuleExecutions,
  },
};
