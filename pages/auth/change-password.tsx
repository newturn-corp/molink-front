import React from 'react'
import AuthManager from '../../manager/Auth/AuthManager'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { ChangePasswordPageComponent } from '../../components/auth/ChangePassword/ChangePasswordPageComponent'

const AuthChangePasswordPage = () => {
    if (typeof window === 'undefined') {
        return <></>
    }

    const key = new URLSearchParams(window.location.search).get('key')
    AuthManager.checkPasswordChangeExist(key).then(res => {
        if (!res) {
            RoutingManager.moveTo(Page.SignIn)
        }
    })

    return <ChangePasswordPageComponent/>
}

export default AuthChangePasswordPage
