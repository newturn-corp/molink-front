import { makeAutoObservable, reaction, toJS } from 'mobx'
import { isBrowser, isMobile } from 'react-device-detect'
import EventManager, { Event } from './EventManager'
import FileSystemManager from './FileSystemManager'

interface ContentStyle {
    container: {
        transform: string,
        width: number
    },
    content: {
        marginLeft: number,
        width: number
    }
}

class StyleManager {
    _contentStyle: ContentStyle = {
        container: {
            transform: isBrowser ? `translateX(${FileSystemManager.directoryDrawerWidth}px)` : undefined,
            width: 1000
        },
        content: {
            marginLeft: 800,
            width: 800
        }
    }

    get contentStyle () {
        return toJS(this._contentStyle)
    }

    constructor () {
        makeAutoObservable(this)
        reaction(() => FileSystemManager.directoryDrawerWidth, () => {
            this.updateContentStyle()
        })
        EventManager.addDisposableEventListener(Event.InitGlobalVariable, () => {
            this.updateContentStyle()
            globalThis.window.onresize = () => {
                this.updateContentStyle()
            }
        }, 1)
    }

    updateContentStyle () {
        const containerSize = isBrowser ? globalThis.window.innerWidth - FileSystemManager.directoryDrawerWidth : globalThis.window.innerWidth
        const contentSize = Math.min(800, containerSize * 0.75)
        this._contentStyle = {
            container: {
                transform: isBrowser ? `translateX(${FileSystemManager.directoryDrawerWidth}px)` : undefined,
                width: containerSize
            },
            content: {
                marginLeft: Math.max((containerSize - contentSize) * 0.5, isBrowser ? 100 : 20),
                width: contentSize
            }
        }
    }
}
export default new StyleManager()
