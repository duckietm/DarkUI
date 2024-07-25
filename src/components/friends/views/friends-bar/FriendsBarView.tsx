import { FC, useState } from 'react';
import { MessengerFriend } from '../../../../api';
import { Button, Flex, Text } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';
import { FaChevronDown, FaChevronUp, FaUser } from "react-icons/fa";

const MAX_DISPLAY_COUNT = 4;

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = ({ onlineFriends }) => {
    const [indexOffset, setIndexOffset] = useState(0);

    const canScrollUp = indexOffset > 0;
    const canScrollDown = (onlineFriends.length > MAX_DISPLAY_COUNT) && (indexOffset + MAX_DISPLAY_COUNT < onlineFriends.length);

    return (
        <Flex alignItems="center" className="friend-bar">
            <div className="text-center nitro-toolbar-secondary friendbarview">
                <div style={{ padding: "4px" }}>
                    <Button
                        className="friend-bar-button mb-1"
                        disabled={!canScrollUp}
                        onClick={() => setIndexOffset(indexOffset - 1)}
                    >
                        <FaChevronUp className="fa-icon" />
                    </Button>
                    {Array.from({ length: MAX_DISPLAY_COUNT }, (_, i) => (
                        <FriendBarItemView key={i} friend={onlineFriends[indexOffset + i] || null} />
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
