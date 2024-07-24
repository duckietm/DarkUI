import { FC } from 'react';
import { MessengerFriend } from '../../../../../api';
import { FriendsListGroupItemOfflineView } from './FriendsListGroupItemOfflineView';

interface FriendsListGroupViewProps
{
    list: MessengerFriend[];
    selectedFriendsIds: number[];
    selectFriend: (userId: number) => void;
}

export const FriendsListGroupOfflineView: FC<FriendsListGroupViewProps> = props =>
{
    const { list = null, selectedFriendsIds = null, selectFriend = null } = props;

    if(!list || !list.length) return null;

    return (
        <div>
            { list.map((item, index) => <FriendsListGroupItemOfflineView key={ index } friend={ item } selected={ selectedFriendsIds && (selectedFriendsIds.indexOf(item.id) >= 0) } selectFriend={ selectFriend } />) }
        </div>  
    );
}
