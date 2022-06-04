import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

import { CustomElement } from './CustomElement'
import { CustomText } from './CustomText'
import { YjsEditor } from 'slate-yjs'

declare module 'slate' {
    interface CustomTypes {
      Editor: BaseEditor & ReactEditor & HistoryEditor & YjsEditor
      Element: CustomElement
      Text: CustomText
    }
}
