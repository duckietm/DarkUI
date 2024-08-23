import { FC, useMemo } from 'react';
import { GetConfiguration } from '../../api';
import { BaseProps } from '../Base';

export interface LayoutRoomThumbnailViewProps extends BaseProps<HTMLDivElement> {
    roomId?: number;
    customUrl?: string;
}

export const LayoutRoomSmallThumbnailView: FC<LayoutRoomThumbnailViewProps> = props => {
    const { roomId = -1, customUrl = null, shrink = true, overflow = 'hidden', classNames = [], children = null, ...rest } = props;

    const getImageUrl = useMemo(() => {
        if(customUrl && customUrl.length) {
            return (GetConfiguration<string>('image.library.url') + customUrl);
        }

        return (GetConfiguration<string>('thumbnails.url').replace('%thumbnail%', roomId.toString()));
    }, [ customUrl, roomId ]);

    return (
        <>
            { getImageUrl && (
                <img 
                    style={{ height: "60px", width: "60px", borderRadius: "7px" }} 
                    src={ getImageUrl } 
                    onError={({ currentTarget }) => {
                        currentTarget.onerror = null;
                        currentTarget.className = 'room-thumbnail';
                    }} 
                />
            )}
        </>
    );
}