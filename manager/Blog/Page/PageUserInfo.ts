import EventManager from '../../global/Event/EventManager'
import { Event } from '../../global/Event/Event'
import EditorManager from '../EditorManager'
import ViewerAPI from '../../../api/ViewerAPI'
import { makeAutoObservable } from 'mobx'

export class PageUserInfo {
    userProfileImageUrl: string = '/image/global/header/login-button-profile.png'
    nickname: string = '사용자'

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.LoadContent, async () => {
            if (!EditorManager.editable) {
                await this.updatePageUserInfo()
            }
        }, 1)
        EventManager.addEventListeners(
            [Event.UnloadPage,
                Event.MoveToAnotherPage,
                Event.SignOut
            ], () => {
                this.reset()
            }, 1)
    }

    async updatePageUserInfo () {
        if (!EditorManager.info) {
            return
        }
        const userId = EditorManager.info.userId
        const { infoMap } = await ViewerAPI.getUserInfoMapByIDList([userId])
        const userInfo = infoMap[userId]
        this.nickname = userInfo.nickname
        this.userProfileImageUrl = userInfo.profileImageUrl
    }

    reset () {
        this.userProfileImageUrl = '/image/global/header/login-button-profile.png'
        this.nickname = '사용자'
    }
}
