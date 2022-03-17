import React, { useCallback, useEffect, useRef, useState } from 'react'

import { CircularProgress } from '@material-ui/core'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthInput } from '../../components/auth/AuthInput'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthButton } from '../../components/auth/AuthButton'
import UserManager from '../../manager/global/User/UserManager'
import SignInManager from '../../manager/Auth/SignInManager'
import { EmailState, PasswordState } from '../../manager/Auth/AuthStates'

const getEmailHelperText = (emailState: EmailState) => {
    if (emailState === EmailState.DEFAULT) {
        return undefined
    }
    switch (emailState) {
    case EmailState.NOT_EMAIL:
        return '이메일 형식이 아닙니다.'
    case EmailState.NOT_AUTHORIZED:
    case EmailState.WRONG_EMAIL_PASSWORD:
        return '이메일 혹은 비밀번호가 잘못 입력되었습니다.'
    case EmailState.TOO_MANY_REQUEST:
        return '요청을 너무 많이 보냈습니다. 잠시 뒤 다시 시도해주세요.'
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
        <div
            className={'auth-container' + (loading ? ' loading' : '')}
        >
            <CircularProgress style={{ display: loading ? undefined : 'none' }} color="inherit" />
            <div style={{ display: loading ? 'none' : undefined }}>
                <AuthTitle text={'로그인'}/>
                <form onKeyDown={async (event) => {
                    if (event.key === 'Enter') {
                        await login()
                    }
                }}>
                    <AuthInput
                        inputRef={emailRef}
                        label="이메일"
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
                        label="비밀번호"
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
                    text={'로그인'}
                    theme={'primary'}
                    style={{
                        marginTop: 22
                    }}
                    onClick={async () => {
                        await login()
                    }}
                />
                <AuthButton
                    text={'계정 생성'}
                    theme={'primary-stroke'}
                    border={'1px solid #3A7BBF'}
                    onClick={async () => {
                        setLoading(true)
                        await RoutingManager.moveTo(Page.SignUp)
                        setLoading(false)
                    }}
                />
                <div
                    className={'reset-password-button'}
                    onClick={() => RoutingManager.moveTo(Page.changePasswordRequest)}
                >
                    {'비밀번호를 잊으셨나요?'}
                </div>
            </div>
        </div>
    </div>
})

export default SignIn
