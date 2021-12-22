import { makeAutoObservable } from 'mobx'
import React from 'react'
import Document from '../../domain/Document'
import EventManager, { Event } from '../EventManager'
import GlobalManager from '../GlobalManager'

class FileDragManager {
    public draggingDocument: Document = null

    public newOrder: number = 0
    public newParent: Document | null = null

    public fileSystemElement: HTMLElement

    public indicatorTooptip: HTMLElement
    private isTooltipVisible: boolean = false
    public viewerText: string = ''

    public dragIndicator: HTMLElement
    private isIndicatorVisible: boolean = false

    private _dragOverCount = 0

    constructor () {
        makeAutoObservable(this)
        EventManager.addEventLinstener(Event.DocumentMapInited, () => {
            this.fileSystemElement = GlobalManager.document.getElementsByClassName('MuiList-root MuiList-padding')[0] as HTMLElement
            this.indicatorTooptip = GlobalManager.document.getElementsByClassName('ant-tooltip')[0] as HTMLElement
            this.dragIndicator = GlobalManager.document.getElementsByClassName('drag-indicator')[0] as HTMLElement
        }, 1)
    }

    handleDragStart (document: Document) {
        this.draggingDocument = document
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
            this.indicatorTooptip.style.visibility = 'visible'
        } else {
            this.indicatorTooptip.style.visibility = 'hidden'
        }
    }

    setViewerPosition (position: number) {
        this.indicatorTooptip.style.top = (position - 17) + 'px'
        this.dragIndicator.style.top = (position - 60) + 'px'
    }

    newHandleDragOver (event: React.DragEvent<HTMLDivElement>, document: Document) {
        if (!this.draggingDocument) {
            return
        }
        if (this.draggingDocument.equal(document)) {
            return
        }
        event.preventDefault()

        const documentElement = globalThis.document.getElementById('document-' + document.meta.id)
        const mouseY = event.pageY
        const y = documentElement.getBoundingClientRect().y
        const height = documentElement.offsetHeight
        const topStandard = y + height * 0.25
        const bottomStandard = y + height * 0.75

        this.setIndicatorTooltipVisible(true)
        if (mouseY < topStandard) {
            this.setViewerPosition(y)
            this.setIndicatorVisible(true)
            this.newOrder = document.directoryInfo.order
            this.newParent = document.directoryInfo.parent

            if (document.directoryInfo.order === 0) {
                this.viewerText = `${document.meta.title} 위로 이동`
            } else {
                const documentOnTop = document.directoryInfo.getSibling()[document.directoryInfo.order - 1]
                this.viewerText = `${documentOnTop.meta.title} 아래로 이동`
            }

            this._dragOverCount = 0
        } else if (mouseY > bottomStandard) {
            this.setViewerPosition(y + height)
            this.setIndicatorVisible(true)
            this.newOrder = document.directoryInfo.order + 1
            this.newParent = document.directoryInfo.parent

            this.viewerText = `${document.meta.title} 아래로 이동`
            this._dragOverCount = 0
        } else {
            this.setViewerPosition(y + height * 0.5)
            this.setIndicatorVisible(false)
            this.newOrder = document.directoryInfo.children.length
            this.newParent = document

            if (!document.directoryInfo.isChildrenOpen && document.directoryInfo.children.length > 0) {
                this._dragOverCount += 1
                if (this._dragOverCount < 30) {
                    this.viewerText = `${document.meta.title}의 하위 문서로 추가 또는 이 문서 열기 (${30 - this._dragOverCount})`
                } else if (this._dragOverCount === 30) {
                    document.directoryInfo.setIsChildrenOpen(true)
                    this._dragOverCount = 0
                }
            } else {
                this.viewerText = `${document.meta.title}의 하위 문서로 추가`
            }
        }
    }

    handleDragLeave (document: Document) {
        if (!this.draggingDocument) {
            return
        }
        if (this.draggingDocument.meta.id === document.meta.id) {
            return
        }
        this._dragOverCount = 0
    }

    async handleDragEnd (ghost: HTMLElement) {
        globalThis.document.getElementsByClassName('drag-ghost-parent')[0].removeChild(ghost)

        this.setIndicatorVisible(false)
        this.setIndicatorTooltipVisible(false)

        if (this.draggingDocument.directoryInfo.order === this.newOrder) {
            if (!this.newParent && !this.draggingDocument.directoryInfo.parent) {
                return
            } else if (this.newParent.equal(this.draggingDocument.directoryInfo.parent)) {
                return
            }
        }

        await this.draggingDocument.directoryInfo.setDocumentLocation(this.newParent, this.newOrder)
        this._dragOverCount = 0
    }
}
export default new FileDragManager()
