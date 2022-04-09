import { makeAutoObservable } from 'mobx'
import { ColorStyle } from './ColorStyle'
import { HierarchyStyle } from './HierarchyStyle'
import { ContentStyle } from './ContentStyle'
import { GlobalStyle } from './GlobalStyle'

class StyleManager {
    contentStyle: ContentStyle
    colorStyle: ColorStyle
    hierarchyStyle: HierarchyStyle
    globalStyle: GlobalStyle

    constructor () {
        this.contentStyle = new ContentStyle()
        this.colorStyle = new ColorStyle()
        this.hierarchyStyle = new HierarchyStyle()
        this.globalStyle = new GlobalStyle()
        makeAutoObservable(this)
    }
}
export default new StyleManager()
