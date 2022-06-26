import AuthAPI from '../../api/AuthAPI'
import { BlogNameState, EmailState, NicknameState, PasswordState, SignUpCheckListState } from './AuthStates'
import EventManager from '../global/Event/EventManager'
import { Event } from '../global/Event/Event'
import { makeAutoObservable } from 'mobx'
import AuthValidator from './AuthValidator'
import { AuthEmailStatus, SendSignUpAuthEmailDTO, SignUpDTO } from '@newturn-develop/types-molink'
import {
    BlogNameAlreadyExists,
    EmailAlreadyExists,
    InvalidBlogName,
    InvalidEmail,
    InvalidNickname,
    InvalidPassword,
    NicknameAlreadyExists,
    TooManyEmailRequest,
    TooManySignUpRequest,
    UserAlreadyAuthorized
} from '../../Errors/AuthError'
import AuthSignUpAPI from '../../api/Auth/AuthSignUpAPI'
import { UserNotExists } from '../../Errors/UserError'
import RoutingManager, { Page } from '../global/RoutingManager'
import ModalManager, { Modal, ModalButton } from '../global/ModalManager'
import EmailAuthenticator from './EmailAuthenticator'

export enum SignUpStep {
    Terms,
    Email,
    Password,
    UserAndBlogInfo,
    EmailSent
}

class SignUpManager {
    isLoading: boolean = false
    step: SignUpStep = SignUpStep.Terms
    email: string = ''
    emailState: EmailState = EmailState.Default

    pwd: string = ''
    pwdCheck: string = ''
    passwordState: PasswordState = PasswordState.DEFAULT

    nickname: string = ''
    nicknameState: NicknameState = NicknameState.Default

    blogName: string = ''
    blogNameState: BlogNameState = BlogNameState.Default

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
            this.reset()
        }, 1)
    }

    handleNextAtCheckTermStep () {
        if (!(this.isAcceptTermOfUse && this.isAcceptPrivacy)) {
            this.checkListState = SignUpCheckListState.NotAllAccepted
        } else {
            this.step = SignUpStep.Email
        }
    }

    async handleNextAtEmailStep () {
        if (this.email.length === 0) {
            this.emailState = EmailState.EmptyEmail
            return
        }
        if (!AuthValidator.validateEmail(this.email)) {
            this.emailState = EmailState.NotEmail
            return
        }
        this.isLoading = true
        const { status } = await AuthAPI.getEmailStatus(this.email)
        switch (status) {
        case AuthEmailStatus.AlreadyAuthed:
            this.emailState = EmailState.SameEmail
            break
        case AuthEmailStatus.InvalidEmail:
            this.emailState = EmailState.NotEmail
            break
        case AuthEmailStatus.Validating:
            const { success } = await EmailAuthenticator.sendSignUpAuthEmail(this.email)
            if (success) {
                await RoutingManager.moveTo(Page.ValidatingEmail, `?email=${this.email}`)
            }
            break
        case AuthEmailStatus.NotExists:
            this.step = SignUpStep.Password
        }
        this.isLoading = false
    }

    handleNextAtPasswordStep () {
        if (this.pwd !== this.pwdCheck) {
            this.passwordState = PasswordState.PASSWORD_MISMATCH
            return
        }
        if (!AuthValidator.validatePassword(this.pwd)) {
            this.passwordState = PasswordState.PASSWORD_CONDITION_NOT_SATISFIED
            return
        }
        this.step = SignUpStep.UserAndBlogInfo
    }

    async handleRandomGenerationNicknameButtonDown () {
        const { nickname } = await AuthAPI.getRandomNickname()
        this.nicknameState = NicknameState.Default
        this.nickname = nickname
        this.blogNameState = BlogNameState.Default
        this.blogName = `${nickname}의 공간`
    }

    async signup () {
        if (this.email.length === 0) {
            this.emailState = EmailState.EmptyEmail
            this.step = SignUpStep.Email
            return { success: false }
        }
        if (!AuthValidator.validateEmail(this.email)) {
            this.emailState = EmailState.NotEmail
            this.step = SignUpStep.Email
            return { success: false }
        }
        this.emailState = EmailState.Default

        if (!AuthValidator.validateNickname(this.blogName)) {
            this.nicknameState = NicknameState.NicknameConditionNotSatisfied
            this.step = SignUpStep.UserAndBlogInfo
            return { success: false }
        }
        this.nicknameState = NicknameState.Default

        if (!AuthValidator.validateBlogName(this.blogName)) {
            this.blogNameState = BlogNameState.BlogNameConditionNotSatisfied
            this.step = SignUpStep.UserAndBlogInfo
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
        try {
            await AuthAPI.signUp(new SignUpDTO(this.email, this.pwd, this.nickname, this.blogName, this.isAcceptMarketing))
            this.step = SignUpStep.EmailSent
        } catch (err) {
            if (err instanceof EmailAlreadyExists) {
                this.emailState = EmailState.SameEmail
                this.step = SignUpStep.Email
            } else if (err instanceof InvalidEmail) {
                this.emailState = EmailState.NotEmail
                this.step = SignUpStep.Email
            } else if (err instanceof InvalidPassword) {
                this.passwordState = PasswordState.PASSWORD_CONDITION_NOT_SATISFIED
                this.step = SignUpStep.Password
            } else if (err instanceof TooManySignUpRequest) {
                this.emailState = EmailState.TOO_MANY_REQUEST
                this.step = SignUpStep.UserAndBlogInfo
            } else if (err instanceof InvalidNickname) {
                this.nicknameState = NicknameState.NicknameConditionNotSatisfied
                this.step = SignUpStep.UserAndBlogInfo
            } else if (err instanceof NicknameAlreadyExists) {
                this.nicknameState = NicknameState.NicknameAlreadyExists
                this.step = SignUpStep.UserAndBlogInfo
            } else if (err instanceof InvalidBlogName) {
                this.blogNameState = BlogNameState.BlogNameConditionNotSatisfied
                this.step = SignUpStep.UserAndBlogInfo
            } else if (err instanceof BlogNameAlreadyExists) {
                this.blogNameState = BlogNameState.BlogNameAlreadyExists
                this.step = SignUpStep.UserAndBlogInfo
            } else {
                throw err
            }
        }
    }

    reset () {
        this.step = SignUpStep.Terms
        this.emailState = EmailState.Default
        this.passwordState = PasswordState.DEFAULT
        this.nicknameState = NicknameState.Default
        this.blogNameState = BlogNameState.Default
        this.checkListState = SignUpCheckListState.Default

        this.email = ''
        this.pwd = ''
        this.pwdCheck = ''
        this.nickname = ''
        this.blogName = ''

        this._isAcceptAllCheckList = false
        this.isAcceptPrivacy = false
        this.isAcceptTermOfUse = false
    }
}
export default new SignUpManager()
