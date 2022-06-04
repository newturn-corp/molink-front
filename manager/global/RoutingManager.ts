import Router from 'next/router'
import GlobalManager from './GlobalManager'
import { Event } from './Event/Event'
import EventManager from './Event/EventManager'
import { RoutingHistory } from './Routing/RoutingHistory'

export enum Page {
    Index = '/',
    SignIn = '/auth/sign-in',
    Search = '/search',
    SearchUser = '/search/users',
    ChangePasswordRequest = '/auth/change-password-request',
    SignUp = '/auth/sign-up',
    NoticeEmailAuth = '/auth/notice-email-auth',
    SettingProfile = '/setting/profile',
    SettingFollow = '/setting/follow',
    SettingDocumentList = '/setting/document-list',
    Home = '',
    Blog = '/blog',
    MobileSupport = '/m/support',
    SettingFileUpload = '/setting/file-upload'
}

class RoutingManager {
    history: RoutingHistory[] = []

    async moveTo (page: Page, extra: string = '') {
        await EventManager.issueEvent(Event.MoveToAnotherPage)
        await Router.push(page + extra)
        this.history.push(new RoutingHistory(page, extra))
    }

    async moveWithoutAddHistory (page: Page, extra: string = '') {
        await EventManager.issueEvent(Event.MoveToAnotherPage)
        await Router.replace(page + extra)
    }

    async rawMoveTo (url: string, shouldOpenNewWindow: boolean = false) {
        const domain = new URL(url)
        // 외부 주소일 경우 새 창에서, 내부 주소일 경우 페이지 이동
        if (shouldOpenNewWindow || domain.hostname.replace('www.', '') !== process.env.FRONT_HOST_NAME) {
            GlobalManager.window.open(url)
        } else {
            await EventManager.issueEvent(Event.MoveToAnotherPage)
            await Router.push(url)
            this.history.push(new RoutingHistory(null, url))
        }
    }

    async back () {
        if (this.history.length > 0) {
            const { page, extra } = this.history.pop()
            if (page) {
                await Router.push(page + extra)
            } else {
                await Router.push(extra)
            }
        } else {
            Router.back()
        }
    }
}
export default new RoutingManager()
