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
    const [selectedFriendsIds, setSelectedFriendsIds] = useState<number[]>([]);
    const [showRoomInvite, setShowRoomInvite] = useState<boolean>(false);
    const [showRemoveFriendsConfirmation, setShowRemoveFriendsConfirmation] = useState<boolean>(false);
    const { onlineFriends = [], offlineFriends = [], requests = [], requestFriend = null, requestResponse = null } = useFriends();

    const [section, setSection] = useState("online");

    const removeFriendsText = useMemo(() =>
    {
        if (!selectedFriendsIds || !selectedFriendsIds.length) return '';

        const userNames: string[] = [];

        for (const userId of selectedFriendsIds)
        {
            let existingFriend: MessengerFriend = onlineFriends.find(f => f.id === userId);

            if (!existingFriend) existingFriend = offlineFriends.find(f => f.id === userId);

            if (!existingFriend) continue;

            userNames.push(existingFriend.name);
        }

        return LocalizeText('friendlist.removefriendconfirm.userlist', ['user_names'], [userNames.join(', ')]);
    }, [offlineFriends, onlineFriends, selectedFriendsIds]);

    const selectFriend = useCallback((userId: number) =>
    {
        if (userId < 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            const newValue = [...prevValue];

            const existingUserIdIndex: number = newValue.indexOf(userId);

            if (existingUserIdIndex > -1)
            {
                newValue.splice(existingUserIdIndex, 1)
            }
            else
            {
                newValue.push(userId);
            }

            return newValue;
        });
    }, [setSelectedFriendsIds]);

    const sendRoomInvite = (message: string) =>
    {
        if (!selectedFriendsIds.length || !message || !message.length || (message.length > 255)) return;

        SendMessageComposer(new SendRoomInviteComposer(message, selectedFriendsIds));

        setShowRoomInvite(false);
    }

    const removeSelectedFriends = () =>
    {
        if (selectedFriendsIds.length === 0) return;

        setSelectedFriendsIds(prevValue =>
        {
            SendMessageComposer(new RemoveFriendComposer(...prevValue));

            return [];
        });

        setShowRemoveFriendsConfirmation(false);
    }

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if (parts.length < 2) return;

                switch (parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'request':
                        if (parts.length < 4) return;

                        requestFriend(parseInt(parts[2]), parts[3]);
                }
            },
            eventUrlPrefix: 'friends/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [requestFriend]);

    if (!isVisible) return null;

    return (
        <>
            <NitroCardView className="nitro-friends" uniqueKey="nitro-friends">
                <NitroCardHeaderView headerText="Firend Lits" onCloseClick={event => setIsVisible(false)} />
                <NitroCardTabsView>
                    <NitroCardTabsItemView onClick={(e) => setSection("online")} isActive={section === "online" ? true : false}>
                        <Flex gap={0} alignItems="center">
                            En linea
                        </Flex>
                    </NitroCardTabsItemView>
                    <NitroCardTabsItemView onClick={(e) => setSection("offline")} isActive={section === "offline" ? true : false}>
                        <Flex gap={0} alignItems="center">
                            Desconectados
                        </Flex>
                    </NitroCardTabsItemView>
                    <NitroCardTabsItemView onClick={(e) => setSection("requests")} isActive={section === "requests" ? true : false}>
                        <Flex gap={0} alignItems="center">
                            Solicitudes
                        </Flex>
                    </NitroCardTabsItemView>
                    <NitroCardTabsItemView onClick={(e) => setSection("search")} isActive={section === "search" ? true : false}>
                        <Flex gap={0} alignItems="center">
                            Buscar
                        </Flex>
                    </NitroCardTabsItemView>
                </NitroCardTabsView>
                <NitroCardContentView overflow="hidden" gap={1} className="text-black p-0">

                    {section === "online" &&
                        <div style={{overflow: "auto"}}>
                            <div className="row mt-1 gx-1" style={{ marginLeft: "0px", marginRight: "0px", padding: "4px" }}>
                                <div className='col-md-6'>
                                    <button onClick={() => setShowRoomInvite(true)} disabled={selectedFriendsIds && selectedFriendsIds.length > 0 ? false : true} className='btn w-100' style={{ backgroundColor: "var(--colors-secondary)" }}>
                                        <img style={{ filter: "drop-shadow(0 0px 6px rgb(255,255,255))" }} src="https://2.bp.blogspot.com/-WZfVZfUX4H8/XK0oYoS0BtI/AAAAAAABOsg/6dam7awczkAUFOyBunIuuKKTPYcKp3TwACKgBGAs/s1600/user_plus.png" /> &nbsp; Invitar amigos
                                    </button>
                                </div>
                                <div className='col-md-6'>
                                    <button onClick={event => setShowRemoveFriendsConfirmation(true)} disabled={selectedFriendsIds && selectedFriendsIds.length > 0 ? false : true} className={`btn w-100 btn-danger`}>
                                        <img style={{ filter: "drop-shadow(0 0px 6px rgb(255,255,255))" }} src="https://1.bp.blogspot.com/-LRbP70GFQyA/X6DP5Hg8UuI/AAAAAAABe3k/x0uk5ZZteK0EFJdi6FBlBITgbGFHh5rrQCPcBGAsYHg/s0/1869__-446.png" /> &nbsp; Borrar amigos
                                    </button>
                                </div>
                            </div>
                            <FriendsListGroupView list={onlineFriends} selectedFriendsIds={selectedFriendsIds} selectFriend={selectFriend} />
                        </div>
                    }

                    {section === "offline" &&
                        <div style={{overflow: "auto"}}>
                            <div className="row mt-1 gx-1" style={{ marginLeft: "0px", marginRight: "0px", padding: "4px" }}>
                                <div className='col-md-12'>
                                    <button onClick={event => setShowRemoveFriendsConfirmation(true)} disabled={selectedFriendsIds && selectedFriendsIds.length > 0 ? false : true} className={`btn w-100 btn-danger`}>
                                        <img style={{ filter: "drop-shadow(0 0px 6px rgb(255,255,255))" }} src="https://1.bp.blogspot.com/-LRbP70GFQyA/X6DP5Hg8UuI/AAAAAAABe3k/x0uk5ZZteK0EFJdi6FBlBITgbGFHh5rrQCPcBGAsYHg/s0/1869__-446.png" /> &nbsp; Borrar amigos
                                    </button>
                                </div>
                            </div>
                            <FriendsListGroupOfflineView list={offlineFriends} selectedFriendsIds={selectedFriendsIds} selectFriend={selectFriend} />
                        </div>
                    }

                    {section === "requests" && <div style={{overflow: "auto"}}>
                        <div className="row mt-1 gx-1" style={{ marginLeft: "0px", marginRight: "0px", padding: "4px" }}>
                            <div className='col-md-12'>
                                <button disabled={requests && requests.length > 0 ? false : true} onClick={event => requestResponse(-1, false)} className={`btn w-100 btn-danger`}>
                                    <img style={{ filter: "drop-shadow(0 0px 6px rgb(255,255,255))" }} src="https://1.bp.blogspot.com/-LRbP70GFQyA/X6DP5Hg8UuI/AAAAAAABe3k/x0uk5ZZteK0EFJdi6FBlBITgbGFHh5rrQCPcBGAsYHg/s0/1869__-446.png" /> &nbsp; Rechazar todas las solicitudes
                                </button>
                            </div>
                        </div>
                        <FriendsListRequestView />
                    </div>}

                    {section === "search" && <FriendsSearchView headerText={LocalizeText('people.search.title')} />}
                </NitroCardContentView>
            </NitroCardView>
            {showRoomInvite &&
                <FriendsRoomInviteView selectedFriendsIds={selectedFriendsIds} onCloseClick={() => setShowRoomInvite(false)} sendRoomInvite={sendRoomInvite} />}
            {showRemoveFriendsConfirmation &&
                <FriendsRemoveConfirmationView selectedFriendsIds={selectedFriendsIds} removeFriendsText={removeFriendsText} onCloseClick={() => setShowRemoveFriendsConfirmation(false)} removeSelectedFriends={removeSelectedFriends} />}
        </>
    );
};
