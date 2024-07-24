import { FC, MouseEvent, useState } from 'react';
import { GetUserProfile, MessengerFriend, OpenMessengerChat } from '../../../../../api';
import { Text } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

export const FriendsListGroupItemOfflineView: FC<{ friend: MessengerFriend, selected: boolean, selectFriend: (userId: number) => void }> = props =>
{
    const { friend = null, selected = false, selectFriend = null } = props;
    const [isRelationshipOpen, setIsRelationshipOpen] = useState<boolean>(false);
    const { followFriend = null, updateRelationship = null } = useFriends();

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
        if (!friend) return 'none';

        switch (friend.relationshipStatus)
        {
            case MessengerFriend.RELATIONSHIP_HEART: return 'heart';
            case MessengerFriend.RELATIONSHIP_SMILE: return 'smile';
            case MessengerFriend.RELATIONSHIP_BOBBA: return 'bobba';
            default: return 'none';
        }
    }

    if (!friend) return null;
    if (friend.online) return null;

    return (
        <div style={{ padding: "20px", position: "relative" }} className={`row gx-0 mt-1 ${selected ? 'bg-primary text-white' : 'friendlist-element'}`} onClick={event => selectFriend(friend.id)}>
            <div className='col-md-6'>
                <div className='row'>
                    <div className='col-md-3'>
                        <div onClick={event => GetUserProfile(friend.id)}>
                            <div className="nitro-chat-avatar-card">
                                <img className="nitro-chat-avatar-image" src={`https://imager.bobba.chat/?figure=no&direction=4&head_direction=4&headonly=1`} />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-9'>
                        <div style={{marginTop: "14px"}}>
                            <Text variant="white" bold>{friend.name}</Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                <div style={{ float: "right", marginTop: "13px" }}>
                    <button className='btn btn-sm btn-muted' onClick={(e) => { e.stopPropagation(); GetUserProfile(friend.id); }} style={{ fontSize: "12px" }}>Perfil</button>
                </div>
            </div>
        </div>
    );
}
