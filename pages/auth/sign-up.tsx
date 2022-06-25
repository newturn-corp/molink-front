import React, { useEffect, useRef, useState } from 'react'
import { observer } from 'mobx-react-lite'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { AuthHeader } from '../../components/auth/AuthHeader'
import UserManager from '../../manager/global/User/UserManager'
import { AuthContainer } from '../../components/auth/AuthContainer'
import { SiteHead } from '../../components/global/SiteHead'
import { SignUpPageContent } from '../../components/auth/SignUp/SignUpPageContent'

const SignUp = () => {
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
        <SignUpPageContent/>
    </div>
}

export default SignUp
