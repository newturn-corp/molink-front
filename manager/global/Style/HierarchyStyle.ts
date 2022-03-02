import { makeAutoObservable, toJS } from 'mobx'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import { HierarchyOnOffChangeParam, HierarchyWidthChangeParam } from '../Event/EventParams'

const hierarchyOnOffButtonWidth = 26

export interface widthControllerStyleInterface {
    left: number
}

const defaultWidthControllerStyle = {
    left: 240
}

export interface onOffButtonStyleInterface {
    left: number
}

const defaultOnOffButtonStyle = {
    left: 240 - hierarchyOnOffButtonWidth * 0.5
}

export interface ContainerStyleInterface {
    width: number
}

const defaultContainerStyle = {
    width: 240
}

const defaultHierarchyWidth = 240

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

    _containerStyle: ContainerStyleInterface = defaultContainerStyle
    get containerStyle () {
        return toJS(this._containerStyle)
    }

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(
            Event.HierarchyWidthChange,
            ({ width }: HierarchyWidthChangeParam) => {
                this.width = width
                this._widthControllerStyle = {
                    left: width
                }
                this._onOffButtonStyle = {
                    left: width - hierarchyOnOffButtonWidth * 0.5
                }
                this._containerStyle = {
                    width
                }
            }, 1)
        EventManager.addEventListener(
            Event.HierarchyOnOffChange,
            ({ onOff }: HierarchyOnOffChangeParam) => {
                if (onOff) {
                    this._widthControllerStyle = {
                        left: this.width
                    }
                    this._onOffButtonStyle = {
                        left: this.width - hierarchyOnOffButtonWidth * 0.5
                    }
                    this._containerStyle = {
                        width: this.width
                    }
                } else {
                    this._widthControllerStyle = {
                        left: 30
                    }
                    this._onOffButtonStyle = {
                        left: 30 - hierarchyOnOffButtonWidth * 0.5
                    }
                    this._containerStyle = {
                        width: 30
                    }
                }
            }
            , 1)
    }
}
