import { Backdrop, Button, CircularProgress, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { AuthLogo } from '../../components/auth/logo'
import AuthManager, { PasswordState } from '../../manager/AuthManager'
import RoutingManager, { Page } from '../../manager/RoutingManager'

const getPasswordHelperText = (passwordState: PasswordState) => {
    if (passwordState === PasswordState.DEFAULT) {
        return <p className='password-helper-text'>{'문자, 숫자, 특수문자 포함 최소 8글자'}</p>
    }
    const text = passwordState === PasswordState.PASSWORD_MISMATCH ? '비밀번호가 일치하지 않습니다.' : '문자, 숫자, 특수문자 포함 최소 8글자'
    return <p className='password-helper-text' style={{ color: 'red' }}>{text}</p>
}

const ChangePassword = () => {
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
        <AuthLogo />
        <p className='title'>비밀번호 변경</p>
        <div className='auth-page-input'>
            <TextField
                id="standard-password-input"
                className={'input-field'}
                label="비밀번호"
                type="password"
                autoComplete="current-password"
                variant='filled'
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
        </div>
        <div className='auth-page-input'>
            <TextField
                id="standard-password-input"
                className={'input-field'}
                label="비밀번호 확인"
                type="password"
                autoComplete="current-password"
                variant='filled'
                error={AuthManager.passwordState !== PasswordState.DEFAULT}
                onChange={(e) => {
                    AuthManager.passwordState = PasswordState.DEFAULT
                    AuthManager.pwdCheck = e.target.value
                }}
                onPaste={(e) => {
                    e.preventDefault()
                }}
            />
        </div>
        <Button
            className={'login-button'}
            color="secondary"
            variant="contained"
            disabled={loading}
            onClick={async (e) => {
                setLoading(true)
                const result = await AuthManager.endPasswordChange(key)
                if (result.success || result.goToLogin) {
                    RoutingManager.moveTo(Page.SignIn)
                }
                setLoading(false)
            }}>
        비밀번호 변경
        </Button>
    </div>
}

export default ChangePassword
