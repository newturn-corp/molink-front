import { observer } from 'mobx-react'
import React from 'react'
import { Skeleton } from '@material-ui/lab'

const ParagraphSkeleton = () => {
    return <Skeleton
        animation={'wave'}
        variant={'rect'}
        width={'100%'}
        height={30}
        style={{
            marginBottom: 10,
            borderRadius: 3
        }}
    />
}

const TagSkeleton = () => {
    return <Skeleton
        animation={'wave'}
        variant={'rect'}
        width={80}
        height={30}
        style={{
            marginBottom: 40,
            borderRadius: 3,
            marginRight: 10
        }}
    />
}

export const EditorPageSkeleton: React.FC<{
}> = observer(() => {
    return <>
        <Skeleton
            animation={'wave'}
            variant={'rect'}
            className={'header-icon'}
            style={{
                borderRadius: 8
            }}
            // width={90}
            // height={90}
        />
        <Skeleton
            animation={'wave'}
            variant={'rect'}
            width={400}
            height={60}
            style={{
                marginBottom: 20,
                borderRadius: 5
            }}
        />
        <div
            style={{
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <TagSkeleton/>
            <TagSkeleton/>
            <TagSkeleton/>
            <TagSkeleton/>
        </div>
        <ParagraphSkeleton/>
        <ParagraphSkeleton/>
        <ParagraphSkeleton/>
        <ParagraphSkeleton/>
    </>
})
