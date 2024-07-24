import { FC } from 'react';
import { useFriends } from '../../../../../hooks';
import { FriendsListRequestItemView } from './FriendsListRequestItemView';

export const FriendsListRequestView: FC<{}> = props =>
{
    const { requests = [], requestResponse = null } = useFriends();

    if(!requests.length) return null;

    return (
        <div>
            { requests.map((request, index) => <FriendsListRequestItemView key={ index } request={ request } />) }
        </div>
    );
}
