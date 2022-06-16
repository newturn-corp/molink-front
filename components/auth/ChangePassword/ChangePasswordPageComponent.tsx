import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import AuthManager, { PasswordState } from '../../../manager/Auth/AuthManager'
import LanguageManager from '../../../manager/global/LanguageManager'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { SiteHead } from '../../global/SiteHead'
import { AuthHeader } from '../AuthHeader'
import { AuthContainer } from '../AuthContainer'
import { AuthTitle } from '../AuthTitle'
import { AuthInput } from '../AuthInput'
import { AuthButton } from '../AuthButton'

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

export const ChangePasswordPageComponent = observer(() => {
    useEffect(() => {
        if (typeof window === 'undefined' || !window) {
            return
        }
        AuthManager.checkPasswordChangeExist(new URLSearchParams(window.location.search).get('key')).then(res => {
            if (!res) {
                RoutingManager.moveTo(Page.SignIn)
            }
        })
    }, [window])
    const [loading, setLoading] = useState(false)

    const key = new URLSearchParams(window.location.search).get('key')
    return <div className='auth-page change-password-page'>
        <SiteHead/>
        <AuthHeader/>
        <AuthContainer
            loading={loading}
        >
            <AuthTitle
                text={LanguageManager.languageMap.ChangePassword}
            />
            <AuthInput
                label={LanguageManager.languageMap.Password}
                type="password"
                autoComplete="new-password"
                variant='outlined'
                error={AuthManager.passwordState !== PasswordState.DEFAULT}
                onChange={(e) => {
                    const { value } = e.target
                    AuthManager.passwordState = PasswordState.DEFAULT
                    AuthManager.pwd = value
                }}
                onFocus={(e) => {
                    AuthManager.passwordState = PasswordState.DEFAULT
                }}
                onPaste={(e) => {
                    e.preventDefault()
                }}
                helperText={getPasswordHelperText(AuthManager.passwordState)}
            />
            <AuthInput
                label={LanguageManager.languageMap.PasswordConfirm}
                type="password"
                autoComplete="new-password"
                variant='outlined'
                error={AuthManager.passwordState !== PasswordState.DEFAULT}
                onChange={(e) => {
                    AuthManager.passwordState = PasswordState.DEFAULT
                    AuthManager.pwdCheck = e.target.value
                }}
                onFocus={(e) => {
                    AuthManager.passwordState = PasswordState.DEFAULT
                }}
                onPaste={(e) => {
                    e.preventDefault()
                }}
            />
            <AuthButton
                text={LanguageManager.languageMap.ChangePassword}
                theme={'primary'}
                style={{
                    marginTop: 44
                }}
                onClick={async (e) => {
                    setLoading(true)
                    const result = await AuthManager.endPasswordChange(key)
                    if (result.success || result.goToLogin) {
                        await RoutingManager.moveTo(Page.SignIn)
                    }
                    setLoading(false)
                }}
            />
        </AuthContainer>
    </div>
})
