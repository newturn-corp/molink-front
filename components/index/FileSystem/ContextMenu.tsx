import { Portal } from '@material-ui/core'
import { reaction } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import FileSystemManager from '../../../manager/FileSystemManager'

let root: HTMLDivElement = null

export const DrawerContextMenu: React.FC = observer(() => {
    reaction(() => FileSystemManager.clickPosition, () => {
        const clickX = FileSystemManager.clickPosition.x
        const clickY = FileSystemManager.clickPosition.y
        root.style.left = `${clickX + 5}px`
        root.style.top = `${clickY + 5}px`
    })
    return <Portal container={globalThis.document.body}>
        <div ref={ref => { root = ref }} className="contextMenu" style={{
            visibility: FileSystemManager.openContextMenu ? 'visible' : 'hidden'
        }}>
            {
                FileSystemManager.availControlOptions.map(option =>
                    <div onClick={(e) => {
                        e.stopPropagation()
                        FileSystemManager.openContextMenu = false
                        option.callback()
                    }} key={Math.random()} className="contextMenu--option">
                        {option.name}
                    </div>)
            }
        </div>
    </Portal>
})
