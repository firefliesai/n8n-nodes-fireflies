import type { IExecuteFunctions, INode } from 'n8n-workflow';

import { resourceOperationsFunctions } from '../nodes/Fireflies/operations';
import { MAX_PAGES } from '../nodes/Fireflies/operations/cursorPagination';

const node: INode = {
  id: 'node-1',
  name: 'Fireflies',
  type: '@firefliesai/n8n-nodes-fireflies.fireflies',
  typeVersion: 1,
  position: [0, 0],
  parameters: {},
};

const ok = (data: unknown) => ({ statusCode: 200, headers: {}, body: { data } });

/** Execute context that records each GraphQL request and answers from a script. */
function harness(parameters: Record<string, unknown>, responses: Array<unknown>) {
  const requests: Array<{ query: string; variables?: Record<string, any> }> = [];
  const httpRequestWithAuthentication = jest.fn(async (_cred: string, options: any) => {
    requests.push(options.body);
    if (!responses.length) throw new Error('no more responses scripted');
    return responses.shift();
  });
  const httpRequest = jest.fn(async () => ({}));
  const binary = { mimeType: 'audio/mpeg', fileName: 'standup.mp3', data: '' };
  const fileBuffer = Buffer.from('fake-audio-bytes');
  const ef = {
    getNode: () => node,
    getNodeParameter: (name: string, _index: number, fallback?: unknown) =>
      name in parameters ? parameters[name] : fallback,
    continueOnFail: () => false,
    helpers: {
      httpRequestWithAuthentication,
      httpRequest,
      assertBinaryData: jest.fn(() => binary),
      getBinaryDataBuffer: jest.fn(async () => fileBuffer),
    },
  } as unknown as IExecuteFunctions;
  return { ef, requests, httpRequest, fileBuffer };
}

const run = (resource: string, operation: string, ef: IExecuteFunctions) =>
  resourceOperationsFunctions[resource][operation](ef, 0);

describe('user groups', () => {
  it.each([
    ['addUserToUserGroup', 'addUserToUserGroup(group_id: $groupId'],
    ['removeUserFromUserGroup', 'removeUserFromUserGroup(group_id: $groupId'],
  ])('%s sends the group id and email', async (operation, call) => {
    const group = { id: 'g-1', name: 'Sales', members: [] };
    const { ef, requests } = harness({ groupId: 'g-1', userEmail: 'a@example.com' }, [
      ok({ [operation]: group }),
    ]);

    const item = await run('user', operation, ef);

    expect(requests[0].query).toContain(call);
    expect(requests[0].variables).toEqual({ groupId: 'g-1', userEmail: 'a@example.com' });
    expect(item.json).toEqual({ success: true, data: group });
  });

  it('getUser looks a teammate up by id', async () => {
    const { ef, requests } = harness({ userId: 'u-9' }, [ok({ user: { user_id: 'u-9' } })]);

    const item = await run('user', 'getUser', ef);

    expect(requests[0].variables).toEqual({ id: 'u-9' });
    expect(item.json).toEqual({ success: true, data: { user_id: 'u-9' } });
  });
});

describe('live meetings', () => {
  it('pauses recording', async () => {
    const { ef, requests } = harness({ meetingId: 'm-1', meetingStateAction: 'pause_recording' }, [
      ok({ updateMeetingState: { success: true, action: 'pause_recording' } }),
    ]);

    const item = await run('meeting', 'updateMeetingState', ef);

    expect(requests[0].variables).toEqual({
      input: { meeting_id: 'm-1', action: 'pause_recording' },
    });
    expect(item.json).toMatchObject({ success: true });
  });

  it.each(['createLiveActionItem', 'createLiveSoundbite'])(
    '%s sends the meeting id and prompt',
    async (operation) => {
      const { ef, requests } = harness({ meetingId: 'm-1', prompt: 'Follow up on pricing' }, [
        ok({ [operation]: { success: true } }),
      ]);

      const item = await run('meeting', operation, ef);

      expect(requests[0].variables).toEqual({
        input: { meeting_id: 'm-1', prompt: 'Follow up on pricing' },
      });
      expect(item.json).toEqual({ success: true, data: { success: true } });
    },
  );

  it('returns one item per live action item', async () => {
    const items = [
      { name: 'Sam', action_item: 'Send the deck' },
      { name: 'Ana', action_item: 'Book the room' },
    ];
    const { ef, requests } = harness({ meetingId: 'm-1' }, [ok({ live_action_items: items })]);

    const output = await run('meeting', 'getLiveActionItems', ef);

    expect(requests[0].variables).toEqual({ meetingId: 'm-1' });
    expect(output.map((o: any) => o.json.data)).toEqual(items);
  });

  it('filters active meetings by email and state', async () => {
    const { ef, requests } = harness({ filters: { email: 'a@example.com', states: ['paused'] } }, [
      ok({ active_meetings: [] }),
    ]);

    await run('meeting', 'getActiveMeetings', ef);

    expect(requests[0].variables).toEqual({
      input: { email: 'a@example.com', states: ['paused'] },
    });
  });

  it('passes attendees to Add to Live Meeting, without the blank fields n8n fills in', async () => {
    const attendee = { displayName: 'Ana', email: 'ana@example.com', phoneNumber: '' };
    const { ef, requests } = harness(
      {
        meetingLink: 'https://meet.example.com/x',
        additionalFields: { attendees: { attendeeValues: [attendee] } },
      },
      [ok({ addToLiveMeeting: { success: true } })],
    );

    await run('meeting', 'addToLiveMeeting', ef);

    // An empty email fails the API's @IsEmail(); blank fields must not be sent.
    expect(requests[0].variables!.attendees).toEqual([
      { displayName: 'Ana', email: 'ana@example.com' },
    ]);
  });
});

describe('Upload File (direct upload)', () => {
  it('creates an upload URL, PUTs the bytes, then confirms', async () => {
    const { ef, requests, httpRequest, fileBuffer } = harness(
      { binaryPropertyName: 'data', additionalFields: { custom_language: 'es' } },
      [
        ok({
          createUploadUrl: {
            upload_url: 'https://storage.example.com/signed',
            meeting_id: 'm-42',
            expires_at: '2026-10-09T16:00:00.000Z',
          },
        }),
        ok({ confirmUpload: { success: true, meeting_id: 'm-42', message: 'queued' } }),
      ],
    );

    const item = await run('audio', 'uploadFile', ef);

    expect(requests[0].query).toContain('createUploadUrl(input: $input)');
    expect(requests[0].variables).toEqual({
      input: {
        content_type: 'audio/mpeg',
        file_size: fileBuffer.length,
        title: 'standup.mp3',
        custom_language: 'es',
      },
    });
    expect(httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://storage.example.com/signed',
      body: fileBuffer,
      headers: { 'Content-Type': 'audio/mpeg' },
    });
    expect(requests[1].variables).toEqual({ input: { meeting_id: 'm-42' } });
    expect(item.json).toEqual({
      success: true,
      data: { success: true, meeting_id: 'm-42', message: 'queued' },
    });
  });
});

describe('Upload Audio input shape', () => {
  it('sends camelCase attendees and the DownloadAuthType enum values', async () => {
    const { ef, requests } = harness(
      {
        url: 'https://files.example.com/a.mp3',
        title: 'Weekly',
        additionalFields: {
          attendees: {
            attendeeValues: [{ displayName: 'Ana', email: 'ana@example.com', phoneNumber: '1' }],
          },
          download_auth: { authValues: { type: 'basic_auth', password: 'secret' } },
          meeting_date: '2026-10-01T09:00:00.000Z',
        },
      },
      [ok({ uploadAudio: { success: true } })],
    );

    await run('audio', 'uploadAudio', ef);

    expect(requests[0].variables!.input).toMatchObject({
      attendees: [{ displayName: 'Ana', email: 'ana@example.com', phoneNumber: '1' }],
      download_auth: { type: 'basic_auth', basic: { password: 'secret' } },
      meeting_date: '2026-10-01T09:00:00.000Z',
    });
  });

  it.each([
    ['bearer', 'bearer_token', { token: 't' }, { bearer: { token: 't' } }],
    [
      'basic',
      'basic_auth',
      { username: 'u', password: 'p' },
      { basic: { username: 'u', password: 'p' } },
    ],
  ])(
    'maps the pre-2.3.0 stored type %s to %s instead of dropping the auth',
    async (legacy, current, values, payload) => {
      const { ef, requests } = harness(
        {
          url: 'https://files.example.com/a.mp3',
          title: 'Weekly',
          additionalFields: { download_auth: { authValues: { type: legacy, ...values } } },
        },
        [ok({ uploadAudio: { success: true } })],
      );

      await run('audio', 'uploadAudio', ef);

      expect(requests[0].variables!.input.download_auth).toEqual({ type: current, ...payload });
    },
  );

  it('drops blank attendee fields and fully blank attendees', async () => {
    const { ef, requests } = harness(
      {
        url: 'https://files.example.com/a.mp3',
        title: 'Weekly',
        additionalFields: {
          attendees: {
            attendeeValues: [
              { displayName: 'Ana', email: '', phoneNumber: '' },
              { displayName: '', email: '', phoneNumber: '' },
              { displayName: '', email: ' bo@example.com ', phoneNumber: '+1 555' },
            ],
          },
        },
      },
      [ok({ uploadAudio: { success: true } })],
    );

    await run('audio', 'uploadAudio', ef);

    expect(requests[0].variables!.input.attendees).toEqual([
      { displayName: 'Ana' },
      { email: 'bo@example.com', phoneNumber: '+1 555' },
    ]);
  });

  it('maps a bearer token', async () => {
    const { ef, requests } = harness(
      {
        url: 'https://files.example.com/a.mp3',
        title: 'Weekly',
        additionalFields: { download_auth: { authValues: { type: 'bearer_token', token: 't' } } },
      },
      [ok({ uploadAudio: { success: true } })],
    );

    await run('audio', 'uploadAudio', ef);

    expect(requests[0].variables!.input.download_auth).toEqual({
      type: 'bearer_token',
      bearer: { token: 't' },
    });
  });
});

describe('Share Meeting', () => {
  it('sends share type and password for a password link', async () => {
    const { ef, requests } = harness(
      {
        transcriptId: 't-1',
        emails: 'a@example.com',
        additionalFields: { shareType: 'PASSWORD_LINK', password: 'correct-horse' },
      },
      [ok({ shareMeeting: { success: true, share_slug: 'abc' } })],
    );

    await run('transcript', 'shareMeeting', ef);

    expect(requests[0].variables!.input).toEqual({
      meeting_id: 't-1',
      emails: ['a@example.com'],
      share_type: 'PASSWORD_LINK',
      password: 'correct-horse',
    });
  });
});

describe('cursor-paginated resources', () => {
  const event = (id: string) => ({ id, action: 'MEETING_DELETED' });

  it('returns one page of audit events with the cursor to continue from', async () => {
    const { ef, requests } = harness(
      {
        category: 'MEETING_OPERATIONS',
        returnAll: false,
        limit: 2,
        filters: { actor_email: 'a@example.com' },
      },
      [
        ok({
          auditEvents: { events: [event('1'), event('2')], has_more: true, next_cursor: 'c2' },
        }),
      ],
    );

    const output = await run('auditEvent', 'getAuditEvents', ef);

    expect(requests).toHaveLength(1);
    expect(requests[0].variables).toEqual({
      limit: 2,
      filters: { category: 'MEETING_OPERATIONS', actor_email: 'a@example.com' },
    });
    expect(output).toHaveLength(2);
    expect(output[0].json.page).toEqual({ has_more: true, next_cursor: 'c2' });
  });

  it('Return All follows next_cursor until has_more is false', async () => {
    const { ef, requests } = harness({ category: 'AUTHENTICATION', returnAll: true }, [
      ok({ auditEvents: { events: [event('1')], has_more: true, next_cursor: 'c2' } }),
      ok({ auditEvents: { events: [event('2')], has_more: false, next_cursor: null } }),
    ]);

    const output = await run('auditEvent', 'getAuditEvents', ef);

    expect(requests.map((r) => r.variables!.cursor)).toEqual([undefined, 'c2']);
    expect(requests[0].variables!.limit).toBe(50);
    expect(output.map((o: any) => o.json.data.id)).toEqual(['1', '2']);
  });

  it('Return All stops at MAX_PAGES even if the API never ends', async () => {
    const endless = Array.from({ length: MAX_PAGES + 5 }, (_, i) =>
      ok({ auditEvents: { events: [event(String(i))], has_more: true, next_cursor: `c${i + 1}` } }),
    );
    const { ef, requests } = harness({ category: 'AUTHENTICATION', returnAll: true }, endless);

    const output = await run('auditEvent', 'getAuditEvents', ef);

    expect(requests).toHaveLength(MAX_PAGES);
    // The cap is visible: the set is incomplete and says where to continue.
    expect(output[0].json.page).toEqual({
      has_more: true,
      next_cursor: `c${MAX_PAGES}`,
      truncated: true,
    });
  });

  it('stops on a cursor that does not advance, keeping what was fetched', async () => {
    const stuck = ok({ auditEvents: { events: [event('1')], has_more: true, next_cursor: 'c1' } });
    const { ef, requests } = harness({ category: 'AUTHENTICATION', returnAll: true }, [
      ok({ auditEvents: { events: [event('0')], has_more: true, next_cursor: 'c1' } }),
      stuck,
      stuck,
    ]);

    const output = await run('auditEvent', 'getAuditEvents', ef);

    expect(requests).toHaveLength(2);
    expect(output.map((o: any) => o.json.data.id)).toEqual(['0', '1']);
    // The repeated cursor leads nowhere, so it is not offered as a place to resume.
    expect(output[0].json.page).toEqual({
      has_more: true,
      next_cursor: null,
      truncated: true,
      stalled: true,
    });
  });

  it('keeps the pages already fetched when a later page is rate limited', async () => {
    const rateLimited = {
      statusCode: 429,
      headers: { 'retry-after': '3600' },
      body: {
        errors: [
          {
            message: 'Too many requests',
            extensions: {
              code: 'too_many_requests',
              metadata: { retryAfter: Date.now() + 3_600_000 },
            },
          },
        ],
      },
    };
    const { ef, requests } = harness({ category: 'AUTHENTICATION', returnAll: true }, [
      ok({ auditEvents: { events: [event('1'), event('2')], has_more: true, next_cursor: 'c2' } }),
      rateLimited,
    ]);
    (ef as any).continueOnFail = () => true;

    const output = await run('auditEvent', 'getAuditEvents', ef);

    expect(requests).toHaveLength(2);
    expect(output).toHaveLength(1);
    expect(output[0].json.error).toMatchObject({
      code: 'too_many_requests',
      retryAfterSeconds: 3600,
      partial: { completed: [event('1'), event('2')], rejected: ['c2'], pending: [] },
    });
    expect(output[0].json.error.details).toContain(
      '2 records were fetched over 1 pages; continue from cursor c2',
    );
  });

  it('a Limit above the page size spans pages until it is reached', async () => {
    const page = (from: number, count: number, next: string) =>
      ok({
        auditEvents: {
          events: Array.from({ length: count }, (_, i) => event(String(from + i))),
          has_more: true,
          next_cursor: next,
        },
      });
    const { ef, requests } = harness({ category: 'AUTHENTICATION', returnAll: false, limit: 120 }, [
      page(0, 50, 'c2'),
      page(50, 50, 'c3'),
      page(100, 20, 'c4'),
    ]);

    const output = await run('auditEvent', 'getAuditEvents', ef);

    expect(requests.map((r) => [r.variables!.limit, r.variables!.cursor])).toEqual([
      [50, undefined],
      [50, 'c2'],
      [20, 'c3'],
    ]);
    expect(output).toHaveLength(120);
    expect(output[119].json.page).toEqual({ has_more: true, next_cursor: 'c4' });
  });

  it('a Limit stops early when the API runs out', async () => {
    const { ef, requests } = harness({ category: 'AUTHENTICATION', returnAll: false, limit: 120 }, [
      ok({ auditEvents: { events: [event('1')], has_more: false, next_cursor: null } }),
    ]);

    const output = await run('auditEvent', 'getAuditEvents', ef);

    expect(requests).toHaveLength(1);
    expect(output).toHaveLength(1);
  });

  it('rule executions map filters, logs per meeting and the test/production switch', async () => {
    const { ef, requests } = harness(
      {
        returnAll: false,
        limit: 5,
        filters: { rule_id: 'r-1', is_test: 'false', logs_per_meeting: 3 },
      },
      [
        ok({
          rule_executions_by_meeting: {
            meetings: [{ meeting_id: 'm-1' }],
            has_more: false,
            next_cursor: null,
          },
        }),
      ],
    );

    const output = await run('ruleExecution', 'getRuleExecutions', ef);

    expect(requests[0].variables).toEqual({
      limit: 5,
      filters: { rule_id: 'r-1', is_test: false },
      logsPerMeeting: 3,
    });
    expect(output[0].json.data).toEqual({ meeting_id: 'm-1' });
  });

  it('rule executions leave is_test out for "All"', async () => {
    const { ef, requests } = harness({ returnAll: false, limit: 5, filters: { is_test: 'any' } }, [
      ok({ rule_executions_by_meeting: { meetings: [], has_more: false, next_cursor: null } }),
    ]);

    await run('ruleExecution', 'getRuleExecutions', ef);

    expect(requests[0].variables).toEqual({ limit: 5 });
  });
});
