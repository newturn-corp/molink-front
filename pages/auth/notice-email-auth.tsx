import React from 'react'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthContainer } from '../../components/auth/AuthContainer'
import { AuthTitle } from '../../components/auth/AuthTitle'
import LanguageManager from '../../manager/global/LanguageManager'
import { observer } from 'mobx-react'
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthSubButton } from '../../components/auth/AuthSubButton'

const NoticeEmailAuth = observer(() => {
    return <div className='auth-page notice-email-auth-page'>
        <AuthHeader/>
        <AuthContainer
            loading={false}
        >
            <AuthTitle
                text={'이메일 전송됨'}
            />
            <div
                className={'icon'}
            >
                <MailOutlineRoundedIcon/>
            </div>
            <div className={'description'}>
                {'인증 이메일이 전송되었습니다!'}
            </div>
            <div className={'description'}>
                {'메일함을 확인해주세요!'}
            </div>
            <AuthSubButton
                text={'로그인 페이지로 이동하기'}
                onClick={() => RoutingManager.moveTo(Page.SignIn)}
            />
        </AuthContainer>
    </div>
})

export default NoticeEmailAuth
