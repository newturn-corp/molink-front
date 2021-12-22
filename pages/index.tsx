import React from 'react'
import ContentManager from '../manager/ContentManager'
import { DrawerWidthController } from '../components/index/FileSystem/DrawerWidthController'
import { FileSystem } from '../components/index/FileSystem/FileSystem'
import { Header } from '../components/global/Header/Header'
import UserManager from '../manager/UserManager'
import { ContentComponent } from '../components/home/ContentComponent'
import GlobalManager from '../manager/GlobalManager'
import { useRouter } from 'next/router'
import FileSystemManager from '../manager/FileSystemManager'
import EventManager, { Event } from '../manager/EventManager'
import DocumentManager from '../manager/DocumentManager'

const openDocument = (documentId: string) => {
    const loadedDocument = DocumentManager.documentMap.get(documentId)
    if (loadedDocument) {
        EventManager.issueEvent(Event.OpenDocument, {
            document: loadedDocument
        })
    } else {
        ContentManager.tryOpenDocumentByDocumentId(documentId)
    }
}

const Index = () => {
    const router = useRouter()
    console.log('index loading')
    UserManager.updateUserProfile()
        .then(() => {
            const documentId = new URLSearchParams(GlobalManager.window.location.search).get('id')
            if (documentId) {
                if (!DocumentManager.isDocumentMapInited) {
                    EventManager.addEventLinstener(Event.DocumentMapInited, () => {
                        openDocument(documentId)
                    }, 1)
                } else {
                    openDocument(documentId)
                }
            } else {
                if (!UserManager.isUserAuthorized) {
                    router.push('http://localhost:3000/signin')
                }
            }
        })
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
