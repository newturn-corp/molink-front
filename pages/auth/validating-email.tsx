import React from 'react'
import { AuthHeader } from '../../components/auth/AuthHeader'
import { AuthContainer } from '../../components/auth/AuthContainer'
import { SiteHead } from '../../components/global/SiteHead'
import { ValidatingEmailContent } from '../../components/auth/ValidatingEmail/ValidatingEmailContent'

const ValidatingEmailPageContainer = () => {
    if (typeof window === 'undefined' || !window) {
        return <></>
    }
    return <div className='auth-page'>
        <SiteHead/>
        <AuthHeader/>
        <AuthContainer
            loading={false}
        >
            <ValidatingEmailContent/>
        </AuthContainer>
    </div>
}

export default ValidatingEmailPageContainer
