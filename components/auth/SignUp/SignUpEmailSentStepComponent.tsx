import React from 'react'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import AuthEmailIcon from '../../../public/image/auth/auth-email.svg'
import SignUpManager from '../../../manager/Auth/SignUpManager'
import { AuthButton } from '../AuthButton'

export const SignUpEmailSentStepComponent = observer(() => {
    return <div
        className={'email-sent-step-content'}
    >
        <div
            className={'email-icon'}
        >
            <AuthEmailIcon/>
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: SignUpManager.email + ' 메일로 발송한<br> 이메일 인증을 완료해주세요.<br><br>*인증 메일이 오지 않았다면?'
            }}
        />
        <AuthButton
            text={'로그인 페이지로 이동'}
            theme={'primary-stroke'}
            onClick={async () => {
                await RoutingManager.moveTo(Page.SignIn)
            }}
            style={{
                margin: '0px 16px 0px 0px'
            }}
        />
    </div>
})
