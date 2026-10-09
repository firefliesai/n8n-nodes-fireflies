/** One row of the node's Attendees fixedCollection, as n8n hands it over. */
export interface AttendeeRow {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
}

export type AttendeeInput = Partial<Record<keyof AttendeeRow, string>>;

/**
 * Build the API's `AttendeeInput` list from fixedCollection rows.
 *
 * n8n fills every field of a row with its default, so an attendee given only
 * a name arrives with `email: ''`. The API validates `email` with
 * `@IsEmail()` + `@IsOptional()`, and `@IsOptional` only skips null and
 * undefined, so an empty string fails the whole call with invalid_arguments.
 * Blank fields are dropped, and a row left entirely blank is dropped too.
 */
export function toAttendeeInputs(rows: AttendeeRow[] | undefined): AttendeeInput[] {
  const attendees: AttendeeInput[] = [];
  for (const row of rows ?? []) {
    const attendee: AttendeeInput = {};
    for (const key of ['displayName', 'email', 'phoneNumber'] as const) {
      const value = row[key]?.trim();
      if (value) attendee[key] = value;
    }
    if (Object.keys(attendee).length) attendees.push(attendee);
  }
  return attendees;
}
