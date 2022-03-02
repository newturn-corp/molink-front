import { makeAutoObservable } from 'mobx'
import React from 'react'
import HierarchyManager from './HierarchyManager'
import { Event } from '../Event/Event'
import EventManager from '../Event/EventManager'

class PageDragManager {
    public draggingDocument: Document = null
    public draggingDocumentId: string = null

    public newOrder: number = 0
    public newParent: Document | null = null
    public newParentId: string | null = null

    public fileSystemElement: HTMLElement

    public indicatorTooltip: HTMLElement
    private isTooltipVisible: boolean = false
    public viewerText: string = ''

    public dragIndicator: HTMLElement
    private isIndicatorVisible: boolean = false

    private _dragOverCount = 0

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventListener(Event.UpdateHierarchy, () => {
            this.fileSystemElement = document.getElementsByClassName('MuiList-root MuiList-padding')[0] as HTMLElement
            this.indicatorTooltip = document.getElementsByClassName('ant-tooltip')[0] as HTMLElement
            this.dragIndicator = document.getElementsByClassName('drag-indicator')[0] as HTMLElement
        }, 1)
    }

    handleDragStart (documentId: string) {
        this.draggingDocumentId = documentId
    }

    setIndicatorVisible (visible: boolean) {
        if (visible === this.isIndicatorVisible) {
            return
        }
        this.isIndicatorVisible = visible
        if (visible) {
            this.dragIndicator.style.visibility = 'visible'
        } else {
            this.dragIndicator.style.visibility = 'hidden'
        }
    }

    setIndicatorTooltipVisible (visible: boolean) {
        if (visible === this.isTooltipVisible) {
            return
        }
        this.isTooltipVisible = visible
        if (visible) {
            this.indicatorTooltip.style.visibility = 'visible'
        } else {
            this.indicatorTooltip.style.visibility = 'hidden'
        }
    }

    setViewerPosition (position: number) {
        this.indicatorTooltip.style.top = (position - 17) + 'px'
        this.dragIndicator.style.top = (position - 60) + 'px'
    }

    handleDragOver (event: React.DragEvent<HTMLDivElement>, documentId: string) {
        if (!this.draggingDocumentId) {
            return
        }
        if (this.draggingDocumentId === documentId) {
            return
        }
        event.preventDefault()
        const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
        const document = currentHierarchy.map[documentId]

        const documentElement = globalThis.document.getElementById('document-' + document.id)
        const mouseY = event.pageY
        const y = documentElement.getBoundingClientRect().y
        const height = documentElement.offsetHeight
        const topStandard = y + height * 0.25
        const bottomStandard = y + height * 0.75

        this.setIndicatorTooltipVisible(true)
        if (mouseY < topStandard) {
            this.setViewerPosition(y)
            this.setIndicatorVisible(true)
            this.newOrder = document.order
            this.newParentId = document.parentId

            if (document.order === 0) {
                this.viewerText = `${document.title} 위로 이동`
            } else {
                const documentOnTop = currentHierarchy.getSibling(document.id, document.order - 1)
                this.viewerText = `${documentOnTop.title} 아래로 이동`
            }

            this._dragOverCount = 0
        } else if (mouseY > bottomStandard) {
            this.setViewerPosition(y + height)
            this.setIndicatorVisible(true)
            this.newOrder = document.order + 1
            this.newParentId = document.parentId

            this.viewerText = `${document.title} 아래로 이동`
            this._dragOverCount = 0
        } else {
            this.setViewerPosition(y + height * 0.5)
            this.setIndicatorVisible(false)
            this.newOrder = document.children.length
            this.newParentId = document.id

            if (!document.childrenOpen && document.children.length > 0) {
                this._dragOverCount += 1
                if (this._dragOverCount < 30) {
                    this.viewerText = `${document.title}의 하위 페이지로 추가 또는 이 페이지 열기 (${30 - this._dragOverCount})`
                } else if (this._dragOverCount === 30) {
                    currentHierarchy.updateHierarchyChildrenOpen(documentId, true)
                    this._dragOverCount = 0
                }
            } else {
                this.viewerText = `${document.title}의 하위 페이지로 추가`
            }
        }
    }

    handleDragLeave (documentId: string) {
        if (!this.draggingDocumentId) {
            return
        }
        if (this.draggingDocumentId === documentId) {
            return
        }
        this._dragOverCount = 0
    }

    async handleDragEnd (ghost: HTMLElement) {
        globalThis.document.getElementsByClassName('drag-ghost-parent')[0].removeChild(ghost)

        this.setIndicatorVisible(false)
        this.setIndicatorTooltipVisible(false)

        // 만약 전혀 변하지 않았다면 따로 처리하지 않는다.
        const document = HierarchyManager.hierarchy.yMap.get(this.draggingDocumentId)
        if (document.order === this.newOrder) {
            if (!this.newParentId) {
                if (!document.parentId) {
                    return
                }
            } else {
                if (this.newParentId === document.parentId) {
                    return
                }
            }
        }

        await HierarchyManager.hierarchy.locationController.updatePageLocation(this.draggingDocumentId, this.newParentId, this.newOrder)
        this._dragOverCount = 0
    }
}
export default new PageDragManager()
