import { makeAutoObservable } from 'mobx'
import { ColorStyle } from './ColorStyle'
import { HierarchyStyle } from './HierarchyStyle'
import { ContentStyle } from './ContentStyle'

class StyleManager {
    contentStyle: ContentStyle
    colorStyle: ColorStyle
    hierarchyStyle: HierarchyStyle

    constructor () {
        this.contentStyle = new ContentStyle()
        this.colorStyle = new ColorStyle()
        this.hierarchyStyle = new HierarchyStyle()
        makeAutoObservable(this)
    }
}
export default new StyleManager()
