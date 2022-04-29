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

const getEmailHelperText = (emailState: EmailState) => {
    if (emailState === EmailState.DEFAULT) {
        return undefined
    }
    switch (emailState) {
    case EmailState.NOT_EMAIL:
        return LanguageManager.languageMap.get('EmailFormatError')
    case EmailState.NOT_AUTHORIZED:
    case EmailState.WRONG_EMAIL_PASSWORD:
        return LanguageManager.languageMap.get('WrongEmailPasswordError')
    case EmailState.TOO_MANY_REQUEST:
        return LanguageManager.languageMap.get('TooManyLoginRequestsError')
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
            await RoutingManager.moveTo(Page.Blog, `/${UserManager.profile.nickname}`)
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
        <AuthHeader/>
        <AuthContainer loading={loading}>
            <AuthTitle text={LanguageManager.languageMap.get('SignIn')}/>
            <form onKeyDown={async (event) => {
                if (event.key === 'Enter') {
                    await login()
                }
            }}>
                <AuthInput
                    inputRef={emailRef}
                    label={LanguageManager.languageMap.get('Email')}
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
                    label={LanguageManager.languageMap.get('Password')}
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
                text={LanguageManager.languageMap.get('SignIn')}
                theme={'primary'}
                style={{
                    marginTop: 22
                }}
                onClick={async () => {
                    await login()
                }}
            />
            <AuthButton
                text={LanguageManager.languageMap.get('SignUp')}
                theme={'primary-stroke'}
                border={'1px solid #3A7BBF'}
                onClick={async () => {
                    setLoading(true)
                    await RoutingManager.moveTo(Page.SignUp)
                    setLoading(false)
                }}
            />
            <AuthSubButton
                text={LanguageManager.languageMap.get('ForgetPassword')}
                onClick={() => RoutingManager.moveTo(Page.ChangePasswordRequest)}
            />
        </AuthContainer>
    </div>
})

export default SignIn
