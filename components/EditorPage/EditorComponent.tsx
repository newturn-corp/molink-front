import React from 'react'
import { BrowserView, MobileView } from 'react-device-detect'
import EditorPage from '../../manager/Blog/Editor/EditorPage'
import { EditorToolbarComponent } from '../../components/BlogPage/EditorPage/Toolbar/EditorToolbarComponent'
import { EditorHeader } from '../../components/BlogPage/EditorPage/Header/EditorHeader'
import { EditorBodyComponent } from '../../components/BlogPage/EditorPage/EditorBodyComponent'
import { ContentComponent } from '../../components/EditorPage/Content/ContentComponent'
import { MobileToolbar } from '../../components/EditorPage/MobileToolbar/MobileToolbar'
import { CommandDrawer } from '../../components/EditorPage/Content/CommandDrawer'
import { observer } from 'mobx-react'

const EditorComponent: React.FC<{
}> = observer(() => {
    if (!EditorPage.editor) {
        return <></>
    }

    return <>
        <BrowserView>
            <EditorToolbarComponent/>
            <EditorHeader/>
        </BrowserView>
        <EditorBodyComponent>
            <ContentComponent/>
        </EditorBodyComponent>
        <MobileView>
            <MobileToolbar/>
            <CommandDrawer/>
        </MobileView>
    </>
})

export default EditorComponent
