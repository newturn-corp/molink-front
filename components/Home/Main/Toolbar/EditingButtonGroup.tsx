import { observer } from 'mobx-react'
import React from 'react'
import { ToolbarEditingButton } from './ToolbarEditingButton'
import Code from 'public/image/icon/code.svg'
import Link from 'public/image/icon/link.svg'
import File from 'public/image/icon/file.svg'
import Photo from 'public/image/icon/photo.svg'
import Video from 'public/image/icon/video.svg'
import Calendar from 'public/image/icon/calendar.svg'
import Table from 'public/image/icon/table.svg'
import Align from 'public/image/icon/align.svg'
import Bold from 'public/image/icon/bold.svg'
import Italic from 'public/image/icon/italic.svg'
import Underline from 'public/image/icon/underline.svg'
import ToolbarManager from '../../../../manager/Editing/ToolbarManager'

export const EditingButtonGroup: React.FC<{
}> = observer(() => {
    return <div
        className={'editing-button-group'}
    >
        <input
            accept='image/jpg,impge/png,image/jpeg'
            style={{ display: 'none' }}
            id="image-insert-button"
            multiple
            onChange={(event) => ToolbarManager.insertImage(event)}
            type="file"
        />
        <label htmlFor={'image-insert-button'}>
            <ToolbarEditingButton
                icon={<Photo/>}
                text={'이미지'}
                onClick={() => {}}
                disabled={false}
            >
            </ToolbarEditingButton>
        </label>
        <ToolbarEditingButton
            icon={<Video/>}
            text={'동영상'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<Link/>}
            text={'링크'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<File/>}
            text={'파일'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<Calendar/>}
            text={'일정'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<Code/>}
            text={'코드'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<Table/>}
            text={'표'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<Align/>}
            text={'정렬'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<Bold/>}
            text={'볼드'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<Italic/>}
            text={'이탤릭'}
            onClick={() => {}}
            disabled={true}
        />
        <ToolbarEditingButton
            icon={<Underline/>}
            text={'밑줄'}
            onClick={() => {}}
            disabled={true}
        />
    </div>
})
