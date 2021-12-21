import { reaction } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import FileSystemManager from '../../../manager/renew/FileSystemManager'

let root: HTMLDivElement = null

export const DrawerContextMenu: React.FC = observer(() => {
    reaction(() => FileSystemManager.clickPosition, () => {
        const clickX = FileSystemManager.clickPosition.x
        const clickY = FileSystemManager.clickPosition.y
        root.style.left = `${clickX + 5}px`
        root.style.top = `${clickY + 5}px`
    })
    return <div ref={ref => { root = ref }} className="contextMenu" style={{
        visibility: FileSystemManager.openContextMenu ? 'visible' : 'hidden'
    }}>
        {
            FileSystemManager.availControlOptions.map(option =>
                <div onClick={() => option.callback()} key={Math.random()} className="contextMenu--option">
                    {option.name}
                </div>)
        }
    </div>
})
