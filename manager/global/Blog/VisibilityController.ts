import { ChangePageVisibilityDTO, PageVisibility } from '@newturn-develop/types-molink'
import { visibilityToText } from '../Hierarchy/HierarchyUtils'
import DialogManager from '../DialogManager'
import { makeAutoObservable } from 'mobx'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'
import HierarchyAPI from '../../../api/HierarchyAPI'
import { ChildrenVisibilityWide, ParentVisibilityNarrow } from '../../../Errors/HierarchyError'

export class VisibilityController {
    public isVisibilityMenuOpen: boolean = false
    public isVisibilityDrawerOpen: boolean = false

    constructor () {
        EventManager.addEventListener(Event.PageBodyClick, () => {
            this.isVisibilityMenuOpen = false
        }, 1)
        makeAutoObservable(this)
    }

    public checkVisibilityWide (visibility: PageVisibility, compareTarget: PageVisibility) {
        if (visibility === compareTarget) {
            return 0
        }

        if (visibility === PageVisibility.Public) {
            return 1
        } else if (visibility === PageVisibility.OnlyFollower) {
            if (compareTarget === PageVisibility.Private) {
                return 1
            } else if (compareTarget === PageVisibility.Public) {
                return -1
            }
        } else if (visibility === PageVisibility.Private) {
            return -1
        }
        throw new Error('처리되지 않은 공개범위')
    }

    public async updatePageVisibility (pageId: string, visibility: PageVisibility, force = false) {
        try {
            await HierarchyAPI.changePageVisibility(new ChangePageVisibilityDTO(pageId, visibility, force))
        } catch (err) {
            if (err instanceof ParentVisibilityNarrow) {
                const action = await DialogManager.openDialog(
                    '상위 페이지 범위 변경',
                    `'${visibilityToText(visibility)}'보다 좁은 공개 범위의 상위 페이지가 있습니다.\n이 페이지의 공개 범위를 '${visibilityToText(visibility)}'로 변경하면\n상위 페이지의 공개 범위도 같이 변경됩니다. 변경하시겠습니까?`, ['변경'])
                if (action === -1) {
                    return
                }
                await this.updatePageVisibility(pageId, visibility, true)
            } else if (err instanceof ChildrenVisibilityWide) {
                const action = await DialogManager.openDialog(
                    '하위 페이지 범위 변경',
                    `'${visibilityToText(visibility)}'보다 넓은 공개 범위의 하위 페이지가 있습니다.\n이 페이지의 공개 범위를 '${visibilityToText(visibility)}'로 변경하면\n하위 페이지의 공개 범위도 같이 변경됩니다. 변경하시겠습니까?`, ['변경'])
                if (action === -1) {
                    return
                }
                await this.updatePageVisibility(pageId, visibility, true)
            }
        }
    }
}
