import React, { useCallback, useRef, useState } from 'react'
import EditorManager from '../../../manager/Blog/EditorManager'
import { observer } from 'mobx-react'
import { AvailCodeLanguage, CodeElement } from '../../../Types/slate/CustomElement'
import { Text, Transforms } from 'slate'
import MenuManager from '../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../manager/global/Menu/MenuItem'
import { ReactEditor, useSlate } from 'slate-react'

const availLanguages = [AvailCodeLanguage.Javascript, AvailCodeLanguage.Python, AvailCodeLanguage.HTML, AvailCodeLanguage.JAVA, AvailCodeLanguage.PHP, AvailCodeLanguage.SQL]

export const SlateCodeElement: React.FC<{
    attributes,
    children,
    element: CodeElement
}> = observer(({
    attributes,
    children,
    element
}) => {
    const editor = useSlate()
    const changeLanguageButtonRef = useRef(null)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const currentNodePath = useCallback(() => (
        ReactEditor.findPath(EditorManager.slateEditor, element)
    ), [EditorManager.slateEditor, element])
    const changeLanguage = useCallback((language: AvailCodeLanguage) => {
        Transforms.setNodes(editor, {
            language
        }, {
            at: currentNodePath()
        })
        Transforms.setNodes(editor, {
            codeLanguage: language
        }, {
            at: currentNodePath(),
            match: node => Text.isText(node)
        })
    }, [editor])

    return (
        <p
            className='code'
            spellCheck='false'
            onMouseOver={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
            {...attributes}
        >
            <div
                ref={changeLanguageButtonRef}
                className={'change-language-button'}
                style={{
                    color: (EditorManager.editable && isMouseOver) ? undefined : '#00000000'
                }}
                contentEditable={false}
                onClick={(event) => {
                    event.stopPropagation()
                    const rect = changeLanguageButtonRef.current.getBoundingClientRect()
                    MenuManager.open([
                        new MenuItem(element.language, () => {
                            changeLanguage(element.language)
                        }),
                        ...(availLanguages.filter(language => language !== element.language).map(language => new MenuItem(language, () => {
                            changeLanguage(language)
                        })))
                    ], {
                        top: rect.top + (rect.height / 2),
                        left: rect.left + (rect.width / 2)
                    }, true)
                }}
            >
                {element.language}
            </div>
            <div
                className={'code-content'}
            >
                {children}
            </div>
        </p>
    )
})
