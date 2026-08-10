// A failed $jsonSchema check always has the message "Document failed validation".
// The part that says which rule broke is on errInfo, not on the message.
export function describeValidationError(err: unknown): string {
  const details = (err as { errInfo?: { details?: { schemaRulesNotSatisfied?: unknown } } }).errInfo
    ?.details?.schemaRulesNotSatisfied;

  if (!details) {
    return err instanceof Error ? err.message : String(err);
  }

  return JSON.stringify(details, null, 2);
}
