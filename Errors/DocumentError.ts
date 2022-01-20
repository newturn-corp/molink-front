import { CustomError } from './Common'

export class UnauthorizedForDocument extends CustomError {}

export class DocumentIsPrivate extends CustomError {}

export class DocumentOnlyOpenedForFollower extends CustomError {}

export class DocumentNotExists extends CustomError {}

export class UnexpectedError extends CustomError {}
