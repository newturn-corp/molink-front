import { observer } from 'mobx-react'
import React from 'react'
import { Range } from 'slate'
import { useSelected, useSlate } from 'slate-react'
import { TextCategory } from '../../Types/slate/CustomElement'
import EditorManager from '../../manager/Home/EditorManager'
import StyleManager from '../../manager/global/StyleManager'

export const SlateYoutubeElement: React.FC<{
    attributes,
    children,
    element
}> = observer(({ attributes, children, element }) => {
    return <div
        {...attributes}
        className={'youtube-element'}
        contentEditable={false}
    >
        <iframe
            src={`https://www.youtube.com/embed/${element.videoId}`}
            aria-label="Youtube video"
            className={'video'}
            style={{
                width: StyleManager.contentStyle.content.width,
                height: StyleManager.contentStyle.content.width / 16 * 9
            }}
            frameBorder="0"
        />
        {children}
    </div>
})
