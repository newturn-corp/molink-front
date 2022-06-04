import moment from 'moment-timezone'
import { makeAutoObservable } from 'mobx'
import UserManager from '../../global/User/UserManager'
import ViewerAPI from '../../../api/ViewerAPI'
import EditorPage from './EditorPage'
import ModalManager from '../../global/ModalManager'
import ContentAPI from '../../../api/ContentAPI'
import { PageVisibility, PublishPageDTO } from '@newturn-develop/types-molink'
import DialogManager from '../../global/DialogManager'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../global/FeedbackManager'
import Blog from '../../global/Blog/Blog'

export class EditorPageInfo {
    pageId: string
    lastEditedAt: number = Number(new Date())
    lastPublishedAt: number = Number(moment().subtract(7, 'days').toDate())
    pageDescription: string = null
    thumbnailImage: string = null
    likeCount: number = 0
    isLike: boolean = false
    isPublishable: boolean = false

    constructor (pageId: string) {
        this.pageId = pageId
        makeAutoObservable(this)
    }

    async load () {
        const summary = await ViewerAPI.getPageSummary(EditorPage.pageId)
        this.lastEditedAt = summary.lastEditedAt
        this.lastPublishedAt = summary.lastPublishedAt
        this.isPublishable = !this.lastPublishedAt || moment(this.lastPublishedAt).isBefore(moment().subtract(3, 'days'))
        this.likeCount = summary.like
        this.pageDescription = summary.description
        this.thumbnailImage = summary.image
        if (UserManager.isUserAuthorized) {
            const dto = await ViewerAPI.getUserLikePage(EditorPage.pageId)
            this.isLike = dto.isLike
        }
    }

    async handleLikeButtonDown () {
        if (!UserManager.isUserAuthorized) {
            ModalManager.openShouldLoginNoticeModal = true
            return
        }

        if (this.isLike) {
            await ContentAPI.cancelLikePage(EditorPage.pageId)
            this.likeCount -= 1
        } else {
            await ContentAPI.likePage(EditorPage.pageId)
            this.likeCount += 1
        }
        this.isLike = !this.isLike
    }

    async handlePublishButtonDown () {
        const pageHierarchy = Blog.pageHierarchy
        const {
            title,
            visibility
        } = pageHierarchy.getPage(EditorPage.pageId)
        if (visibility === PageVisibility.Private) {
            const index = await DialogManager.openDialog('비공개 페이지 발행하기', `${title} 페이지의 공개 범위가 비공개 상태이므로 발행해도 아무도 볼 수 없습니다. 공개 범위를 전체 공개로 변경하고 발행하시겠습니까?`, ['변경 후 발행', '비공개 상태로 발행'])
            if (index === 0) {
                const result = await pageHierarchy.visibilityController.updatePageVisibility(EditorPage.pageId, PageVisibility.Public)
                if (!result) {
                    return
                }
            }
        }

        if (this.lastPublishedAt && moment(this.lastPublishedAt).isAfter(moment().subtract(3, 'days'))) {
            FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '아직 발행할 수 없어요!', '', 5)
            return
        }
        await ContentAPI.publishPage(new PublishPageDTO(EditorPage.pageId))
        await EditorPage.editor.permanenceManager.persistPageDataInSearchEngine()

        FeedbackManager.showFeedback(NOTIFICATION_TYPE.SUCCESS, `${title} 페이지가 발행되었습니다!`, '', 5)
        this.lastPublishedAt = Number(new Date())
        this.isPublishable = false
    }
}
