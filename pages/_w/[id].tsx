import React from 'react'
import { useRouter } from 'next/router'
import { Header } from '../../components/global/Header/Header'
import { BrowserView, isBrowser, isMobile, MobileView } from 'react-device-detect'
import { BlogWidthController } from '../../components/Blog/BlogWidthController'
import { BlogComponent } from '../../components/Blog/BlogComponent'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'
import { EditorPageHead } from '../../components/BlogPage/EditorPage/EditorPageHead'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'
import { SERVER_BASE_URL } from '../../infra/constants'
import { GetStaticProps } from 'next'
import { UserBlogBarComponent } from '../../components/global/UserBlogBar/UserBlogBarComponent'
import { MobileBlogComponent } from '../../components/Blog/Mobile/MobileBlogComponent'
import ContentContainer from '../../components/global/ContentContainer'
import EditorPage from '../../manager/Blog/Editor/EditorPage'
import { SiteBody } from '../../components/global/SiteBody'
import EditorComponent from '../../components/EditorPage/EditorComponent'

const EditorPageComponent: React.FC<{
    pageMetaInfo: ESPageMetaInfo | null
}> = ({ pageMetaInfo }) => {
    const router = useRouter()
    if (!router.query.id) {
        return <></>
    }
    EditorPage.handleEnter(router.query.id as string)

    return <div
        onClick={async () => {
            await EventManager.issueEvent(Event.PageBodyClick)
        }}
    >
        <EditorPageHead
            pageMetaInfo={pageMetaInfo}
        />
        {
            typeof window !== 'undefined' && <>
                <Header />
                {
                    isMobile && <MobileBlogComponent/>
                }
                <SiteBody>
                    <ContentContainer>
                        <EditorComponent/>
                    </ContentContainer>
                    {
                        isBrowser && <>
                            <UserBlogBarComponent/>
                            <BlogComponent />
                            <BlogWidthController/>
                        </>
                    }
                </SiteBody>
            </>
        }
    </div>
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export const getStaticProps: GetStaticProps = async (context) => {
    const pageID = context.params.id as string

    const getMetaInfo = async (pageID: string): Promise<ESPageMetaInfo | undefined> => {
        try {
            const res = await fetch(`${SERVER_BASE_URL}/viewer/pages/${pageID}/meta-info`, {
                method: 'GET'
            })
            const body = await res.json()
            return body.data
        } catch (err) {
            console.log(err)
        }
    }

    if (pageID) {
        const metaInfo = await getMetaInfo(pageID)
        if (metaInfo) {
            return {
                props: {
                    pageMetaInfo: metaInfo
                }
            }
        }
    }

    return {
        props: {
            pageMetaInfo: null
        },
        revalidate: 10
    }
}

export const getStaticPaths = async () => {
    const res = await fetch(`${SERVER_BASE_URL}/viewer/pages`, {
        method: 'GET'
    })
    const body = await res.json()
    const paths = body.arr.map((id) => ({
        params: { id }
    }))
    console.log(paths)
    return { paths, fallback: true }
}

export default EditorPageComponent
