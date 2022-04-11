import { makeAutoObservable, toJS } from 'mobx'
import { defaultGlobalBodyStyle, defaultGlobalHeaderStyle } from './constants'
import { GlobalBodyStyleInterface, GlobalHeaderStyleInterface } from './interface'
import EventManager from '../../Event/EventManager'
import { Event } from '../../Event/Event'
import GlobalManager from '../../GlobalManager'

export class GlobalStyle {
    _header: GlobalHeaderStyleInterface = defaultGlobalHeaderStyle
    get header () {
        return toJS(this._header)
    }

    _body: GlobalBodyStyleInterface = defaultGlobalBodyStyle
    get body () {
        return toJS(this._body)
    }

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.InitGlobalVariable, () => {
            this._body.height = GlobalManager.window.innerHeight - this._body.top
        }, 1)
    }
}
