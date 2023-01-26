import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Header } from '../../components/global/Header/Header'
import { isBrowser, isMobile } from 'react-device-detect'
import { HomeMainComponent } from '../../components/Home/Main/HomeMainComponent'
import { BlogWidthController } from '../../components/Blog/BlogWidthController'
import { BlogComponent } from '../../components/Blog/BlogComponent'
import EventManager from '../../manager/global/Event/EventManager'
import { Event } from '../../manager/global/Event/Event'
import StyleManager from '../../manager/global/Style/StyleManager'
import BlogPage from '../../manager/Blog/BlogPage'
import { EditorPageHead } from '../../components/BlogPage/EditorPage/EditorPageHead'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'
import { UserBlogBarComponent } from '../../components/global/UserBlogBar/UserBlogBarComponent'
import { MobileBlogComponent } from '../../components/Blog/Mobile/MobileBlogComponent'

const BlogPageComponent: React.FC<{
    pageMetaInfo: ESPageMetaInfo | null
}> = ({ pageMetaInfo }) => {
    const router = useRouter()
    if (!router.query.info) {
        return <></>
    }
    BlogPage.handleEnter(router.query.info as string[], pageMetaInfo)
    return <div>
        <EditorPageHead
            pageMetaInfo={pageMetaInfo}
        />
        <div
            onClick={async () => {
                await EventManager.issueEvent(Event.PageBodyClick)
            }}
        >

            <Header />
            {
                isMobile && <MobileBlogComponent/>
            }
            <div
                className={'index-body'}
                style={StyleManager.globalStyle.body}
            >
                <HomeMainComponent/>
                {
                    isBrowser && <>
                        <UserBlogBarComponent/>
                        <BlogComponent />
                        <BlogWidthController/>
                    </>
                }
            </div>
            <div
                id={'drag-ghost-parent'}
                className={'drag-ghost-parent'}
            />
        </div>
    </div>
}

// // This function gets called at build time on server-side.
// // It may be called again, on a serverless function, if
// // revalidation is enabled and a new request comes in
// export const getStaticProps: GetStaticProps = async (context) => {
//     const urlInfo = context.params.info as string[]
//
//     const getMetaInfo = async (pageID: string): Promise<ESPageMetaInfo | undefined> => {
//         try {
//             const res = await fetch(`${SERVER_BASE_URL}/viewer/pages/${pageID}/meta-info`, {
//                 method: 'GET'
//             })
//             const body = await res.json()
//             return body.data
//         } catch (err) {
//             console.log(err)
//         }
//     }
//
//     const getPageIDFromURLInfo = (urlInfo: string[]) => {
//         if (urlInfo.length === 3) {
//             const [a, pageID, b] = urlInfo
//             return pageID
//         }
//     }
//
//     const pageID = getPageIDFromURLInfo(urlInfo)
//     if (pageID) {
//         const metaInfo = await getMetaInfo(pageID)
//         if (metaInfo) {
//             return {
//                 props: {
//                     pageMetaInfo: metaInfo
//                 }
//             }
//         }
//     }
//
//     return {
//         props: {
//             pageMetaInfo: null
//         },
//         revalidate: 10
//     }
// }
//
// export const getStaticPaths = async () => {
//     return { paths: [], fallback: true }
// }

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const urlInfo = context.query.info as string[]
//
//     const getMetaInfo = async (pageID: string): Promise<ESPageMetaInfo | undefined> => {
//         try {
//             const res = await fetch(`${SERVER_BASE_URL}/viewer/pages/${pageID}/meta-info`, {
//                 method: 'GET'
//             })
//             const body = await res.json()
//             return body.data
//         } catch (err) {
//             console.log(err)
//         }
//     }
//
//     const getPageIDFromURLInfo = (urlInfo: string[]) => {
//         if (urlInfo.length === 3) {
//             const [a, pageID, b] = urlInfo
//             return pageID
//         }
//     }
//
//     const pageID = getPageIDFromURLInfo(urlInfo)
//     if (pageID) {
//         const metaInfo = await getMetaInfo(pageID)
//         if (metaInfo) {
//             return {
//                 props: {
//                     pageMetaInfo: metaInfo
//                 }
//             }
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
