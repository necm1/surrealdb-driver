/**
 * @class ConnectionHandler
 */
export class ConnectionHandler {
  /**
   * Handle error
   *
   * @public
   * @param {any} e
   */
  public onError(e: any): void {}

  /**
   * Handle close
   *
   * @public
   * @param {any} e
   */
  public onClose(e: any): void {}

  /**
   * Handle open
   *
   * @public
   * @param {any} e
   */
  public onOpen(e: any): void {}
}
