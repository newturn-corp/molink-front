import { makeAutoObservable, toJS } from 'mobx'
import { Event } from '../../Event/Event'
import {
    defaultContainerStyle,
    defaultHierarchyOnOffButtonWidth,
    defaultHierarchyPageComponentStyle,
    defaultHierarchyPageTitleStyle,
    defaultHierarchyPaperStyle,
    defaultHierarchyWidth,
    defaultOnOffButtonStyle,
    defaultWidthControllerStyle
} from './constants'
import {
    HierarchyContainerStyleInterface, HierarchyPageComponentStyleInterface, HierarchyPageTitleStyleInterface,
    HierarchyPaperStyleInterface,
    onOffButtonStyleInterface,
    widthControllerStyleInterface
} from './interfaces'
import EventManager from '../../Event/EventManager'
import { HierarchyOnOffChangeParam, HierarchyWidthChangeParam } from '../../Event/EventParams'
import GlobalManager from '../../GlobalManager'
import { isMobile } from 'react-device-detect'

export class HierarchyStyle {
    width: number = defaultHierarchyWidth
    _widthControllerStyle: widthControllerStyleInterface = defaultWidthControllerStyle
    get widthControllerStyle () {
        return toJS(this._widthControllerStyle)
    }

    _onOffButtonStyle: onOffButtonStyleInterface = defaultOnOffButtonStyle
    get onOffButtonStyle () {
        return toJS(this._onOffButtonStyle)
    }

    _containerStyle: HierarchyContainerStyleInterface = defaultContainerStyle
    get containerStyle () {
        return toJS(this._containerStyle)
    }

    _paperStyle: HierarchyPaperStyleInterface = defaultHierarchyPaperStyle
    get paperStyle () {
        return toJS(this._paperStyle)
    }

    _pageTitleStyle: HierarchyPageTitleStyleInterface = defaultHierarchyPageTitleStyle
    get pageTitleStyle () {
        return toJS(this._pageTitleStyle)
    }

    _pageComponentStyle: HierarchyPageComponentStyleInterface = defaultHierarchyPageComponentStyle
    get pageComponentStyle () {
        return toJS(this._pageComponentStyle)
    }

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(
            Event.InitGlobalVariable,
            () => {
                this._containerStyle.height = GlobalManager.window.innerHeight - this._containerStyle.top
                this._paperStyle.height = this._containerStyle.height
                if (isMobile) {
                    this.width = GlobalManager.window.innerWidth * 0.8
                    this._containerStyle.width = this.width
                }
            }, 1
        )
        EventManager.addEventListener(
            Event.HierarchyWidthChange,
            ({ width }: HierarchyWidthChangeParam) => {
                this.width = width
                this._widthControllerStyle = {
                    left: width
                }
                this._onOffButtonStyle = {
                    left: width - defaultHierarchyOnOffButtonWidth * 0.5
                }
                this._containerStyle.width = width
            }, 1)
        EventManager.addEventListener(
            Event.HierarchyOnOffChange,
            ({ onOff }: HierarchyOnOffChangeParam) => {
                if (onOff) {
                    this._widthControllerStyle = {
                        left: this.width
                    }
                    this._onOffButtonStyle = {
                        left: this.width - defaultHierarchyOnOffButtonWidth * 0.5
                    }
                    this._containerStyle.width = this.width
                } else {
                    this._widthControllerStyle = {
                        left: 30
                    }
                    this._onOffButtonStyle = {
                        left: 30 - defaultHierarchyOnOffButtonWidth * 0.5
                    }
                    this._containerStyle.width = 30
                }
            }
            , 1)
    }
}
