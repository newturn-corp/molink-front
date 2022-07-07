import GlobalManager from '../../GlobalManager'

export class BlogNotificationView {
    notificationViewElement: HTMLElement = null

    constructor () {
        this.notificationViewElement = GlobalManager.document.getElementById('blog-notification-view')
    }

    open () {
        const rect = this.notificationViewElement.getBoundingClientRect()
        const position = {
            top: rect.top + (rect.height / 2),
            left: rect.left + (rect.width / 2)
        }
        setTimeout(() => {
            if (globalThis.document.body.clientHeight < position.top + this.notificationViewElement.offsetHeight + 100) {
                this.notificationViewElement.style.top = `${position.top - this.notificationViewElement.offsetHeight - 5}px`
            } else {
                this.notificationViewElement.style.top = `${position.top + 5}px`
            }
            if (global.document.body.clientWidth < position.left + this.notificationViewElement.offsetWidth + 100) {
                this.notificationViewElement.style.left = `${position.left - this.notificationViewElement.offsetWidth}px`
            } else {
                this.notificationViewElement.style.left = `${position.left}px`
            }
        }, 0)
    }

    close () {
        this.notificationViewElement.style.top = '-9999px'
        this.notificationViewElement.style.left = '-9999px'
    }
}
