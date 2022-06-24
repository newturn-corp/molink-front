import React from 'react'
import LanguageManager from '../../../manager/global/LanguageManager'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { AuthSubButton } from '../AuthSubButton'
import { AuthTitle } from '../AuthTitle'
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded'

export const SignUpEmailSentStepComponent = observer(() => {
    return <div
        className={'notice-email-auth-page'}
    >
        <AuthTitle
            text={LanguageManager.languageMap.NoticeEmailAuthTitle}
        />
        <div
            className={'icon'}
        >
            <MailOutlineRoundedIcon/>
        </div>
        <div className={'description'}>
            {LanguageManager.languageMap.NoticeEmailAuthDescription1}
        </div>
        <div className={'description'}>
            {LanguageManager.languageMap.NoticeEmailAuthDescription2}
        </div>
        <AuthSubButton
            text={LanguageManager.languageMap.MoveToLoginPage}
            onClick={() => RoutingManager.moveTo(Page.SignIn)}
        />
    </div>
})
