import React from 'react'
import { observer } from 'mobx-react'
import ArrowDownDoubleIcon from 'public/image/icon/arrow-down-double.svg'
import ArrowUpDoubleIcon from 'public/image/icon/arrow-up-double.svg'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

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
    const toolbar = EditorPage.editor.toolbar
    return <div
        className={'toolbar-control-button'}
        style={toolbar.isOpen ? openStateStyle : closeStateStyle}
        onClick={async () => {
            if (toolbar.isOpen) {
                await toolbar.close()
            } else {
                await toolbar.open()
            }
        }}
    >
        {
            toolbar.isOpen
                ? <ArrowUpDoubleIcon/>
                : <ArrowDownDoubleIcon/>
        }
    </div>
})
