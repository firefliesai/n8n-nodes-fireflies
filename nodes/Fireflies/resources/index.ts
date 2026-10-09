import { INodeProperties } from 'n8n-workflow';
import { transcriptFields } from './transcript.fields';
import { aiAppFields } from './aiApp.fields';
import { audioFields } from './audio.fields';
import { askfredFields } from './askfred.fields';
import { userFields } from './user.fields';
import { meetingFields } from './meeting.fields';
import { channelFields } from './channel.fields';
import { biteFields } from './bite.fields';
import { contactFields } from './contact.fields';
import { teamAnalyticsFields } from './teamAnalytics.fields';
import { auditEventFields } from './auditEvent.fields';
import { ruleExecutionFields } from './ruleExecution.fields';
import { userOperations } from './user.properties';
import { transcriptOperations } from './transcript.properties';
import { aiAppOperations } from './aiApp.properties';
import { audioOperations } from './audio.properties';
import { askfredOperations } from './askfred.properties';
import { meetingOperations } from './meeting.properties';
import { channelOperations } from './channel.properties';
import { biteOperations } from './bite.properties';
import { contactOperations } from './contact.properties';
import { teamAnalyticsOperations } from './teamAnalytics.properties';
import { auditEventOperations } from './auditEvent.properties';
import { ruleExecutionOperations } from './ruleExecution.properties';

const resourcesOptions: INodeProperties = {
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  noDataExpression: true,
  options: [
    { name: 'AI App', value: 'aiApp' },
    { name: 'AskFred', value: 'askfred' },
    { name: 'Audio', value: 'audio' },
    { name: 'Audit Event', value: 'auditEvent' },
    { name: 'Bite', value: 'bite' },
    { name: 'Channel', value: 'channel' },
    { name: 'Contact', value: 'contact' },
    { name: 'Meeting', value: 'meeting' },
    { name: 'Rule Execution', value: 'ruleExecution' },
    { name: 'Team Analytics', value: 'teamAnalytics' },
    { name: 'Transcript', value: 'transcript' },
    { name: 'User', value: 'user' },
  ],
  default: 'transcript',
};

export const firefliesNodeProperties = [
  resourcesOptions,
  aiAppOperations,
  askfredOperations,
  audioOperations,
  auditEventOperations,
  biteOperations,
  channelOperations,
  contactOperations,
  meetingOperations,
  ruleExecutionOperations,
  teamAnalyticsOperations,
  transcriptOperations,
  userOperations,
  ...aiAppFields,
  ...askfredFields,
  ...audioFields,
  ...auditEventFields,
  ...biteFields,
  ...channelFields,
  ...contactFields,
  ...meetingFields,
  ...ruleExecutionFields,
  ...teamAnalyticsFields,
  ...transcriptFields,
  ...userFields,
];
