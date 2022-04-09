import React from 'react'
import { observer } from 'mobx-react'
import Head from 'next/head'
import HierarchyManager from '../../manager/global/Hierarchy/HierarchyManager'

export const SiteHead: React.FC<{
  }> = observer(() => {
      const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
      const headText = !currentHierarchy || !currentHierarchy.openedPageId || !currentHierarchy.map[currentHierarchy.openedPageId] ? 'Molink' : currentHierarchy.map[currentHierarchy.openedPageId].title
      return <Head>
          <title>{headText}</title>
          <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
  })
