# n8n-nodes-fireflies

This is an n8n community node. It lets you use Fireflies.ai in your n8n workflows.

Fireflies is an AI meeting assistant that automatically records, transcribes, and analyzes your meetings. It integrates with popular video conferencing platforms to help teams capture and search through important meeting content.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Resources](#resources)  
[Version history](#version-history)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

The Fireflies node supports the following operations:

- **Get AI App Outputs**: Retrieve outputs from AI applications integrated with Fireflies
- **Get Meeting Analytics**: Fetch analytics data for a specific meeting transcript
- **Get Meeting Summary**: Get a summary of a meeting transcript
- **Get Transcript**: Fetch a complete transcript by ID
- **Get Transcripts List**: Retrieve a list of available transcripts
- **Get Users**: Get information about users in your Fireflies organization
- **Upload Audio**: Upload an audio file for transcription


## Credentials

To use the Fireflies node, you need to authenticate with your Fireflies API key.

1. Log in to your [Fireflies.ai](https://fireflies.ai) account
2. Go to Settings > Developer Settings
3. Generate or copy your existing API key
4. Use this API key in your n8n credentials for the Fireflies node

The node uses API Key authentication to securely connect to the Fireflies.ai API.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Fireflies.ai API documentation](https://docs.fireflies.ai)

## Version history

0.1.0

- Added operations Get AI App Outputs, Get Meeting Analytics, Get Meeting Summary, Get Transcript, Get Transcripts List, Get Users, and Upload Audio
- Initial release of the Fireflies.ai node for n8n


