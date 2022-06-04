import { observer } from 'mobx-react'
import React, { useRef } from 'react'
import { AddRounded } from '@material-ui/icons'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import CommandManager from '../../../../manager/Editing/Command/CommandManager'
import LanguageManager from '../../../../manager/global/LanguageManager'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const MobileToolbar: React.FC<{
}> = observer(() => {
    const ref = useRef<HTMLDivElement | null>(null)

    return <div
        ref={ref}
        className={'mobile-toolbar'}
        style={{
            display: EditorPage.editor.toolbar.showMobileToolbar ? 'flex' : 'none',
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
            <div className={'text'}>
                {LanguageManager.languageMap.Add}
            </div>
        </div>
    </div>
})
