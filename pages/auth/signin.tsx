import React, { useState } from 'react'

import { Backdrop, Button, CircularProgress, TextField } from '@material-ui/core'
import AuthManager, { EmailState, PasswordState } from '../../manager/Auth/AuthManager'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthLogo } from '../../components/auth/logo'
import UserManager from '../../manager/global/UserManager'

const getEmailHelperText = (emailState: EmailState) => {
    if (emailState === EmailState.DEFAULT) {
        return <></>
    }
    switch (emailState) {
    case EmailState.NOT_EMAIL:
        return <p className='helper-text' style={{ color: 'red' }}>{'이메일 형식이 아닙니다.'}</p>
    case EmailState.NOT_AUTHORIZED:
    case EmailState.WRONG_EMAIL_PASSWORD:
        return <p className='helper-text' style={{ color: 'red' }}>{'이메일 혹은 비밀번호가 잘못 입력되었습니다.'}</p>
    case EmailState.TOO_MANY_REQUEST:
        return <p className='helper-text' style={{ color: 'red' }}>{'요청을 너무 많이 보냈습니다. 잠시 뒤 다시 시도해주세요.'}</p>
    }
    return <></>
}

const SignIn = observer(() => {
    const [loading, setLoading] = useState(false)
    return <div className='auth-page sign-in-page'>
        <Backdrop open={loading} onClick={() => setLoading(false)}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <AuthLogo />
        <p className='title'>로그인</p>
        <div className='auth-page-input'>
            <TextField
                id="standard-email"
                className={'input-field'}
                label="이메일"
                type="email"
                variant='filled'
                autoComplete='off'
                error={AuthManager.emailState !== EmailState.DEFAULT}
                onChange={(e) => {
                    const { value } = e.target
                    AuthManager.emailState = EmailState.DEFAULT
                    AuthManager.email = value
                }}
            />
            {getEmailHelperText(AuthManager.emailState)}
        </div>
        <div className='auth-page-input'>
            <TextField
                id="standard-password-input"
                label="비밀번호"
                className={'input-field'}
                type="password"
                autoComplete="current-password"
                variant='filled'
                error={AuthManager.passwordState !== PasswordState.DEFAULT}
                onChange={(e) => {
                    const { value } = e.target
                    AuthManager.passwordState = PasswordState.DEFAULT
                    AuthManager.pwd = value
                }}
            />
        </div>
        <div className='reset-password-container'>
            <Button className={'reset-password'} onClick={() => RoutingManager.moveTo(Page.changePasswordRequest)}>비밀번호를 잊으셨나요?</Button>
        </div>
        <Button
            className={'login-button'}
            color="secondary"
            variant="contained"
            onClick={async (e) => {
                setLoading(true)
                const result = await AuthManager.signin()
                setLoading(false)
                if (result.success) {
                    await UserManager.refresh()
                    const documentBeforeLogin = localStorage.getItem('document-before-login')
                    if (documentBeforeLogin) {
                        RoutingManager.moveTo(Page.Home, `?id=${documentBeforeLogin}`)
                    } else {
                        RoutingManager.moveTo(Page.Home)
                    }
                }
            }}>
        로그인
        </Button>
        <Button
            className={'sign-up-button'}
            color="primary"
            variant="contained"
            onClick={() => RoutingManager.moveTo(Page.SignUp)}>
        계정 생성
        </Button>
    </div>
})

export default SignIn
