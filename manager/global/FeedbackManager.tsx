import React from 'react'
import { notification } from 'antd'
import StyleManager from './Style/StyleManager'
import ErrorIcon from 'public/image/icon/error-color.svg'
import { isBrowser } from 'react-device-detect'

enum NOTIFICATION_TYPE { SUCCESS, ERROR }

class FeedbackManager {
    constructor () {
        notification.config({
            top: 80,
            bottom: 80
        })
    }

    public showFeedback (type: NOTIFICATION_TYPE, message: string, description: string, duration: number = 10, width: number = 500) {
        notification.open({
            message,
            description,
            duration,
            style: {
                whiteSpace: 'pre-line',
                width: 'fit-content',
                maxWidth: '100vw',
                boxShadow: '0px 8px 16px rgba(145, 158, 171, 0.12)',
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 16,
                height: 64,
                padding: 12,
                color: StyleManager.colorStyle.text.primary
            },
            placement: isBrowser ? 'topRight' : 'bottomRight',
            icon: this.getIconByNotificationType(type)
        })
    }

    private getIconByNotificationType (type: NOTIFICATION_TYPE) {
        if (type === NOTIFICATION_TYPE.SUCCESS) {
            return <img
                src={'/image/global/notification/success-icon.png'}
            />
        } else if (type === NOTIFICATION_TYPE.ERROR) {
            return <ErrorIcon/>
        }
    }

    private _convertNotificationTypeToString (type: NOTIFICATION_TYPE) {
        if (type === NOTIFICATION_TYPE.SUCCESS) {
            return 'success'
        } else if (type === NOTIFICATION_TYPE.ERROR) {
            return 'error'
        }
    }
}
export { NOTIFICATION_TYPE }
export default new FeedbackManager()
