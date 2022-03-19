import React from 'react'
import { CircularProgress } from '@material-ui/core'
import { isBrowser } from 'react-device-detect'

export interface AuthContainerPropsInterface {
    loading: boolean
}

const AuthContainerMobileStyle: React.CSSProperties = {
    background: 'transparent',
    top: 50
}

const AuthContainerBrowserStyle: React.CSSProperties = {
    background: '#FFFFFF',
    border: '1px solid #ECEFF2',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
    top: 104
}

export const AuthContainer: React.FC<AuthContainerPropsInterface> = (props) => {
    return <div
        className={'auth-container' + (props.loading ? ' loading' : '')}
        style={isBrowser ? AuthContainerBrowserStyle : AuthContainerMobileStyle}
    >
        <CircularProgress style={{ display: props.loading ? undefined : 'none' }} color="inherit" />
        <div style={{ display: props.loading ? 'none' : undefined }}>
            {props.children}
        </div>
    </div>
}
