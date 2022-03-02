import { makeAutoObservable } from 'mobx'
import { ChangeEvent } from 'react'
import MainAPI from '../../api/mainAPI'
import { SaveSupportDTO } from '../../DTO/UserDTO'
import FeedbackManager, { NOTIFICATION_TYPE } from './FeedbackManager'

class SupportManager {
    showSupportModal: boolean = false
    content: string = ''

    constructor () {
        makeAutoObservable(this)
    }

    async saveSupport (content: string) {
        await MainAPI.saveSupport(new SaveSupportDTO(content))
    }

    async handleOk () {
        this.showSupportModal = false
        await this.saveSupport(this.content)
        this.content = ''
        FeedbackManager.showFeedback(
            NOTIFICATION_TYPE.SUCCESS,
            '의견을 보내주셔서 감사합니다.',
            '',
            5)
    }

    handleCancel () {
        this.showSupportModal = false
    }

    handleChange (event: ChangeEvent<HTMLTextAreaElement>) {
        this.content = event.target.value
    }
}
export default new SupportManager()
