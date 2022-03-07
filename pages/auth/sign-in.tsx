import React, { useEffect, useState } from 'react'

import { Backdrop, CircularProgress } from '@material-ui/core'
import AuthManager, { EmailState, PasswordState } from '../../manager/Auth/AuthManager'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthInput } from '../../components/auth/AuthInput'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthButton } from '../../components/auth/AuthButton'
import UserManager from '../../manager/global/User/UserManager'

const getEmailHelperText = (emailState: EmailState) => {
    console.log(emailState)
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
    useEffect(() => {
        UserManager.load()
            .then(() => {
                if (UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.Blog, `/${UserManager.profile.nickname}`)
                }
            })
    }, [])
    const [loading, setLoading] = useState(false)
    return <div className='auth-page sign-in-page'>
        <AuthHeader/>
        <div
            className={'auth-container' + (loading ? ' loading' : '')}
        >
            {
                loading
                    ? <CircularProgress color="inherit" />
                    : <>
                        <AuthTitle text={'로그인'}/>
                        <AuthInput
                            label="이메일"
                            type="email"
                            variant="outlined"
                            autoComplete='off'
                            style={{
                                marginBottom: 12
                            }}
                            error={AuthManager.emailState !== EmailState.DEFAULT}
                            onChange={(e) => {
                                const { value } = e.target
                                AuthManager.emailState = EmailState.DEFAULT
                                AuthManager.email = value
                            }}
                        />
                        {getEmailHelperText(AuthManager.emailState)}
                        <AuthInput
                            label="비밀번호"
                            type="password"
                            autoComplete="current-password"
                            variant="outlined"
                            error={AuthManager.passwordState !== PasswordState.DEFAULT}
                            onChange={(e) => {
                                const { value } = e.target
                                AuthManager.passwordState = PasswordState.DEFAULT
                                AuthManager.pwd = value
                            }}
                        />
                        <AuthButton
                            text={'로그인'}
                            textColor={'#FFFFFF'}
                            backgroundColor={'#3A7BBF'}
                            style={{
                                marginTop: 22
                            }}
                            onClick={async (e) => {
                                setLoading(true)
                                const result = await AuthManager.signIn()
                                setLoading(false)
                                if (result.success) {
                                    await UserManager.load()
                                    await RoutingManager.moveTo(Page.Blog, `/${UserManager.profile.nickname}`)
                                }
                            }}
                        />
                        <AuthButton
                            text={'계정 생성'}
                            textColor={'#3A7BBF'}
                            backgroundColor={'#FFFFFF'}
                            border={'1px solid #3A7BBF'}
                            onClick={() => RoutingManager.moveTo(Page.SignUp)}
                        />
                        <div
                            className={'reset-password-button'}
                            onClick={() => RoutingManager.moveTo(Page.changePasswordRequest)}
                        >
                            {'비밀번호를 잊으셨나요?'}
                        </div>
                    </>
            }
        </div>
    </div>
})

export default SignIn
