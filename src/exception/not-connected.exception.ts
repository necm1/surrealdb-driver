/**
 * @class NotConnectedException
 * @extends {Error}
 */
export class NotConnectedException extends Error {
  /**
   * NotConnectedException constructor
   *
   * @constructor
   */
  constructor() {
    super('Connection is not established.');

    this.name = NotConnectedException.name;
  }
}
