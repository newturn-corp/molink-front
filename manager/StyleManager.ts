import { makeAutoObservable, reaction, toJS } from 'mobx'
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
            transform: `translateX(${FileSystemManager.directoryDrawerWidth}px)`,
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
        const containerSize = globalThis.window.innerWidth - FileSystemManager.directoryDrawerWidth
        const contentSize = Math.min(800, containerSize * 0.75)
        this._contentStyle = {
            container: {
                transform: `translateX(${FileSystemManager.directoryDrawerWidth}px)`,
                width: containerSize
            },
            content: {
                marginLeft: Math.max((containerSize - contentSize) * 0.5, 100),
                width: contentSize
            }
        }
    }
}
export default new StyleManager()
