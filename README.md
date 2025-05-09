# Fireflies Node for n8n

This node allows you to interact with the [Fireflies.ai](https://fireflies.ai) API, enabling you to automate tasks related to meeting transcriptions, analytics, and more.

## Operations

The Fireflies node supports the following operations:

- **Get AI App Outputs**: Retrieve outputs from AI applications integrated with Fireflies
- **Get Meeting Analytics**: Fetch analytics data for a specific meeting transcript
- **Get Meeting Summary**: Get a summary of a meeting transcript
- **Get Transcript**: Fetch a complete transcript by ID
- **Get Transcripts List**: Retrieve a list of available transcripts
- **Get Users**: Get information about users in your Fireflies organization
- **Upload Audio**: Upload an audio file for transcription

## Prerequisites

- You need a Fireflies.ai account
- You need to obtain an API key from your Fireflies account settings

## Authentication

This node uses API Key authentication. To obtain your API key:

1. Log in to your Fireflies.ai account
2. Go to Settings > API
3. Generate or copy your existing API key

## Example Usage

### Get a Transcript

1. Add a Fireflies node to your workflow
2. Select the "Get Transcript" operation
3. Enter the Transcript ID
4. Execute the workflow to retrieve the complete transcript data

### Upload Audio for Transcription

1. Add a Fireflies node to your workflow
2. Select the "Upload Audio" operation
3. Configure the required parameters (title, audio file, etc.)
4. Execute the workflow to upload and transcribe the audio file

## Additional Resources

- [Fireflies API Documentation](https://docs.fireflies.ai)
- [n8n Documentation](https://docs.n8n.io)
