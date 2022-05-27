import React, { useState } from 'react'

import { CircularProgress } from '@material-ui/core'
import AuthManager, { EmailState, PasswordState } from '../../manager/Auth/AuthManager'
import { observer } from 'mobx-react-lite'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthTitle } from '../../components/auth/AuthTitle'
import { AuthInput } from '../../components/auth/AuthInput'
import { AuthButton } from '../../components/auth/AuthButton'
import UserManager from '../../manager/global/User/UserManager'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthContainer } from '../../components/auth/AuthContainer'
import LanguageManager from '../../manager/global/LanguageManager'

const getEmailHelperText = (emailState: EmailState) => {
    if (emailState === EmailState.DEFAULT) {
        return undefined
    }
    switch (emailState) {
    case EmailState.NOT_EMAIL:
        return LanguageManager.languageMap.EmailFormatError
    case EmailState.TOO_MANY_REQUEST:
        return LanguageManager.languageMap.TooManyRequestError
    case EmailState.EMAIL_NOT_EXIST:
        return LanguageManager.languageMap.AccountNotExistsError
    }
}

const ChangePasswordRequest = observer(() => {
    const [loading, setLoading] = useState(false)
    return <div className='auth-page change-password-request-page'>
        <AuthHeader/>
        <AuthContainer
            loading={loading}
        >
            <AuthTitle
                text={LanguageManager.languageMap.ChangePassword}
            />
            <AuthInput
                label={LanguageManager.languageMap.Email}
                type="email"
                variant={'outlined'}
                autoComplete={'on'}
                error={AuthManager.emailState !== EmailState.DEFAULT}
                defaultValue={AuthManager.email}
                onChange={(e) => {
                    const { value } = e.target
                    AuthManager.emailState = EmailState.DEFAULT
                    AuthManager.email = value
                }}
                onFocus={(e) => {
                    AuthManager.emailState = EmailState.DEFAULT
                }}
                helperText={getEmailHelperText(AuthManager.emailState)}
            />
            <pre
                className='change-password-description'
                style={{
                    wordBreak: 'break-all',
                    wordWrap: 'break-word'
                }}
            >
                {LanguageManager.languageMap.ChangePasswordRequestDescription}
            </pre>
            <AuthButton
                text={LanguageManager.languageMap.GetChangePasswordEmail}
                theme={'primary'}
                style={{
                    marginTop: 44
                }}
                onClick={async (e) => {
                    setLoading(true)
                    const result = await AuthManager.startPasswordChange()
                    setLoading(false)
                    if (result.success) {
                        await RoutingManager.moveTo(Page.NoticeEmailAuth)
                    }
                }}
            />
        </AuthContainer>
    </div>
})

export default ChangePasswordRequest
