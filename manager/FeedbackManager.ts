import { notification } from 'antd'

enum NOTIFICATION_TYPE { SUCCESS, ERROR }

class FeedbackManager {
    public showFeedback (type: NOTIFICATION_TYPE, message: string, description: string, duration: number = 10, width: number = 500) {
        notification[this._convertNotificationTypeToString(type)]({
            message,
            description,
            duration,
            style: {
                whiteSpace: 'pre-line',
                width
            }
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
