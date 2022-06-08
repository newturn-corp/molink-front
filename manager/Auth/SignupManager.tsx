import AuthAPI, { SIGN_UP_FAIL_REASON } from '../../api/AuthAPI'
import FeedbackManager, { NOTIFICATION_TYPE } from '../global/FeedbackManager'
import { EmailState, NicknameState, PasswordState, SignUpCheckListState } from './AuthStates'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import { makeAutoObservable } from 'mobx'
import AuthValidator from './AuthValidator'
import { SignUpDTO } from '@newturn-develop/types-molink'

class SignUpManager {
    email: string = ''
    emailState: EmailState = EmailState.DEFAULT

    pwd: string = ''
    pwdCheck: string = ''
    passwordState: PasswordState = PasswordState.DEFAULT

    nickname: string = ''
    nicknameState: NicknameState = NicknameState.Default

    _isAcceptAllCheckList: boolean = false
    get isAcceptAllCheckList () {
        return this._isAcceptAllCheckList
    }

    set isAcceptAllCheckList (value: boolean) {
        this._isAcceptAllCheckList = value
        this.isAcceptTermOfUse = value
        this.isAcceptPrivacy = value
        this.isAcceptMarketing = value
    }

    isAcceptTermOfUse: boolean = false
    isAcceptPrivacy: boolean = false
    isAcceptMarketing: boolean = false
    checkListState: SignUpCheckListState = SignUpCheckListState.Default

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.MoveToAnotherPage, () => {
            this.emailState = EmailState.DEFAULT
            this.passwordState = PasswordState.DEFAULT
            this.nicknameState = NicknameState.Default
            this.checkListState = SignUpCheckListState.Default

            this.email = ''
            this.pwd = ''
            this.pwdCheck = ''
            this.nickname = ''

            this._isAcceptAllCheckList = false
            this.isAcceptPrivacy = false
            this.isAcceptTermOfUse = false
        }, 1)
    }

    async signup () {
        // 사전 이메일 확인
        if (this.email.length === 0) {
            this.emailState = EmailState.EmptyEmail
            return { success: false }
        }
        if (!AuthValidator.validateEmail(this.email)) {
            this.emailState = EmailState.NOT_EMAIL
            return { success: false }
        }
        this.emailState = EmailState.DEFAULT

        if (!AuthValidator.validateNickname(this.nickname)) {
            this.nicknameState = NicknameState.NicknameConditionNotSatisfied
            return { success: false }
        }
        this.nicknameState = NicknameState.Default

        if (this.pwd !== this.pwdCheck) {
            this.passwordState = PasswordState.PASSWORD_MISMATCH
            return { success: false }
        } else if (!AuthValidator.validatePassword(this.pwd)) {
            this.passwordState = PasswordState.PASSWORD_CONDITION_NOT_SATISFIED
            return { success: false }
        }

        if (!(this.isAcceptTermOfUse && this.isAcceptPrivacy)) {
            this.checkListState = SignUpCheckListState.NotAllAccepted
            return { success: false }
        }
        const result = await AuthAPI.signUp(new SignUpDTO(this.email, this.pwd, this.nickname, this.isAcceptMarketing))
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
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '인증 메일이 발송되었습니다!', '', 3)
        return { success: true }
    }
}
export default new SignUpManager()
