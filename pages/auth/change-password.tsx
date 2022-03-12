import { Backdrop, Button, CircularProgress, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AuthLogo } from '../../components/auth/logo'
import AuthManager, { PasswordState } from '../../manager/Auth/AuthManager'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthInput } from '../../components/auth/AuthInput'
import { AuthButton } from '../../components/auth/AuthButton'

const getPasswordHelperText = (passwordState: PasswordState) => {
    switch (passwordState) {
    case PasswordState.DEFAULT:
    case PasswordState.PASSWORD_CONDITION_NOT_SATISFIED:
        return '문자, 숫자 포함 최소 8글자'
    case PasswordState.PASSWORD_MISMATCH:
        return '비밀번호가 일치하지 않습니다.'
    default:
        throw new Error('Unhandled Password State')
    }
}

const AuthChangePasswordPage = () => {
    const key = new URLSearchParams(window.location.search).get('key')
    useEffect(() => {
        AuthManager.checkPasswordChangeExist(new URLSearchParams(window.location.search).get('key')).then(res => {
            if (!res) {
                RoutingManager.moveTo(Page.SignIn)
            }
        })
    })
    const [loading, setLoading] = useState(false)
    return <div className='auth-page change-password-page'>
        <AuthHeader/>
        <div
            className={'auth-container' + (loading ? ' loading' : '')}
        >
            {
                loading
                    ? <>
                        <CircularProgress
                            color="inherit"
                        />
                    </>
                    : <>
                        <AuthTitle text={'비밀번호 변경'}/>
                        <AuthInput
                            label="비밀번호"
                            type="password"
                            autoComplete="new-password"
                            variant='outlined'
                            error={AuthManager.passwordState !== PasswordState.DEFAULT}
                            onChange={(e) => {
                                const { value } = e.target
                                AuthManager.passwordState = PasswordState.DEFAULT
                                AuthManager.pwd = value
                            }}
                            onFocus={(e) => {
                                AuthManager.passwordState = PasswordState.DEFAULT
                            }}
                            onPaste={(e) => {
                                e.preventDefault()
                            }}
                            helperText={getPasswordHelperText(AuthManager.passwordState)}
                        />
                        <AuthInput
                            label="비밀번호 확인"
                            type="password"
                            autoComplete="new-password"
                            variant='outlined'
                            error={AuthManager.passwordState !== PasswordState.DEFAULT}
                            onChange={(e) => {
                                AuthManager.passwordState = PasswordState.DEFAULT
                                AuthManager.pwdCheck = e.target.value
                            }}
                            onFocus={(e) => {
                                AuthManager.passwordState = PasswordState.DEFAULT
                            }}
                            onPaste={(e) => {
                                e.preventDefault()
                            }}
                        />
                        <AuthButton
                            text={'비밀번호 변경'}
                            theme={'primary'}
                            style={{
                                marginTop: 44
                            }}
                            onClick={async (e) => {
                                setLoading(true)
                                const result = await AuthManager.endPasswordChange(key)
                                if (result.success || result.goToLogin) {
                                    await RoutingManager.moveTo(Page.SignIn)
                                }
                                setLoading(false)
                            }}
                        />
                    </>

            }

        </div>
    </div>
}

export default AuthChangePasswordPage
