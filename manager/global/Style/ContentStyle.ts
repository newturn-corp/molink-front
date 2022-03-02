import { makeAutoObservable, toJS } from 'mobx'
import { isBrowser } from 'react-device-detect'
import HierarchyManager from '../Hierarchy/HierarchyManager'
import { Event } from '../Event/Event'
import EventManager from '../Event/EventManager'
import { ToolbarOnOffChangeParam } from '../Event/EventParams'

export interface ContentContainerStyleInterface {
    transform: string,
    width: number
}

export interface ContentBodyStyleInterface {
    width: number
    top: number
}

export interface ContentMainStyleInterface {
    width: number
    marginLeft: number
}

const defaultContentContainerStyle = {
    transform: isBrowser ? 'translateX(240px)' : undefined,
    width: 1000
}

const defaultContentBodyStyle = {
    width: 1000,
    top: 106
}

const defaultContentMainStyle = {
    marginLeft: 800,
    width: 800
}

export class ContentStyle {
    _container: ContentContainerStyleInterface = defaultContentContainerStyle
    get container () {
        return toJS(this._container)
    }

    _body: ContentBodyStyleInterface = defaultContentBodyStyle
    get body () {
        return toJS(this._body)
    }

    _main: ContentMainStyleInterface = defaultContentMainStyle
    get main () {
        return toJS(this._main)
    }

    constructor () {
        makeAutoObservable(this)
        EventManager.addDisposableEventListener(Event.InitGlobalVariable, () => {
            this.refresh()
        }, 1)
        EventManager.addEventListeners([Event.HierarchyOnOffChange, Event.WindowResize, Event.HierarchyWidthChange], () => {
            this.refresh()
        }, 1)
        EventManager.addEventListener(Event.ToolbarOnOffChange, ({ isToolbarOpen }: ToolbarOnOffChangeParam) => {
            this._body.top = isToolbarOpen ? 106 : 50
        }, 1)
    }

    refresh () {
        const containerSize = isBrowser ? globalThis.window.innerWidth - HierarchyManager.getHierarchyWidth() : globalThis.window.innerWidth
        const contentSize = Math.min(800, containerSize * 0.75)
        this._container = {
            transform: isBrowser ? `translateX(${HierarchyManager.getHierarchyWidth()}px)` : undefined,
            width: containerSize
        }
        this._body.width = containerSize
        this._main = {
            marginLeft: Math.max((containerSize - contentSize) * 0.5, isBrowser ? 100 : 20),
            width: contentSize
        }
    }
}
