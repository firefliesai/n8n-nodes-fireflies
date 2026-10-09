import { INodeProperties } from 'n8n-workflow';

export const audioOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['audio'],
    },
  },
  options: [
    {
      name: 'Upload',
      action: 'Upload audio',
      description: 'Upload an audio file for transcription',
      value: 'uploadAudio',
    },
    {
      name: 'Upload File',
      action: 'Upload a binary file',
      description:
        'Upload a binary audio or video file directly for transcription. Requires direct-upload access, which is not generally available.',
      value: 'uploadFile',
    },
  ],
  default: 'uploadAudio',
};
