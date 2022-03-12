export enum EmailState {
    DEFAULT,
    NOT_EMAIL,
    SAME_EMAIL,
    TOO_MANY_REQUEST,
    EMAIL_NOT_EXIST,
    NOT_AUTHORIZED,
    WRONG_EMAIL_PASSWORD,
    EmptyEmail
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

export enum SignUpCheckListState {
    Default,
    NotAllAccepted
}
