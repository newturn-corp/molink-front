import React from 'react'
import { useRouter } from 'next/router'
import { Header } from '../../components/global/Header/Header'
import { isBrowser, isMobile } from 'react-device-detect'
import { BlogWidthController } from '../../components/Blog/BlogWidthController'
import { BlogComponent } from '../../components/Blog/BlogComponent'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'
import { UserBlogBarComponent } from '../../components/global/UserBlogBar/UserBlogBarComponent'
import { MobileBlogComponent } from '../../components/Blog/Mobile/MobileBlogComponent'
import BlogPage from '../../manager/Blog/BlogPage'
import { SiteBody } from '../../components/global/SiteBody'
import { BlogUserContent } from '../../components/BlogPage/UserContent/BlogUserContent'
import ContentContainer from '../../components/global/ContentContainer'

const BlogPageComponent: React.FC<{
    pageMetaInfo: ESPageMetaInfo | null
}> = () => {
    const router = useRouter()
    BlogPage.handleEnter(router.query.name as string)

    return <div
        onClick={async () => {
            await EventManager.issueEvent(Event.PageBodyClick)
        }}
    >
        <Header />
        {
            isMobile && <MobileBlogComponent/>
        }
        <SiteBody>
            <ContentContainer>
                <BlogUserContent/>
            </ContentContainer>
            {
                isBrowser && <>
                    <UserBlogBarComponent/>
                    <BlogComponent />
                    <BlogWidthController/>
                </>
            }
        </SiteBody>
    </div>
}

export default BlogPageComponent
