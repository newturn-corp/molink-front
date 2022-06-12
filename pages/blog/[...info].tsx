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

const BlogPageComponent: React.FC<{
    pageMetaInfo: ESPageMetaInfo | null
}> = ({ pageMetaInfo }) => {
    const router = useRouter()
    if (!router.query.info) {
        return <></>
    }
    BlogPage.handleEnter(router.query.info as string[])
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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     console.log(context)
//     const urlInfo = context.query.info as string[]
//     if (urlInfo.length === 3) {
//         try {
//             const [a, pageID, b] = urlInfo
//             const res = await fetch(`${SERVER_BASE_URL}/viewer/pages/${pageID}/meta-info`, {
//                 method: 'GET'
//             })
//             const body = await res.json()
//             const pageMetaInfo = body.data
//             console.log(pageMetaInfo)
//             return {
//                 props: {
//                     pageMetaInfo: pageMetaInfo || null
//                 }
//             }
//         } catch (err) {
//             console.log(err)
//         }
//     }
//
//     return {
//         props: {
//             pageMetaInfo: null
//         }
//     }
// }

export default BlogPageComponent
