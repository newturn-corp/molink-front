import React, { useState } from 'react'
import { observer } from 'mobx-react'
import AuthManager from '../../../manager/AuthManager'
import { IconButton, Menu, MenuItem, Tooltip } from '@material-ui/core'
import { WifiRounded, PermScanWifiRounded, CloudUpload } from '@material-ui/icons'
import ContentManager, { ContentSaveStatus } from '../../../manager/home/ContentManager'
import moment from 'moment'

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
      const [diff, setDiff] = useState(moment().diff(moment(ContentManager.lastSavedAt), 'seconds'))

      return <div className='network-status-container'>
          <Tooltip title={getNetworkStatusTooltip(ContentManager.contentSaveStatus, diff)} onOpen={() => setDiff(moment().diff(moment(ContentManager.lastSavedAt), 'seconds'))}>
              {NetworkStatusIcon({ status: ContentManager.contentSaveStatus }) }
          </Tooltip>
      </div>
  })
