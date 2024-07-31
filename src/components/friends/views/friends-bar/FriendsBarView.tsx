import { FC, useState } from 'react';
import { LocalizeText, MessengerFriend } from '../../../../api';
import { Button, Flex, Text } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';
import { FaChevronDown, FaChevronUp, FaUser } from "react-icons/fa";

const MAX_DISPLAY_COUNT = 4;

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = ({ onlineFriends }) => {
    const [indexOffset, setIndexOffset] = useState(0);
    const [activeFriend, setActiveFriend] = useState<MessengerFriend | null>(null);

    const canScrollUp = indexOffset > 0;
    const canScrollDown = (onlineFriends.length > MAX_DISPLAY_COUNT) && (indexOffset + MAX_DISPLAY_COUNT < onlineFriends.length);

    return (
        <Flex alignItems="center" className="friend-bar">
            <div className="text-center nitro-toolbar-secondary friendbarview" style={{ position: 'relative' }}>
                {activeFriend && (
                    <div className="search-content mt-3" style={{ position: 'absolute', left: '-320px', top: '0', zIndex: 1000 }}>
                        <div className="bg-white text-black px-1 py-1 font-size-friend">
                            {LocalizeText('friend.bar.find.text')}
                        </div>
                        <Button className="mt-2 mb-4" variant="white" onClick={() => SendMessageComposer(new FindNewFriendsMessageComposer())}>
                            {LocalizeText('friend.bar.find.button')}
                        </Button>
                    </div>
                )}
                <div style={{ padding: "4px" }}>
                    <Button
                        className="friend-bar-button mb-1"
                        disabled={!canScrollUp}
                        onClick={() => setIndexOffset(indexOffset - 1)}
                    >
                        <FaChevronUp className="fa-icon" />
                    </Button>
                    {Array.from({ length: MAX_DISPLAY_COUNT }, (_, i) => (
                        <FriendBarItemView
                            key={i}
                            friend={onlineFriends[indexOffset + i] || null}
                            onActivate={setActiveFriend}
                        />
                    ))}
                    <Button
                        className="friend-bar-button"
                        disabled={!canScrollDown}
                        onClick={() => setIndexOffset(indexOffset + 1)}
                    >
                        <FaChevronDown className="fa-icon" />
                    </Button>
                </div>
                <div className="w-100" style={{ padding: "3px", textAlign: "center", background: "rgba(0,0,0,0.6)", borderBottomLeftRadius: "5px", borderBottomRightRadius: "5px" }}>
                    <Text variant="white" bold small>
                        {onlineFriends.length} <FaUser className="fa-icon" fontSize={16} />
                    </Text>
                </div>
            </div>
        </Flex>
    );
};
