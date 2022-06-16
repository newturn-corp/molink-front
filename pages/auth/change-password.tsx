import React, { useEffect, useState } from 'react'
import AuthManager, { PasswordState } from '../../manager/Auth/AuthManager'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthInput } from '../../components/auth/AuthInput'
import { AuthButton } from '../../components/auth/AuthButton'
import { AuthContainer } from '../../components/auth/AuthContainer'
import LanguageManager from '../../manager/global/LanguageManager'
import { observer } from 'mobx-react'
import { SiteHead } from '../../components/global/SiteHead'
import { ChangePasswordPageComponent } from '../../components/auth/ChangePassword/ChangePasswordPageComponent'

const getPasswordHelperText = (passwordState: PasswordState) => {
    switch (passwordState) {
    case PasswordState.DEFAULT:
    case PasswordState.PASSWORD_CONDITION_NOT_SATISFIED:
        return LanguageManager.languageMap.PasswordCondition
    case PasswordState.PASSWORD_MISMATCH:
        return LanguageManager.languageMap.PasswordMismatch
    default:
        throw new Error('Unhandled Password State')
    }
}

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
