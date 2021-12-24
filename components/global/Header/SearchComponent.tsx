import React from 'react'
import { observer } from 'mobx-react'

import { Input } from 'antd'
import SearchManager from '../../../manager/SearchManager'
import { useRouter } from 'next/router'

const { Search } = Input

export const SearchComponent: React.FC<{
  }> = observer(() => {
      const router = useRouter()
      const onSearch = async value => {
          await SearchManager.search(value)
          router.replace(`/search?q=${value}`)
      }

      return <Search className='search' placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
  })
