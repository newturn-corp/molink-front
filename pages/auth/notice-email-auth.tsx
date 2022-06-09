import React from 'react'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthContainer } from '../../components/auth/AuthContainer'
import { AuthTitle } from '../../components/auth/AuthTitle'
import LanguageManager from '../../manager/global/LanguageManager'
import { observer } from 'mobx-react'
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthSubButton } from '../../components/auth/AuthSubButton'
import { SiteHead } from '../../components/global/SiteHead'

const NoticeEmailAuth = observer(() => {
    return <div className='auth-page notice-email-auth-page'>
        <SiteHead/>
        <AuthHeader/>
        <AuthContainer
            loading={false}
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
        </AuthContainer>
    </div>
})

export default NoticeEmailAuth
