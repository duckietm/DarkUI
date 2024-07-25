import { FC, MouseEvent, useState } from 'react';
import { GetUserProfile, LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../../api';
import { Text } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

interface FriendsListGroupItemOfflineViewProps {
    friend: MessengerFriend;
    selected: boolean;
    selectFriend: (userId: number) => void;
}

export const FriendsListGroupItemOfflineView: FC<FriendsListGroupItemOfflineViewProps> = ({ friend, selected, selectFriend }) =>
{
    const [isRelationshipOpen, setIsRelationshipOpen] = useState<boolean>(false);
    const { followFriend, updateRelationship } = useFriends();

    const clickFollowFriend = (event: MouseEvent<HTMLButtonElement>) =>
    {
        event.stopPropagation();
        followFriend(friend);
    }

    const openMessengerChat = (event: MouseEvent<HTMLButtonElement>) =>
    {
        event.stopPropagation();
        OpenMessengerChat(friend.id);
    }

    const openRelationship = (event: MouseEvent<HTMLButtonElement>) =>
    {
        event.stopPropagation();
        setIsRelationshipOpen(true);
    }

    const clickUpdateRelationship = (event: MouseEvent<HTMLButtonElement>, type: number) =>
    {
        event.stopPropagation();
        updateRelationship(friend, type);
        setIsRelationshipOpen(false);
    }

    const getCurrentRelationshipName = () =>
    {
        switch (friend.relationshipStatus)
        {
            case MessengerFriend.RELATIONSHIP_HEART: return 'heart';
            case MessengerFriend.RELATIONSHIP_SMILE: return 'smile';
            case MessengerFriend.RELATIONSHIP_BOBBA: return 'bobba';
            default: return 'none';
        }
    }

    if (friend.online) return null;

    return (
        <>
            <div 
                className={`row gx-0 mt-1 ${selected ? 'bg-primary text-white' : 'friendlist-element'}`} 
                style={{ padding: '20px', position: 'relative' }} 
                onClick={() => selectFriend(friend.id)}
            >
                <div className='col-md-6'>
                    <div className='row'>
                        <div className='col-md-2'>
                            <Text variant="white" fontSize={4} bold>{friend.name}</Text>
                        </div>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div style={{ float: 'right', marginTop: '13px' }}>
                        <button 
                            className='btn btn-sm btn-muted' 
                            onClick={(e) => { e.stopPropagation(); GetUserProfile(friend.id); }} 
                            style={{ fontSize: '12px' }}
                        >
                            {LocalizeText('friendbar.request.profile')}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
