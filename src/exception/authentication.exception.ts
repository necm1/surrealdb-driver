/**
 * @class AuthenticationException
 * @extends {Error}
 */
export class AuthenticationException extends Error {
  /**
   * AuthenticationException constructor
   *
   * @constructor
   */
  constructor() {
    super('There was a problem with authentication');

    this.name = AuthenticationException.name;
  }
}
