export class CustomError extends Error {
    constructor (message = '') {
        super(message)
    }
}

export class Unauthorized extends CustomError {}

export class InvalidParam extends CustomError {}
