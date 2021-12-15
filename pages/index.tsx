import React from 'react'

import { SidebarLayout } from '../components/SideBarLayout'
import DirectoryManager from '../manager/DirectoryManager'
import { Editor } from '../components/Editor'
import { DrawerWidthController } from '../components/DrawerWidthController'

const Index = () => {
    return <div onClick={() => {
        DirectoryManager.openContextMenu = false
        DirectoryManager.selectedDocument = null
    } } >
        <SidebarLayout />\
        <DrawerWidthController/>
        <div className={'drag-ghost-parent'}/>
        <Editor/>
    </div>
}

export default Index
