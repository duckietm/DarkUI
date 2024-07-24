import { FC, MouseEvent, useState } from 'react';
import { GetUserProfile, MessengerFriend, OpenMessengerChat } from '../../../../../api';
import { Text } from '../../../../../common';
import { useFriends } from '../../../../../hooks';

export const FriendsListGroupItemView: FC<{ friend: MessengerFriend, selected: boolean, selectFriend: (userId: number) => void }> = props =>
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
    if (!friend.online) return null;

    return (
        <div style={{ padding: "20px", position: "relative" }} className={`row gx-0 mt-1 ${selected ? 'bg-primary text-white' : 'friendlist-element'}`} onClick={event => selectFriend(friend.id)}>
            <div className='col-md-6'>
                <div className='row'>
                    <div className='col-md-3'>
                        <div onClick={event => GetUserProfile(friend.id)}>
                            <div className="nitro-chat-avatar-card">
                                <img className="nitro-chat-avatar-image" src={`https://imager.bobba.chat/?figure=${friend.figure}&direction=4&head_direction=4&headonly=1`} />
                            </div>
                        </div>
                    </div>
                    <div className='col-md-9'>
                        <Text variant="white" bold>{friend.name}</Text>
                        <div style={{ marginTop: "-6px" }}>
                            <Text variant="white">{friend.motto}</Text>
                        </div>
                        <div style={{ marginTop: "-6px" }}>
                            <Text variant={selected ? 'white' : 'muted'} underline>Hotel view</Text>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-md-6'>
                {!isRelationshipOpen &&
                    <>
                        <div style={{ float: "right", marginTop: "13px" }}>
                            <button className='btn btn-sm btn-muted' onClick={(e) => { e.stopPropagation(); GetUserProfile(friend.id); }} style={{ fontSize: "12px" }}>Perfil</button>&nbsp;
                            {friend.followingAllowed && <>
                                <button className='btn btn-sm btn-muted' onClick={clickFollowFriend} style={{ fontSize: "12px" }}>Seguir</button>&nbsp;
                            </>}
                            <button className='btn btn-sm btn-muted' onClick={openMessengerChat} style={{ fontSize: "12px" }}>Chatear</button>&nbsp;
                            {friend.id > 0 && <>
                                <button className='btn btn-sm btn-muted' onClick={openRelationship} style={{ fontSize: "12px" }}>Estado</button>&nbsp;
                            </>}
                        </div>
                    </>
                }
                {isRelationshipOpen &&
                    <>
                        <div style={{ float: "right", marginTop: "13px" }}>
                            <button className={`btn btn-sm ${getCurrentRelationshipName() === "heart" ? "btn-dark" : "btn-muted"}`} onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_HEART)} style={{ fontSize: "12px" }}>Heart</button>&nbsp;
                            <button className={`btn btn-sm ${getCurrentRelationshipName() === "smile" ? "btn-dark" : "btn-muted"}`} onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE)} style={{ fontSize: "12px" }}>Smile</button>&nbsp;
                            <button className={`btn btn-sm ${getCurrentRelationshipName() === "bobba" ? "btn-dark" : "btn-muted"}`} onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA)} style={{ fontSize: "12px" }}>Bobba</button>&nbsp;
                            <button className={`btn btn-sm ${getCurrentRelationshipName() === "none" ? "btn-dark" : "btn-muted"}`} onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_NONE)} style={{ fontSize: "12px" }}>None</button>&nbsp;
                        </div>
                    </>
                }
                {/*
                {!isRelationshipOpen &&
                    <>
                    { friend.followingAllowed &&
                        <Base style={{display: "inline-block"}} pointer onClick={ clickFollowFriend } className="nitro-friends-spritesheet icon-follow" title={ LocalizeText('friendlist.tip.follow') } /> }
                    { friend.online &&
                        <Base style={{display: "inline-block"}} pointer className="nitro-friends-spritesheet icon-chat" onClick={ openMessengerChat } title={ LocalizeText('friendlist.tip.im') } /> }
                    { (friend.id > 0) &&
                        <Base style={{display: "inline-block"}} className={ `nitro-friends-spritesheet icon-${ getCurrentRelationshipName() } cursor-pointer` } onClick={ openRelationship } title={ LocalizeText('infostand.link.relationship') } /> }
                </>}
                {isRelationshipOpen &&
                    <div style={{ marginTop: "6px" }}>
                        <Base style={{ display: "inline-block" }} pointer className="nitro-friends-spritesheet icon-heart" onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_HEART)} />
                        <Base style={{ display: "inline-block", marginLeft: "5px" }} pointer className="nitro-friends-spritesheet icon-smile" onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_SMILE)} />
                        <Base style={{ display: "inline-block", marginLeft: "5px" }} pointer className="nitro-friends-spritesheet icon-bobba" onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_BOBBA)} />
                        <Base style={{ display: "inline-block", marginLeft: "5px" }} pointer className="nitro-friends-spritesheet icon-none" onClick={event => clickUpdateRelationship(event, MessengerFriend.RELATIONSHIP_NONE)} />
                    </div>}
                     */}
            </div>
        </div>
    );
}
