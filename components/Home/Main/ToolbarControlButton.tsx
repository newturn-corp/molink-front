import React from 'react'
import { observer } from 'mobx-react'
import EditorManager from '../../../manager/Blog/EditorManager'

export const ToolbarControlButton: React.FC<{
}> = observer(() => {
    return <div
        className={'toolbar-control-button'}
    >
        {
            EditorManager.isToolbarOpen
                ? <div
                    className={'close'}
                    onClick={async () => {
                        await EditorManager.updateIsToolbarOpen(false)
                    }}
                >
                    <img
                        src={'/image/editor/toolbar/toolbar-close-button.png'}
                    />
                </div>
                : <div
                    className={'open'}
                    onClick={async () => {
                        await EditorManager.updateIsToolbarOpen(true)
                    }}
                >
                    <p
                        className={'text'}
                    >
                        {'툴바'}
                    </p>
                    <div
                        className={'icon'}
                    >
                        <img
                            src={'/image/editor/toolbar/toolbar-close-button.png'}
                        />
                    </div>
                </div>
        }
    </div>
})
