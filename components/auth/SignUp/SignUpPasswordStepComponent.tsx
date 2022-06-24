import React from 'react'
import LanguageManager from '../../../manager/global/LanguageManager'
import { EmailState, PasswordState } from '../../../manager/Auth/AuthStates'
import { AuthInput } from '../AuthInput'
import SignUpManager, { SignUpStep } from '../../../manager/Auth/SignUpManager'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { AuthSubButton } from '../AuthSubButton'
import { AuthTitle } from '../AuthTitle'
import { SignUpMoveButton } from './SignUpMoveButton'

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

export const SignUpPasswordStepComponent = observer(() => {
    return <>
        <AuthTitle text={'비밀번호 설정'}/>
        <AuthInput
            autoFocus
            name={Math.random().toString()}
            type={'password'}
            label={LanguageManager.languageMap.Password}
            isPassword={true}
            autoComplete='new-password'
            variant="outlined"
            error={SignUpManager.passwordState !== PasswordState.DEFAULT}
            onChange={(e) => {
                const { value } = e.target
                SignUpManager.passwordState = PasswordState.DEFAULT
                SignUpManager.pwd = value
            }}
            onFocus={(e) => {
                SignUpManager.passwordState = PasswordState.DEFAULT
            }}
            onPaste={(e) => {
                e.preventDefault()
            }}
            defaultValue={SignUpManager.pwd}
            helperText={getPasswordHelperText(SignUpManager.passwordState)}
        />
        <AuthInput
            name={Math.random().toString()}
            type={'password'}
            label={LanguageManager.languageMap.PasswordConfirm}
            isPassword={true}
            autoComplete='new-password'
            variant="outlined"
            error={SignUpManager.passwordState !== PasswordState.DEFAULT}
            onChange={(e) => {
                SignUpManager.passwordState = PasswordState.DEFAULT
                SignUpManager.pwdCheck = e.target.value
            }}
            onFocus={(e) => {
                SignUpManager.passwordState = PasswordState.DEFAULT
            }}
            onPaste={(e) => {
                e.preventDefault()
            }}
            defaultValue={SignUpManager.pwdCheck}
            style={{
                marginBottom: 32
            }}
        />
        <SignUpMoveButton
            onBack={() => {
                SignUpManager.step = SignUpStep.Email
            }}
            onNext={async () => {
                await SignUpManager.handleNextAtPasswordStep()
            }}
        />
    </>
})
