import { observer } from 'mobx-react'
import React from 'react'
import PublishRoundedIcon from '@material-ui/icons/PublishRounded'
import PageManager from '../../../../manager/Blog/PageManager'
import { Tooltip } from 'antd'
import { getTimeDiff } from '../../../../utils/getRelativeTime'
import moment from 'moment-timezone'

export const PublishButton: React.FC<{
}> = observer(() => {
    const {
        isPublishable,
        lastPublishedAt
    } = PageManager.pageUserInfo
    const availTimeDiff = getTimeDiff(moment().toDate(), moment(lastPublishedAt || new Date()).add(3, 'days').toDate())
    return <Tooltip
        visible={isPublishable ? false : undefined}
        title={`${availTimeDiff} 후에 발행할 수 있습니다.`}
        placement={'bottom'}
    >
        <div
            className={'publish-button' + (!isPublishable ? ' unpublishable' : '')}
            style={{
                cursor: isPublishable ? 'pointer' : 'default'
            }}
            onClick={async (event) => {
                if (isPublishable) {
                    await PageManager.pageUserInfo.handlePublishButtonDown()
                }
            }}
        >
            <PublishRoundedIcon/>
            발행하기
        </div>
    </Tooltip>
})
