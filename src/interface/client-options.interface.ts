/**
 * @interface ClientOptions
 */
export interface ClientOptions {
  /**
   * @type {string}
   */
  host: string;

  /**
   * @type {number}
   */
  port: number;

  /**
   * @type {string}
   */
  user: string;

  /**
   * @type {string}
   */
  pass: string;

  /**
   * @type {string}
   */
  db: string;

  /**
   * @type {string}
   */
  ns: string;

  /**
   * @type {boolean}
   */
  ssl: boolean;
}
