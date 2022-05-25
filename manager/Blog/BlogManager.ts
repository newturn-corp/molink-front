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
import { FollowPageList } from './FollowPageList'
import { ESUser } from '@newturn-develop/types-molink'

enum HomeURLType {
    OnlyDocumentURL = 'only-document-url',
    UserMainURL = 'user-main-url',
    StandardDocumentURL = 'standard-document-url'
}

class BlogManager {
    blogUserId: number = 0
    followPageList: FollowPageList

    constructor () {
        this.followPageList = new FollowPageList()
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

    async handleEnterMainPage () {
        this.followPageList.clear()
        // await this.followPageList.loadPageSummaryList()
    }
}
export default new BlogManager()
