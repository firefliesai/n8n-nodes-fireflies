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
  ],
  default: 'uploadAudio',
};
