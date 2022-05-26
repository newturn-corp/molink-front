import { Element } from 'slate'
import { ListOptions } from '../../ListPlugin'

export const isList = (node: Node): boolean => Element.isElement(node) && ListOptions.types.includes(node.type)
