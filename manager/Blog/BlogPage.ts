import { BlogPageType } from './Blog'
import { InvalidParam } from '../../Errors/Common'
import UserManager from '../global/User/UserManager'
import ViewerAPI from '../../api/ViewerAPI'
import DialogManager from '../global/DialogManager'
import RoutingManager, { Page } from '../global/RoutingManager'
import { BlogInfo, ESPageMetaInfo, ESUser } from '@newturn-develop/types-molink'
import { UserNotExists } from '../../Errors/UserError'
import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../../Errors/DocumentError'
import { ContentNotExists, ContentUserNotExists, UnauthorizedForContent } from '../../Errors/ContentError'
import { HierarchyNotExists } from '../../Errors/HierarchyError'
import { BlogNotExists, BlogPageNotExist } from '../../Errors/BlogError'
import { makeAutoObservable } from 'mobx'
import LanguageManager from '../global/LanguageManager'
import EditorPage from './Editor/EditorPage'
import Blog from '../global/Blog/Blog'
import UserInfoMap from '../global/User/UserInfoMap'
import BlogMainInfoPage from './UserInfo/BlogUserInfoPage'
import BlogInfoMap from '../global/Blog/BlogInfoMap'

export enum BlogURLType {
    OnlyPageURL = 'only-page-url',
    BlogMainURL = 'blog-main-url',
    StandardDocumentURL = 'standard-document-url'
}

class BlogPage {
    pageType: BlogPageType = null

    constructor () {
        makeAutoObservable(this)
    }

    interpretURLInfo (info: string[]) {
        if (info.length === 1) {
            if (info[0].length < 28) {
                return { type: BlogURLType.BlogMainURL, blogName: info[0], pageId: null, pageName: null }
            } else if (info[0].length === 32) {
                return { type: BlogURLType.OnlyPageURL, blogName: null, pageId: info[0], pageName: null }
            } else {
                throw new InvalidParam()
            }
        } else if (info.length === 3) {
            const blogName = info[0]
            const pageId = info[1]
            const pageName = info[2]
            if (blogName.length > 27 || pageId.length !== 32) {
                throw new InvalidParam()
            }
            return { type: BlogURLType.StandardDocumentURL, blogName, pageId, pageName }
        } else {
            throw new InvalidParam()
        }
    }

    private async _handleEnterOnlyPageURL (pageId: string) {
        // 만약, 현재 로드된 블로그가 있고, 해당 블로그에 이미 페이지가 있는 경우
        if (Blog.pageHierarchy && Blog.pageHierarchy.map[pageId]) {
            const page = Blog.pageHierarchy.map[pageId]
            await RoutingManager.moveWithoutAddHistory(
                Page.Blog,
                `/${Blog.profile.name}/${pageId}/${encodeURIComponent(page.title)}`
            )
            return
        }
        await RoutingManager.moveWithoutAddHistory(Page.Blog, `/blog-name/${pageId}/page-name`)
    }

    private async _handleEnterUserMainURL (blogName: string) {
        const infoMap = await BlogInfoMap.getBlogInfoMapByNameList([blogName])
        const info = infoMap[blogName] as BlogInfo
        if (!info) {
            throw new UserNotExists()
        }
        await BlogMainInfoPage.handleEnter(info.id)
        this.pageType = BlogPageType.UserMainPage
    }

    private async _getPageURLInfo (pageID: string, metaInfo: ESPageMetaInfo | null) {
        if (!metaInfo) {
            metaInfo = await ViewerAPI.getPageMetaInfo(pageID)
        }
        const pageTitle = metaInfo.title
        const blogID = metaInfo.blogID
        const userID = metaInfo.userId
        const blogInfoMap = await BlogInfoMap.getBlogInfoMapByBlogIDList([metaInfo.blogID])
        const blogInfo = blogInfoMap[blogID]
        if (!blogInfo) {
            throw new BlogNotExists()
        }

        const blogName = blogInfo.name
        return { pageTitle, blogName, blogID, userID }
    }

    private async _handleEnterStandardPageURL (metaInfo: ESPageMetaInfo | null, pageId: string, blogName: string, pageTitle: string) {
        const { pageTitle: lastPageTitle, blogName: lastBlogName, blogID, userID } = await this._getPageURLInfo(pageId, metaInfo)
        if (lastBlogName !== blogName || pageTitle === undefined || lastPageTitle !== decodeURIComponent(pageTitle)) {
            await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${lastBlogName}/${pageId}/${encodeURIComponent(lastPageTitle)}`)
            return
        }
        await EditorPage.handleEnter(pageId, blogID, userID)
        this.pageType = BlogPageType.NormalPage
    }

    async handleEnter (info: string[], metaInfo: ESPageMetaInfo | null) {
        try {
            await UserManager.load()
            const { type, blogName, pageId, pageName } = this.interpretURLInfo(info)
            if (type === BlogURLType.OnlyPageURL) {
                await this._handleEnterOnlyPageURL(pageId)
            } else if (type === BlogURLType.BlogMainURL) {
                await this._handleEnterUserMainURL(blogName)
            } else if (type === BlogURLType.StandardDocumentURL) {
                await this._handleEnterStandardPageURL(metaInfo, pageId, blogName, pageName)
            }
        } catch (err) {
            if (err instanceof UserNotExists) {
                await DialogManager.openDialog(LanguageManager.languageMap.UserNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof DocumentNotExists) {
                await DialogManager.openDialog(LanguageManager.languageMap.PageNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnexpectedError) {
                await DialogManager.openDialog(LanguageManager.languageMap.PageNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnauthorizedForDocument) {
                await DialogManager.openDialog(LanguageManager.languageMap.PageNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof ContentNotExists) {
                await DialogManager.openDialog(LanguageManager.languageMap.PageNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnauthorizedForContent) {
                await DialogManager.openDialog(LanguageManager.languageMap.PageNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof ContentUserNotExists) {
                await DialogManager.openDialog(LanguageManager.languageMap.PageNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof HierarchyNotExists) {
                await DialogManager.openDialog(LanguageManager.languageMap.PageNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof BlogPageNotExist) {
                await DialogManager.openDialog(LanguageManager.languageMap.PageNotExistsNoticeMessage, LanguageManager.languageMap.MoveToMainPageNoticeMessage, [LanguageManager.languageMap.Accept])
                await RoutingManager.moveTo(Page.Blog, `/${err.blogNickname}`)
            }
        }
    }
}
export default new BlogPage()
