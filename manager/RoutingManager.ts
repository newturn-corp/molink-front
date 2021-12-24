import Router from 'next/router'
import EventManager, { Event } from './EventManager'

export enum Page {
    Index = '/',
    SignIn = '/signin',
    Search = '/search',
    changePasswordRequest = 'change-password-request',
    SignUp = '/signup'
}

class RoutingManager {
    moveTo (page: Page, extra: string = '') {
        EventManager.issueEvent(Event.MoveToAnotherPage, {})
        Router.push(page + extra)
    }
}
export default new RoutingManager()
