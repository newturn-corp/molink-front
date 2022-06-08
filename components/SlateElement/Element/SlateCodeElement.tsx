import React, { useCallback, useRef, useState } from 'react'
import { observer } from 'mobx-react'
import { AvailCodeLanguage, CodeElement } from '../../../Types/slate/CustomElement'
import { Text, Transforms } from 'slate'
import MenuManager from '../../../manager/global/Menu/MenuManager'
import MenuItem from '../../../manager/global/Menu/MenuItem'
import { ReactEditor, useSlate } from 'slate-react'
import EditorPage from '../../../manager/Blog/Editor/EditorPage'
import { MediaMenuButton } from '../Extra/MediaMenuButton'

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
    const editor = EditorPage.editor
    const editable = editor.editable
    const slateEditor = useSlate()
    const changeLanguageButtonRef = useRef(null)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [isLanguageChangeButtonMouseOver, setIsLanguageChangeButtonMouseOver] = useState(false)
    const getCurrentNodePath = useCallback(() => (
        ReactEditor.findPath(slateEditor, element)
    ), [slateEditor, element])
    const changeLanguage = useCallback((language: AvailCodeLanguage) => {
        Transforms.setNodes(slateEditor, {
            language
        }, {
            at: getCurrentNodePath()
        })
        Transforms.setNodes(slateEditor, {
            codeLanguage: language
        }, {
            at: getCurrentNodePath(),
            match: node => Text.isText(node)
        })
    }, [slateEditor])

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
                    cursor: editor.editable && !editor.info.isLocked ? 'pointer' : 'default',
                    color: (editor.editable && !editor.info.isLocked && isMouseOver) ? undefined : '#00000000',
                    backgroundColor: (editor.editable && !editor.info.isLocked && isLanguageChangeButtonMouseOver) ? 'rgba(0, 0, 0, 0.05)' : undefined
                }}
                onMouseOver={() => setIsLanguageChangeButtonMouseOver(true)}
                onMouseLeave={() => setIsLanguageChangeButtonMouseOver(false)}
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
            {
                editable && <MediaMenuButton
                    isShow={isMouseOver}
                    menuItems={[new MenuItem('삭제', () => {
                        if (editable) {
                            Transforms.removeNodes(slateEditor, { at: getCurrentNodePath() })
                        }
                    })]}
                    currentNodePath={getCurrentNodePath()}
                />
            }
        </p>
    )
})
