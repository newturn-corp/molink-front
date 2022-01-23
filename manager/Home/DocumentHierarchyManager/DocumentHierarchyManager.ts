import { makeAutoObservable, toJS } from 'mobx'
import ViewerAPI from '../../../api/ViewerAPI'
import { CreateNewDocumentOption, HierarchyControlOption } from './HierarchyOptions'
import Hierarchy from './Hierarchy'
import React from 'react'
import UserManager from '../../global/UserManager'
import HierarchyLiveServer from '../../../LiveServer/HierarchyLiveServer'
import HierarchyChildrenOpenServer from '../../../LiveServer/HierarchyChildrenOpenServer'

// 전반적인 FileSystem의 변화를 담당하는 매니저
class DocumentHierarchyManager {
    hierarchy: Hierarchy = null

    editable: boolean = false
    openHierarchyContextMenu: boolean = false

    private _clickPosition: { x: number, y: number } = { x: 0, y: 0 }
    get clickPosition () {
        return toJS(this._clickPosition)
    }

    private _availControlOptions: HierarchyControlOption[] = []
    get availControlOptions () {
        return toJS(this._availControlOptions)
    }

    constructor () {
        makeAutoObservable(this)
    }

    async loadHierarchy (nickname: string) {
        const serializedHierarchy = await ViewerAPI.getDocumentsHierarchy(nickname) as any
        const serializedChildrenOpenMap = (await ViewerAPI.getDocumentHierarchyChildrenOpenMap(nickname)).serializedValue
        this.hierarchy = new Hierarchy(serializedHierarchy, serializedChildrenOpenMap)
        this.editable = UserManager.profile && UserManager.profile.nickname === nickname
        if (UserManager.isUserAuthorized) {
            await HierarchyChildrenOpenServer.connect(nickname)
        }
        if (this.editable) {
            await HierarchyLiveServer.connect(nickname)
        }
    }

    handleRightClick (event: React.MouseEvent<HTMLElement, MouseEvent>, documentId: string | null) {
        if (!this.editable) {
            return
        }
        event.preventDefault()
        event.stopPropagation()
        this.hierarchy.setSelectedDocumentId(documentId)

        this._availControlOptions = []
        if (this.editable) {
            this._availControlOptions.push(new CreateNewDocumentOption(documentId))
            if (document) {
                // if (document.meta.representative) {
                //     this._availControlOptions.push({ name: '대표 문서 해제', callback: () => this.setDocumentRepresentative(false) })
                // }
                // if (!document.meta.representative && document.meta.visibility === DocumentVisibility.Public) {
                //     this._availControlOptions.push({ name: '대표 문서로 설정', callback: () => this.setDocumentRepresentative(true) })
                // }
                // this._availControlOptions.push(new ChangeDocumentNameOption(document, this.hierarchy))
                // this._availControlOptions.push(new DeleteDocumentOption(document, this.hierarchy))
            }
        }
        // this._availControlOptions.push(new SettingDocumentListOption(document, this.hierarchy))

        this.openHierarchyContextMenu = true
        this._clickPosition = { x: event.clientX, y: event.clientY }
        console.log(this._availControlOptions)
    }

    closeContextMenu () {
        if (this.hierarchy) {
            this.hierarchy.setSelectedDocumentId(null)
        }
        this.openHierarchyContextMenu = false
    }
}
export default new DocumentHierarchyManager()
