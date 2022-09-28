import React, { useState } from 'react'
import {
    useSelected,
    useFocused
} from 'slate-react'
import { css } from '@emotion/css'
import { SlateImageElementType } from '../../../../Types/slate/CustomElement'
import FileUploadManager from '../../../../manager/Editing/FileUploadManager'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import { Caption } from '../Caption'

const getImageSrc = (src: string, version) => {
    if (src && src.includes('https://cdn.filestackcontent.com')) {
        return src + `?policy=${FileUploadManager.policy}&signature=${FileUploadManager.signature}`
    } else if (src && src.includes('molink.life/files')) {
        return src + `?pageId=${EditorPage.pageId}&v=${version}`
    }
    return src
}

export const SlateReadonlyImageElement: React.FC<{
    attributes,
    children,
    element: SlateImageElementType
  }> = ({ attributes, children, element }) => {
      const selected = useSelected()
      const focused = useFocused()
      const [version, setVersion] = useState(1)

      return (
          <div
              className={'image-element'}
              {...attributes}
          >
              {children}
              {
                  !element.isUploading && <><img
                      draggable={false}
                      src={getImageSrc(element.url, version)}
                      onError={() => setTimeout(() => {
                          setVersion(version * (version + 1))
                      }, version * 50)}
                      className={css`
                            display: block;
                            width: 100%;
                            height: 100%;
                            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
                            `}
                  />
                  <Caption selected={false} caption={element.caption} floatOption={element.floatOption}/>
                  </>
              }
          </div>
      )
  }
