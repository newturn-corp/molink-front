import { Blog } from './Blog'
import { UserPageList } from './UserPageList'
import { InvalidParam } from '../../Errors/Common'
import UserManager from '../global/User/UserManager'
import ViewerAPI from '../../api/ViewerAPI'
import DialogManager from '../global/DialogManager'
import RoutingManager, { Page } from '../global/RoutingManager'
import { ESUser } from '@newturn-develop/types-molink'
import HierarchyManager from '../global/Hierarchy/HierarchyManager'
import EditorManager from './EditorManager'
import { UserNotExists } from '../../Errors/UserError'
import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../../Errors/DocumentError'
import { ContentNotExists, ContentUserNotExists, UnauthorizedForContent } from '../../Errors/ContentError'
import { HierarchyNotExists } from '../../Errors/HierarchyError'
import { BlogPageNotExist } from '../../Errors/BlogError'
import { makeAutoObservable } from 'mobx'

enum BlogURLType {
    OnlyPageURL = 'only-page-url',
    UserMainURL = 'user-main-url',
    StandardDocumentURL = 'standard-document-url'
}

class BlogPage {
    blog: Blog = null

    constructor () {
        makeAutoObservable(this)
    }

    _interpretURLInfo (info: string[]) {
        if (info.length === 0) {
            throw new InvalidParam()
        } else if (info.length === 1) {
            if (info[0].length < 28) {
                return { type: BlogURLType.UserMainURL, nickname: info[0], pageId: null, documentName: null }
            } else if (info[0].length === 32) {
                return { type: BlogURLType.OnlyPageURL, nickname: null, pageId: info[0], documentName: null }
            } else {
                throw new InvalidParam()
            }
        } else if (info.length === 2) {
            const nickname = info[0]
            const pageListOrder = Number(info[1])
            return { type: BlogURLType.UserMainURL, nickname, pageListOrder }
        } else {
            const nickname = info[0]
            const pageId = info[1]
            const documentName = info[2]
            if (nickname.length > 27 || pageId.length !== 32) {
                throw new InvalidParam()
            }
            return { type: BlogURLType.StandardDocumentURL, nickname, pageId, documentName }
        }
    }

    private async _handleEnterOnlyPageURL (pageId: string) {
        const authority = await ViewerAPI.getDocumentAuthority(pageId)
        if (!authority.viewable) {
            throw new BlogPageNotExist(authority.nickname)
        }
        await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${authority.nickname}/${pageId}/${encodeURIComponent(authority.documentName)}`)
    }

    private async _handleEnterUserMainURL (nickname: string) {
        const dto = await ViewerAPI.getUserInfoMapByNicknameList([nickname])
        const userInfo = dto.infoMap[nickname] as ESUser
        if (!userInfo) {
            throw new UserNotExists()
        }
        console.log(userInfo)
        const userId = Number(userInfo.id)
        if (!this.blog || this.blog.id !== userId) {
            this.blog = new Blog(userId)
        }
        await HierarchyManager.loadHierarchy(userId)
        await this.blog.loadUserPageList()
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        currentHierarchy.openedPageId = null
    }

    private async _handleEnterStandardPageURL (pageId: string, nickname: string, pageName: string) {
        const authority = await ViewerAPI.getDocumentAuthority(pageId)
        if (!authority.viewable) {
            throw new BlogPageNotExist(authority.nickname)
        }
        if (authority.nickname !== nickname || (pageName !== undefined && authority.documentName !== decodeURIComponent(pageName))) {
            await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${authority.nickname}/${pageId}/${encodeURIComponent(authority.documentName)}`)
            return
        }
        if (!this.blog || this.blog.id !== authority.userId) {
            this.blog = new Blog(authority.userId)
        }
        await HierarchyManager.loadHierarchy(authority.userId)
        await EditorManager.load(pageId)
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        currentHierarchy.openPageParents(pageId)
    }

    async handleEnter (info: string[]) {
        try {
            await UserManager.load()
            const { type, nickname, pageId, documentName } = this._interpretURLInfo(info)
            if (type === BlogURLType.OnlyPageURL) {
                await this._handleEnterOnlyPageURL(pageId)
            } else if (type === BlogURLType.UserMainURL) {
                await this._handleEnterUserMainURL(nickname)
            } else if (type === BlogURLType.StandardDocumentURL) {
                await this._handleEnterStandardPageURL(pageId, nickname, documentName)
            }
        } catch (err) {
            if (err instanceof UserNotExists) {
                await DialogManager.openDialog('사용자가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof DocumentNotExists) {
                await DialogManager.openDialog('문서가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnexpectedError) {
                await DialogManager.openDialog('예상치 못한 문제가 발생했습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnauthorizedForDocument) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof ContentNotExists) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnauthorizedForContent) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof ContentUserNotExists) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof HierarchyNotExists) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof BlogPageNotExist) {
                await DialogManager.openDialog('페이지가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Blog, `/${err.blogNickname}`)
            } else {
                throw err
            }
        }
    }
}
export default new BlogPage()
