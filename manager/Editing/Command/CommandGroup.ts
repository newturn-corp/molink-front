import Command from './Command'
import { reaction } from 'mobx'
import LanguageManager from '../../global/LanguageManager'

class CommandGroup {
    name: string
    commands: Command[]

    constructor (nameKey: string, commands: Command[]) {
        this.name = nameKey
        this.commands = commands

        reaction(() => LanguageManager.languageMap[nameKey], () => {
            this.name = LanguageManager.languageMap[nameKey]
        })
    }

    search (text: string) {
        return new CommandGroup(
            this.name,
            this.commands.filter((command) => {
                return command.name.startsWith(text.toLowerCase())
            })
        )
    }
}
export default CommandGroup
