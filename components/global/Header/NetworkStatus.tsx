import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from '@material-ui/core'
import { WifiRounded, PermScanWifiRounded, CloudUpload } from '@material-ui/icons'
import moment from 'moment'
import SaveManager, { ContentSaveStatus } from '../../../manager/renew/SaveManager'
import ContentManager from '../../../manager/renew/ContentManager'

const getNetworkStatusTooltip = (status: ContentSaveStatus, diff: number) => {
    switch (status) {
    case ContentSaveStatus.Saved:
        return `연결 정상: ${diff}초 전에 저장됨`
    case ContentSaveStatus.Saving:
        return '저장 중...'
    case ContentSaveStatus.SaveFailed:
        return `연결 끊김: ${diff}초 전에 저장됨`
    }
}

const NetworkStatusIcon: React.FC<{
    status: ContentSaveStatus
}> = ({ status }) => {
    switch (status) {
    case ContentSaveStatus.Saved:
        return <WifiRounded style={{ color: 'rgb(48, 175, 31)' }} />
    case ContentSaveStatus.Saving:
        return <CloudUpload style={{ color: '#23a3bc' }} />
    case ContentSaveStatus.SaveFailed:
        return <PermScanWifiRounded style={{ color: '#bc2323' }}/>
    default:
        throw new Error('unhandled network status')
    }
}

export const NetworkStatus: React.FC<{
  }> = observer(() => {
      const [diff, setDiff] = useState(moment().diff(moment(SaveManager.lastSavedAt), 'seconds'))

      if (!ContentManager.openedDocument || !ContentManager.openedDocument.authority.editable) {
          return <></>
      }

      return <div className='network-status-container'>
          <Tooltip title={getNetworkStatusTooltip(SaveManager.contentSaveStatus, diff)} onOpen={() => setDiff(moment().diff(moment(SaveManager.lastSavedAt), 'seconds'))}>
              {NetworkStatusIcon({ status: SaveManager.contentSaveStatus }) }
          </Tooltip>
      </div>
  })
