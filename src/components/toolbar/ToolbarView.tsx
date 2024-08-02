import { Dispose, DropBounce, EaseOut, ILinkEventTracker, JumpBy, Motions, NitroToolbarAnimateIconEvent, PerkAllowancesMessageEvent, PerkEnum, Queue, Wait } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, GetSessionDataManager, LocalizeText, MessengerIconState, OpenMessengerChat, RemoveLinkEventTracker } from '../../api';
import { Base, Flex, LayoutItemCountView, Text, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { useAchievements, useFriends, useInventoryUnseenTracker, useIsPlaying, useMessageEvent, useMessenger, useRoomEngineEvent, useSessionInfo } from '../../hooks';
import RoomWidgetsView from './RoomWidgetsView';
import { ToolbarMeView } from './ToolbarMeView';

export const ToolbarView: FC<{ isInRoom: boolean }> = props =>
{
    const { isInRoom } = props;
    const [isMeExpanded, setMeExpanded] = useState(false);
    const [useGuideTool, setUseGuideTool] = useState(false);
    const { userFigure = null } = useSessionInfo();
    const { getFullCount = 0 } = useInventoryUnseenTracker();
    const { getTotalUnseen = 0 } = useAchievements();
    const { requests = [] } = useFriends();
    const { iconState = MessengerIconState.HIDDEN } = useMessenger();
    const isMod = GetSessionDataManager().isModerator;

    // 
    const [isVisible, setIsVisible] = useState(true);
    const { isPlaying } = useIsPlaying();

    useMessageEvent<PerkAllowancesMessageEvent>(PerkAllowancesMessageEvent, event =>
    {
        const parser = event.getParser();

        setUseGuideTool(parser.isAllowed(PerkEnum.USE_GUIDE_TOOL));
    });

    useRoomEngineEvent<NitroToolbarAnimateIconEvent>(NitroToolbarAnimateIconEvent.ANIMATE_ICON, event =>
    {
        const animationIconToToolbar = (iconName: string, image: HTMLImageElement, x: number, y: number) =>
        {
            const target = (document.body.getElementsByClassName(iconName)[0] as HTMLElement);

            if (!target) return;

            image.className = 'toolbar-icon-animation';
            image.style.visibility = 'visible';
            image.style.left = (x + 'px');
            image.style.top = (y + 'px');

            document.body.append(image);

            const targetBounds = target.getBoundingClientRect();
            const imageBounds = image.getBoundingClientRect();

            const left = (imageBounds.x - targetBounds.x);
            const top = (imageBounds.y - targetBounds.y);
            const squared = Math.sqrt(((left * left) + (top * top)));
            const wait = (500 - Math.abs(((((1 / squared) * 100) * 500) * 0.5)));
            const height = 20;

            const motionName = (`ToolbarBouncing[${iconName}]`);

            if (!Motions.getMotionByTag(motionName))
            {
                Motions.runMotion(new Queue(new Wait((wait + 8)), new DropBounce(target, 400, 12))).tag = motionName;
            }

            const motion = new Queue(new EaseOut(new JumpBy(image, wait, ((targetBounds.x - imageBounds.x) + height), (targetBounds.y - imageBounds.y), 100, 1), 1), new Dispose(image));

            Motions.runMotion(motion);
        }

        animationIconToToolbar('icon-inventory', event.image, event.x, event.y);
    });

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
                }
            },
            eventUrlPrefix: 'toolbar-view/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    return (
        <>
            {isVisible && !!!isPlaying ?
                <>
                    <TransitionAnimation type={TransitionAnimationTypes.FADE_IN} inProp={isMeExpanded} timeout={300}>
                        <ToolbarMeView useGuideTool={useGuideTool} unseenAchievementCount={getTotalUnseen} setMeExpanded={setMeExpanded} />
                    </TransitionAnimation>
                    <Flex alignItems="center" justifyContent="between" className="nitro-toolbar py-1 px-3 animate__animated animate__backInUp">
                        <Flex gap={1} alignItems="center">
                            <Flex alignItems="center" className="nitro-toolbar-firstview">
                                {isInRoom && <RoomWidgetsView />}
                            </Flex>
                            <Flex className='w-100'>&nbsp;</Flex>
                        </Flex>
                        <Flex alignItems="center" id="toolbar-chat-input-container" />
                        <Flex alignItems="center">
                            <Flex className='nitro-toolbar-main-icons' style={{marginBottom: "40px"}}>
                                {isInRoom &&
                                    <div className='text-center' style={{marginRight: "15px"}}>
                                        <Base pointer className="navigation-item icon icon-camera nitro-toolbar-icon nitro-space-left nitro-space-right sidebar-navigation-icon" onClick={event => CreateLinkEvent('camera/toggle')} />
                                        <div className='w-100 text-center'>
                                            <Text variant="white" small bold center>{ LocalizeText('room.camera.button.text') }</Text>
                                        </div>
                                    </div>
                                }
                                {((iconState === MessengerIconState.SHOW) || (iconState === MessengerIconState.UNREAD)) &&
                                    <div className='text-center' style={{marginRight: "15px"}}>
                                        <Base pointer className={`navigation-item icon icon-message nitro-toolbar-icon  ${(iconState === MessengerIconState.UNREAD) && 'is-unseen'} nitro-space-right sidebar-navigation-icon`} onClick={event => OpenMessengerChat()} />
                                        <div className='w-100 text-center'>
                                            <Text variant="white" small bold center>Messenger</Text>
                                        </div>
                                    </div>
                                }
                                <div className={`text-center`} style={{marginRight: "5px"}}>
                                    <Base pointer className="navigation-item icon icon-friendall nitro-toolbar-icon nitro-space-left nitro-space-right sidebar-navigation-icon" onClick={event => CreateLinkEvent('friends/toggle')}>
                                        {(requests.length > 0) &&
                                            <LayoutItemCountView count={requests.length} />}
                                    </Base>
                                    <div className='w-100 text-center'> <Text variant="white" small bold center>{ LocalizeText('friendlist.friends') }</Text> </div>
                                </div>
                            </Flex>
                            <Base id="toolbar-friend-bar-container" className="d-none d-lg-block nitro-space-right" />
                        </Flex>
                    </Flex>
                </>
                :
                <>
                    <Flex alignItems="center" justifyContent="around" gap={3} className="nitro-toolbar py-1 px-3 animate__animated animate__backInUp">
                        <Flex alignItems="center" id="toolbar-chat-input-container" />
                        <Base id="toolbar-friend-bar-container" className="d-none" />
                    </Flex>
                </>
            }
        </>
    );
}
