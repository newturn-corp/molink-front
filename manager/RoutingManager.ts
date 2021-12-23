import Router from 'next/router'
import EventManager, { Event } from './EventManager'

export enum Page {
    SignIn = '/signin'
}

class RoutingManager {
    moveTo (page: Page, extra: string = '') {
        EventManager.issueEvent(Event.MoveToAnotherPage, {})
        Router.push(page + extra)
    }
}
export default new RoutingManager()
