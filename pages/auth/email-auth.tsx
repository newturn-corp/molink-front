import React, { useEffect } from 'react'
import AuthManager from '../../manager/AuthManager'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../manager/FeedbackManager'
import RoutingManager, { Page } from '../../manager/RoutingManager'

const EmailAuth = () => {
    const key = new URLSearchParams(window.location.search).get('key')
    useEffect(() => {
        AuthManager.verifyEmail(key).then((res) => {
            if (!res.success) {
                FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '이메일 인증 만료', '이미 만료된 인증입니다.', 10)
            } else {
                FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '이메일 인증 성공!', '', 10)
                RoutingManager.moveTo(Page.SignIn)
            }
        })
    }, [])
    return <></>
}

export default EmailAuth
