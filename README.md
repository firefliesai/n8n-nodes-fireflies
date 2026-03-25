# n8n-nodes-fireflies

This is an n8n community node. It lets you use Fireflies.ai in your n8n workflows.

Fireflies is an AI meeting assistant that automatically records, transcribes, and analyzes your meetings. It integrates with popular video conferencing platforms to help teams capture and search through important meeting content.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)
[Usage](#usage)
[Credentials](#credentials)  
[Resources](#resources)  
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The **Fireflies** node supports 10 resources and 32 operations via the [Fireflies.ai API](https://docs.fireflies.ai).

### AI App

- **Get AI App Outputs** — retrieve results from AI apps installed in the workspace; optional filters: `appId`, `transcriptId`, `skip`, `limit`

### AskFred

AskFred is Fireflies' AI assistant for querying your meetings in natural language.

- **Get Threads** — list all AskFred conversation threads; optional filter: `transcriptId`
- **Get Thread** — get a specific thread with all its messages
- **Create Thread** — start a new conversation; supports meeting filters (`dateRange`, `participants`, `organizers`, `channels`, `transcriptIds`) and response options (`language`, `format`)
- **Continue Thread** — add a follow-up question to an existing thread
- **Delete Thread** — remove a thread and all its messages

### Audio

- **Upload Audio** — upload an audio file for transcription; optional: `webhook`, `customLanguage`, `saveVideo`, `bypass_size_check`, `download_auth` (bearer/basic), `attendees`, `client_reference_id`

### Bite

Bites are short video or audio clips created from a transcript.

- **Get List** — list bite clips; optional filters: `mine`, `transcriptId`, `myTeam`, `limit`, `skip`
- **Get** — get a specific bite by ID
- **Create** — create a bite from a transcript; requires `transcriptId`, `startTime`, `endTime`; optional: `name`, `mediaType`, `privacies`

### Channel

- **Get List** — list all channels in the workspace
- **Get** — get a specific channel by ID

### Contact

- **Get List** — list all contacts in the workspace

### Meeting

- **Get Active Meetings** — list currently active/live meetings
- **Add to Live Meeting** — add the Fireflies bot to an active meeting; requires `meetingLink`; optional: `title`, `meetingPassword`, `duration`, `language`

### Team Analytics

- **Get Team Analytics** — get analytics for the entire team; requires admin privileges; optional: `startTime`, `endTime` (ISO date strings)

### Transcript

- **Get** — get the full transcript by ID
- **Get List** — list transcripts with optional filters: `limit`, `skip`, `title`, `fromDate`, `toDate`, `hostEmail`, `organizerEmail`, `participantEmail`, `userId`, `mine`, `keyword`, `scope`, `organizers`, `participants`, `channelId`
- **Get Summary** — get the AI-generated summary for a transcript
- **Get Analytics** — get analytics (sentiment, topics, engagement) for a transcript
- **Get Audio URL** — get the audio download URL for a transcript
- **Get Video URL** — get the video download URL for a transcript
- **Delete** — permanently delete a transcript
- **Share** — share a meeting with email addresses; optional: `expiresAt`
- **Revoke Shared Access** — revoke shared access from specified email addresses
- **Update Title** — update the meeting title
- **Update Privacy** — change the privacy setting (`link` / `owner` / `participants` / `teammates` / `teammatesandparticipants`)
- **Update Channel** — move a meeting to a different channel

### User

- **Get Current User** — get the profile of the authenticated user
- **Get List** — list all users in the workspace
- **Get Groups** — list user groups; optional filter: `mine`
- **Set Role** — change a user's role (`admin` / `user`); requires admin privileges

---

## Usage

### Fetching and Chaining Transcripts

The **Get List** operation under Transcript retrieves a paginated list of meetings based on optional filters:

- `hostEmail`, `organizerEmail`, `participantEmail`
- `title`, `userId`, `mine`
- `fromDate` / `toDate`
- `keyword`, `scope`
- `organizers`, `participants` (comma-separated)
- `channelId`

This is often the first step in a workflow. Iterate over the returned transcript IDs and pass them into:

- **Get** — fetch the full transcript content
- **Get Summary** — retrieve [summary](https://docs.fireflies.ai/schema/summary) and key takeaways
- **Get Analytics** — access [analytics](https://docs.fireflies.ai/schema/analytics) like sentiment, topic extraction, and more

These operations chain naturally for reporting, insights, or downstream automation.

📘 For a full reference of transcript fields and response structure, see the [Fireflies Transcript Schema](https://docs.fireflies.ai/schema/transcript).

### Working with Bites

Bites are short clips cut from a transcript. Use **Create** to clip a specific time range from a meeting by providing `transcriptId`, `startTime`, and `endTime`. You can set a `name`, choose `mediaType` (audio or video), and control visibility with `privacies`.

Use **Get List** to browse existing bites, optionally filtering to your own clips (`mine`) or your team's (`myTeam`).

### Live Meetings

Use **Get Active Meetings** to see which meetings are currently in progress. Once you have a meeting link, **Add to Live Meeting** sends the Fireflies bot to join and record it. You can pass an optional `title`, `meetingPassword`, expected `duration`, and transcription `language`.

### Team Analytics

**Get Team Analytics** returns workspace-wide analytics and requires admin privileges. Pass `startTime` and `endTime` as ISO date strings to scope the report to a specific period.

## Credentials

To use the Fireflies node, you need to authenticate with your Fireflies API key.

1. Log in to your [Fireflies.ai](https://fireflies.ai) account
2. Go to Settings > Developer Settings
3. Generate or copy your existing API key
4. Use this API key in your n8n credentials for the Fireflies node

The node uses API Key authentication to securely connect to the Fireflies.ai API.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Fireflies.ai API documentation](https://docs.fireflies.ai)

## Version history

### 2.2.0

- ✨ **New Resources**: Meeting, Channel, Bite, Contact, Team Analytics
- 🆕 **New Operations**:
  - **Transcript**: `Delete`, `Share`, `Revoke Shared Access`, `Update Title`, `Update Privacy`, `Update Channel`
  - **User**: `Get Groups`, `Set Role`
  - **Meeting**: `Get Active Meetings`, `Add to Live Meeting`
  - **Channel**: `Get`, `Get List`
  - **Bite**: `Get`, `Get List`, `Create`
  - **Contact**: `Get List`
  - **Team Analytics**: `Get Team Analytics` (requires admin privileges)
- 🔍 **Extended Filters**: `Get Transcripts List` now supports filtering by keyword, scope, organizers, participants, and channel ID
- 🔧 **Audio Enhancements**: `Upload Audio` now supports `bypass_size_check` and `download_auth` (bearer/basic) for authenticated downloads

### 2.1.0

- ✨ **New Resource**: Added AskFred resource for AI-powered meeting Q&A
- 🆕 **New Operations**:
  - `Get Threads`: List all AskFred conversation threads
  - `Get Thread`: Retrieve a specific thread with all messages
  - `Create Thread`: Start a new conversation with AskFred
  - `Continue Thread`: Add follow-up questions to existing threads
  - `Delete Thread`: Remove threads and their messages
- 🔍 **Meeting Filters**: Create Thread supports filtering by date range, participants, organizers, channels, and transcript IDs
- 🌐 **Response Options**: Configurable response language and format mode (markdown/plaintext)

### 2.0.0

- ✨ **New Operations**: Added `GetTranscriptVideoUrl` and `GetTranscriptAudioUrl` operations for direct media access
- 🔧 **Enhanced Error Handling**: Comprehensive GraphQL error detection with detailed error codes and correlation IDs
- 🏗️ **Architecture Improvements**: Implemented generic error handling system for consistent error responses across all operations
- 📚 **Code Quality**: Refactored codebase for better maintainability and reduced duplication
- ⚠️ **Breaking Changes**: Removed `audio_url` and `video_url` from `GetTranscript` operation due to GraphQL API's partial data response behavior

### 1.0.7

- Fixed nodeParameter handling for all operations

### 1.0.6

- Removed unsupported field from getAiAppOutput operation

### 1.0.5

- Fixes bug in handling input data

### 1.0.4

- Major refactor to separate code into resources and operations

### 1.0.3

- Bump version due to inconsistent build

### 1.0.2

- Refactored Fireflies Node implementation
- Replaced axios with http helper
- Added test for credentials

### 1.0.1

- Fixed bugs in array responses

### 1.0.0

- Added operations Get AI App Outputs, Get Meeting Analytics, Get Meeting Summary, Get Transcript, Get Transcripts List, Get Users, and Upload Audio
- Initial release of the Fireflies.ai node for n8n
