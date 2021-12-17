import React, { useEffect } from 'react'

import { FileSystem } from '../components/global/FileSystem/FileSystem'
import DirectoryManager from '../manager/DirectoryManager'
import { Editor } from '../components/home/Editor'
import { DrawerWidthController } from '../components/global/DrawerWidthController'
import { Header } from '../components/global/Header'
import DocumentManager from '../manager/DocumentManager'
import { ContentComponent } from '../components/home/ContentComponent'

const Index = () => {
    useEffect(() => {
        DocumentManager.init()
    }, [])

    return <div onClick={() => {
        DirectoryManager.openContextMenu = false
        DirectoryManager.selectedDocument = null
    } } >
        <Header />
        <div className={'index-body'}>
            <FileSystem />
            <DrawerWidthController/>
            <ContentComponent/>
        </div>
        <div className={'drag-ghost-parent'}/>
    </div>
}

export default Index
