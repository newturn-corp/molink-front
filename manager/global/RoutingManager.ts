import Router from 'next/router'
import ContentManager from '../ContentManager'
import EventManager, { Event } from '../EventManager'
import GlobalManager from './GlobalManager'
import UserManager from './UserManager'

export enum Page {
    Index = '/',
    SignIn = '/auth/signin',
    Search = '/search',
    changePasswordRequest = '/auth/change-password-request',
    SignUp = '/auth/signup',
    SettingProfile = '/setting/profile',
    SettingFollow = '/setting/follow',
    SettingDocumentList = '/setting/document-list',
    Home = ''
}

class RoutingManager {
    async moveTo (page: Page, extra: string = '') {
        if (ContentManager.editor) {
            if (ContentManager.editor.destroy) {
                ContentManager.editor.destroy()
            }
        }
        await EventManager.issueEvent(Event.MoveToAnotherPage, {})
        if (page === Page.Home) {
            return Router.push(`${page}/${UserManager.profile.nickname}${extra}`)
        }
        Router.push(page + extra)
    }

    async rawMoveTo (url: string) {
        if (ContentManager.editor) {
            if (ContentManager.editor.destroy) {
                ContentManager.editor.destroy()
            }
        }
        const domain = new URL(url)
        // 외부 주소일 경우 새 창에서, 내부 주소일 경우 페이지 이동
        if (domain.hostname.replace('www.', '') !== process.env.FRONT_HOST_NAME) {
            GlobalManager.window.open(url)
        } else {
            await EventManager.issueEvent(Event.MoveToAnotherPage, {})
            Router.push(url)
        }
    }
}
export default new RoutingManager()
