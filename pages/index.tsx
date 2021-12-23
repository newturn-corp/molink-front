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
import RoutingManager, { Page } from '../manager/RoutingManager'

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

const initDocumentMap = async () => {
    if (DocumentManager.isDocumentMapInited) {
        return
    }
    await DocumentManager.init()
}

const Index = () => {
    const router = useRouter()
    UserManager.updateUserProfile()
        .then(initDocumentMap)
        .then(() => {
            const documentId = new URLSearchParams(GlobalManager.window.location.search).get('id')
            if (documentId) {
                openDocument(documentId)
            } else {
                if (!UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.SignIn)
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
