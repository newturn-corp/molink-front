import { Portal } from '@material-ui/core'
import { reaction } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import DocumentHierarchyManager from '../../../manager/Home/Hierarchy/HierarchyManager'

let root: HTMLDivElement = null

export const HierarchyContextMenu: React.FC = observer(() => {
    reaction(() => DocumentHierarchyManager.clickPosition, () => {
        const clickX = DocumentHierarchyManager.clickPosition.x
        const clickY = DocumentHierarchyManager.clickPosition.y
        root.style.left = `${clickX + 5}px`
        root.style.top = `${clickY + 5}px`
    })
    return <Portal container={globalThis.document.body}>
        <div ref={ref => { root = ref }} className="contextMenu" style={{
            visibility: DocumentHierarchyManager.openHierarchyContextMenu ? 'visible' : 'hidden'
        }}>
            {
                DocumentHierarchyManager.availControlOptions.map(option =>
                    <div onClick={(e) => {
                        e.stopPropagation()
                        DocumentHierarchyManager.openHierarchyContextMenu = false
                        option.handleOnClick()
                    }} key={Math.random()} className="contextMenu--option">
                        {option.name}
                    </div>)
            }
        </div>
    </Portal>
})
