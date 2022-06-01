import { observer } from 'mobx-react'
import React from 'react'
import ListViewIcon from 'public/image/icon/list-view.svg'
import TableViewIcon from 'public/image/icon/table-view.svg'
import { CategoryContainer } from './Header/CategoryContainer'
import { ViewTypeSelector } from './Header/ViewTypeSelector'

export const MainHeader: React.FC<{
}> = observer(() => {
    return <div className={'main-header'}>
        <CategoryContainer/>
        <ViewTypeSelector/>
    </div>
})
