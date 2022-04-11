import React from 'react'
import { useSlate } from 'slate-react'
import LinkManager from '../../../../../manager/Editing/Link/LinkManager'
import { Link } from '@material-ui/icons'

export const LinkButton: React.FC<{
}> = () => {
    const editor = useSlate()
    return (
        <div
            className={'link-button'}
            onClick={event => {
                event.preventDefault()
                LinkManager.hoveringToolbar.showLinkInput(editor.selection)
            }}
        >
            <Link/>
            <span className='text'>링크</span>
        </div>
    )
}
