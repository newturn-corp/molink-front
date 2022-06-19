import React from 'react'
import { useRouter } from 'next/router'
import { Header } from '../../components/global/Header/Header'
import { BrowserView, MobileView } from 'react-device-detect'
import { HomeMainComponent } from '../../components/Home/Main/HomeMainComponent'
import { HierarchyWidthController } from '../../components/global/Hierarchy/HierarchyWidthController'
import { HierarchyContainer } from '../../components/global/Hierarchy/HierarchyContainer'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'
import { Portal } from '../../components/utils/Portal'
import StyleManager from '../../manager/global/Style/StyleManager'
import BlogPage from '../../manager/Blog/BlogPage'
import { BlogPageHead } from '../../components/Blog/EditorPage/BlogPageHead'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'
import { SERVER_BASE_URL } from '../../infra/constants'
import { GetServerSideProps } from 'next'

const BlogPageComponent: React.FC<{
    pageMetaInfo: ESPageMetaInfo | null
}> = ({ pageMetaInfo }) => {
    const router = useRouter()
    if (!router.query.info) {
        return <></>
    }
    BlogPage.handleEnter(router.query.info as string[], pageMetaInfo)
    return <div>
        <BlogPageHead
            pageMetaInfo={pageMetaInfo}
        />
        <div
            onClick={async () => {
                await EventManager.issueEvent(Event.PageBodyClick)
            }}
        >

            <Header />
            <MobileView>
                <Portal>
                    <HierarchyContainer />
                </Portal>
            </MobileView>
            <div
                className={'index-body'}
                style={StyleManager.globalStyle.body}
            >
                <HomeMainComponent/>
                <BrowserView>
                    <HierarchyContainer />
                    <HierarchyWidthController/>
                </BrowserView>
            </div>
            <div
                className={'drag-ghost-parent'}
            />
        </div>
    </div>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const urlInfo = context.query.info as string[]

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

    const getPageIDFromURLInfo = (urlInfo: string[]) => {
        if (urlInfo.length === 3) {
            const [a, pageID, b] = urlInfo
            return pageID
        }
    }

    const pageID = getPageIDFromURLInfo(urlInfo)
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
        }
    }
}

export default BlogPageComponent
