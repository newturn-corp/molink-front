import React from 'react'
import { AuthLogo } from './logo'

export const AuthHeader: React.FC<{
}> = () => {
    return <div
        className={'auth-header'}
    >
        <AuthLogo />
    </div>
}
