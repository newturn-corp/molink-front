import React from 'react'
import ContentManager from '../manager/ContentManager'
import { DrawerWidthController } from '../components/index/FileSystem/DrawerWidthController'
import { FileSystem } from '../components/index/FileSystem/FileSystem'
import { Header } from '../components/global/Header/Header'
import UserManager from '../manager/UserManager'
import { ContentComponent } from '../components/home/ContentComponent'
import GlobalManager from '../manager/GlobalManager'
import FileSystemManager from '../manager/FileSystemManager'
import RoutingManager, { Page } from '../manager/RoutingManager'
import DocumentManager from '../manager/DocumentManager'

const Index = () => {
    UserManager.updateUserProfile()
        .then(() => {
            const documentId = new URLSearchParams(GlobalManager.window.location.search).get('id')
            if (documentId) {
                ContentManager.tryOpenDocumentByDocumentId(documentId)
            } else {
                if (!UserManager.isUserAuthorized) {
                    RoutingManager.moveTo(Page.SignIn)
                } else {
                    DocumentManager.init(UserManager.userId)
                    ContentManager.currentContentUserId = UserManager.userId
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
