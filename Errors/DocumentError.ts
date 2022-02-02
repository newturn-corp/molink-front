import { CustomError } from './Common'

export class UnauthorizedForDocument extends CustomError {}

export class DocumentNotExists extends CustomError {}

export class UnexpectedError extends CustomError {}
