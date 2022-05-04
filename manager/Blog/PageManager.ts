import { PageUserInfo } from './Page/PageUserInfo'
import EditorManager from './EditorManager'

class PageManager {
    pageUserInfo: PageUserInfo

    constructor () {
        this.pageUserInfo = new PageUserInfo()
    }

    get pageFileVolumn () {
        return EditorManager.yInfo.get('page-file-volumn')
    }
}
export default new PageManager()
