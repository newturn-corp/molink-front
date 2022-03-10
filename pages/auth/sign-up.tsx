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

const getEmailHelperText = (emailState: EmailState) => {
    switch (emailState) {
    case EmailState.DEFAULT:
        return undefined
    case EmailState.EmptyEmail:
        return '이메일을 입력해주세요.'
    case EmailState.NOT_EMAIL:
        return '이메일 형식이 아닙니다.'
    case EmailState.SAME_EMAIL:
        return '이미 존재하는 이메일입니다.'
    default:
        throw new Error('Unhandled Email State')
    }
}

const getNicknameHelperText = (nicknameState: NicknameState) => {
    switch (nicknameState) {
    case NicknameState.Default:
        return '최대 2~27글자, 특수문자는 -,_,.(마침표) 사용 가능'
    case NicknameState.NicknameConditionNotSatisfied:
        return '2~15글자 내로 닉네임을 정해주세요.'
    case NicknameState.NicknameAlreadyExists:
        return '이미 존재하는 닉네임입니다.'
    default:
        throw new Error('Unhandled Password State')
    }
}

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
        <div
            className={'auth-container' + (loading ? ' loading' : '')}
        >
            {
                loading
                    ? <CircularProgress color="inherit" />
                    : <>
                        <AuthTitle text={'계정 생성'}/>
                        <AuthInput
                            name={Math.random().toString()}
                            type={'text'}
                            label="이메일"
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
                            label="비밀번호"
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
                            label="비밀번호 확인"
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
                            label="닉네임"
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
                            text={'계정 생성'}
                            backgroundColor={'#FFFFFF'}
                            textColor={'#3A7BBF'}
                            onClick={async () => {
                                setLoading(true)
                                const result = await SignupManager.signup()
                                setLoading(false)
                                if (result.success) {
                                    await RoutingManager.moveTo(Page.SignIn)
                                }
                            }}
                        />
                    </>
            }
        </div>
    </div>
})

export default SignUp
