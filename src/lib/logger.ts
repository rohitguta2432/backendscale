/**
 * Structured logger for client-side and server-side error reporting.
 * Outputs JSON to console for easy parsing by log aggregators.
 */

interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn';
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
}

export function logError(error: Error, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'error',
    message: error.message,
    stack: error.stack,
    context,
  };
  console.error(JSON.stringify(entry));
}

export function logWarn(message: string, context?: Record<string, unknown>): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level: 'warn',
    message,
    context,
  };
  console.warn(JSON.stringify(entry));
}
