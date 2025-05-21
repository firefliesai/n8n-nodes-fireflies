import {
  IAuthenticateGeneric,
  ICredentialType,
  ICredentialTestRequest,
  INodeProperties,
} from 'n8n-workflow';

export class FirefliesApi implements ICredentialType {
  name = 'firefliesApi';
  displayName = 'Fireflies API';
  documentationUrl = 'https://docs.fireflies.ai';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
    },
  ];
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{$credentials.apiKey}}',
      },
    },
  };
  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.fireflies.ai/graphql',
      url: '',
      method: 'POST',
      body: {
        query: `query ValidateCredentials { user { user_id } }`,
      },
    },
    rules: [
      {
        type: 'responseSuccessBody',
        properties: {
          key: 'data.user.user_id',
          message: 'Invalid API key',
          value: 'auth_failed',
        },
      },
    ],
  };
}
