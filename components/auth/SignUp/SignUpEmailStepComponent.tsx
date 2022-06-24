import React from 'react'
import LanguageManager from '../../../manager/global/LanguageManager'
import { EmailState } from '../../../manager/Auth/AuthStates'
import { AuthInput } from '../AuthInput'
import SignUpManager, { SignUpStep } from '../../../manager/Auth/SignUpManager'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { AuthSubButton } from '../AuthSubButton'
import { AuthTitle } from '../AuthTitle'
import { SignUpMoveButton } from './SignUpMoveButton'

const getEmailHelperText = (emailState: EmailState) => {
    switch (emailState) {
    case EmailState.Default:
        return undefined
    case EmailState.EmptyEmail:
        return LanguageManager.languageMap.EmptyEmailError
    case EmailState.NotEmail:
        return LanguageManager.languageMap.EmailFormatError
    case EmailState.SameEmail:
        return LanguageManager.languageMap.EmailAlreadyExistsError
    default:
        throw new Error('Unhandled Email State')
    }
}

export const SignUpEmailStepComponent = observer(() => {
    return <>
        <AuthTitle text={'계정 만들기'}/>
        <AuthInput
            autoFocus
            name={Math.random().toString()}
            type={'text'}
            label={LanguageManager.languageMap.Email}
            variant="outlined"
            autoComplete='new-street-address'
            error={SignUpManager.emailState !== EmailState.Default}
            onChange={(e) => {
                const { value } = e.target
                SignUpManager.emailState = EmailState.Default
                SignUpManager.email = value
            }}
            onFocus={(e) => {
                SignUpManager.emailState = EmailState.Default
            }}
            onKeyDown={async (event) => {
                if (event.key === 'Enter') {
                    await SignUpManager.handleNextAtEmailStep()
                }
            }}
            defaultValue={SignUpManager.email}
            helperText={getEmailHelperText(SignUpManager.emailState)}
            style={{
                marginBottom: 50
            }}
        />
        <SignUpMoveButton
            onBack={() => {
                SignUpManager.step = SignUpStep.Terms
            }}
            onNext={async () => {
                await SignUpManager.handleNextAtEmailStep()
            }}
        />
    </>
})
