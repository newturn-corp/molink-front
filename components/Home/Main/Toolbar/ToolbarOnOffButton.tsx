import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import ArrowDownDoubleIcon from 'public/image/icon/arrow-down-double.svg'
import ArrowUpDoubleIcon from 'public/image/icon/arrow-up-double.svg'
import StyleManager from '../../../../manager/global/Style/StyleManager'

const closeStateStyle = {
    width: 24,
    height: 24,
    top: 5
}

const openStateStyle = {
    width: 26,
    height: 26,
    top: 60
}

export const ToolbarOnOffButton: React.FC<{
}> = observer(() => {
    return <div
        className={'toolbar-control-button'}
        style={EditorManager.isToolbarOpen ? openStateStyle : closeStateStyle}
        onClick={async () => {
            await EditorManager.updateIsToolbarOpen(!EditorManager.isToolbarOpen)
        }}
    >
        {
            EditorManager.isToolbarOpen
                ? <ArrowUpDoubleIcon/>
                : <ArrowDownDoubleIcon/>
        }
    </div>
})
