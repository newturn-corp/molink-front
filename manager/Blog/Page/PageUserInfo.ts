import EventManager from '../../global/Event/EventManager'
import { Event } from '../../global/Event/Event'
import EditorManager from '../EditorManager'
import ViewerAPI from '../../../api/ViewerAPI'
import { makeAutoObservable } from 'mobx'
import UserManager from '../../global/User/UserManager'
import ContentAPI from '../../../api/ContentAPI'
import ModalManager from '../../global/ModalManager'
import moment from 'moment-timezone'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../global/FeedbackManager'
import { PageVisibility, PublishPageDTO } from '@newturn-develop/types-molink'
import HierarchyManager from '../../global/Hierarchy/HierarchyManager'
import DialogManager from '../../global/DialogManager'
import EditorPage from '../Editor/EditorPage'

export class PageUserInfo {
    isLoaded: boolean = false
    userProfileImageUrl: string = '/image/global/header/login-button-profile.png'
    nickname: string = '사용자'
    lastEditedAt: number = Number(new Date())
    lastPublishedAt: number = Number(moment().subtract(7, 'days').toDate())
    isPublishable: boolean = false
    likeCount: number = 0
    isLike: boolean = false
    pageDescription: string = null
    thumbnailImage: string = null

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.LockPage, async ({ isLocked }: any) => {
            if (isLocked && !this.isLoaded) {
                await this.load()
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

    async load () {
        const summary = await ViewerAPI.getPageSummary(EditorPage.pageId)
        const userId = Number(summary.userId)
        const { infoMap } = await ViewerAPI.getUserInfoMapByIDList([userId])
        const userInfo = infoMap[userId]
        this.nickname = userInfo.nickname
        this.userProfileImageUrl = userInfo.profileImageUrl
        this.lastEditedAt = summary.lastEditedAt
        this.lastPublishedAt = summary.lastPublishedAt
        this.isPublishable = !this.lastPublishedAt || moment(this.lastPublishedAt).isBefore(moment().subtract(3, 'days'))
        this.likeCount = summary.like
        this.pageDescription = summary.description
        this.thumbnailImage = summary.image
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

    async handlePublishButtonDown () {
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        const {
            title,
            visibility
        } = currentHierarchy.getPage(EditorManager.pageId)
        if (visibility === PageVisibility.Private) {
            const index = await DialogManager.openDialog('비공개 페이지 발행하기', `${title} 페이지의 공개 범위가 비공개 상태이므로 발행해도 아무도 볼 수 없습니다. 공개 범위를 전체 공개로 변경하고 발행하시겠습니까?`, ['변경 후 발행', '비공개 상태로 발행'])
            if (index === 0) {
                await currentHierarchy.visibilityController.updatePageVisibility(EditorManager.pageId, PageVisibility.Public)
            }
        }

        if (this.lastPublishedAt && moment(this.lastPublishedAt).isAfter(moment().subtract(3, 'days'))) {
            FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '아직 발행할 수 없어요!', '', 5)
            return
        }
        await ContentAPI.publishPage(new PublishPageDTO(EditorManager.pageId))

        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, `${title} 페이지가 발행되었습니다!`, '', 5)
        this.lastPublishedAt = Number(new Date())
        this.isPublishable = false
    }

    reset () {
        this.userProfileImageUrl = '/image/global/header/login-button-profile.png'
        this.nickname = '사용자'
        this.isLoaded = false
        this.lastEditedAt = Number(new Date())
        this.lastPublishedAt = Number(moment().subtract(7, 'days').toDate())
        this.isPublishable = false
        this.isLike = false
        this.likeCount = 0
        this.pageDescription = null
        this.thumbnailImage = null
    }
}
