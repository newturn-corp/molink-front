import { makeAutoObservable, observable } from 'mobx'
import AuthAPI, { PASSWORD_CHANGE_FAIL_REASON, SIGN_IN_FAIL_REASON, SIGN_UP_FAIL_REASON, START_PASSWORD_CHANGE_FAIL_REASON } from '../../api/AuthAPI'
import FeedbackManager, { NOTIFICATION_TYPE } from '../global/FeedbackManager'
import RoutingManager, { Page } from '../global/RoutingManager'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import AuthValidator from './AuthValidator'

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

const MAX_NICKNAME_LENGTH = 15

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

    isLoading: boolean = false

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.MoveToAnotherPage, () => {
            this.emailState = EmailState.DEFAULT
            this.passwordState = PasswordState.DEFAULT
            this.nicknameState = NicknameState.Default
            this.email = ''
            this.pwd = ''
            this.pwdCheck = ''
            this.nickname = ''
        }, 1)
    }

    validateEmail (email: string) {
        // eslint-disable-next-line prefer-regex-literals
        const emailReg = new RegExp(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i)
        return emailReg.test(email)
    }

    validatePassword (pwd: string) {
        // eslint-disable-next-line prefer-regex-literals
        const pwdReg = new RegExp(/^.*(?=^.{8,300}$)(?=.*\d)(?=.*[a-zA-Z]).*$/)
        return pwdReg.test(pwd)
    }

    async signOut () {
        await EventManager.issueEvent(Event.SignOut, {})
        await AuthAPI.signOut()
        await RoutingManager.moveTo(Page.SignIn)
    }

    async verifyEmail (hash: string) {
        const result = await AuthAPI.verifyEmail(hash)
        if (!result.success) {
            await FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '이미 만료된 인증입니다.', '', 5)
        } else {
            await FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '이메일 인증 성공!', '', 5)
        }
        await RoutingManager.moveTo(Page.SignIn)
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
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '비밀번호 변경 메일이 전송되었습니다!', '', 5)
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
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '비밀번호 변경이 완료되었습니다!', '', 5)
        return { success: true }
    }
}
export default new AuthManager()
