import { observer } from 'mobx-react'
import React from 'react'
import PublishRoundedIcon from '@material-ui/icons/PublishRounded'
import { Tooltip } from 'antd'
import { getTimeDiff } from '../../../../utils/getRelativeTime'
import moment from 'moment-timezone'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const PublishButton: React.FC<{
}> = observer(() => {
    const pageInfo = EditorPage.pageInfo
    const {
        isPublishable,
        lastPublishedAt
    } = EditorPage.pageInfo
    const availTimeDiff = getTimeDiff(moment().toDate(), moment(lastPublishedAt || new Date()).add(3, 'days').toDate())
    const tooltipVisible = isPublishable || moment(lastPublishedAt).isAfter(moment().subtract(10, 'seconds')) ? false : undefined

    return <Tooltip
        visible={tooltipVisible}
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
                    await pageInfo.handlePublishButtonDown()
                }
            }}
        >
            <PublishRoundedIcon/>
            {'발행하기'}
        </div>
    </Tooltip>
})
