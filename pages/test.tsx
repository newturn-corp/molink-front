import React, { useEffect, useState } from 'react'

import { observer } from 'mobx-react'
import axios from 'axios'
import mainAPI from '../api/mainAPI'
import { AnalyzeLinkResponseDTO } from '@newturn-develop/types-molink'
import RoutingManager from '../manager/global/RoutingManager'

const data = [
]

const Test = observer(() => {
    return <div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: 152,
                width: 900
            }}
        >
            <img
                style={{
                    width: 256
                }}
                src={'https://2.bp.blogspot.com/-ZXMgVTTpXXs/XLlEgJWAoMI/AAAAAAADiq4/ByMh00IcN6E3nvQPmBBaDK0n-Vmrh7f2ACLcBGAs/s640/%25EC%259D%25B4%25EB%25AF%25B8%25EC%25A7%2580%2B1.png'}
            />
            <div
                style={{
                    padding: '0px 21px',
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 'auto 0'
                }}
            >
                <div
                    style={{
                        fontFamily: 'Pretendard',
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 8,
                        lineHeight: '20px'
                    }}
                >{'테스트 제목'}</div>
                <div
                    style={{
                        fontFamily: 'Pretendard',
                        fontSize: 12,
                        color: '#9DA7B0',
                        marginBottom: 8
                    }}
                >{'2022.04.24'}</div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: 20,
                        marginBottom: 8
                    }}
                >
                    <img
                        src={'https://2.bp.blogspot.com/-ZXMgVTTpXXs/XLlEgJWAoMI/AAAAAAADiq4/ByMh00IcN6E3nvQPmBBaDK0n-Vmrh7f2ACLcBGAs/s640/%25EC%259D%25B4%25EB%25AF%25B8%25EC%25A7%2580%2B1.png'}
                        width={20}
                        style={{
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    />
                    <div
                        style={{
                            fontFamily: 'Pretendard',
                            fontSize: 14,
                            lineHeight: '16px',
                            fontWeight: 400
                        }}
                    >후성</div>
                </div>
                <div
                    style={{
                        fontFamily: 'Pretendard',
                        fontSize: 14
                    }}
                >{'애플이 아닌이 이상 , 일할 때 항상 8~90%를 추구하는게 좋다.  일할 때 항상 8~90%를 추구하는게 좋다 Photo by Marc Sendr...'}</div>
            </div>
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                height: 152,
                width: 900
            }}
        >
            <div
                style={{
                    backgroundColor: '#99a9c7',
                    display: 'flex',
                    justifyContent: 'center',
                    width: 256
                }}
            >
                <div
                    style={{
                        margin: 'auto auto',
                        fontSize: 25,
                        fontFamily: 'Pretendard'
                    }}
                >아아아</div>
            </div>
            <div
                style={{
                    padding: '0px 21px',
                    display: 'flex',
                    flexDirection: 'column',
                    margin: 'auto 0'
                }}
            >
                <div
                    style={{
                        fontFamily: 'Pretendard',
                        fontSize: 18,
                        fontWeight: 600,
                        marginBottom: 8,
                        lineHeight: '20px'
                    }}
                >{'테스트 제목'}</div>
                <div
                    style={{
                        fontFamily: 'Pretendard',
                        fontSize: 12,
                        color: '#9DA7B0',
                        marginBottom: 8
                    }}
                >{'2022.04.24'}</div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        height: 20,
                        marginBottom: 8
                    }}
                >
                    <img
                        src={'https://2.bp.blogspot.com/-ZXMgVTTpXXs/XLlEgJWAoMI/AAAAAAADiq4/ByMh00IcN6E3nvQPmBBaDK0n-Vmrh7f2ACLcBGAs/s640/%25EC%259D%25B4%25EB%25AF%25B8%25EC%25A7%2580%2B1.png'}
                        width={20}
                        style={{
                            marginRight: 4,
                            borderRadius: 10
                        }}
                    />
                    <div
                        style={{
                            fontFamily: 'Pretendard',
                            fontSize: 14,
                            lineHeight: '16px',
                            fontWeight: 400
                        }}
                    >후성</div>
                </div>
                <div
                    style={{
                        fontFamily: 'Pretendard',
                        fontSize: 14
                    }}
                >{'애플이 아닌이 이상 , 일할 때 항상 8~90%를 추구하는게 좋다.  일할 때 항상 8~90%를 추구하는게 좋다 Photo by Marc Sendr...'}</div>
            </div>
        </div>
    </div>
})

export default Test
