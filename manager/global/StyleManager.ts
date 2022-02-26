import { makeAutoObservable, reaction, toJS } from 'mobx'
import { isBrowser, isMobile } from 'react-device-detect'
import EventManager, { Event } from '../EventManager'
import NewUserManager from './NewUserManager'
import HierarchyManager from '../Home/Hierarchy/HierarchyManager'

interface ContentStyle {
    container: {
        transform: string,
        width: number
    },
    contentBody: {
        width: number
    }
    content: {
        marginLeft: number,
        width: number
    }
}

const defaultHierarchyWidth = 240

class StyleManager {
    _contentStyle: ContentStyle = {
        container: {
            transform: isBrowser ? `translateX(${defaultHierarchyWidth}px)` : undefined,
            width: 1000
        },
        contentBody: {
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
        EventManager.addDisposableEventListener(Event.InitGlobalVariable, () => {
            reaction(() => ({
                isHierarchyOpen: HierarchyManager.isHierarchyOpen,
                hierarchyWidth: NewUserManager.setting ? NewUserManager.setting.hierarchyWidth : 240
            }), () => {
                console.log('여기 호출')
                this.updateContentStyle()
            })
            this.updateContentStyle()
            globalThis.window.onresize = () => {
                this.updateContentStyle()
            }
        }, 1)
    }

    updateContentStyle () {
        console.log(HierarchyManager.getHierarchyWidth())
        const containerSize = isBrowser ? globalThis.window.innerWidth - HierarchyManager.getHierarchyWidth() : globalThis.window.innerWidth
        const contentSize = Math.min(800, containerSize * 0.75)
        this._contentStyle = {
            container: {
                transform: isBrowser ? `translateX(${HierarchyManager.getHierarchyWidth()}px)` : undefined,
                width: containerSize
            },
            contentBody: {
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
