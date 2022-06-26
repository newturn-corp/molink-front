import { observer } from 'mobx-react-lite'
import React from 'react'
import { AuthTitle } from '../AuthTitle'
import SignupManager, { SignUpStep } from '../../../manager/Auth/SignUpManager'
import { AuthSignUpProgress } from './AuthSignUpProgress'
import { SignUpTermsStepComponent } from './SignUpTermsStepComponent'
import { SignUpEmailStepComponent } from './SignUpEmailStepComponent'
import { SignUpPasswordStepComponent } from './SignUpPasswordStepComponent'
import { SignUpUserAndBlogInfoStepComponent } from './SignUpUserAndBlogInfoStepComponent'
import { SignUpEmailSentStepComponent } from './SignUpEmailSentStepComponent'
import { AuthContainer } from '../AuthContainer'

const getTitleBySignUpStep = (step: SignUpStep) => {
    switch (step) {
    case SignUpStep.Terms:
        return '약관에 동의해주세요.'
    case SignUpStep.Email:
        return '사용하실 이메일을<br>입력해 주세요.'
    case SignUpStep.Password:
        return '사용하실 비밀번호를<br>입력해 주세요.'
    case SignUpStep.UserAndBlogInfo:
        return '닉네임과<br>블로그 이름을 입력해 주세요.'
    case SignUpStep.EmailSent:
        return '인증 이메일 전송됨'
    default:
        return ''
    }
}

const getStepComponentBySignUpStep = (step: SignUpStep) => {
    switch (step) {
    case SignUpStep.Terms:
        return <SignUpTermsStepComponent/>
    case SignUpStep.Email:
        return <SignUpEmailStepComponent/>
    case SignUpStep.Password:
        return <SignUpPasswordStepComponent/>
    case SignUpStep.UserAndBlogInfo:
        return <SignUpUserAndBlogInfoStepComponent/>
    case SignUpStep.EmailSent:
        return <SignUpEmailSentStepComponent/>
    default:
        return <></>
    }
}

export const SignUpPageContent = observer(() => {
    return <AuthContainer
        loading={false}
    >
        <AuthTitle
            text={getTitleBySignUpStep(SignupManager.step)}
        />
        <AuthSignUpProgress/>
        {
            getStepComponentBySignUpStep(SignupManager.step)
        }
    </AuthContainer>
})
