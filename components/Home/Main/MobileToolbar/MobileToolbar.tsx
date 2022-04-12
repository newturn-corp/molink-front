import { observer } from 'mobx-react'
import React, { useRef } from 'react'
import ToolbarManager from '../../../../manager/Editing/ToolbarManager'
import { AddRounded } from '@material-ui/icons'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import CommandManager from '../../../../manager/Editing/Command/CommandManager'

export const MobileToolbar: React.FC<{
}> = observer(() => {
    const ref = useRef<HTMLDivElement | null>(null)

    return <div
        ref={ref}
        className={'mobile-toolbar'}
        style={{
            display: ToolbarManager.showMobileToolbar ? 'flex' : 'none',
            ...StyleManager.contentStyle.mobileToolbarStyle
        }}
    >
        <div
            className={'content'}
            onClick={() => {
                CommandManager.isCommandDrawerOpen = true
            }}
        >
            <AddRounded/>
            <div className={'text'}>추가</div>
        </div>
    </div>
})
