import { css, cx } from '@emotion/css'
import { FormatBold, FormatItalic, FormatUnderlined, Link } from '@material-ui/icons'
import React, { PropsWithChildren, Ref, useEffect, useRef } from 'react'
import { Editor, Range, Text, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { LinkInput } from './LinkInput'
import LinkManager from '../../../../../manager/Editing/Link/LinkManager'
import { Portal } from '../../../../utils/Portal'
import FormattingManager, { Format } from '../../../../../manager/Editing/FormattingManager'
import { LinkButton } from './LinkButton'
import EditorPage from '../../../../../manager/Blog/Editor/EditorPage'

interface BaseProps {
    className: string
    [key: string]: unknown
  }
  type OrNull<T> = T | null

export const Button = React.forwardRef(
    (
        {
            className,
            active,
            reversed,
            ...props
        }: PropsWithChildren<
        {
          active: boolean
          reversed: boolean
        } & BaseProps
      >,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
            cursor: pointer;
          `
            )}
        />
    )
)

export const Icon = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLSpanElement>>
    ) => (
        <span
            {...props}
            ref={ref}
            className={cx(
                'material-icons',
                className,
                css`
            font-size: 18px;
            vertical-align: text-bottom;
          `
            )}
        />
    )
)

export const Menu = React.forwardRef(
    (
        { className, ...props }: PropsWithChildren<BaseProps>,
        ref: Ref<OrNull<HTMLDivElement>>
    ) => (
        <div
            {...props}
            ref={ref}
            className={cx(
                className,
                css`
            & > * {
              display: inline-block;
            }
  
            & > * + * {
              margin-left: 15px;
            }
          `
            )}
        />
    )
)

const FormatButton: React.FC<{
    format: Format
    icon: JSX.Element
}> = ({ format, icon }) => {
    const isActive = FormattingManager.formatActiveMap.get(format)
    return (
        <div
            className={'button' + (isActive ? '' : ' inactive')}
            onClick={event => {
                event.preventDefault()
                event.stopPropagation()
                FormattingManager.toggleFormat(format)
            }}
        >
            {icon}
        </div>
    )
}

export const HoveringToolbar: React.FC<{
}> = () => {
    const ref = useRef<HTMLDivElement | null>(null)
    const editor = useSlate()
    let selectionRect = null
    useEffect(() => {
        const el = ref.current
        const { selection } = editor
        if (!el) {
            return
        }

        if (
            !EditorPage.editor ||
            !EditorPage.editor.editable ||
            !selection ||
          Range.isCollapsed(selection) ||
          Editor.string(editor, selection) === ''
        ) {
            el.removeAttribute('style')
            return
        }
        // 한 줄이 아닌 경우 return
        if (selection.anchor.path[0] !== selection.focus.path[0]) {
            el.removeAttribute('style')
            return
        }

        // const node = Node.get(editor, selection.anchor.path)
        // if (node.type === 'link') {

        // }

        if (!LinkManager.hoveringToolbar.isShowLinkInput) {
            const domSelection = window.getSelection()
            const domRange = domSelection.getRangeAt(0)
            selectionRect = domRange.getBoundingClientRect()
            el.style.opacity = '1'
            el.style.top = `${selectionRect.top + window.pageYOffset - el.offsetHeight}px`
            el.style.left = `${selectionRect.left +
            window.pageXOffset -
            el.offsetWidth / 2 +
            selectionRect.width / 2}px`
            LinkManager.hoveringToolbar.selectionRect = selectionRect
        }
    })

    return (
        <Portal>
            <Menu
                ref={ref}
                className='hovering-toolbar'
            >
                <FormatButton format={Format.Bold} icon={<FormatBold/>} />
                <FormatButton format={Format.Italic} icon={<FormatItalic/>} />
                <FormatButton format={Format.Underline} icon={<FormatUnderlined/>} />
                <div className={'divider'}></div>
                <LinkButton />
            </Menu>
            <LinkInput />
        </Portal>
    )
}
