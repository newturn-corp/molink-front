import { cx, css } from '@emotion/css'
import { IconButton, SvgIconTypeMap } from '@material-ui/core'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import { FormatBold, FormatItalic, FormatUnderlined, Link } from '@material-ui/icons'
import React, { useRef, PropsWithChildren, Ref, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Editor, Node, Range, Text, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import HoveringToolbarManager from '../../manager/HoveringToolbarManager'
import LinkManager from '../../manager/LinkManager'
import { Portal } from '../utils/Portal'
import { LinkInput } from './LinkInput'
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

const isFormatActive = (editor, format) => {
    try {
        const [match] = Editor.nodes(editor, {
            match: n => n[format] === true,
            mode: 'all'
        })
        return !!match
    } finally {
        // eslint-disable-next-line no-unsafe-finally
        return false
    }
}

const toggleFormat = (editor, format) => {
    const isActive = isFormatActive(editor, format)
    Transforms.setNodes(
        editor,
        { [format]: isActive ? null : true },
        { match: Text.isText, split: true }
    )
}

const FormatButton: React.FC<{
    format: string
    icon: JSX.Element
}> = ({ format, icon }) => {
    const editor = useSlate()
    const isActive = isFormatActive(editor, format)
    return (
        <div
            className={'button' + (isActive ? '' : ' inactive')}
            onClick={event => {
                event.preventDefault()
                toggleFormat(editor, format)
            }}
        >
            {icon}
        </div>
    )
}

const LinkButton: React.FC<{
}> = () => {
    const editor = useSlate()
    return (
        <div
            className={'link-button'}
            onClick={event => {
                event.preventDefault()
                LinkManager.showLinkInput(editor.selection)
            }}
        >
            <Link/>
            <span className='text'>링크</span>
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
            !selection ||
          !ReactEditor.isFocused(editor) ||
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

        const domSelection = window.getSelection()
        const domRange = domSelection.getRangeAt(0)
        selectionRect = domRange.getBoundingClientRect()
        el.style.opacity = '1'
        el.style.top = `${selectionRect.top + window.pageYOffset - el.offsetHeight}px`
        el.style.left = `${selectionRect.left +
          window.pageXOffset -
          el.offsetWidth / 2 +
          selectionRect.width / 2}px`
        LinkManager.selectionRect = selectionRect
    })

    return (
        <Portal>
            <Menu
                ref={ref}
                className='hovering-toolbar'
            >
                <FormatButton format="bold" icon={<FormatBold/>} />
                <FormatButton format="italic" icon={<FormatItalic/>} />
                <FormatButton format="underlined" icon={<FormatUnderlined/>} />
                <div className={'divider'}></div>
                <LinkButton />
            </Menu>
            <LinkInput />
        </Portal>
    )
}
