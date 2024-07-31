import { NotificationAlertItem, NotificationAlertType } from '../../../../api';
import { NitroSystemAlertView } from './NitroSystemAlertView';
import { NotificationDefaultAlertView } from './NotificationDefaultAlertView';
import { NotificationSeachAlertView } from './NotificationSearchAlertView';

export const GetAlertLayout = (item: NotificationAlertItem, onClose: () => void) =>
{
    if(!item) return null;

    const props = { item, onClose };

    switch(item.alertType)
    {
        case NotificationAlertType.NITRO:
            return <NitroSystemAlertView key={item.id} { ...props } />
        case NotificationAlertType.SEARCH:
            return <NotificationSeachAlertView key={item.id} { ...props } />
        default:
            return <NotificationDefaultAlertView key={item.id} { ...props } />
    }
}
