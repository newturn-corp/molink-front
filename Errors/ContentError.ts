import { CustomError } from './Common'

export class UnauthorizedForContent extends CustomError {}

export class ContentNotExists extends CustomError {}

export class ContentUserNotExists extends CustomError {}
