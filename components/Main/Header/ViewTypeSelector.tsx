import { observer } from 'mobx-react'
import React from 'react'
import ListViewIcon from 'public/image/icon/list-view.svg'
import TableViewIcon from 'public/image/icon/table-view.svg'
import MainPage from '../../../manager/Main/MainPage'
import { Tooltip } from 'antd'
import { PageListViewType } from '../../../Enums/PageListViewType'
import LanguageManager from '../../../manager/global/LanguageManager'

export const ViewTypeSelector: React.FC<{
}> = observer(() => {
    const activeViewType = MainPage.viewType
    return <div
        className={'view-type-selector'}
    >
        <Tooltip
            title={LanguageManager.languageMap.TableView}
            placement={'bottom'}
        >
            <div
                className={'change-view-button' + (activeViewType === PageListViewType.Table ? ' active' : '')}
                onClick={() => {
                    if (activeViewType === PageListViewType.List) {
                        MainPage.viewType = PageListViewType.Table
                    }
                }}
            >
                <TableViewIcon/>
            </div>
        </Tooltip>
        <Tooltip
            title={LanguageManager.languageMap.ListView}
            placement={'bottom'}
        >
            <div
                className={'change-view-button' + (activeViewType === PageListViewType.List ? ' active' : '')}
                onClick={() => {
                    if (activeViewType === PageListViewType.Table) {
                        MainPage.viewType = PageListViewType.List
                    }
                }}
            >
                <ListViewIcon/>
            </div>
        </Tooltip>
    </div>
})
