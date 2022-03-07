import React, { useState } from 'react'

import { CircularProgress } from '@material-ui/core'
import AuthManager, { EmailState, PasswordState } from '../../manager/Auth/AuthManager'
import { observer } from 'mobx-react-lite'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthInput } from '../../components/auth/AuthInput'
import { AuthButton } from '../../components/auth/AuthButton'
import UserManager from '../../manager/global/User/UserManager'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'

const getEmailHelperText = (emailState: EmailState) => {
    if (emailState === EmailState.DEFAULT) {
        return undefined
    }
    switch (emailState) {
    case EmailState.NOT_EMAIL:
        return '이메일 형식이 아닙니다.'
    case EmailState.TOO_MANY_REQUEST:
        return '너무 많은 요청을 보냈습니다. 잠시 뒤 다시 시도해주세요.'
    case EmailState.EMAIL_NOT_EXIST:
        return '계정이 존재하지 않습니다.'
    }
}

const ChangePasswordRequest = observer(() => {
    const [loading, setLoading] = useState(false)
    return <div className='auth-page change-password-request-page'>
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
                        <AuthTitle
                            text={'비밀번호 변경'}
                        />
                        <AuthInput
                            label="이메일"
                            type="email"
                            variant={'outlined'}
                            autoComplete={'on'}
                            error={AuthManager.emailState !== EmailState.DEFAULT}
                            defaultValue={AuthManager.email}
                            onChange={(e) => {
                                const { value } = e.target
                                AuthManager.emailState = EmailState.DEFAULT
                                AuthManager.email = value
                            }}
                            onFocus={(e) => {
                                AuthManager.emailState = EmailState.DEFAULT
                            }}
                            helperText={getEmailHelperText(AuthManager.emailState)}
                        />
                        <pre
                            className='change-password-description'
                            style={{
                                wordBreak: 'break-all',
                                wordWrap: 'break-word'
                            }}
                        >
                            {
                                'Molink 가입 시 사용하신 이메일을 입력하시면\n새 비밀번호를 생성할 수 있는 링크를 보내드립니다. '
                            }
                        </pre>
                        <AuthButton
                            text={'비밀번호 초기화 이메일 받기'}
                            textColor={'#FFFFFF'}
                            backgroundColor={'#3A7BBF'}
                            style={{
                                marginTop: 44
                            }}
                            onClick={async (e) => {
                                setLoading(true)
                                const result = await AuthManager.startPasswordChange()
                                setLoading(false)
                                if (result.success) {
                                    await UserManager.load()
                                    await RoutingManager.moveTo(Page.Home, `/${UserManager.profile.nickname}`)
                                }
                            }}
                        /></>

            }

        </div>
    </div>
})

export default ChangePasswordRequest
