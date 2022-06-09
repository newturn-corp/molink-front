import React, { useCallback, useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthInput } from '../../components/auth/AuthInput'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthButton } from '../../components/auth/AuthButton'
import UserManager from '../../manager/global/User/UserManager'
import SignInManager from '../../manager/Auth/SignInManager'
import { EmailState, PasswordState } from '../../manager/Auth/AuthStates'
import { AuthContainer } from '../../components/auth/AuthContainer'
import { AuthSubButton } from '../../components/auth/AuthSubButton'
import LanguageManager from '../../manager/global/LanguageManager'
import GlobalManager from '../../manager/global/GlobalManager'
import { SiteHead } from '../../components/global/SiteHead'

const getEmailHelperText = (emailState: EmailState) => {
    if (emailState === EmailState.DEFAULT) {
        return undefined
    }
    switch (emailState) {
    case EmailState.NOT_EMAIL:
        return LanguageManager.languageMap.EmailFormatError
    case EmailState.NOT_AUTHORIZED:
        return LanguageManager.languageMap.EmailNotAuthorizedError
    case EmailState.WRONG_EMAIL_PASSWORD:
        return LanguageManager.languageMap.WrongEmailPasswordError
    case EmailState.TOO_MANY_REQUEST:
        return LanguageManager.languageMap.TooManyLoginRequestsError
    }
    return undefined
}

const SignIn = observer(() => {
    useEffect(() => {
        UserManager.load()
            .then(() => {
                if (UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.Blog, `/${UserManager.profile.nickname}`)
                }
            })
    }, [])
    const [loading, setLoading] = useState(false)
    const login = useCallback(async () => {
        setLoading(true)
        const result = await SignInManager.signIn()
        if (result.success) {
            await UserManager.load()
            const lastPage = RoutingManager.history[RoutingManager.history.length - 1]
            if (RoutingManager.history.length > 0 && !(
                [
                    Page.SignUp,
                    Page.SignIn,
                    Page.ChangePasswordRequest,
                    Page.NoticeEmailAuth
                ].includes(lastPage.page))) {
                await RoutingManager.back()
            } else {
                await RoutingManager.moveTo(Page.Index)
            }
        }
        setLoading(false)
    }, [])

    const emailRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (emailRef.current && SignInManager.emailState !== EmailState.DEFAULT) {
            emailRef.current.focus()
        } else if (passwordRef.current && SignInManager.passwordState !== PasswordState.DEFAULT) {
            passwordRef.current.focus()
        }
    }, [SignInManager.emailState, SignInManager.passwordState, emailRef, passwordRef])
    return <div className='auth-page sign-in-page'>
        <SiteHead/>
        <AuthHeader/>
        <AuthContainer loading={loading}>
            <AuthTitle text={LanguageManager.languageMap.SignIn}/>
            <form onKeyDown={async (event) => {
                if (event.key === 'Enter') {
                    await login()
                }
            }}>
                <AuthInput
                    inputRef={emailRef}
                    label={LanguageManager.languageMap.Email}
                    type="email"
                    variant="outlined"
                    autoComplete='off'
                    style={{
                        marginBottom: 12
                    }}
                    error={SignInManager.emailState !== EmailState.DEFAULT}
                    onChange={(e) => {
                        const { value } = e.target
                        SignInManager.emailState = EmailState.DEFAULT
                        SignInManager.email = value
                    }}
                    helperText={getEmailHelperText(SignInManager.emailState)}
                />
                <AuthInput
                    inputRef={passwordRef}
                    label={LanguageManager.languageMap.Password}
                    type="password"
                    autoComplete="current-password"
                    variant="outlined"
                    error={SignInManager.passwordState !== PasswordState.DEFAULT}
                    onChange={(e) => {
                        const { value } = e.target
                        SignInManager.passwordState = PasswordState.DEFAULT
                        SignInManager.pwd = value
                    }}
                />
            </form>
            <AuthButton
                text={LanguageManager.languageMap.SignIn}
                theme={'primary'}
                style={{
                    marginTop: 22
                }}
                onClick={async () => {
                    await login()
                }}
            />
            <AuthButton
                text={LanguageManager.languageMap.SignUp}
                theme={'primary-stroke'}
                border={'1px solid #3A7BBF'}
                onClick={async () => {
                    setLoading(true)
                    await RoutingManager.moveTo(Page.SignUp)
                    setLoading(false)
                }}
            />
            <AuthSubButton
                text={LanguageManager.languageMap.ForgetPassword}
                onClick={() => RoutingManager.moveTo(Page.ChangePasswordRequest)}
            />
        </AuthContainer>
    </div>
})

export default SignIn
