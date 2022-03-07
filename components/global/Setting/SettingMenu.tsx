import React from 'react'
import { observer } from 'mobx-react'
import List from '@material-ui/core/List'
import SettingManager from '../../../manager/global/Setting/SettingManager'
import { SettingMenuItem } from './SettingMenuItem'

export const SettingMenu: React.FC<{
}> = observer(() => {
    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            {
                SettingManager.settingList.map((settingID) => {
                    return <SettingMenuItem
                        settingID={settingID}
                        key={`setting-menu-item-${settingID}`}
                        depth={0}
                    />
                })
            }
        </List>
    )
})
