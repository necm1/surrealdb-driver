/**
 * @class UnknownException
 * @extends {Error}
 */
export class UnknownException extends Error {
    /**
     * UnknownException constructor
     *
     * @constructor
     * @param {number} code Error code
     * @param {string} message Error message
     */
    constructor(code: number, message: string) {
        super(`Error code: ${code} with message "${message}"`);

        this.name = UnknownException.name;
    }
}
