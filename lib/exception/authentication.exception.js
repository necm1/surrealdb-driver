"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationException = void 0;
class AuthenticationException extends Error {
    constructor() {
        super('There was a problem with authentication');
        this.name = AuthenticationException.name;
    }
}
exports.AuthenticationException = AuthenticationException;
//# sourceMappingURL=authentication.exception.js.map