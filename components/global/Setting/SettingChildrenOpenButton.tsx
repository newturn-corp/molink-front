import React from 'react'
import { observer } from 'mobx-react'
import { ArrowDropDown, ArrowRight } from '@material-ui/icons'
import SettingManager from '../../../manager/global/Setting/SettingManager'

export const SettingChildrenOpenButton: React.FC<{
    settingID: string
  }> = observer(({ settingID }) => {
      const setting = SettingManager.settingMap.get(settingID)

      const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          event.stopPropagation()
          await SettingManager.updateSettingChildrenOpen(settingID, !setting.isChildrenOpen)
      }

      return <div
          className='child-open-button'
          onClick={(event) => handleClick(event)}
      >
          {
              setting.isChildrenOpen
                  ? <ArrowDropDown />
                  : <ArrowRight />
          }
      </div>
  })
