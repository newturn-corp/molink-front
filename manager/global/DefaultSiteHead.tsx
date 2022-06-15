import React from 'react'
import { observer } from 'mobx-react'
import Head from 'next/head'
import EditorPage from '../../manager/Blog/Editor/EditorPage'
import Blog from '../../manager/global/Blog/Blog'

export const DefaultSiteHead: React.FC<{
}> = () => {
    return <Head>
        <title>{'Molink'}</title>
        <meta name="description" content={'내가 주도하는 블로그 플랫폼, Molink'} />
        <meta name={'Keywords'} content={'블로그, Blog, Editor, 에디터, Molink, 모링크, 링크, Link'} />
        <meta property="og:title" content={'Molink'} />
        <meta property="og:type" content="website" />
        <meta property="og:article:author" content={'Molink'}/>
        <link rel='shortcut icon' href='/favicon.ico' />
    </Head>
}
