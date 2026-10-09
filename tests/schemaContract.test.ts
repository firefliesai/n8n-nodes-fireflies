import { readFileSync } from 'fs';
import { join } from 'path';
import { GraphQLEnumType, Kind, buildSchema, parse, validate } from 'graphql';
import type { INodeProperties } from 'n8n-workflow';

import * as documents from '../nodes/Fireflies/helpers/queries';
import { firefliesNodeProperties } from '../nodes/Fireflies/resources';

/**
 * Contract between the node and the Fireflies public API. The fixture is the
 * public API's schema (introspection of api.fireflies.ai); when the API changes, refresh it
 * and these tests say what the node has to catch up on.
 */
const schema = buildSchema(
  readFileSync(join(__dirname, 'fixtures/public-api.schema.graphql'), 'utf8'),
);

const graphqlDocuments: Array<[string, string]> = (
  Object.entries(documents) as Array<[string, unknown]>
).filter(
  (entry): entry is [string, string] =>
    typeof entry[1] === 'string' && /^\s*(query|mutation)\b/.test(entry[1]),
);

describe('GraphQL documents vs the public API schema', () => {
  it.each(graphqlDocuments)('%s is valid against the schema', (_name, text) => {
    expect(validate(schema, parse(text)).map((error) => error.message)).toEqual([]);
  });

  it('covers every query and mutation the API exposes', () => {
    const used = new Set<string>();
    for (const [, text] of graphqlDocuments) {
      for (const definition of parse(text).definitions) {
        if (definition.kind !== Kind.OPERATION_DEFINITION) continue;
        for (const selection of definition.selectionSet.selections) {
          if (selection.kind === Kind.FIELD) {
            used.add(`${definition.operation} ${selection.name.value}`);
          }
        }
      }
    }
    const exposed = [
      ...Object.keys(schema.getQueryType()!.getFields()).map((name) => `query ${name}`),
      ...Object.keys(schema.getMutationType()!.getFields()).map((name) => `mutation ${name}`),
    ];

    expect(exposed.filter((op) => !used.has(op)).sort()).toEqual([]);
  });
});

/** Walk every parameter, including the options of collections and fixed collections. */
function* allProperties(properties: INodeProperties[]): Generator<INodeProperties> {
  for (const property of properties) {
    yield property;
    for (const option of (property.options ?? []) as unknown as Array<Record<string, unknown>>) {
      if (Array.isArray(option.values)) yield* allProperties(option.values as INodeProperties[]);
      else if (typeof option.displayName === 'string' && typeof option.type === 'string')
        yield* allProperties([option as unknown as INodeProperties]);
    }
  }
}

/** Node parameter (by name and the operation it shows for) -> the API enum it feeds. */
const ENUM_PARAMETERS: Array<{ parameter: string; operation: string; enumType: string }> = [
  { parameter: 'privacy', operation: 'updateMeetingPrivacy', enumType: 'MeetingPrivacy' },
  { parameter: 'role', operation: 'setUserRole', enumType: 'Role' },
  { parameter: 'shareType', operation: 'shareMeeting', enumType: 'ShareMeetingType' },
  { parameter: 'type', operation: 'uploadAudio', enumType: 'DownloadAuthType' },
  {
    parameter: 'meetingStateAction',
    operation: 'updateMeetingState',
    enumType: 'MeetingStateAction',
  },
  { parameter: 'states', operation: 'getActiveMeetings', enumType: 'MeetingState' },
  { parameter: 'category', operation: 'getAuditEvents', enumType: 'AuditEventCategory' },
  { parameter: 'action', operation: 'getAuditEvents', enumType: 'AuditEventAction' },
];

describe('enum option values vs the public API schema', () => {
  it.each(ENUM_PARAMETERS)(
    '$parameter ($operation) only offers $enumType values',
    ({ parameter, operation, enumType }) => {
      const type = schema.getType(enumType);
      expect(type).toBeInstanceOf(GraphQLEnumType);
      const allowed = (type as GraphQLEnumType).getValues().map((value) => value.name);

      const showsFor = (property: INodeProperties) =>
        property.displayOptions?.show?.operation?.includes(operation);
      const topLevel = firefliesNodeProperties.filter(showsFor);
      const candidates = [...allProperties(topLevel)].filter(
        (property) => property.name === parameter && Array.isArray(property.options),
      );

      expect(candidates.length).toBeGreaterThan(0);
      for (const candidate of candidates) {
        const offered = (candidate.options as Array<{ value: unknown }>).map((o) => o.value);
        expect(offered.filter((value) => !allowed.includes(String(value)))).toEqual([]);
      }
    },
  );
});
