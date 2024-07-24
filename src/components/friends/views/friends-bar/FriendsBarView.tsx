import { FC, useRef, useState } from 'react';
import { MessengerFriend } from '../../../../api';
import { Button, Flex, Text } from '../../../../common';
import { FriendBarItemView } from './FriendBarItemView';

const MAX_DISPLAY_COUNT = 4;

export const FriendBarView: FC<{ onlineFriends: MessengerFriend[] }> = props =>
{
    const { onlineFriends = null } = props;
    const [indexOffset, setIndexOffset] = useState(0);
    const elementRef = useRef<HTMLDivElement>();

    return (
        <Flex innerRef={elementRef} alignItems="center" className="friend-bar">
            <div className='text-center nitro-toolbar-secondary' style={{padding: "0px", width: "77px", marginTop: "-334px", marginLeft: "10px", marginRight: "-12px"}}>
                <div style={{ padding: "4px" }}>
                    <Button className="friend-bar-button mb-1" disabled={(indexOffset <= 0)} onClick={event => setIndexOffset(indexOffset - 1)}>
                        <i className="fas fa-chevron-up" style={{ marginTop: "3px" }}></i>
                    </Button>
                    {Array.from(Array(MAX_DISPLAY_COUNT), (e, i) => <FriendBarItemView key={i} friend={(onlineFriends[indexOffset + i] || null)} />)}
                    <Button className="friend-bar-button" disabled={!((onlineFriends.length > MAX_DISPLAY_COUNT) && ((indexOffset + MAX_DISPLAY_COUNT) <= (onlineFriends.length - 1)))} onClick={event => setIndexOffset(indexOffset + 1)}>
                        <i className="fas fa-chevron-down" style={{ marginTop: "3px" }}></i>
                    </Button>
                </div>
                <div className='w-100' style={{ padding: "3px", textAlign: "center", background: "rgba(0,0,0,0.6)", borderBottomLeftRadius: "5px",  borderBottomRightRadius: "5px"}}>
                    <Text variant="white" bold small>
                    {onlineFriends.length} <i className="fas fa-users"></i>
                    </Text>
                </div>
            </div>
        </Flex>
    );
}
