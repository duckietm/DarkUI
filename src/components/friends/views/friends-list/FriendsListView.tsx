import { ILinkEventTracker, RemoveFriendComposer, SendRoomInviteComposer } from '@nitrots/nitro-renderer';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { AddEventLinkTracker, LocalizeText, MessengerFriend, RemoveLinkEventTracker, SendMessageComposer } from '../../../../api';
import { Flex, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../../../common';
import { useFriends } from '../../../../hooks';
import { FriendsRemoveConfirmationView } from './FriendsListRemoveConfirmationView';
import { FriendsRoomInviteView } from './FriendsListRoomInviteView';
import { FriendsSearchView } from './FriendsListSearchView';
import { FriendsListGroupView } from './friends-list-group/FriendsListGroupView';
import { FriendsListGroupOfflineView } from './friends-list-group/FriendsListGroupViewOffline';
import { FriendsListRequestView } from './friends-list-request/FriendsListRequestView';

export const FriendsListView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [section, setSection] = useState("online");
    const [selectedFriendsIds, setSelectedFriendsIds] = useState<number[]>([]);
    const [showRoomInvite, setShowRoomInvite] = useState(false);
    const [showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation] = useState(false);
	
    const { onlineFriends = [], offlineFriends = [], requests = [], requestFriend = null, requestResponse = null } = useFriends();

    const removeFriendsText = useMemo(() =>
    {
        if (!selectedFriendsIds.length) return '';

        const userNames = selectedFriendsIds
            .map(userId => onlineFriends.find(f => f.id === userId) || offlineFriends.find(f => f.id === userId))
            .filter(friend => friend)
            .map(friend => friend.name);

        return LocalizeText('friendlist.removefriendconfirm.userlist', ['user_names'], [userNames.join(', ')]);
    }, [offlineFriends, onlineFriends, selectedFriendsIds]);

    const selectFriend = useCallback((userId: number) =>
    {
        if (userId < 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            const newValue = [...prevValue];
            const index = newValue.indexOf(userId);

            if (index > -1) newValue.splice(index, 1);
            else newValue.push(userId);

            return newValue;
        });
    }, []);

    const sendRoomInvite = useCallback((message: string) =>
    {
        if (!selectedFriendsIds.length || !message || message.length > 255) return;

        SendMessageComposer(new SendRoomInviteComposer(message, selectedFriendsIds));
        setShowRoomInvite(false);
    }, [selectedFriendsIds]);

    const removeSelectedFriends = useCallback(() =>
    {
        if (!selectedFriendsIds.length) return;

        SendMessageComposer(new RemoveFriendComposer(...selectedFriendsIds));
        setSelectedFriendsIds([]);
        setShowRemoveFriendsConfirmation(false);
    }, [selectedFriendsIds]);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const [prefix, command, id, name] = url.split('/');

                switch (command)
                {
                    case 'show':
                        setIsVisible(true);
                        break;
                    case 'hide':
                        setIsVisible(false);
                        break;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        break;
                    case 'request':
                        if (id && name) requestFriend(parseInt(id), name);
                        break;
                    default:
                        break;
                }
            },
            eventUrlPrefix: 'friends/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [requestFriend]);

    if (!isVisible) return null;

    const renderSection = () => {
        switch (section) {
            case 'online':
                return (
                    <div style={{ overflow: "auto" }}>
                        <div className="row mt-1 gx-1" style={{ marginLeft: "0px", marginRight: "0px", padding: "4px" }}>
                            <div className='col-md-6'>
                                <button 
                                    onClick={() => setShowRoomInvite(true)} 
                                    disabled={!selectedFriendsIds.length} 
                                    className='btn w-100' 
                                    style={{ backgroundColor: "var(--colors-secondary)" }}>
                                    {LocalizeText('friendlist.tip.invite')}
                                </button>
                            </div>
                            <div className='col-md-6'>
                                <button 
                                    onClick={() => setShowRemoveFriendsConfirmation(true)} 
                                    disabled={!selectedFriendsIds.length} 
                                    className='btn w-100 btn-danger'>
                                    {LocalizeText('friendlist.tip.remove')}
                                </button>
                            </div>
                        </div>
                        <FriendsListGroupView list={onlineFriends} selectedFriendsIds={selectedFriendsIds} selectFriend={selectFriend} />
                    </div>
                );
            case 'offline':
                return (
                    <div style={{ overflow: "auto" }}>
                        <div className="row mt-1 gx-1" style={{ marginLeft: "0px", marginRight: "0px", padding: "4px" }}>
                            <div className='col-md-12'>
                                <button 
                                    onClick={() => setShowRemoveFriendsConfirmation(true)} 
                                    disabled={!selectedFriendsIds.length} 
                                    className='btn w-100 btn-danger'>
                                    {LocalizeText('friendlist.tip.remove')}
                                </button>
                            </div>
                        </div>
                        <FriendsListGroupOfflineView list={offlineFriends} selectedFriendsIds={selectedFriendsIds} selectFriend={selectFriend} />
                    </div>
                );
            case 'requests':
                return (
                    <div style={{ overflow: "auto" }}>
                        <div className="row mt-1 gx-1" style={{ marginLeft: "0px", marginRight: "0px", padding: "4px" }}>
                            <div className='col-md-12'>
                                <button 
                                    disabled={!requests.length} 
                                    onClick={() => requestResponse(-1, false)} 
                                    className='btn w-100 btn-danger'>
                                    {LocalizeText('friendlist.tip.declineall')}
                                </button>
                            </div>
                        </div>
                        <FriendsListRequestView />
                    </div>
                );
            case 'search':
                return <FriendsSearchView headerText={LocalizeText('people.search.title')} />;
            default:
                return null;
        }
    };

    return (
        <>
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends">
                <NitroCardHeaderView headerText={LocalizeText('friendlist.friends')} onCloseClick={() => setIsVisible(false)} />
                <NitroCardTabsView>
                    {['online', 'offline', 'requests', 'search'].map(tab => (
                        <NitroCardTabsItemView key={tab} onClick={() => setSection(tab)} isActive={section === tab}>
                            <Flex gap={0} alignItems="center">
                                {LocalizeText(`friendlist.${tab}`)}
                            </Flex>
                        </NitroCardTabsItemView>
                    ))}
                </NitroCardTabsView>
                <NitroCardContentView overflow="hidden" gap={1} className="text-black p-0">
                    {renderSection()}
                </NitroCardContentView>
            </NitroCardView>
            {showRoomInvite && 
                <FriendsRoomInviteView 
                    selectedFriendsIds={selectedFriendsIds} 
                    onCloseClick={() => setShowRoomInvite(false)} 
                    sendRoomInvite={sendRoomInvite} />}
            {showRemoveFriendsConfirmation && 
                <FriendsRemoveConfirmationView 
                    selectedFriendsIds={selectedFriendsIds} 
                    removeFriendsText={removeFriendsText} 
                    onCloseClick={() => setShowRemoveFriendsConfirmation(false)} 
                    removeSelectedFriends={removeSelectedFriends} />}
        </>
    );
};
