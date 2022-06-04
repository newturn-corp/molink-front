import React from 'react'
import { observer } from 'mobx-react'
import Head from 'next/head'
import EditorPage from '../../manager/Blog/Editor/EditorPage'
import Blog from '../../manager/global/Blog/Blog'

export const SiteHead: React.FC<{
  }> = observer(() => {
      const pageHierarchy = Blog.pageHierarchy
      const headText = pageHierarchy && pageHierarchy.openedPage ? pageHierarchy.openedPage.title : 'Molink'
      const {
          pageDescription,
          thumbnailImage
      } = EditorPage.pageInfo || {
          pageDescription: '내가 주도하는 블로그 플랫폼, Molink',
          thumbnailImage: null
      }
      const {
          nickname
      } = EditorPage.userInfo || {
          nickname: 'Molink'
      }

      return <Head>
          <title>{headText}</title>
          <meta name="description" content={pageDescription} />
          <meta property="og:title" content={headText} />
          <meta property="og:type" content="website" />
          {
              thumbnailImage && <meta
                  property="og:image"
                  content={thumbnailImage}
              />
          }
          <meta property="og:article:author" content={nickname}/>
          <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
  })
