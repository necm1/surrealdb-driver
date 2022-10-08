/**
 * @interface QueryResult
 */
export interface QueryResult<T> {
  result: T[];
  status: string;
  time: string;
}
