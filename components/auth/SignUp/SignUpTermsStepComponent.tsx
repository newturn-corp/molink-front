import React from 'react'
import LanguageManager from '../../../manager/global/LanguageManager'
import { observer } from 'mobx-react'
import { SignupCheckList } from '../SignupCheckList'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { AuthSubButton } from '../AuthSubButton'
import { AuthTitle } from '../AuthTitle'
import { SignUpMoveButton } from './SignUpMoveButton'
import SignUpManager from '../../../manager/Auth/SignUpManager'

export const SignUpTermsStepComponent = observer(() => {
    return <>
        <SignupCheckList/>
        <SignUpMoveButton
            showBack={false}
            onNext={() => {
                SignUpManager.handleNextAtCheckTermStep()
            }}
        />
        <AuthSubButton
            text={LanguageManager.languageMap.AlreadyAccountExists}
            onClick={() => RoutingManager.moveTo(Page.SignIn)}
        />
    </>
})
