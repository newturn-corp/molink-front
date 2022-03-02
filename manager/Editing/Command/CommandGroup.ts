import Command from './Command'

class CommandGroup {
    name: string
    commands: Command[]

    constructor (name: string, commands: Command[]) {
        this.name = name
        this.commands = commands
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
