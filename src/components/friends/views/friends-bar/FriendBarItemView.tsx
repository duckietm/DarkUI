import { MouseEventType } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { GetUserProfile, MessengerFriend, OpenMessengerChat } from '../../../../api';
import { LayoutAvatarImageView, LayoutBadgeImageView, Text } from '../../../../common';
import { useFriends } from '../../../../hooks';
import { FaAddressCard, FaRegChartBar, FaCommentDots } from 'react-icons/fa';
import classNames from 'classnames';

interface FriendBarItemViewProps {
    friend: MessengerFriend | null;
}

export const FriendBarItemView: FC<FriendBarItemViewProps> = ({ friend }) => {
    const [isVisible, setVisible] = useState(false);
    const { followFriend } = useFriends();
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const element = elementRef.current;
            if (element && !element.contains(event.target as Node)) {
                setVisible(false);
            }
        };

        document.addEventListener(MouseEventType.MOUSE_CLICK, onClick);
        return () => document.removeEventListener(MouseEventType.MOUSE_CLICK, onClick);
    }, []);

    if (!friend) {
        return (
            <div style={{ height: "70px" }} ref={elementRef} className="mb-0">
                <div style={{ height: "40px" }}>
                    <div className="friend-bar-item-head position-absolute group">
                        <LayoutAvatarImageView
                            headOnly
                            className="image-friendzone"
                            figure="ch-3215-92.hr-831-45.sh-290-64.fa-1206-91.lg-270-92.ha-3129-92.hd-180-2.cc-3039-92"
                            direction={2}
                        />
                    </div>
                </div>
                <Text variant="white" small bold className="mb-4">Buscar</Text>
            </div>
        );
    }

    return (
        <div
            style={{ height: "70px" }}
            ref={elementRef}
            className={classNames('mb-0', { 'friend-bar-item-active': isVisible })}
            onMouseOver={() => setVisible(true)}
            onMouseOut={() => setVisible(false)}
        >
            <div style={{ height: "40px" }}>
                <div className={classNames('friend-bar-item-head position-absolute', {
                    'avatar': friend.id > 0,
                    'group': friend.id <= 0
                })}>
                    {friend.figure.toLowerCase().includes("badge") ? (
                        <LayoutAvatarImageView
                            headOnly
                            className="image-friendzone"
                            figure="ch-3215-92.hr-831-45.sh-290-64.fa-1206-91.lg-270-92.ha-3129-92.hd-180-2.cc-3039-92"
                            direction={2}
                        />
                    ) : (
                        <>
                            {friend.id > 0 ? (
                                <LayoutAvatarImageView
                                    headOnly
                                    className="image-friendzone"
                                    figure={friend.figure}
                                    direction={2}
                                />
                            ) : (
                                <LayoutAvatarImageView
                                    className="image-friendzone"
                                    headOnly
                                    figure={friend.figure === 'ADM'
                                        ? 'ha-3409-1413-70.lg-285-89.ch-3032-1334-109.sh-3016-110.hd-185-1359.ca-3225-110-62.wa-3264-62-62.fa-1206-90.hr-3322-1403'
                                        : friend.figure
                                    }
                                    isgroup={1}
                                    direction={3}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
            {!isVisible ? (
                <Text variant="white" small bold className="mb-4">
                    {friend.name.length > 10 ? `${friend.name.substring(0, 10)}...` : friend.name}
                </Text>
            ) : (
                <div className="d-flex justify-content-between friendbaritemview" >
                    <div className="d-flex">
						<div className="nitro-pointer" onClick={() => OpenMessengerChat(friend.id)}>
							<Text variant="white" bold>
								<FaCommentDots />
							</Text>
						</div>
					</div>
                    {friend.followingAllowed && (
                        <div className="nitro-pointer" onClick={() => followFriend(friend)}>
                            <Text variant="white" small bold>
                                <FaRegChartBar />
                            </Text>
                        </div>
                    )}
                    <div className="nitro-pointer" onClick={() => GetUserProfile(friend.id)}>
                        <Text variant="white" small bold>
                            <FaAddressCard />
                        </Text>
                    </div>
                </div>
            )}
        </div>
    );
};
