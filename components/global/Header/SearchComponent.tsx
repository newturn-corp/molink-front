import React from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../manager/UserManager'
import { useRouter } from 'next/router'

import { Input } from 'antd'

const { Search } = Input

export const SearchComponent: React.FC<{
  }> = observer(() => {
      const onSearch = value => console.log(value)

      return <Search className='search' placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
  })
