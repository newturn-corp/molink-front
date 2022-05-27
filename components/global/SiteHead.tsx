import React from 'react'
import { observer } from 'mobx-react'
import Head from 'next/head'
import HierarchyManager from '../../manager/global/Hierarchy/HierarchyManager'
import PageManager from '../../manager/Blog/PageManager'

export const SiteHead: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const headText = !currentHierarchy || !currentHierarchy.openedPageId || !currentHierarchy.map[currentHierarchy.openedPageId] ? 'Molink' : currentHierarchy.map[currentHierarchy.openedPageId].title
      const siteDescription = PageManager.pageUserInfo.pageDescription || '내가 주도하는 블로그 플랫폼, Molink'
      const author = PageManager.pageUserInfo.nickname || 'Molink'

      return <Head>
          <title>{headText}</title>
          <meta name="description" content={siteDescription} />
          <meta property="og:title" content={headText} />
          <meta property="og:type" content="website" />
          {
              PageManager.pageUserInfo.thumbnailImage
                  ? <meta
                      property="og:image"
                      content={PageManager.pageUserInfo.thumbnailImage}
                  />
                  : <></>
          }
          <meta property="og:article:author" content={author}/>
          <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
  })
