import { makeAutoObservable } from 'mobx'
import { Event } from './Event/Event'
import EventManager from './Event/EventManager'

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

    async init () {
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
            this.mousePositionX = event.pageX
            this.mousePositionY = event.pageY
        })
        this.window.addEventListener('dragover', (event) => {
            this.mousePositionX = event.pageX
            this.mousePositionY = event.pageY
        })
        this.window.onbeforeunload = async () => {
            await EventManager.issueEvent(Event.UnloadPage, {})
        }
        this.window.onresize = async () => {
            await EventManager.issueEvent(Event.WindowResize, {})
        }

        await EventManager.issueEvent(Event.InitGlobalVariable, {})
    }

    constructor () {
        makeAutoObservable(this)
    }
}
export default new GlobalManager()
