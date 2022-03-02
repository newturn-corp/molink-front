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

enum HomeURLType {
    OnlyDocumentURL = 'only-document-url',
    UserMainURL = 'user-main-url',
    StandardDocumentURL = 'standard-document-url'
}

class BlogManager {
    interpretURLInfo (info: string[]) {
        if (info.length === 0) {
            throw new InvalidParam()
        } else if (info.length === 1) {
            if (info[0].length < 28) {
                return { type: HomeURLType.UserMainURL, nickname: info[0], documentId: null, documentName: null }
            } else if (info[0].length === 32) {
                return { type: HomeURLType.OnlyDocumentURL, nickname: null, documentId: info[0], documentName: null }
            } else {
                throw new InvalidParam()
            }
        } else {
            const nickname = info[0]
            const documentId = info[1]
            const documentName = info[2]
            if (nickname.length > 27 || documentId.length !== 32) {
                throw new InvalidParam()
            }
            return { type: HomeURLType.StandardDocumentURL, nickname, documentId, documentName }
        }
    }

    async handleEnterBlogPage (info: string[]) {
        try {
            await UserManager.load()
            const { type, nickname, documentId, documentName } = this.interpretURLInfo(info)
            if (type === HomeURLType.OnlyDocumentURL) {
                const authority = await ViewerAPI.getDocumentAuthority(documentId)
                if (!authority.viewable) {
                    await DialogManager.openDialog('문서가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                    return RoutingManager.moveTo(Page.Blog, `/${authority.nickname}`)
                }
                return RoutingManager.moveTo(Page.Blog, `/${authority.nickname}/${documentId}/${encodeURIComponent(authority.documentName)}`)
            } else if (type === HomeURLType.UserMainURL) {
                const { id: userId } = await ViewerAPI.getUserIDByNickname(nickname)
                await HierarchyManager.loadHierarchy(userId, nickname)
            } else if (type === HomeURLType.StandardDocumentURL) {
                const authority = await ViewerAPI.getDocumentAuthority(documentId)
                if (!authority.viewable) {
                    await DialogManager.openDialog('문서가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                    return RoutingManager.moveTo(Page.Blog, `/${authority.nickname}`)
                }
                if (authority.nickname !== nickname || (documentName !== undefined && authority.documentName !== decodeURIComponent(documentName))) {
                    return RoutingManager.moveTo(Page.Blog, `/${authority.nickname}/${documentId}/${encodeURIComponent(authority.documentName)}`)
                }
                await HierarchyManager.loadHierarchy(authority.userId, nickname)
                await EditorManager.load(documentId)
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
