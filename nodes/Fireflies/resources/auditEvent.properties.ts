import { INodeProperties } from 'n8n-workflow';

export const auditEventOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['auditEvent'],
    },
  },
  options: [
    {
      name: 'Get Many',
      action: 'Get many audit events',
      description:
        "Get your team's audit events (meetings, teammates, settings, logins). Requires a team admin on Enterprise.",
      value: 'getAuditEvents',
    },
  ],
  default: 'getAuditEvents',
};
