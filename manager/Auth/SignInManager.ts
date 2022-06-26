import AuthAPI, { SIGN_IN_FAIL_REASON } from '../../api/AuthAPI'
import FeedbackManager, { NOTIFICATION_TYPE } from '../global/FeedbackManager'
import { EmailState, NicknameState, PasswordState, SignUpCheckListState } from './AuthStates'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import { makeAutoObservable } from 'mobx'
import AuthValidator from './AuthValidator'

class SignInManager {
    email: string = ''
    emailState: EmailState = EmailState.Default

    pwd: string = ''
    passwordState: PasswordState = PasswordState.DEFAULT

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.MoveToAnotherPage, () => {
            this.emailState = EmailState.Default
            this.passwordState = PasswordState.DEFAULT

            this.email = ''
            this.pwd = ''
        }, 1)
    }

    async signIn () {
        if (!AuthValidator.validateEmail(this.email)) {
            this.emailState = EmailState.NotEmail
            return { success: false }
        }
        this.emailState = EmailState.Default
        const result = await AuthAPI.signIn(this.email, this.pwd)
        if (result.success === false) {
            if (result.failReason === SIGN_IN_FAIL_REASON.EMAIL_NOT_AUTHORIZED) {
                this.emailState = EmailState.NOT_AUTHORIZED
                await FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '다시 인증 메일을 보냈습니다! 이메일을 확인해주세요!', '', 5)
            } else if (result.failReason === SIGN_IN_FAIL_REASON.WRONG_EMAIL_PASSWORD) {
                this.emailState = EmailState.WRONG_EMAIL_PASSWORD
            } else if (result.failReason === SIGN_IN_FAIL_REASON.TOO_MANY_REQUEST) {
                this.emailState = EmailState.TOO_MANY_REQUEST
            } else if (result.failReason === SIGN_IN_FAIL_REASON.TOO_MANY_EMAIL_AUTH_REQUEST) {
                this.emailState = EmailState.NOT_AUTHORIZED
                await FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '너무 많이 이메일 인증을 시도했습니다. 잠시 뒤에 시도해주세요.', '', 5)
            }
            return { success: false }
        }
        return { success: true }
    }
}
export default new SignInManager()
