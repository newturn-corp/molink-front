import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../../Errors/DocumentError'
import { UserNotExists } from '../../Errors/UserError'
import DialogManager from '../global/DialogManager'
import RoutingManager, { Page } from '../global/RoutingManager'
import { ContentNotExists, ContentUserNotExists, UnauthorizedForContent } from '../../Errors/ContentError'
import { HierarchyNotExists } from '../../Errors/HierarchyError'
import ViewerAPI from '../../api/ViewerAPI'
import { InvalidParam } from '../../Errors/Common'
import HierarchyManager from '../global/Hierarchy/HierarchyManager'
import EditorManager from './EditorManager'
import UserManager from '../global/User/UserManager'
import { UserPageList } from './UserPageList'

enum HomeURLType {
    OnlyDocumentURL = 'only-document-url',
    UserMainURL = 'user-main-url',
    StandardDocumentURL = 'standard-document-url'
}

class BlogManager {
    blogUserId: number = 0
    userPageList: UserPageList

    constructor () {
        this.userPageList = new UserPageList()
    }

    interpretURLInfo (info: string[]) {
        if (info.length === 0) {
            throw new InvalidParam()
        } else if (info.length === 1) {
            if (info[0].length < 28) {
                return { type: HomeURLType.UserMainURL, nickname: info[0], pageId: null, documentName: null }
            } else if (info[0].length === 32) {
                return { type: HomeURLType.OnlyDocumentURL, nickname: null, pageId: info[0], documentName: null }
            } else {
                throw new InvalidParam()
            }
        } else if (info.length === 2) {
            const nickname = info[0]
            const pageListOrder = Number(info[1])
            return { type: HomeURLType.UserMainURL, nickname, pageListOrder }
        } else {
            const nickname = info[0]
            const pageId = info[1]
            const documentName = info[2]
            if (nickname.length > 27 || pageId.length !== 32) {
                throw new InvalidParam()
            }
            return { type: HomeURLType.StandardDocumentURL, nickname, pageId, documentName }
        }
    }

    async handleEnterBlogPage (info: string[]) {
        try {
            await UserManager.load()
            const { type, nickname, pageId, documentName, pageListOrder } = this.interpretURLInfo(info)
            if (type === HomeURLType.OnlyDocumentURL) {
                const authority = await ViewerAPI.getDocumentAuthority(pageId)
                if (!authority.viewable) {
                    await DialogManager.openDialog('문서가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                    await RoutingManager.moveTo(Page.Blog, `/${authority.nickname}`)
                    return
                }
                await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${authority.nickname}/${pageId}/${encodeURIComponent(authority.documentName)}`)
                return
            } else if (type === HomeURLType.UserMainURL) {
                const { id: userId } = await ViewerAPI.getUserIDByNickname(nickname)
                this.blogUserId = userId
                await HierarchyManager.loadHierarchy(userId, nickname)
                await this.userPageList.loadPageSummaryList(pageListOrder)
                const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
                currentHierarchy.openedPageId = null
            } else if (type === HomeURLType.StandardDocumentURL) {
                const authority = await ViewerAPI.getDocumentAuthority(pageId)
                if (!authority.viewable) {
                    await DialogManager.openDialog('문서가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                    await RoutingManager.moveTo(Page.Blog, `/${authority.nickname}`)
                    return
                }
                if (authority.nickname !== nickname || (documentName !== undefined && authority.documentName !== decodeURIComponent(documentName))) {
                    await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${authority.nickname}/${pageId}/${encodeURIComponent(authority.documentName)}`)
                    return
                }
                await HierarchyManager.loadHierarchy(authority.userId, nickname)
                await EditorManager.load(pageId)
                const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
                currentHierarchy.openPageParents(pageId)
            }
        } catch (err) {
            console.log(err)
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
            } else {
                throw err
            }
        }
    }
}
export default new BlogManager()
