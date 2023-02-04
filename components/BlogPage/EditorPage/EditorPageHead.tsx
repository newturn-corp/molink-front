import React from 'react'
import Head from 'next/head'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'
import { observer } from 'mobx-react'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'

export const EditorPageHead: React.FC<{
    pageMetaInfo: ESPageMetaInfo | undefined
}> = observer(({ pageMetaInfo }) => {
    const metaInfo = EditorPage.metaInfo || pageMetaInfo
    const title = metaInfo ? metaInfo.title : 'Molink'
    const description = metaInfo ? metaInfo.description : '내가 주도하는 블로그 플랫폼, Molink'
    const image = metaInfo ? metaInfo.image : 'https://www.molink.life/image/global/header/logo.png'
    const tags = metaInfo && metaInfo.tags && typeof metaInfo.tags[Symbol.iterator] === 'function' ? metaInfo.tags : []
    const lastEditedAt = metaInfo && metaInfo.lastEditedAt && !isNaN(Number(new Date(metaInfo.lastEditedAt))) ? metaInfo.lastEditedAt : new Date()

    return <Head>
        <title>{title}</title>
        <meta name="title" content={title}/>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />

        <meta name="robots" content="index, follow"/>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Molink"/>
        <meta property="twitter:card" content="summary"/>
        <link rel="canonical" href="https://molink.life" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="Content-Script-Type" content="Text/javascript" />
        <meta
            property="og:image"
            content={image}
        />
        <meta
            property="twitter:image"
            content={image}
        />
        {
            pageMetaInfo && <>
                <meta
                    name="keywords"
                    content={[title, ...tags].join(',')}
                />
                <meta
                    name="Date"
                    content={new Date(lastEditedAt).toISOString()}
                />
            </>
        }
        <link rel='shortcut icon' href='/favicon.ico' />
    </Head>
})
