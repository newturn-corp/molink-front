import React, { useEffect } from 'react'
import AuthManager from '../../manager/Auth/AuthManager'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../manager/global/FeedbackManager'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'

const EmailAuth = () => {
    if (typeof window === 'undefined' || !window) {
        return <></>
    }
    const key = new URLSearchParams(window.location.search).get('key')
    useEffect(() => {
        AuthManager.verifyEmail(key)
    }, [])
    return <></>
}

export default EmailAuth
