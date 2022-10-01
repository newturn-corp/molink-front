import React from 'react'
import { isMobile } from 'react-device-detect'

export const SiteBody: React.FC<{
}> = ({ children }) => {
    return <div
        className={'site-body ' + (isMobile ? 'mobile-site-body' : '')}
    >
        {children}
    </div>
}
