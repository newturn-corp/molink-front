export enum EmailState {
    Default,
    NotEmail,
    SameEmail,
    TOO_MANY_REQUEST,
    EMAIL_NOT_EXIST,
    NOT_AUTHORIZED,
    WRONG_EMAIL_PASSWORD,
    EmptyEmail,
    Validating
}

export enum PasswordState {
    DEFAULT,
    PASSWORD_MISMATCH,
    PASSWORD_CONDITION_NOT_SATISFIED
}

export enum NicknameState {
    Default,
    NicknameAlreadyExists,
    NicknameConditionNotSatisfied
}

export enum BlogNameState {
    Default,
    BlogNameAlreadyExists,
    BlogNameConditionNotSatisfied
}

export enum SignUpCheckListState {
    Default,
    NotAllAccepted
}
