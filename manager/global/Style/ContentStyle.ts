import { makeAutoObservable, toJS } from 'mobx'
import { isBrowser } from 'react-device-detect'
import { Event } from '../Event/Event'
import EventManager from '../Event/EventManager'
import { ToolbarOnOffChangeParam } from '../Event/EventParams'
import {
    ContentBodyStyleInterface,
    ContentContainerStyleInterface,
    ContentHeaderStyleInterface,
    ContentMainStyleInterface,
    ContentToolbarStyleInterface,
    MobileToolbarStyleInterface,
    ToolbarOnOffButtonStyleInterface,
    VisibilityMenuStyleInterface
} from './ContentStyle/interface'
import {
    closeStateContentToolbarStyle,
    closeStateToolbarOnOffButtonStyle,
    defaultContentBodyStyle,
    defaultContentContainerStyle,
    defaultContentHeaderStyle,
    defaultContentMainStyle,
    defaultContentToolbarStyle,
    defaultMobileToolbarStyle,
    defaultToolbarOnOffButtonStyle,
    defaultVisibilityMenuStyle
} from './ContentStyle/constants'
import StyleManager from './StyleManager'
import EditorPage from '../../Blog/Editor/EditorPage'
import Blog from '../Blog/Blog'
import GlobalManager from '../GlobalManager'

export class ContentStyle {
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

    _mobileToolbar: MobileToolbarStyleInterface = defaultMobileToolbarStyle
    get mobileToolbarStyle () {
        return toJS(this._mobileToolbar)
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
        EventManager.addEventListener(Event.ToolbarOnOffChange, ({ isToolbarOpen }: ToolbarOnOffChangeParam) => {
            this.handleToolbarOnOffChange(isToolbarOpen)
        }, 1)
        EventManager.addEventListener(Event.LoadContent, () => {
            this.handleLoadContent()
            this.refresh()
        }, 1)
        EventManager.addEventListener(Event.MobileToolbarOnOffChange, ({ isToolbarOpen }: ToolbarOnOffChangeParam) => {
            this.handleMobileToolbarOnOffChange(isToolbarOpen)
        }, 1)
    }

    handleInitGlobalVariable () {
        this.refreshBodyTop()
        this.refreshBodyHeight()
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
        this.refreshBodyTop()
        this.refreshBodyHeight()
    }

    handleMobileToolbarOnOffChange (isToolbarOpen: boolean) {
        if (isToolbarOpen) {
            this._mobileToolbar.height = 40
        } else {
            this._mobileToolbar.height = 0
        }
        this.refreshBodyHeight()
    }

    private refreshBodyTop () {
        if (isBrowser) {
            if (EditorPage.editor?.editable) {
                this._body.top = this._header.height + this._toolbar.height
            } else {
                this._body.top = this._header.height
            }
        } else {
            this._body.top = StyleManager.globalStyle.header.height
        }
    }

    private refreshBodyHeight () {
        if (!GlobalManager.window) {
            return
        }
        if (isBrowser) {
            this._body.height = GlobalManager.window.innerHeight - this._body.top
        } else {
            this._body.height = GlobalManager.window.innerHeight - this._body.top - this._mobileToolbar.height
        }
    }

    handleLoadContent () {
        if (EditorPage.editor && !EditorPage.editor.editable) {
            this._header.top = 0
        }
        this.refreshBodyTop()
        this.refreshBodyHeight()
    }

    refresh () {
        if (!GlobalManager.window) {
            return
        }
        const blogWidth = Blog.getBlogWidth()
        const containerSize = isBrowser ? globalThis.window.innerWidth - blogWidth : globalThis.window.innerWidth
        const contentSize = Math.min(800, containerSize * (isBrowser ? 0.75 : 0.9))
        this._body.width = containerSize
        this.refreshBodyHeight()
        this._main = {
            marginLeft: Math.max((containerSize - contentSize) * 0.5, isBrowser ? 100 : 20),
            width: isBrowser ? contentSize : contentSize - 5
        }
    }
}
