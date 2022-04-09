import { makeAutoObservable } from 'mobx'
import React, { ChangeEvent } from 'react'
import MainAPI from '../../api/mainAPI'
import { SaveSupportDTO } from '../../DTO/UserDTO'
import FeedbackManager, { NOTIFICATION_TYPE } from './FeedbackManager'
import { isBrowser } from 'react-device-detect'
import { TextAreaRef } from 'antd/es/input/TextArea'

class SupportManager {
    showSupportModal: boolean = false
    isSupportDrawerOpen: boolean = false
    content: string = ''
    supportModalTextAreaRef: React.MutableRefObject<TextAreaRef> = null

    constructor () {
        makeAutoObservable(this, {
            supportModalTextAreaRef: false
        })
    }

    public openSupportModal () {
        this.showSupportModal = true
        setTimeout(() => {
            this.supportModalTextAreaRef.current.focus()
        }, 0)
    }

    private async saveSupport (content: string) {
        await MainAPI.saveSupport(new SaveSupportDTO(content))
    }

    async handleOk () {
        if (isBrowser) {
            this.showSupportModal = false
        } else {
            this.isSupportDrawerOpen = false
        }
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
        this.content = ''
    }

    handleChange (event: ChangeEvent<HTMLTextAreaElement>) {
        this.content = event.target.value
    }
}
export default new SupportManager()
