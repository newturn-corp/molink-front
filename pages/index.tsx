import React from 'react'
import ContentManager from '../manager/renew/ContentManager'
import { DrawerWidthController } from '../components/index/FileSystem/DrawerWidthController'
import { FileSystem } from '../components/index/FileSystem/FileSystem'
import { Header } from '../components/global/Header/Header'
import UserManager from '../manager/UserManager'
import { ContentComponent } from '../components/home/ContentComponent'
import GlobalManager from '../manager/GlobalManager'
import { useRouter } from 'next/router'

const Index = () => {
    const router = useRouter()
    UserManager.updateUserProfile()
        .then(() => {
            const documentId = new URLSearchParams(GlobalManager.window.location.search).get('id')
            if (documentId) {
                ContentManager.tryOpenDocumentByDocumentId(documentId)
            } else {
                if (!UserManager.isUserAuthorized) {
                    router.push('/signin')
                }
            }
        })
    return <div>
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
