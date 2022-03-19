import Router from 'next/router'
import GlobalManager from './GlobalManager'
import { Event } from './Event/Event'
import EditorManager from '../Blog/EditorManager'
import EventManager from './Event/EventManager'

export enum Page {
    Index = '/',
    SignIn = '/auth/sign-in',
    Search = '/search',
    ChangePasswordRequest = '/auth/change-password-request',
    SignUp = '/auth/sign-up',
    SettingProfile = '/setting/profile',
    SettingFollow = '/setting/follow',
    SettingDocumentList = '/setting/document-list',
    Home = '',
    Blog = '/blog'
}

class RoutingManager {
    async moveTo (page: Page, extra: string = '') {
        await EventManager.issueEvent(Event.MoveToAnotherPage)
        await Router.push(page + extra)
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
        }
    }
}
export default new RoutingManager()
