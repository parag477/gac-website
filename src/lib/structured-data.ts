export function serializeStructuredData(data: Record<string, unknown>): string {
  // Escape HTML delimiters without changing the value decoded by JSON parsers.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
