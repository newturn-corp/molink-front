import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

import { CustomElement } from './CustomElement'
import { CustomText } from './CustomText'

declare module 'slate' {
    interface CustomTypes {
      Editor: BaseEditor & ReactEditor & HistoryEditor
      Element: CustomElement
      Text: CustomText
    }
}
