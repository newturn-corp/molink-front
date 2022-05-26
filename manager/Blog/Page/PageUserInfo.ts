import EventManager from '../../global/Event/EventManager'
import { Event } from '../../global/Event/Event'
import EditorManager from '../EditorManager'
import ViewerAPI from '../../../api/ViewerAPI'
import { makeAutoObservable } from 'mobx'
import UserManager from '../../global/User/UserManager'
import ContentAPI from '../../../api/ContentAPI'
import ModalManager from '../../global/ModalManager'

export class PageUserInfo {
    isLoaded: boolean = false
    userProfileImageUrl: string = '/image/global/header/login-button-profile.png'
    nickname: string = '사용자'
    lastEditedAt: number = Number(new Date())
    likeCount: number = 0
    isLike: boolean = false

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.LoadContent, async () => {
            if (!EditorManager.editable || EditorManager.isLocked) {
                await this.updatePageUserInfo()
            }
        }, 1)
        EventManager.addEventListener(Event.LockPage, async ({ isLocked }: any) => {
            if (isLocked && !this.isLoaded) {
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
        const summary = await ViewerAPI.getPageSummary(EditorManager.pageId)
        const userInfo = infoMap[userId]
        this.nickname = userInfo.nickname
        this.userProfileImageUrl = userInfo.profileImageUrl
        this.lastEditedAt = summary.lastEditedAt
        this.likeCount = summary.like
        if (UserManager.isUserAuthorized) {
            const dto = await ViewerAPI.getUserLikePage(EditorManager.pageId)
            this.isLike = dto.isLike
        }
        this.isLoaded = true
    }

    async handleLikeButtonDown () {
        if (!UserManager.isUserAuthorized) {
            ModalManager.openShouldLoginNoticeModal = true
            return
        }

        if (this.isLike) {
            await ContentAPI.cancelLikePage(EditorManager.pageId)
            this.likeCount -= 1
        } else {
            await ContentAPI.likePage(EditorManager.pageId)
            this.likeCount += 1
        }
        this.isLike = !this.isLike
    }

    reset () {
        this.userProfileImageUrl = '/image/global/header/login-button-profile.png'
        this.nickname = '사용자'
        this.isLoaded = false
        this.lastEditedAt = Number(new Date())
        this.isLike = false
        this.likeCount = 0
    }
}
