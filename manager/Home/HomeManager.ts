import { DocumentNotExists, UnauthorizedForDocument, UnexpectedError } from '../../Errors/DocumentError'
import { UserNotExists } from '../../Errors/UserError'
import DialogManager from '../global/DialogManager'
import RoutingManager, { Page } from '../global/RoutingManager'
import UserManager from '../global/UserManager'
import DocumentHierarchyManager from './Hierarchy/HierarchyManager'
import { ContentNotExists, ContentUserNotExists, UnauthorizedForContent } from '../../Errors/ContentError'
import EditorManager from './EditorManager'
import { HierarchyNotExists } from '../../Errors/HierarchyError'
import NewUserManager from '../global/NewUserManager'

class HomeManager {
    async handleEnterHomePage (nickname: string) {
        try {
            if (!nickname) {
                return
            }
            await UserManager.refresh()
            await NewUserManager.load()
            await DocumentHierarchyManager.loadHierarchy(nickname)

            const documentId = new URLSearchParams(globalThis.window.location.search).get('id')
            if (!documentId) {
                return
            }
            console.log(documentId)
            await EditorManager.load(documentId)
        } catch (err) {
            console.log(JSON.stringify(err))
            if (err instanceof UserNotExists) {
                await DialogManager.openDialog('사용자가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnexpectedError) {
                await DialogManager.openDialog('예상치 못한 문제가 발생했습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof DocumentNotExists) {
                await DialogManager.openDialog('문서가 존재하지 않습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnauthorizedForDocument) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof ContentNotExists) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof UnauthorizedForContent) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof ContentUserNotExists) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else if (err instanceof HierarchyNotExists) {
                await DialogManager.openDialog('문서를 찾을 수 없습니다.', '메인 화면으로 돌아갑니다.', ['확인'])
                await RoutingManager.moveTo(Page.Index)
            } else {
                throw err
            }
        }
    }
}
export default new HomeManager()
