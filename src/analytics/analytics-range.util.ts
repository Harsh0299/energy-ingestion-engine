export type AnalyticsRange = '24h' | '7d';
export type AnalyticsInterval = 'hour' | 'day';

export function resolveRange(range?: string): {
  range: AnalyticsRange;
  interval: AnalyticsInterval;
  fromSql: string;
} {
  if (range === '7d') {
    return {
      range: '7d',
      interval: 'day',
      fromSql: `now() - interval '7 days'`,
    };
  }

  // default = 24h
  return {
    range: '24h',
    interval: 'hour',
    fromSql: `now() - interval '24 hours'`,
  };
}
