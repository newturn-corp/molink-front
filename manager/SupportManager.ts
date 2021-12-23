import { makeAutoObservable } from 'mobx'
import { ChangeEvent } from 'react'
import MainAPI from '../api/MainAPI'
import { SaveSupportDTO } from '../DTO/UserDTO'
import NotificationManager, { NOTIFICATION_TYPE } from './NotificationManager'

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
        NotificationManager.showNotification(NOTIFICATION_TYPE.SUCCESS, '전송 성공!', '작성하신 문의 & 의견이 Knowlink 팀 내의 모든 팀원에게 공유되었습니다! 가입하신 이메일로 빠른 시일 내에 답변드리겠습니다!', 5)
    }

    handleCancel () {
        this.showSupportModal = false
    }

    handleChange (event: ChangeEvent<HTMLTextAreaElement>) {
        this.content = event.target.value
    }
}
export default new SupportManager()
