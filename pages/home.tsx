import React, { useEffect } from 'react'

import { FileSystem } from '../components/index/FileSystem/FileSystem'
import { DrawerWidthController } from '../components/index/FileSystem/DrawerWidthController'
import { Header } from '../components/global/Header/Header'
import DocumentManager from '../manager/DocumentManager'
import { ContentComponent } from '../components/home/ContentComponent'
import FileSystemManager from '../manager/renew/FileSystemManager'

const Index = () => {
    useEffect(() => {
        DocumentManager.init()
    }, [])

    return <div onClick={() => {
        FileSystemManager.openContextMenu = false
        FileSystemManager.selectedDocument = null
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
