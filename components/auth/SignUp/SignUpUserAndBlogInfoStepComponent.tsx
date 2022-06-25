import React, { useRef, useState } from 'react'
import LanguageManager from '../../../manager/global/LanguageManager'
import { BlogNameState, EmailState, NicknameState, PasswordState } from '../../../manager/Auth/AuthStates'
import { AuthInput } from '../AuthInput'
import SignUpManager, { SignUpStep } from '../../../manager/Auth/SignUpManager'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { AuthSubButton } from '../AuthSubButton'
import { AuthTitle } from '../AuthTitle'
import { SignUpMoveButton } from './SignUpMoveButton'
import AuthAPI from '../../../api/AuthAPI'

const getNicknameHelperText = (nicknameState: NicknameState) => {
    switch (nicknameState) {
    case NicknameState.Default:
    case NicknameState.NicknameConditionNotSatisfied:
        return LanguageManager.languageMap.AuthSignUpNicknameConditionHelperText
    case NicknameState.NicknameAlreadyExists:
        return LanguageManager.languageMap.AuthSignUpNicknameAlreadyExistsError
    default:
        throw new Error('Unhandled Password State')
    }
}

const getBlogNameHelperText = (blogNameState: BlogNameState) => {
    switch (blogNameState) {
    case BlogNameState.Default:
        return LanguageManager.languageMap.AuthSignUpBlogNameConditionHelperText
    case BlogNameState.BlogNameConditionNotSatisfied:
        return LanguageManager.languageMap.AuthSignUpBlogNameConditionErrorHelperText
    case BlogNameState.BlogNameAlreadyExists:
        return LanguageManager.languageMap.AuthSignUpBlogNameAlreadyExistsErrorHelperText
    default:
        throw new Error('Unhandled Password State')
    }
}

export const SignUpUserAndBlogInfoStepComponent = observer(() => {
    const nicknameRef = useRef<HTMLInputElement>(null)
    const [nicknameFocus, setNicknameFocus] = useState(false)
    return <>
        <AuthInput
            autoFocus
            inputRef={nicknameRef}
            type={'text'}
            label={LanguageManager.languageMap.AuthSignUpNicknameLabel}
            autoComplete='off'
            variant='outlined'
            error={SignUpManager.nicknameState !== NicknameState.Default}
            onChange={(e) => {
                const { value } = e.target
                if (SignUpManager.blogName === '' || SignUpManager.blogName === SignUpManager.nickname + LanguageManager.languageMap.AuthSignUpBlogNamePostfix) {
                    SignUpManager.blogName = value + LanguageManager.languageMap.AuthSignUpBlogNamePostfix
                }
                SignUpManager.nicknameState = NicknameState.Default
                SignUpManager.nickname = value
            }}
            value={SignUpManager.nickname}
            defaultValue={SignUpManager.nickname}
            helperText={getNicknameHelperText(SignUpManager.nicknameState)}
            onFocus={() => setNicknameFocus(true)}
            onBlur={() => setNicknameFocus(false)}
            InputLabelProps={{ shrink: SignUpManager.nickname !== '' || nicknameFocus }}
            style={{
                marginBottom: 12
            }}
        />
        <AuthInput
            type={'text'}
            label={LanguageManager.languageMap.AuthSignUpBlogNameLabel}
            autoComplete='off'
            variant='outlined'
            error={SignUpManager.blogNameState !== BlogNameState.Default}
            onChange={(e) => {
                const { value } = e.target
                SignUpManager.blogNameState = BlogNameState.Default
                SignUpManager.blogName = value
            }}
            value={SignUpManager.blogName}
            defaultValue={SignUpManager.blogName}
            helperText={getBlogNameHelperText(SignUpManager.blogNameState)}
        />
        <AuthSubButton
            text={LanguageManager.languageMap.AuthSignUpGenerateRandomNicknameButtonText}
            style={{
                border: '1px solid #C9CDD2',
                fontSize: 12,
                color: '#595959',
                borderRadius: 5,
                padding: 7,
                marginBottom: 48
            }}
            onClick={async () => {
                await SignUpManager.handleRandomGenerationNicknameButtonDown()
            }}
        />
        <SignUpMoveButton
            onBack={() => {
                SignUpManager.step = SignUpStep.Password
            }}
            onNext={async () => {
                await SignUpManager.signup()
            }}
        />
    </>
})
