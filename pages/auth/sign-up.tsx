import React, { useState } from 'react'
import { Backdrop, Button, CircularProgress, TextField } from '@material-ui/core'
import AuthManager, { EmailState, NicknameState, PasswordState } from '../../manager/Auth/AuthManager'
import { observer } from 'mobx-react-lite'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthLogo } from '../../components/auth/logo'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthButton } from '../../components/auth/AuthButton'

const getEmailHelperText = (emailState: EmailState) => {
    if (emailState === EmailState.DEFAULT) {
        return <></>
    }
    const text = emailState === EmailState.NOT_EMAIL ? '이메일 형식이 아닙니다.' : '이미 존재하는 이메일입니다.'
    return <p className='helper-text' style={{ color: 'red' }}>{text}</p>
}

const getNicknameHelperText = (nicknameState: NicknameState) => {
    if (nicknameState === NicknameState.Default) {
        return <p className='helper-text'>{'2~15글자'}</p>
    }
    const text = nicknameState === NicknameState.NicknameConditionNotSatisfied ? '2~15글자 내로 닉네임을 정해주세요.' : '이미 존재하는 닉네임입니다.'
    return <p className='helper-text' style={{ color: 'red' }}>{text}</p>
}

const getPasswordHelperText = (passwordState: PasswordState) => {
    if (passwordState === PasswordState.DEFAULT) {
        return <p className='helper-text'>{'문자, 숫자, 특수문자 포함 최소 8글자'}</p>
    }
    const text = passwordState === PasswordState.PASSWORD_MISMATCH ? '비밀번호가 일치하지 않습니다.' : '문자, 숫자, 특수문자 포함 최소 8글자'
    return <p className='helper-text' style={{ color: 'red' }}>{text}</p>
}

const SignUp = observer(() => {
    const [loading, setLoading] = useState(false)
    AuthManager.emailState = EmailState.DEFAULT
    AuthManager.passwordState = PasswordState.DEFAULT
    return <div className='auth-page'>
        <Backdrop open={loading} onClick={() => setLoading(false)}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <AuthHeader/>
        <div
            className={'auth-container'}
        >
            <AuthTitle text={'계정 생성'}/>
            <div className='auth-page-input'>
                <TextField
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
            <div className='auth-page-input'>
                <TextField
                    className={'input-field'}
                    label="닉네임"
                    type="text"
                    variant='filled'
                    autoComplete='off'
                    error={AuthManager.nicknameState !== NicknameState.Default}
                    onChange={(e) => {
                        const { value } = e.target
                        AuthManager.nicknameState = NicknameState.Default
                        AuthManager.nickname = value
                    }}
                />
                {getNicknameHelperText(AuthManager.nicknameState)}
            </div>
            <AuthButton
                text={'계정 생성'}
                backgroundColor={'#FFFFFF'}
                textColor={'#3A7BBF'}
                onClick={async () => {
                    setLoading(true)
                    const result = await AuthManager.signup()
                    setLoading(false)
                    if (result.success) {
                        RoutingManager.moveTo(Page.SignIn)
                    }
                }}
            />
        </div>
    </div>
})

export default SignUp
