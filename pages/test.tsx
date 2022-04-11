import React, { useEffect, useState } from 'react'

import { observer } from 'mobx-react'
import axios from 'axios'
import mainAPI from '../api/mainAPI'
import { AnalyzeLinkResponseDTO } from '@newturn-develop/types-molink'
import RoutingManager from '../manager/global/RoutingManager'

const parseHtml = (html: string) => {
    const metaTagOGRegex = /<meta[^>]*(?:property=[ '"]*og:([^'"]*))?[^>]*(?:content=["]([^"]*)["])?[^>]*>/gi
    const matches = html.match(metaTagOGRegex)
    const meta = {}

    if (matches) {
        const metaPropertyRegex = /<meta[^>]*property=[ "]*og:([^"]*)[^>]*>/i
        const metaContentRegex = /<meta[^>]*content=[ "]([^"]*)[^>]*>/i
        matches.forEach((m) => {
            const propertyMatch = metaPropertyRegex.exec(m)
            if (propertyMatch) {
                const property = metaPropertyRegex.exec(propertyMatch[0])
                const content = metaContentRegex.exec(propertyMatch[0])
                if (property && content) {
                    meta[property[1]] = content[1]
                }
            }
        })
    }
    return meta
}

const Test = observer(() => {
    const url = 'https://namu.wiki/w/%ED%8C%8C%EC%B9%9C%EC%BD%94(%EB%93%9C%EB%9D%BC%EB%A7%88)#s-7'
    const [info, setInfo] = useState<AnalyzeLinkResponseDTO>({})

    useEffect(() => {
        mainAPI.analyzeLink('https://namu.wiki/w/%ED%8C%8C%EC%B9%9C%EC%BD%94(%EB%93%9C%EB%9D%BC%EB%A7%88)#s-7')
            .then((dto) => setInfo(dto))
    }, [])

    return <>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                backgroundColor: 'white',
                borderRadius: 3,
                borderColor: '#999999',
                border: '1px solid #999999',
                margin: 5,
                height: 'min-content',
                overflow: 'auto',
                cursor: 'pointer'
            }}
            onClick={() => RoutingManager.rawMoveTo(url, true)}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '70%',
                    padding: '12px 24px 12px 16px',
                    fontSize: '15px',
                    lineHeight: '15px'
                }}
            >
                <div
                    style={{
                        marginBottom: 3,
                        userSelect: 'none'
                    }}
                >
                    {info.title}
                </div>
                {
                    info.description
                        ? <div
                            style={{
                                fontSize: '12px',
                                textOverflow: 'ellipsis',
                                overflowY: 'hidden',
                                lineHeight: '16px',
                                maxHeight: '32px',
                                color: '#999999',
                                marginBottom: '5px',
                                userSelect: 'none'
                            }}
                        >
                            {info.description}
                        </div>
                        : <></>
                }
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row'
                    }}
                >
                    {
                        info.iconURL
                            ? <img
                                src={info.iconURL}
                                style={{
                                    width: 16,
                                    height: 16,
                                    marginRight: 5
                                }}
                            />
                            : <></>
                    }
                    <div
                        style={{
                            lineHeight: '16px',
                            fontSize: '12px',
                            marginTop: info.description ? '0px' : '6px',
                            userSelect: 'none'
                        }}
                    >
                        {'https://www.npmjs.com/package/metadata-scraper'}
                    </div>
                </div>
            </div>
            {
                info.imageURL
                    ? <div
                        style={{
                            width: '30%',
                            position: 'relative',
                            maxHeight: '100%'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0
                            }}
                        >
                            <img
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block',
                                    borderRadius: 1
                                }}
                                src={info.imageURL}
                            ></img>
                        </div>
                    </div>
                    : <></>
            }
        </div>
    </>
})

export default Test
