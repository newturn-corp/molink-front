import { makeAutoObservable } from 'mobx'
import EventManager, { Event } from './EventManager'

export enum Browser {
    Chrome,
    Safari,
    Explorer,
    Firefox
}

class GlobalManager {
    navigator: Navigator
    document: Document
    browser: Browser = null
    window: Window = null
    mousePositionX = 0
    mousePositionY = 0

    init () {
        this.navigator = navigator
        this.document = document
        this.window = window

        const agent = this.navigator.userAgent.toLowerCase()

        if (agent.indexOf('chrome') !== -1) {
            this.browser = Browser.Chrome
        } else if (agent.indexOf('safari') !== -1) {
            this.browser = Browser.Safari
        } else if (agent.indexOf('firefox') !== -1) {
            this.browser = Browser.Firefox
        }
        this.window.addEventListener('mousemove', (event) => {
            this.mousePositionX = event.screenX
            this.mousePositionY = event.screenY
        })
        this.window.addEventListener('dragover', (event) => {
            this.mousePositionX = event.screenX
            this.mousePositionY = event.screenY
        })

        EventManager.issueEvent(Event.InitGlobalVariable, {})
        EventManager.issueInitGlobalVariable()
    }

    constructor () {
        makeAutoObservable(this)
    }
}
export default new GlobalManager()
