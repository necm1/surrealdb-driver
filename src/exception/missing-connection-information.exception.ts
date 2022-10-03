/**
 * @class MissingConnectionInformationException
 * @extends {Error}
 */
export class MissingConnectionInformationException extends Error {
  /**
   * MissingConnectionInformationException constructor
   *
   * @constructor
   */
  constructor() {
    super(
      'There were no connection information passed. Check your constructor or .env file.'
    );

    this.name = MissingConnectionInformationException.name;
  }
}
