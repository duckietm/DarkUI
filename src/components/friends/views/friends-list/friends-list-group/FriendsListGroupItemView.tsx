import { FC, MouseEvent, useState, useCallback } from 'react';
import { GetUserProfile, LocalizeText, MessengerFriend, OpenMessengerChat } from '../../../../../api';
import { LayoutAvatarImageView, Text } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

interface FriendsListGroupItemViewProps {
    friend: MessengerFriend;
    selected: boolean;
    selectFriend: (userId: number) => void;
}

export const FriendsListGroupItemView: FC<FriendsListGroupItemViewProps> = ({ friend, selected, selectFriend }) => {
    const [isRelationshipOpen, setIsRelationshipOpen] = useState<boolean>(false);
    const { followFriend, updateRelationship } = useFriends();

    const handleFollowFriend = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        followFriend(friend);
    }, [friend, followFriend]);

    const handleOpenMessengerChat = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        OpenMessengerChat(friend.id);
    }, [friend.id]);

    const handleOpenRelationship = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setIsRelationshipOpen(true);
    }, []);

    const handleUpdateRelationship = useCallback((event: MouseEvent<HTMLButtonElement>, type: number) => {
        event.stopPropagation();
        updateRelationship(friend, type);
        setIsRelationshipOpen(false);
    }, [friend, updateRelationship]);

    const getCurrentRelationshipName = () => {
        switch (friend.relationshipStatus) {
            case MessengerFriend.RELATIONSHIP_HEART: return 'heart';
            case MessengerFriend.RELATIONSHIP_SMILE: return 'smile';
            case MessengerFriend.RELATIONSHIP_BOBBA: return 'bobba';
            default: return 'none';
        }
    };

    if (!friend || !friend.online) return null;

    return (
        <div style={{ padding: "20px", position: "relative" }} className={`row gx-0 mt-1 ${selected ? 'bg-primary text-white' : 'friendlist-element'}`} onClick={() => selectFriend(friend.id)}>
            <div className='col-md-6'>
                <div className='row'>
                    <div className='col-md-3' onClick={() => GetUserProfile(friend.id)}>
                        <div className="nitro-chat-avatar-card-online">
                            {friend.id > 0 ? (
                                <LayoutAvatarImageView className="nitro-chat-avatar-image" headOnly={true} figure={friend.figure} direction={4} />
                            ) : (
                                <LayoutAvatarImageView className="nitro-chat-avatar-image" headOnly={true} figure={friend.figure === 'ADM' ? 'ha-3409-1413-70.lg-285-89.ch-3032-1334-109.sh-3016-110.hd-185-1359.ca-3225-110-62.wa-3264-62-62.fa-1206-90.hr-3322-1403' : friend.figure} isgroup={1} direction={3} />
                            )}
                        </div>
                    </div>
                    <div className='col-md-9'>
                        <Text variant="white" bold>{friend.name}</Text>
                        <div style={{ marginTop: "-6px" }}>
                            <Text variant="white">{friend.motto}</Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                {!isRelationshipOpen ? (
                    <div style={{ float: "right", marginTop: "13px" }}>
                        {friend.id >= 0 && (
                            <button className='btn btn-sm btn-muted' onClick={(e) => { e.stopPropagation(); GetUserProfile(friend.id); }} style={{ fontSize: "12px" }}>{LocalizeText('friendbar.request.profile')}</button>
                        )}
                        {friend.followingAllowed && (
                            <button className='btn btn-sm btn-muted m-1' onClick={handleFollowFriend} style={{ fontSize: "12px" }}>{LocalizeText('friendlist.follow')}</button>
                        )}
                        <button className='btn btn-sm btn-muted m-1' onClick={handleOpenMessengerChat} style={{ fontSize: "12px" }}>{LocalizeText('friend.bar.message')}</button>
                        {friend.id > 0 && (
                            <button className='btn btn-sm btn-muted' onClick={handleOpenRelationship} style={{ fontSize: "12px" }}>{LocalizeText('friendlist.tip.relationship')}</button>
                        )}
                    </div>
                ) : (
                    <div style={{ float: "right", marginTop: "13px" }}>
                        <button className={`btn btn-sm ${getCurrentRelationshipName() === "heart" ? "btn-dark" : "btn-muted"} m-1`} onClick={(e) => handleUpdateRelationship(e, MessengerFriend.RELATIONSHIP_HEART)} style={{ fontSize: "12px" }}>Heart</button>
                        <button className={`btn btn-sm ${getCurrentRelationshipName() === "smile" ? "btn-dark" : "btn-muted"} m-1`} onClick={(e) => handleUpdateRelationship(e, MessengerFriend.RELATIONSHIP_SMILE)} style={{ fontSize: "12px" }}>Smile</button>
                        <button className={`btn btn-sm ${getCurrentRelationshipName() === "bobba" ? "btn-dark" : "btn-muted"} m-1`} onClick={(e) => handleUpdateRelationship(e, MessengerFriend.RELATIONSHIP_BOBBA)} style={{ fontSize: "12px" }}>Bobba</button>
                        <button className={`btn btn-sm ${getCurrentRelationshipName() === "none" ? "btn-dark" : "btn-muted"} m-1`} onClick={(e) => handleUpdateRelationship(e, MessengerFriend.RELATIONSHIP_NONE)} style={{ fontSize: "12px" }}>None</button>
                    </div>
                )}
            </div>
        </div>
    );
}
