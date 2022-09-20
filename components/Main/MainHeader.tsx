import { observer } from 'mobx-react'
import React from 'react'
import ListViewIcon from 'public/image/icon/list-view.svg'
import TableViewIcon from 'public/image/icon/table-view.svg'
import { CategoryContainer } from './Header/CategoryContainer'
import { ViewTypeSelector } from './Header/ViewTypeSelector'
import { BrowserView } from 'react-device-detect'

export const MainHeader: React.FC<{
}> = observer(() => {
    return <div className={'main-header'}>
        <CategoryContainer/>
        <BrowserView>
            <ViewTypeSelector/>
        </BrowserView>
    </div>
})
