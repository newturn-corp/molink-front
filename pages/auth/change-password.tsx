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

const AuthChangePasswordPage = observer(() => {
    const key = new URLSearchParams(window.location.search).get('key')
    useEffect(() => {
        AuthManager.checkPasswordChangeExist(new URLSearchParams(window.location.search).get('key')).then(res => {
            if (!res) {
                RoutingManager.moveTo(Page.SignIn)
            }
        })
    })
    const [loading, setLoading] = useState(false)
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

export default AuthChangePasswordPage
