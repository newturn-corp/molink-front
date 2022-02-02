import React from 'react'
import { observer } from 'mobx-react'
import ContentManager from '../../manager/ContentManager'
import Head from 'next/head'

export const SiteHead: React.FC<{
  }> = observer(() => {
      const headText = ContentManager.openedDocument ? ContentManager.openedDocument.meta.title : 'Molink'
      return <Head>
          <title>{headText}</title>
          <link rel='shortcut icon' href='/favicon.ico' />
      </Head>
  })
