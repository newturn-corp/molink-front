import { reaction } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import DirectoryManager from '../manager/DirectoryManager'

let root: HTMLDivElement = null

export const DrawerContextMenu: React.FC = observer(() => {
    reaction(() => DirectoryManager.clickPosition, () => {
        const clickX = DirectoryManager.clickPosition.x
        const clickY = DirectoryManager.clickPosition.y
        root.style.left = `${clickX + 5}px`
        root.style.top = `${clickY + 5}px`
    })
    return <div ref={ref => { root = ref }} className="contextMenu" style={{
        visibility: DirectoryManager.openContextMenu ? 'visible' : 'hidden'
    }}>
        {
            DirectoryManager.availControlOptions.map(option =>
                <div onClick={() => option.callback()} key={Math.random()} className="contextMenu--option">
                    {option.name}
                </div>)
        }
    </div>
})
