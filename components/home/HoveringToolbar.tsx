import { cx, css } from '@emotion/css'
import { IconButton, SvgIconTypeMap } from '@material-ui/core'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import { FormatBold, FormatItalic, FormatUnderlined } from '@material-ui/icons'
import React, { useRef, PropsWithChildren, Ref, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Editor, Range, Text, Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

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
            color: ${reversed
            ? active
                ? 'white'
                : '#aaa'
            : active
                ? 'black'
                : '#ccc'};
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

export const Portal = ({ children }) => {
    return typeof document === 'object'
        ? ReactDOM.createPortal(children, document.body)
        : null
}

const isFormatActive = (editor, format) => {
    const [match] = Editor.nodes(editor, {
        match: n => n[format] === true,
        mode: 'all'
    })
    return !!match
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
    return (
        <Button
            className='button'
            reversed
            active={isFormatActive(editor, format)}
            onMouseDown={event => {
                event.preventDefault()
                toggleFormat(editor, format)
            }}
        >
            {icon}
        </Button>
    )
}

export const HoveringToolbar: React.FC<{
}> = () => {
    const ref = useRef<HTMLDivElement | null>(null)
    const editor = useSlate()
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
        const domSelection = window.getSelection()
        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()
        el.style.opacity = '1'
        el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
        el.style.left = `${rect.left +
          window.pageXOffset -
          el.offsetWidth / 2 +
          rect.width / 2}px`
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
            </Menu>
        </Portal>
    )
}
