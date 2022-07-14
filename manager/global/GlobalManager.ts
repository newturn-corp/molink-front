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
    screenWidth = 1920
    screenHeight = 1080

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
        // this.window.onbeforeunload = () => {
        //     console.log('onbeforeunload')
        //     EventManager.issueEvent(Event.UnloadPage, {})
        //     return undefined
        // }
        this.window.addEventListener('beforeunload', (event) => {
            // 표준에 따라 기본 동작 방지
            event.preventDefault()
            EventManager.issueEvent(Event.UnloadPage, {})
        })
        this.window.onresize = async () => {
            this.screenHeight = this.window.innerHeight
            this.screenWidth = this.window.innerWidth
            await EventManager.issueEvent(Event.WindowResize, {})
        }
        await EventManager.issueEvent(Event.InitGlobalVariable, {})
        setTimeout(() => {
            this.screenHeight = this.window.innerHeight
            this.screenWidth = this.window.innerWidth
        }, 1000)
    }

    constructor () {
        makeAutoObservable(this)
    }
}
export default new GlobalManager()
