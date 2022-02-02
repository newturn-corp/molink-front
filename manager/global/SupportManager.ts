import { makeAutoObservable } from 'mobx'
import { ChangeEvent } from 'react'
import MainAPI from '../api/MainAPI'
import { SaveSupportDTO } from '../DTO/UserDTO'
import FeedbackManager, { NOTIFICATION_TYPE } from './global/FeedbackManager'

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
        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, '전송 성공!', '작성하신 문의 & 의견이\nKnowlink 팀 내의 모든 팀원에게 공유되었습니다!\n의견을 보내주셔서 감사합니다.', 5, 450)
    }

    handleCancel () {
        this.showSupportModal = false
    }

    handleChange (event: ChangeEvent<HTMLTextAreaElement>) {
        this.content = event.target.value
    }
}
export default new SupportManager()
