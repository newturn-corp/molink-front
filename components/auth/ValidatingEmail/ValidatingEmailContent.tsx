import { observer } from 'mobx-react-lite'
import { AuthTitle } from '../AuthTitle'
import React from 'react'
import AuthEmailIcon from 'public/image/auth/auth-email.svg'
import { AuthButton } from '../AuthButton'
import EmailAuthenticator from '../../../manager/Auth/EmailAuthenticator'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../../manager/global/FeedbackManager'

export const ValidatingEmailContent = observer(() => {
    const email = new URLSearchParams(window.location.search).get('email')
    return <div
        className={'validating-email-content'}
    >
        <AuthTitle
            text={'이메일 인증 진행 중'}
        />
        <div
            className={'email-icon'}
        >
            <AuthEmailIcon/>
        </div>
        <div
            className={'description'}
            dangerouslySetInnerHTML={{
                __html: email + ' 메일로 발송한<br> 이메일 인증을 완료해주세요.<br><br>*인증 메일이 오지 않았다면?'
            }}
        />
        <AuthButton
            text={'인증 이메일 다시 받기'}
            theme={'primary-stroke'}
            onClick={async () => {
                const { success } = await EmailAuthenticator.sendSignUpAuthEmail(email)
                if (success) {
                    await FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '인증 이메일이 전송되었습니다!', '', 5)
                }
            }}
            style={{
                margin: '0px 16px 0px 0px'
            }}
        />
    </div>
})
