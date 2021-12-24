import React, { useState } from 'react'

import { Backdrop, Button, CircularProgress, TextField } from '@material-ui/core'
import AuthManager, { EmailState, PasswordState } from '../manager/AuthManager'
import { observer } from 'mobx-react-lite'
import RoutingManager, { Page } from '../manager/RoutingManager'

const getEmailHelperText = (emailState: EmailState) => {
    if (emailState === EmailState.DEFAULT) {
        return <></>
    }
    switch (emailState) {
    case EmailState.NOT_EMAIL:
        return <p className='email-helper-text'>{'이메일 형식이 아닙니다.'}</p>
    case EmailState.TOO_MANY_REQUEST:
        return <p className='email-helper-text'>{'너무 많은 요청을 보냈습니다. 잠시 뒤 다시 시도해주세요.'}</p>
    case EmailState.EMAIL_NOT_EXIST:
        return <p className='email-helper-text'>{'계정이 존재하지 않습니다.'}</p>
    }
}

const ChangePasswordRequest = observer(() => {
    const [loading, setLoading] = useState(false)
    AuthManager.emailState = EmailState.DEFAULT
    AuthManager.passwordState = PasswordState.DEFAULT
    return <div className='auth-page change-password-request-page'>
        <Backdrop open={loading} onClick={() => setLoading(false)}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <img className='logo' src='./logo-black.png' alt='logo'/>
        <p className='title'>비밀번호 변경</p>
        <p className='sub-title' style={{ wordBreak: 'break-all', wordWrap: 'break-word' }}>이 이메일 주소로 비밀번호를 변경할 수 있는 링크를 보냅니다.</p>
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

        <Button
            className={'login-button'}
            color="secondary"
            variant="contained"
            disabled={loading || AuthManager.email.length === 0}
            onClick={async (e) => {
                setLoading(true)
                const result = await AuthManager.startPasswordChange()
                if (result.success) {
                    RoutingManager.moveTo(Page.SignIn)
                }
                setLoading(false)
            }}>
        비밀번호 초기화 이메일 전송
        </Button>
    </div>
})

export default ChangePasswordRequest
