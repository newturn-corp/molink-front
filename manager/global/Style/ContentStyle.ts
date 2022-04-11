import { makeAutoObservable, toJS } from 'mobx'
import { isBrowser } from 'react-device-detect'
import HierarchyManager from '../Hierarchy/HierarchyManager'
import { Event } from '../Event/Event'
import EventManager from '../Event/EventManager'
import { ToolbarOnOffChangeParam } from '../Event/EventParams'
import {
    ContentBodyStyleInterface,
    ContentContainerStyleInterface,
    ContentHeaderStyleInterface, ContentMainStyleInterface,
    ContentToolbarStyleInterface, ToolbarOnOffButtonStyleInterface, VisibilityMenuStyleInterface
} from './ContentStyle/interface'
import {
    closeStateContentToolbarStyle,
    closeStateToolbarOnOffButtonStyle,
    defaultContentBodyStyle,
    defaultContentContainerStyle, defaultContentHeaderStyle,
    defaultContentMainStyle, defaultContentToolbarStyle, defaultToolbarOnOffButtonStyle, defaultVisibilityMenuStyle
} from './ContentStyle/constants'
import EditorManager from '../../Blog/EditorManager'
import StyleManager from './StyleManager'

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

    _header: ContentHeaderStyleInterface = defaultContentHeaderStyle
    get header () {
        return toJS(this._header)
    }

    _toolbar: ContentToolbarStyleInterface = defaultContentToolbarStyle
    get toolbar () {
        return toJS(this._toolbar)
    }

    _toolbarOnOffButton: ToolbarOnOffButtonStyleInterface = defaultToolbarOnOffButtonStyle
    get toolbarOnOffButton () {
        return toJS(this._toolbarOnOffButton)
    }

    _visibilityMenu: VisibilityMenuStyleInterface = defaultVisibilityMenuStyle
    get visibilityMenu () {
        return toJS(this._visibilityMenu)
    }

    constructor () {
        makeAutoObservable(this)
        EventManager.addDisposableEventListener(Event.InitGlobalVariable, () => {
            this.handleInitGlobalVariable()
            this.refresh()
        }, 1)
        EventManager.addEventListeners([Event.HierarchyOnOffChange, Event.WindowResize, Event.HierarchyWidthChange], () => {
            this.refresh()
        }, 1)
        EventManager.addEventListener(Event.ToolbarOnOffChange, ({ isToolbarOpen }: ToolbarOnOffChangeParam) => this.handleToolbarOnOffChange(isToolbarOpen), 1)
        EventManager.addEventListener(Event.LoadContent, () => {
            this.handleLoadContent()
            this.refresh()
        }, 1)
    }

    handleInitGlobalVariable () {
        this._body.top = (isBrowser ? (this._header.height + this._toolbar.height) : 0)
        this._body.height = window.innerHeight - this._body.top
        this._visibilityMenu.top = this._header.top + this._header.height + StyleManager.globalStyle.header.height
        this.refresh()
    }

    handleToolbarOnOffChange (isToolbarOpen: boolean) {
        if (isToolbarOpen) {
            this._toolbar = defaultContentToolbarStyle
            this._toolbarOnOffButton = defaultToolbarOnOffButtonStyle
            this._header.top = this._toolbar.height
            this._visibilityMenu.top = this._header.top + this._header.height + StyleManager.globalStyle.header.height
        } else {
            this._toolbar = closeStateContentToolbarStyle
            this._toolbarOnOffButton = closeStateToolbarOnOffButtonStyle
            this._header.top = this._toolbar.height
            this._visibilityMenu.top = this._header.top + this._header.height + StyleManager.globalStyle.header.height
        }
        this._body.top = this._header.height + this._toolbar.height
        this._body.height = window.innerHeight - this._body.top - StyleManager.globalStyle.header.height
    }

    handleLoadContent () {
        if (!EditorManager.editable) {
            this._header.top = 0
            this._body.top = this._header.height
            this._body.height = window.innerHeight - this._body.top
        }
    }

    refresh () {
        const containerSize = isBrowser ? globalThis.window.innerWidth - HierarchyManager.getHierarchyWidth() : globalThis.window.innerWidth
        const contentSize = Math.min(800, containerSize * (isBrowser ? 0.75 : 0.9))
        this._container = {
            transform: isBrowser ? `translateX(${HierarchyManager.getHierarchyWidth()}px)` : undefined,
            width: containerSize
        }
        this._body.width = containerSize
        this._body.height = window.innerHeight - this._body.top
        this._main = {
            marginLeft: Math.max((containerSize - contentSize) * 0.5, isBrowser ? 100 : 20),
            width: contentSize
        }
    }
}
