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

The **Fireflies** node supports 12 resources and 42 operations, covering every query and mutation of the public API, via the [Fireflies.ai API](https://docs.fireflies.ai).

### AI App

- **Get AI App Outputs** — retrieve results from AI apps installed in the workspace; optional filters: `appId`, `transcriptId`, `skip`, `limit`

### AskFred

AskFred is Fireflies' AI assistant for querying your meetings in natural language.

- **Get Threads** — list all AskFred conversation threads; optional filter: `transcriptId`
- **Get Thread** — get a specific thread with all its messages
- **Create Thread** — start a new conversation; supports meeting filters (`dateRange`, `participants`, `organizers`, `channels`, `transcriptIds`) and response options (`language`, `format`, `generateSuggestions`)
- **Continue Thread** — add a follow-up question to an existing thread
- **Delete Thread** — remove a thread and all its messages

### Audio

- **Upload Audio** — upload an audio file from a URL for transcription; optional: `webhook`, `customLanguage`, `meetingDate`, `saveVideo`, `bypass_size_check`, `download_auth` (bearer token / basic auth / none), `attendees`, `client_reference_id`
- **Upload File** — upload a binary audio or video file directly (no public URL needed); optional: `title`, `customLanguage`, `contentType`, `attendees`. Requires direct-upload access, which is not generally available

### Audit Event

- **Get Many** — your team's audit events (meeting, team, user and authentication activity); requires `category`; optional filters: `action`, `actorEmail`, `actorUserId`, `dateFrom`, `dateTo`, `cursor`; supports Return All. Requires a team admin on Enterprise

### Bite

Bites are short video or audio clips created from a transcript.

- **Get List** — list bite clips; optional filters: `mine`, `transcriptId`, `myTeam`, `limit`, `skip`
- **Get** — get a specific bite by ID
- **Create** — create a bite from a transcript; requires `transcriptId`, `startTime`, `endTime`; optional: `name`, `mediaType` (audio / video), `privacies`

### Channel

- **Get List** — list all channels in the workspace
- **Get** — get a specific channel by ID

### Contact

- **Get List** — list all contacts in the workspace

### Meeting

- **Get Active Meetings** — list currently active/live meetings; optional filters: `email`, `states` (active / paused)
- **Add to Live Meeting** — add the Fireflies bot to an active meeting; requires `meetingLink`; optional: `title`, `meetingPassword`, `duration` (15–120 minutes), `language`, `attendees`
- **Pause or Resume Recording** — pause or resume the bot in a live meeting
- **Create Live Action Item** — ask Fred to create an action item during a live meeting from a plain-language `prompt`
- **Create Live Soundbite** — ask Fred to create a soundbite during a live meeting from a plain-language `prompt`
- **Get Live Action Items** — list the action items created during a live meeting

The four live-meeting operations need the meeting ID from **Get Active Meetings**. Each is limited to 10 requests per hour, and the two Fred operations use AI credits.

### Rule Execution

- **Get Many** — automation rule executions grouped by meeting; optional filters: `ruleId`, `meetingId`, `dateFrom`, `dateTo`, test or production executions, `logsPerMeeting`, `cursor`; supports Return All. Requires an Enterprise plan

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
- **Share** — share a meeting with email addresses; optional: `expiryDays`, `shareType` (email / password link), `password`
- **Revoke Shared Access** — revoke shared access from specified email addresses
- **Update Title** — update the meeting title
- **Update Privacy** — change the privacy setting (`link` / `owner` / `participants` / `participatingteammates` / `teammates` / `teammatesandparticipants`)
- **Update Channel** — move a meeting to a different channel

### User

- **Get** — get a teammate's profile by user ID
- **Get Current User** — get the profile of the authenticated user
- **Get List** — list all users in the workspace
- **Get Groups** — list user groups; optional filter: `mine`
- **Add to Group** / **Remove From Group** — manage user group membership by email; requires a team admin on Business or higher
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

### Rate limits

The Fireflies API enforces per-plan request limits (per minute, and per day on Free and Pro); the current numbers are in the [Limits](https://docs.fireflies.ai/fundamentals/limits) documentation. When a request is rejected as `too_many_requests`, the node waits for the time the API asks for (`Retry-After`) and retries up to two times, as long as the wait is about a minute or less (a per-minute limit). A longer wait, such as a daily quota, fails the item at once with an error that states the wait in seconds, e.g. `Fireflies API rate limit reached. Retry after 3600 seconds.`, so a workflow never blocks for hours. With **Continue On Fail** the error item carries `retryAfterSeconds` and `retryAt`, and the remaining input items of that run are not sent (each gets the same error item, marked `skipped`), because every request sent during a block extends it. n8n's **Retry On Fail** cannot cover such a wait (at most 5 tries, at most 5 seconds apart) and would only extend the block; branch on `retryAt` or pause with a **Wait** node instead, then send the remaining items.

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

### 2.3.0

- 🚦 **Rate limit handling**: a `429 Too Many Requests` / `too_many_requests` response is retried after the API's `Retry-After` (up to two retries, waits of about a minute or less); longer waits fail immediately with an error stating the wait in seconds and linking the [Limits](https://docs.fireflies.ai/fundamentals/limits) docs. With **Continue On Fail** the error item carries `retryAfterSeconds` and `retryAt`, and the run's remaining items are skipped instead of being sent into the block
- ✨ **Full API coverage**: every query and mutation of the public API is now available
  - **New resources**: Audit Event (`Get Many`) and Rule Execution (`Get Many`), both with Return All pagination
  - **Meeting**: `Pause or Resume Recording`, `Create Live Action Item`, `Create Live Soundbite`, `Get Live Action Items`; `Get Active Meetings` filters by email and state; `Add to Live Meeting` takes attendees
  - **User**: `Get` (by ID), `Add to Group`, `Remove From Group`
  - **Audio**: `Upload File` for direct binary uploads (requires direct-upload access); `Upload Audio` takes a meeting date
  - **Transcript**: `Share` supports password links; `Update Privacy` adds participating teammates; `Get List` returns more fields (date, duration, privacy, attendees, channels, and more) and `Scope` is a dropdown; summaries include `notes`
  - **AskFred**: `Create Thread` and `Continue Thread` can generate suggested follow-up questions
- 🐛 **Fixes**: `Upload Audio` now sends attendees and download authentication in the shape the API accepts (both were rejected before); `Create Bite` media type is a dropdown
- 🧪 **Tests**: a Jest suite (`npm test`, run on every pull request) covers rate limiting and every new operation, and a contract test checks every GraphQL document, every API operation and every enum option against the public API schema

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
