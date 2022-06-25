import { CustomError } from './Common'

export class EmailAlreadyExists extends CustomError {}

export class InvalidEmail extends CustomError {}

export class InvalidPassword extends CustomError {}

export class TooManySignUpRequest extends CustomError {}

export class InvalidNickname extends CustomError {}

export class NicknameAlreadyExists extends CustomError {}

export class InvalidBlogName extends CustomError {}

export class BlogNameAlreadyExists extends CustomError {}

export class UserAlreadyAuthorized extends CustomError {}

export class TooManyEmailRequest extends CustomError {}
