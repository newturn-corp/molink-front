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
                if (isMobile) {
                    this.width = GlobalManager.window.innerWidth * 0.8
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
            }, 1)
    }
}
