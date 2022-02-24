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
    if (passwordState === PasswordState.DEFAULT) {
        return <p className='helper-text'>{'문자, 숫자, 특수문자 포함 최소 8글자'}</p>
    }
    const text = passwordState === PasswordState.PASSWORD_MISMATCH ? '비밀번호가 일치하지 않습니다.' : '문자, 숫자, 특수문자 포함 최소 8글자'
    return <p className='helper-text' style={{ color: 'red' }}>{text}</p>
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
    AuthManager.passwordState = PasswordState.DEFAULT
    const [loading, setLoading] = useState(false)
    return <div className='auth-page change-password-page'>
        <Backdrop open={loading} onClick={() => setLoading(false)}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <AuthHeader/>
        <div
            className={'auth-container'}
        >
            <AuthTitle text={'비밀번호 변경'}/>
            <AuthInput
                id="standard-password-input"
                label="비밀번호"
                type="password"
                autoComplete="current-password"
                variant='outlined'
                error={AuthManager.passwordState !== PasswordState.DEFAULT}
                onChange={(e) => {
                    const { value } = e.target
                    AuthManager.passwordState = PasswordState.DEFAULT
                    AuthManager.pwd = value
                }}
                onPaste={(e) => {
                    e.preventDefault()
                }}
            />
            {getPasswordHelperText(AuthManager.passwordState)}
            <AuthInput
                id="standard-password-input"
                label="비밀번호 확인"
                type="password"
                autoComplete="current-password"
                variant='outlined'
                error={AuthManager.passwordState !== PasswordState.DEFAULT}
                onChange={(e) => {
                    AuthManager.passwordState = PasswordState.DEFAULT
                    AuthManager.pwdCheck = e.target.value
                }}
                onPaste={(e) => {
                    e.preventDefault()
                }}
            />
            <AuthButton
                text={'비밀번호 변경'}
                textColor={'#FFFFFF'}
                backgroundColor={'#3A7BBF'}
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
        </div>
    </div>
}

export default AuthChangePasswordPage
