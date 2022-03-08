import React from 'react'
import { notification } from 'antd'
import StyleManager from './Style/StyleManager'

enum NOTIFICATION_TYPE { SUCCESS, ERROR }

class FeedbackManager {
    public showFeedback (type: NOTIFICATION_TYPE, message: string, description: string, duration: number = 10, width: number = 500) {
        notification.open({
            message,
            description,
            duration,
            style: {
                whiteSpace: 'pre-line',
                width: 'fit-content',
                boxShadow: '0px 8px 16px rgba(145, 158, 171, 0.12)',
                borderRadius: 8,
                fontSize: 14,
                lineHeight: 16,
                height: 64,
                padding: 12,
                color: StyleManager.colorStyle.text.primary
            },
            icon: <img src={'/image/global/notification/success-icon.png'}></img>
        })
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
