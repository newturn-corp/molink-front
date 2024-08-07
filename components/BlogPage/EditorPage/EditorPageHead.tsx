import React from 'react'
import Head from 'next/head'
import { ESPageMetaInfo } from '@newturn-develop/types-molink'

export const EditorPageHead: React.FC<{
    pageMetaInfo: ESPageMetaInfo | undefined
}> = ({ pageMetaInfo }) => {
    const title = pageMetaInfo ? pageMetaInfo.title : 'Molink'
    const description = pageMetaInfo ? pageMetaInfo.description : '내가 주도하는 블로그 플랫폼, Molink'
    const image = pageMetaInfo ? pageMetaInfo.image : 'https://www.molink.life/image/global/header/logo.png'
    const tags = pageMetaInfo && pageMetaInfo.tags && typeof pageMetaInfo.tags[Symbol.iterator] === 'function' ? pageMetaInfo.tags : []
    const lastEditedAt = pageMetaInfo && pageMetaInfo.lastEditedAt && !isNaN(Number(new Date(pageMetaInfo.lastEditedAt))) ? pageMetaInfo.lastEditedAt : new Date()

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
}
