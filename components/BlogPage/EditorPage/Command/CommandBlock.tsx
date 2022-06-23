import React, { useState } from 'react'
import Command from '../../../../manager/Editing/Command/Command'
import CommandManager from '../../../../manager/Editing/Command/CommandManager'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const CommandBlock: React.FC<{
    index: number,
    command: Command
}> = ({ index, command }) => {
    const className = (index === CommandManager.index ? 'command-block selected' : 'command-block') + ' ' + (command.className ? command.className : '')
    const [isMouseOver, setIsMouseOver] = useState(false)
    return <div
        id={`command-block-${index}`}
        key={`command-block-${command.name}`}
        className={className}
        onMouseOver={() => {
            if (!isMouseOver) {
                CommandManager.index = index
            }
            setIsMouseOver(true)
        }}
        onClick={(event) => {
            CommandManager.handleEnterAndTabAndClick(event, EditorPage.editor.slateEditor)
        }}
        onMouseLeave={() => setIsMouseOver(false)}
    >
        {
            command.imgType === 'img'
                ? <img
                    key={`command-block-img-${command.name}`}
                    className='command-img'
                    src={command.imgSrc as string}
                />
                : <div
                    className='command-img'
                >
                    {command.imgSrc}
                </div>
        }
        <div
            key={`command-block-text-container${command.name}`}
            className='text-container'
        >
            <p
                key={`command-block-name-${command.name}`}
                className='name'
            >
                {command.name}
            </p>
            <p
                key={`command-block-description-${command.name}`}
                className='description'
            >
                {command.description}
            </p>
        </div>
    </div>
}
