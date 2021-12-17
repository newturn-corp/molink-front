import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import AuthManager from '../manager/AuthManager'
import NotificationManager, { NOTIFICATION_TYPE } from '../manager/NotificationManager'

const EmailAuth = () => {
    const router = useRouter()
    const key = new URLSearchParams(window.location.search).get('key')
    useEffect(() => {
        AuthManager.verifyEmail(key).then((res) => {
            if (!res.success) {
                NotificationManager.showNotification(NOTIFICATION_TYPE.ERROR, '이메일 인증 만료', '이미 만료된 인증입니다.', 10)
            } else {
                NotificationManager.showNotification(NOTIFICATION_TYPE.SUCCESS, '이메일 인증 성공!', '', 10)
                router.replace('/signin')
            }
        })
    }, [])
    return <></>
}

export default EmailAuth
