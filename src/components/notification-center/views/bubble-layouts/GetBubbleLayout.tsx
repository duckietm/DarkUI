import React from 'react';
import { NotificationBubbleItem, NotificationBubbleType } from '../../../../api';
import { NotificationClubGiftBubbleView } from './NotificationClubGiftBubbleView';
import { NotificationDefaultBubbleView } from './NotificationDefaultBubbleView';

export const GetBubbleLayout = (item: NotificationBubbleItem, onClose: () => void) => {

    if (!item) return null;

    const { id, notificationType, ...rest } = item;
    const props = { item: rest, onClose };

    switch (notificationType) {
        case NotificationBubbleType.CLUBGIFT:
            return <NotificationClubGiftBubbleView key={id} {...props} />;
        default:
            return <NotificationDefaultBubbleView key={id} {...props} />;
    }
};