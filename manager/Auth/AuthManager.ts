import { makeAutoObservable, observable } from 'mobx'
import AuthAPI, { PASSWORD_CHANGE_FAIL_REASON, SIGN_IN_FAIL_REASON, SIGN_UP_FAIL_REASON, START_PASSWORD_CHANGE_FAIL_REASON } from '../../api/AuthAPI'
import EventManager, { Event } from '../EventManager'
import FeedbackManager, { NOTIFICATION_TYPE } from '../global/FeedbackManager'
import RoutingManager, { Page } from '../global/RoutingManager'

export enum SignupError {
    NOT_EMAIL,
    SAME_EMAIL
}

export enum EmailState {
    DEFAULT,
    NOT_EMAIL,
    SAME_EMAIL,
    TOO_MANY_REQUEST,
    EMAIL_NOT_EXIST,
    NOT_AUTHORIZED,
    WRONG_EMAIL_PASSWORD
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

class AuthManager {
    email: string = ''
    pwd: string = ''
    pwdCheck: string = ''
    nickname: string = ''

    @observable
    signupError: SignupError = null

    emailState: EmailState = EmailState.DEFAULT
    passwordState: PasswordState = PasswordState.DEFAULT
    nicknameState: NicknameState = NicknameState.Default

    constructor () {
        makeAutoObservable(this)
    }

    validateEmail (email: string) {
        // eslint-disable-next-line prefer-regex-literals
        const emailReg = new RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i)
        return emailReg.test(email)
    }

    validatePassword (pwd: string) {
        // eslint-disable-next-line prefer-regex-literals
        const pwdReg = new RegExp(/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
        return pwdReg.test(pwd)
    }

    private validateNickname (nickname: string) {
        if (nickname.length < 2) {
            return false
        } else if (nickname.length > 20) {
            return false
        }
        return true
    }

    async signin () {
        if (!this.validateEmail(this.email)) {
            this.emailState = EmailState.NOT_EMAIL
            return { success: false }
        }
        this.emailState = EmailState.DEFAULT
        const result = await AuthAPI.signIn(this.email, this.pwd)
        if (result.success === false) {
            if (result.failReason === SIGN_IN_FAIL_REASON.EMAIL_NOT_AUTHORIZED) {
                this.emailState = EmailState.NOT_AUTHORIZED
            } else if (result.failReason === SIGN_IN_FAIL_REASON.WRONG_EMAIL_PASSWORD) {
                this.emailState = EmailState.WRONG_EMAIL_PASSWORD
            } else if (result.failReason === SIGN_IN_FAIL_REASON.TOO_MANY_REQUEST) {
                this.emailState = EmailState.TOO_MANY_REQUEST
            }
            return { success: false }
        }
        return { success: true }
    }

    async signup () {
        // 사전 이메일 확인
        if (!this.validateEmail(this.email)) {
            this.emailState = EmailState.NOT_EMAIL
            return { success: false }
        }
        this.emailState = EmailState.DEFAULT

        if (!this.validateNickname(this.nickname)) {
            this.nicknameState = NicknameState.NicknameConditionNotSatisfied
        }
        this.nicknameState = NicknameState.Default

        if (this.pwd !== this.pwdCheck) {
            this.passwordState = PasswordState.PASSWORD_MISMATCH
            return { success: false }
        } else if (!this.validatePassword(this.pwd)) {
            this.passwordState = PasswordState.PASSWORD_CONDITION_NOT_SATISFIED
            return { success: false }
        } else {
            const result = await AuthAPI.signUp(this.email, this.pwd, this.nickname)
            if (result.success === false) {
                if (result.reason === SIGN_UP_FAIL_REASON.ALREADY_EXISTS) {
                    this.emailState = EmailState.SAME_EMAIL
                } else if (result.reason === SIGN_UP_FAIL_REASON.INVALID_EMAIL) {
                    this.emailState = EmailState.NOT_EMAIL
                } else if (result.reason === SIGN_UP_FAIL_REASON.INVALID_PASSWORD) {
                    this.passwordState = PasswordState.PASSWORD_CONDITION_NOT_SATISFIED
                } else if (result.reason === SIGN_UP_FAIL_REASON.TOO_MANY_SIGN_UP_REQEUST) {
                    this.emailState = EmailState.TOO_MANY_REQUEST
                } else if (result.reason === SIGN_UP_FAIL_REASON.INVALID_NICKNAME) {
                    this.nicknameState = NicknameState.NicknameConditionNotSatisfied
                } else if (result.reason === SIGN_UP_FAIL_REASON.NICKNAME_ALREADY_EXISTS) {
                    this.nicknameState = NicknameState.NicknameAlreadyExists
                }
                return { success: false }
            }
            FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '이메일 인증 전송', '입력하신 이메일로 인증 링크가 전송되었습니다. 링크를 눌러 가입을 완료하시기 바랍니다.')
            return { success: true }
        }
    }

    async signOut () {
        await AuthAPI.signOut()
        await EventManager.issueEvent(Event.SignOut, {})
        RoutingManager.moveTo(Page.SignIn)
    }

    verifyEmail (hash: string) {
        return AuthAPI.verifyEmail(hash)
    }

    checkPasswordChangeExist (hash: string) {
        return AuthAPI.checkPasswordChangeExist(hash)
    }

    async startPasswordChange () {
        if (!this.validateEmail(this.email)) {
            this.emailState = EmailState.NOT_EMAIL
            return { success: false }
        }
        const result = await AuthAPI.startPasswordChange(this.email)
        if (result.success === false) {
            if (result.failReason === START_PASSWORD_CHANGE_FAIL_REASON.INVALID_EMAIL) {
                this.emailState = EmailState.NOT_EMAIL
            } else if (result.failReason === START_PASSWORD_CHANGE_FAIL_REASON.USER_NOT_EXISTS) {
                this.emailState = EmailState.EMAIL_NOT_EXIST
            } else if (result.failReason === START_PASSWORD_CHANGE_FAIL_REASON.TOO_MANY_REQEUST) {
                this.emailState = EmailState.TOO_MANY_REQUEST
            }
            return { success: false }
        }
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '메일 전송 성공', '메일 전송이 완료되었습니다.\n인증 메일은 15분 동안 유효하니 가능한 빨리 메일함을 확인하고 비밀번호 변경을 완료해주시기 바랍니다.')
        return { success: true }
    }

    async endPasswordChange (hash: string) {
        if (this.pwd !== this.pwdCheck) {
            this.passwordState = PasswordState.PASSWORD_MISMATCH
            return { success: false }
        }
        if (!this.validatePassword(this.pwd)) {
            this.passwordState = PasswordState.PASSWORD_CONDITION_NOT_SATISFIED
            return { success: false }
        }
        const result = await AuthAPI.endPasswordChange(hash, this.pwd)
        if (result.success === false) {
            if (result.failReason === PASSWORD_CHANGE_FAIL_REASON.INVALID_PASSWORD) {
                this.passwordState = PasswordState.PASSWORD_CONDITION_NOT_SATISFIED
            } else if (result.failReason === PASSWORD_CHANGE_FAIL_REASON.NO_PASSWORD_CHANGE) {
                return { success: false, goToLogin: true }
            }
            return { success: false }
        }
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '비밀번호 변경 성공', '비밀번호 변경이 완료되었습니다.')
        return { success: true }
    }
}
export default new AuthManager()
