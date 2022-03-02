import { PageVisibility } from '@newturn-develop/types-molink'
import { getChildren, getParents, visibilityToText } from './HierarchyUtils'
import DialogManager from '../DialogManager'
import Hierarchy from './Hierarchy'
import { makeAutoObservable } from 'mobx'
import EventManager from '../Event/EventManager'
import { Event } from '../Event/Event'

export class VisibilityController {
    private hierarchy: Hierarchy

    public isVisibilityMenuOpen: boolean = false

    constructor (hierarchy: Hierarchy) {
        this.hierarchy = hierarchy
        EventManager.addEventListener(Event.PageBodyClick, () => {
            this.isVisibilityMenuOpen = false
        }, 1)
        makeAutoObservable(this)
    }

    private _checkVisibilityWide (visibility: PageVisibility, compareTarget: PageVisibility) {
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

    public async updatePageVisibility (pageId: string, visibility: PageVisibility) {
        if (!this.hierarchy.editable) {
            return
        }

        const yDocument = this.hierarchy.yDocument
        const yMap = this.hierarchy.yMap
        const pageMap = this.hierarchy.map
        const page = pageMap[pageId]

        if (page.visibility === visibility) {
            return
        }

        // 자식의 공개 범위는 부모의 공개 범위보다 항상 좁거나 같다.가 전제.
        // 현재의 공개 범위보다 좁히는 경우, 자식들도 안 보이게 되는 문제가 있다.
        // 현재보다 높게 바꾸는 경우 부모 중, 이 페이지의 공개 범위보다 좁은 부모가 있다면 수정을 제안해야 한다.
        if (this._checkVisibilityWide(visibility, page.visibility) === 1) {
            const parentIDList = getParents(pageMap, pageId)
            const narrowParentIDList = parentIDList.filter(parentID => {
                const parent = pageMap[parentID]
                return this._checkVisibilityWide(parent.visibility, visibility) === -1
            })
            if (narrowParentIDList.length > 0) {
                const narrowParentsText = narrowParentIDList.map(parentId => {
                    const parent = pageMap[parentId]
                    return parent.title
                }).join(', ')
                const action = await DialogManager.openDialog(
                    '상위 페이지 범위 변경',
                    `'${visibilityToText(visibility)}'보다 좁은 공개 범위의 상위 페이지가 있습니다.\n이 페이지의 공개 범위를 '${visibilityToText(visibility)}'로 변경하면\n다음 페이지의 공개 범위도 같이 변경됩니다. 변경하시겠습니까?\n\n${narrowParentsText}`, ['변경'])
                if (action === -1) {
                    return
                }
                yDocument.transact(() => {
                    for (const parentID of narrowParentIDList) {
                        const parent = pageMap[parentID]
                        parent.visibility = visibility
                        yMap.set(parent.id, parent)
                    }
                })
            }
        } else {
            // 현재보다 좁게 바꾸는 경우 자식 중, 이 페이지의 공개 범위보다 넓은 자식이 있다면 수정을 제안해야 한다.
            const childrenIDList = getChildren(pageMap, pageId)
            const wideChildrenIDList = childrenIDList.filter(childID => {
                const child = pageMap[childID]
                // 버그 방지 (getChildren 주석 참고)
                if (child.id === pageId) {
                    return false
                }
                return this._checkVisibilityWide(child.visibility, visibility) === 1
            })
            if (wideChildrenIDList.length > 0) {
                const wideChildrenText = wideChildrenIDList.map(childID => {
                    const child = pageMap[childID]
                    return child.title
                }).join(', ')
                const action = await DialogManager.openDialog(
                    '하위 페이지 범위 변경',
                    `'${visibilityToText(visibility)}'보다 넓은 공개 범위의 하위 페이지가 있습니다.\n이 페이지의 공개 범위를 '${visibilityToText(visibility)}'로 변경하면\n다음 페이지의 공개 범위도 같이 변경됩니다. 변경하시겠습니까?\n\n${wideChildrenText}`, ['변경'])
                if (action === -1) {
                    return
                }
                yDocument.transact(() => {
                    for (const childID of wideChildrenIDList) {
                        const child = pageMap[childID]
                        child.visibility = visibility
                        yMap.set(child.id, child)
                    }
                })
            }
        }
        page.visibility = visibility
        yMap.set(page.id, page)
    }
}
