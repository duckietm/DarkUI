import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetUserProfile, MessengerFriend, OpenMessengerChat } from '../../../../api';
import { LayoutAvatarImageView, LayoutBadgeImageView, Text } from '../../../../common';
import { useFriends } from '../../../../hooks';

export const FriendBarItemView: FC<{ friend: MessengerFriend }> = props =>
{
    const { friend = null } = props;
    const [isVisible, setVisible] = useState(false);
    const { followFriend = null } = useFriends();
    const elementRef = useRef<HTMLDivElement>();

    useEffect(() =>
    {
        const onClick = (event: MouseEvent) =>
        {
            const element = elementRef.current;

            if (!element) return;

            if ((event.target !== element) && !element.contains((event.target as Node)))
            {
                setVisible(false);
            }
        }

        document.addEventListener(MouseEventType.MOUSE_CLICK, onClick);

        return () => document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
    }, []);

    if (!friend)
    {
        return (
            <div style={{ height: "70px" }} ref={elementRef} className="mb-0">
                <div style={{ height: "40px" }}>
                    <div className={`friend-bar-item-head position-absolute group`}>
                        <LayoutAvatarImageView headOnly className="image-friendzone" figure={"ch-3215-92.hr-831-45.sh-290-64.fa-1206-91.lg-270-92.ha-3129-92.hd-180-2.cc-3039-92"} direction={2} />
                    </div>
                </div>
                <Text variant="white" small bold className='mb-4'>Buscar</Text>
            </div>
        );
    }

    return (
        <div style={{ height: "70px" }} ref={elementRef} className={'mb-0' + (isVisible ? 'friend-bar-item-active' : '')} onMouseOver={e => setVisible(prevValue => !prevValue)} onMouseOut={e => setVisible(prevValue => !prevValue)}>
            <div style={{ height: "40px" }}>
                <div className={`friend-bar-item-head position-absolute ${friend.id > 0 ? 'avatar' : 'group'}`}>
                    {friend.figure.toLowerCase().includes("badge") ? <LayoutAvatarImageView headOnly className="image-friendzone" figure={"ch-3215-92.hr-831-45.sh-290-64.fa-1206-91.lg-270-92.ha-3129-92.hd-180-2.cc-3039-92"} direction={2} /> :
                        <>
                            {(friend.id > 0) && <LayoutAvatarImageView headOnly className="image-friendzone" figure={friend.figure} direction={2} />}
                            {(friend.id <= 0) && <LayoutBadgeImageView isGroup={true} badgeCode={friend.figure} />}
                        </>
                    }
                </div>
            </div>
            {!isVisible &&
                <Text variant="white" small bold className='mb-4'>{friend.name.length > 10 ? friend.name.substring(0, 10) + '...' : friend.name}</Text>
            }
            {isVisible &&
                <div className="d-flex justify-content-between animate__animated animate__fadeIn" style={{ paddingTop: "2px", paddingBottom: "2px" }}>
                    <div className='nitro-pointer' onClick={event => OpenMessengerChat(friend.id)}>
                        <Text variant="white" small bold>
                            <i className="fas fa-comment-dots"></i>
                        </Text>
                    </div>
                    {friend.followingAllowed && <div className='nitro-pointer' onClick={event => followFriend(friend)}>
                        <Text variant="white" small bold>
                            <i className="fas fa-user-chart"></i>
                        </Text>
                    </div>}
                    <div className='nitro-pointer' onClick={event => GetUserProfile(friend.id)}>
                        <Text variant="white" small bold>
                            <i className="fas fa-address-card"></i>
                        </Text>
                    </div>
                </div>}
        </div>
    );
}
