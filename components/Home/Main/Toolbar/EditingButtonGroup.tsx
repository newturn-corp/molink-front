import { observer } from 'mobx-react'
import React from 'react'
import { ToolbarEditingButton } from './ToolbarEditingButton'
import Code from 'public/image/icon/code.svg'
import Link from 'public/image/icon/link.svg'
import File from 'public/image/icon/folder.svg'
import Photo from 'public/image/icon/photo.svg'
import Video from 'public/image/icon/video.svg'
import Calendar from 'public/image/icon/calendar.svg'
import Table from 'public/image/icon/table.svg'
import Align from 'public/image/icon/align.svg'
import Bold from 'public/image/icon/bold-1.svg'
import Italic from 'public/image/icon/italic.svg'
import Underline from 'public/image/icon/underline.svg'
import ToolbarManager from '../../../../manager/Editing/ToolbarManager'

export const EditingButtonGroup: React.FC<{
}> = observer((props) => {
    return <div
        className={'editing-button-group'}
    >
        {props.children}
    </div>
})
