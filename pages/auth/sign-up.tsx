import React, { useEffect, useState } from 'react'
import { Backdrop, CircularProgress } from '@material-ui/core'
import { EmailState, NicknameState, PasswordState } from '../../manager/Auth/AuthStates'
import { observer } from 'mobx-react-lite'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthButton } from '../../components/auth/AuthButton'
import { AuthInput } from '../../components/auth/AuthInput'
import UserManager from '../../manager/global/User/UserManager'
import SignupManager from '../../manager/Auth/SignupManager'
import { SignupCheckList } from '../../components/auth/SignupCheckList'
import { AuthContainer } from '../../components/auth/AuthContainer'
import { AuthSubButton } from '../../components/auth/AuthSubButton'
import LanguageManager from '../../manager/global/LanguageManager'

const getEmailHelperText = (emailState: EmailState) => {
    switch (emailState) {
    case EmailState.DEFAULT:
        return undefined
    case EmailState.EmptyEmail:
        return LanguageManager.languageMap.EmptyEmailError
    case EmailState.NOT_EMAIL:
        return LanguageManager.languageMap.EmailFormatError
    case EmailState.SAME_EMAIL:
        return LanguageManager.languageMap.EmailAlreadyExistsError
    default:
        throw new Error('Unhandled Email State')
    }
}

const getNicknameHelperText = (nicknameState: NicknameState) => {
    switch (nicknameState) {
    case NicknameState.Default:
        return LanguageManager.languageMap.NicknameCondition
    case NicknameState.NicknameConditionNotSatisfied:
        return LanguageManager.languageMap.NicknameConditionError
    case NicknameState.NicknameAlreadyExists:
        return LanguageManager.languageMap.NicknameAlreadyExistsError
    default:
        throw new Error('Unhandled Password State')
    }
}

const getPasswordHelperText = (passwordState: PasswordState) => {
    switch (passwordState) {
    case PasswordState.DEFAULT:
    case PasswordState.PASSWORD_CONDITION_NOT_SATISFIED:
        return LanguageManager.languageMap.PasswordCondition
    case PasswordState.PASSWORD_MISMATCH:
        return LanguageManager.languageMap.PasswordMismatch
    default:
        throw new Error('Unhandled Password State')
    }
}

const SignUp = observer(() => {
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        UserManager.load()
            .then(() => {
                if (UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.Blog, `/${UserManager.profile.nickname}`)
                }
            })
    }, [])
    return <div className='auth-page'>
        <AuthHeader/>
        <AuthContainer
            loading={loading}
        >
            <AuthTitle text={LanguageManager.languageMap.SignUp}/>
            <AuthInput
                name={Math.random().toString()}
                type={'text'}
                label={LanguageManager.languageMap.Email}
                variant="outlined"
                autoComplete='new-street-address'
                error={SignupManager.emailState !== EmailState.DEFAULT}
                onChange={(e) => {
                    const { value } = e.target
                    SignupManager.emailState = EmailState.DEFAULT
                    SignupManager.email = value
                }}
                onFocus={(e) => {
                    SignupManager.emailState = EmailState.DEFAULT
                }}
                defaultValue={SignupManager.email}
                helperText={getEmailHelperText(SignupManager.emailState)}
            />
            <AuthInput
                name={Math.random().toString()}
                type={'password'}
                label={LanguageManager.languageMap.Password}
                isPassword={true}
                autoComplete='new-password'
                variant="outlined"
                error={SignupManager.passwordState !== PasswordState.DEFAULT}
                onChange={(e) => {
                    const { value } = e.target
                    SignupManager.passwordState = PasswordState.DEFAULT
                    SignupManager.pwd = value
                }}
                onFocus={(e) => {
                    SignupManager.passwordState = PasswordState.DEFAULT
                }}
                onPaste={(e) => {
                    e.preventDefault()
                }}
                defaultValue={SignupManager.pwd}
                helperText={getPasswordHelperText(SignupManager.passwordState)}
            />
            <AuthInput
                name={Math.random().toString()}
                type={'password'}
                label={LanguageManager.languageMap.PasswordConfirm}
                isPassword={true}
                autoComplete='new-password'
                variant="outlined"
                error={SignupManager.passwordState !== PasswordState.DEFAULT}
                onChange={(e) => {
                    SignupManager.passwordState = PasswordState.DEFAULT
                    SignupManager.pwdCheck = e.target.value
                }}
                onFocus={(e) => {
                    SignupManager.passwordState = PasswordState.DEFAULT
                }}
                onPaste={(e) => {
                    e.preventDefault()
                }}
                defaultValue={SignupManager.pwdCheck}
            />
            <AuthInput
                name={Math.random().toString()}
                type={'text'}
                label={LanguageManager.languageMap.Nickname}
                autoComplete='off'
                variant='outlined'
                error={SignupManager.nicknameState !== NicknameState.Default}
                onChange={(e) => {
                    const { value } = e.target
                    SignupManager.nicknameState = NicknameState.Default
                    SignupManager.nickname = value
                }}
                defaultValue={SignupManager.nickname}
                helperText={getNicknameHelperText(SignupManager.nicknameState)}
            />
            <SignupCheckList/>
            <AuthButton
                text={LanguageManager.languageMap.SignUp}
                theme={'primary-stroke'}
                onClick={async () => {
                    setLoading(true)
                    const result = await SignupManager.signup()
                    setLoading(false)
                    if (result.success) {
                        await RoutingManager.moveTo(Page.NoticeEmailAuth)
                    }
                }}
            />
            <AuthSubButton
                text={LanguageManager.languageMap.AlreadyAccountExists}
                onClick={() => RoutingManager.moveTo(Page.SignIn)}
            />
        </AuthContainer>
    </div>
})

export default SignUp
