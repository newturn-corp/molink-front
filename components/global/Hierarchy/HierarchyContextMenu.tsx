import { Portal } from '@material-ui/core'
import { reaction } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'

let root: HTMLDivElement = null
export const HierarchyContextMenu: React.FC = observer(() => {
    reaction(() => HierarchyManager.clickPosition, () => {
        const clickX = HierarchyManager.clickPosition.x
        const clickY = HierarchyManager.clickPosition.y
        root.style.left = `${clickX + 5}px`
        root.style.top = `${clickY + 5}px`
    })
    return <Portal container={globalThis.document.body}>
        <div
            ref={ref => { root = ref }}
            className="contextMenu"
            style={{
                visibility: HierarchyManager.openHierarchyContextMenu ? 'visible' : 'hidden'
            }}
        >
            {
                HierarchyManager.availControlOptions.map(option =>
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            HierarchyManager.openHierarchyContextMenu = false
                            option.handleOnClick()
                        }}
                        key={Math.random()}
                        className="contextMenu--option"
                    >
                        {option.name}
                    </div>)
            }
        </div>
    </Portal>
})
