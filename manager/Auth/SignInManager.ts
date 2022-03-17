import AuthAPI, { SIGN_IN_FAIL_REASON, SIGN_UP_FAIL_REASON } from '../../api/AuthAPI'
import FeedbackManager, { NOTIFICATION_TYPE } from '../global/FeedbackManager'
import { EmailState, NicknameState, PasswordState, SignUpCheckListState } from './AuthStates'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import { makeAutoObservable } from 'mobx'
import AuthValidator from './AuthValidator'

class SignInManager {
    email: string = ''
    emailState: EmailState = EmailState.DEFAULT

    pwd: string = ''
    passwordState: PasswordState = PasswordState.DEFAULT

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.MoveToAnotherPage, () => {
            this.emailState = EmailState.DEFAULT
            this.passwordState = PasswordState.DEFAULT

            this.email = ''
            this.pwd = ''
        }, 1)
    }

    async signIn () {
        if (!AuthValidator.validateEmail(this.email)) {
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
}
export default new SignInManager()
