import React, { SyntheticEvent, useState } from 'react'
import { observer } from 'mobx-react'
import { Tag, Tooltip } from 'antd'
import FeedbackManager, { NOTIFICATION_TYPE } from '../../../manager/global/FeedbackManager'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import { isMac } from 'lib0/environment'

interface CustomEvent extends SyntheticEvent {
    data: string
}

export const PageTagList: React.FC<{
}> = observer(() => {
    const [newTag, setNewTag] = useState('')
    const [isTagFocus, setIsTagFocus] = useState(false)
    const editor = EditorPage.editor
    const tags = editor.synchronizer ? editor.tagList.tags : EditorPage.pageInfo.tags

    return <div
        className={'page-tag-list-container'}
    >
        {
            tags.map((tag, index) =>
                <Tag
                    key={`page-tag-${index}`}
                    closable={editor.editable && !editor.info.isLocked}
                    onClose={(event) => {
                        event.preventDefault()
                        if (editor.editable) {
                            editor.tagList.remove(index)
                        }
                    }}
                >
                    {tag}
                </Tag>)
        }
        {
            editor.editable &&
            !editor.info.isLocked
                ? <Tooltip
                    title={'엔터 또는 쉼표로 태그 입력'}
                    placement={'bottomLeft'}
                    visible={isTagFocus}
                >
                    <input
                        className={'tag-input'}
                        placeholder={'태그 입력'}
                        value={newTag}
                        onChange={(event) => {
                            setNewTag(event.target.value)
                        }}
                        onFocus={() => setIsTagFocus(true)}
                        onBlur={() => {
                            setNewTag('')
                            setIsTagFocus(false)
                        }}
                        onKeyDown={(event) => {
                            if (newTag !== '') {
                                if (isMac && event.key === 'Enter' && event.keyCode === 229) {
                                    return
                                }
                                if (event.key === 'Enter' || event.key === ',') {
                                    // 중복이 없으면
                                    event.preventDefault()
                                    if (editor.tagList.tags.filter(v => v === newTag).length === 0) {
                                        editor.tagList.add(newTag)
                                    } else {
                                        FeedbackManager.showFeedback(NOTIFICATION_TYPE.ERROR, '이미 태그가 존재합니다.', '', 3)
                                    }
                                    setNewTag('')
                                }
                            }
                        }}
                        onBeforeInput={(event: any) => {
                            const data = event.data as any
                            if (isMac && data[data.length - 1] === ',') {
                                event.preventDefault()
                            }
                        }}
                    />
                </Tooltip>
                : <></>
        }
    </div>
})
