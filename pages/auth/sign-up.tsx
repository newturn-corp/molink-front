import React, { useEffect, useRef, useState } from 'react'
import { BlogNameState, EmailState, NicknameState, PasswordState } from '../../manager/Auth/AuthStates'
import { observer } from 'mobx-react-lite'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthHeader } from '../../components/auth/AuthHeader'
import UserManager from '../../manager/global/User/UserManager'
import SignupManager, { SignUpStep } from '../../manager/Auth/SignUpManager'
import { AuthContainer } from '../../components/auth/AuthContainer'
import { SiteHead } from '../../components/global/SiteHead'
import { Steps } from 'antd'
import { SignUpEmailStepComponent } from '../../components/auth/SignUp/SignUpEmailStepComponent'
import LanguageManager from '../../manager/global/LanguageManager'
import { SignUpTermsStepComponent } from '../../components/auth/SignUp/SignUpTermsStepComponent'
import { SignUpPasswordStepComponent } from '../../components/auth/SignUp/SignUpPasswordStepComponent'
import { SignUpUserAndBlogInfoStepComponent } from '../../components/auth/SignUp/SignUpUserAndBlogInfoStepComponent'
import { SignUpEmailSentStepComponent } from '../../components/auth/SignUp/SignUpEmailSentStepComponent'

const { Step } = Steps

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

const getNicknameHelperText = (nicknameState: NicknameState) => {
    switch (nicknameState) {
    case NicknameState.Default:
        return LanguageManager.languageMap.NicknameCondition
    case NicknameState.NicknameConditionNotSatisfied:
        return LanguageManager.languageMap.NicknameConditionError
    case NicknameState.NicknameAlreadyExists:
        return LanguageManager.languageMap.NicknameAlreadyExistsError
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

const SignUp = observer(() => {
    const [loading, setLoading] = useState(false)
    const nicknameRef = useRef<HTMLInputElement>(null)
    const [nicknameFocus, setNicknameFocus] = useState(false)
    useEffect(() => {
        UserManager.load()
            .then(() => {
                if (UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.Index)
                }
            })
    }, [])
    return <div className='auth-page'>
        <SiteHead/>
        <AuthHeader/>
        <AuthContainer
            loading={loading}
        >
            {
                getStepComponentBySignUpStep(SignupManager.step)
            }
            {/* <AuthInput */}
            {/*     name={Math.random().toString()} */}
            {/*     type={'text'} */}
            {/*     label={LanguageManager.languageMap.Email} */}
            {/*     variant="outlined" */}
            {/*     autoComplete='new-street-address' */}
            {/*     error={SignupManager.emailState !== EmailState.Default} */}
            {/*     onChange={(e) => { */}
            {/*         const { value } = e.target */}
            {/*         SignupManager.emailState = EmailState.Default */}
            {/*         SignupManager.email = value */}
            {/*     }} */}
            {/*     onFocus={(e) => { */}
            {/*         SignupManager.emailState = EmailState.Default */}
            {/*     }} */}
            {/*     defaultValue={SignupManager.email} */}
            {/*     helperText={getEmailHelperText(SignupManager.emailState)} */}
            {/* /> */}
            {/* <AuthInput */}
            {/*     name={Math.random().toString()} */}
            {/*     type={'password'} */}
            {/*     label={LanguageManager.languageMap.Password} */}
            {/*     isPassword={true} */}
            {/*     autoComplete='new-password' */}
            {/*     variant="outlined" */}
            {/*     error={SignupManager.passwordState !== PasswordState.DEFAULT} */}
            {/*     onChange={(e) => { */}
            {/*         const { value } = e.target */}
            {/*         SignupManager.passwordState = PasswordState.DEFAULT */}
            {/*         SignupManager.pwd = value */}
            {/*     }} */}
            {/*     onFocus={(e) => { */}
            {/*         SignupManager.passwordState = PasswordState.DEFAULT */}
            {/*     }} */}
            {/*     onPaste={(e) => { */}
            {/*         e.preventDefault() */}
            {/*     }} */}
            {/*     defaultValue={SignupManager.pwd} */}
            {/*     helperText={getPasswordHelperText(SignupManager.passwordState)} */}
            {/* /> */}
            {/* <AuthInput */}
            {/*     name={Math.random().toString()} */}
            {/*     type={'password'} */}
            {/*     label={LanguageManager.languageMap.PasswordConfirm} */}
            {/*     isPassword={true} */}
            {/*     autoComplete='new-password' */}
            {/*     variant="outlined" */}
            {/*     error={SignupManager.passwordState !== PasswordState.DEFAULT} */}
            {/*     onChange={(e) => { */}
            {/*         SignupManager.passwordState = PasswordState.DEFAULT */}
            {/*         SignupManager.pwdCheck = e.target.value */}
            {/*     }} */}
            {/*     onFocus={(e) => { */}
            {/*         SignupManager.passwordState = PasswordState.DEFAULT */}
            {/*     }} */}
            {/*     onPaste={(e) => { */}
            {/*         e.preventDefault() */}
            {/*     }} */}
            {/*     defaultValue={SignupManager.pwdCheck} */}
            {/* /> */}
            {/* <AuthInput */}
            {/*     inputRef={nicknameRef} */}
            {/*     name={Math.random().toString()} */}
            {/*     type={'text'} */}
            {/*     label={LanguageManager.languageMap.Nickname} */}
            {/*     autoComplete='off' */}
            {/*     variant='outlined' */}
            {/*     error={SignupManager.nicknameState !== NicknameState.Default} */}
            {/*     onChange={(e) => { */}
            {/*         const { value } = e.target */}
            {/*         SignupManager.nicknameState = NicknameState.Default */}
            {/*         SignupManager.nickname = value */}
            {/*     }} */}
            {/*     value={SignupManager.nickname} */}
            {/*     defaultValue={SignupManager.nickname} */}
            {/*     helperText={getNicknameHelperText(SignupManager.nicknameState)} */}
            {/*     onFocus={() => setNicknameFocus(true)} */}
            {/*     onBlur={() => setNicknameFocus(false)} */}
            {/*     InputLabelProps={{ shrink: SignupManager.nickname !== '' || nicknameFocus }} */}
            {/* /> */}
            {/* <AuthSubButton */}
            {/*     text={LanguageManager.languageMap.GenerateRandomNickname} */}
            {/*     style={{ */}
            {/*         border: '1px solid #C9CDD2', */}
            {/*         fontSize: 12, */}
            {/*         color: '#595959', */}
            {/*         borderRadius: 5, */}
            {/*         padding: 7 */}
            {/*     }} */}
            {/*     onClick={async () => { */}
            {/*         const { nickname } = await AuthAPI.getRandomNickname() */}
            {/*         SignupManager.nicknameState = NicknameState.Default */}
            {/*         SignupManager.nickname = nickname */}
            {/*     }} */}
            {/* /> */}
            {/* <AuthInput */}
            {/*     inputRef={nicknameRef} */}
            {/*     name={Math.random().toString()} */}
            {/*     type={'text'} */}
            {/*     label={'블로그 이름'} */}
            {/*     autoComplete='off' */}
            {/*     variant='outlined' */}
            {/*     error={SignupManager.blogNameState !== BlogNameState.Default} */}
            {/*     onChange={(e) => { */}
            {/*         const { value } = e.target */}
            {/*         SignupManager.blogNameState = BlogNameState.Default */}
            {/*         SignupManager.blogName = value */}
            {/*     }} */}
            {/*     value={SignupManager.blogName} */}
            {/*     defaultValue={SignupManager.blogName} */}
            {/*     helperText={getNicknameHelperText(SignupManager.blogNameState)} */}
            {/*     onFocus={() => setNicknameFocus(true)} */}
            {/*     onBlur={() => setNicknameFocus(false)} */}
            {/*     InputLabelProps={{ shrink: SignupManager.nickname !== '' || nicknameFocus }} */}
            {/* /> */}
            {/* <SignupCheckList/> */}
            {/* <AuthButton */}
            {/*     text={LanguageManager.languageMap.SignUp} */}
            {/*     theme={'primary-stroke'} */}
            {/*     onClick={async () => { */}
            {/*         setLoading(true) */}
            {/*         const result = await SignupManager.signup() */}
            {/*         setLoading(false) */}
            {/*         if (result.success) { */}
            {/*             await RoutingManager.moveTo(Page.NoticeEmailAuth) */}
            {/*         } */}
            {/*     }} */}
            {/* /> */}
            {/* <AuthSubButton */}
            {/*     text={LanguageManager.languageMap.AlreadyAccountExists} */}
            {/*     onClick={() => RoutingManager.moveTo(Page.SignIn)} */}
            {/* /> */}
        </AuthContainer>
    </div>
})

export default SignUp
