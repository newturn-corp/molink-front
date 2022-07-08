import { Portal } from '@material-ui/core'
import { observer } from 'mobx-react'
import React, { useEffect, useRef } from 'react'
import Blog from '../../../manager/global/Blog/Blog'
import EmojiPicker from '../../../manager/global/EmojiPicker'
import { Input, InputRef } from 'antd'

export const BlogNotificationOverlayComponent: React.FC = observer(() => {
    return <Portal>
        <div
            id={'blog-notification-view'}
            style={{
                position: 'absolute',
                top: -9999,
                left: -9999
            }}
        >
            <div
                className={'blog-notification-overlay'}
            >

            </div>
        </div>
    </Portal>
})
