import { GetGuestRoomResultEvent, ILinkEventTracker, NavigatorSearchComposer, RateFlatMessageComposer } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, GetRoomEngine, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { Flex, Text } from '../../common';
import { useIsPlaying, useMessageEvent, useNavigator, useRoom } from '../../hooks';

const RoomWidgetsView = () =>
{
    const [ isZoomedIn, setIsZoomedIn ] = useState<boolean>(false);
    const [ roomName, setRoomName ] = useState<string>(null);
    const [ roomOwner, setRoomOwner ] = useState<string>(null);
    const [ roomTags, setRoomTags ] = useState<string[]>(null);
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const { navigatorData = null } = useNavigator();
    const { roomSession = null } = useRoom();
    const sso = new URLSearchParams(window.location.search).get('sso');
    

    // 
    const [ isVisible, setIsVisible ] = useState(true);
    const { isPlaying } = useIsPlaying();

    function openBawTool()
    {
        fetch('https://int.habbe.es/?type=builderTool&sso='+sso);
    }

    const handleToolClick = (action: string, value?: string) =>
    {
        switch(action)
        {
            case 'settings':
                CreateLinkEvent('navigator/toggle-room-info');
                return;
            case 'zoom':
                setIsZoomedIn(prevValue =>
                {
                    let scale = GetRoomEngine().getRoomInstanceRenderingCanvasScale(roomSession.roomId, 1);

                    if(!prevValue) scale /= 2;
                    else scale *= 2;

                    GetRoomEngine().setRoomInstanceRenderingCanvasScale(roomSession.roomId, 1, scale);

                    return !prevValue;
                });
                return;
            case 'chat_history':
                CreateLinkEvent('chat-history/toggle');
                return;
            case 'like_room':
                SendMessageComposer(new RateFlatMessageComposer(1));
                return;
            case 'toggle_room_link':
                CreateLinkEvent('navigator/toggle-room-link');
                return;
            case 'navigator_search_tag':
                CreateLinkEvent(`navigator/search/${ value }`);
                SendMessageComposer(new NavigatorSearchComposer('hotel_view', `tag:${ value }`));
                return;
        }
    }

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                }
            },
            eventUrlPrefix: 'roomtools-view/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useMessageEvent<GetGuestRoomResultEvent>(GetGuestRoomResultEvent, event =>
    {
        const parser = event.getParser();

        if(!parser.roomEnter || (parser.data.roomId !== roomSession.roomId)) return;

        if(roomName !== parser.data.roomName) setRoomName(parser.data.roomName);
        if(roomOwner !== parser.data.ownerName) setRoomOwner(parser.data.ownerName);
        if(roomTags !== parser.data.tags) setRoomTags(parser.data.tags);
    });

    useEffect(() =>
    {
        setIsOpen(true);

        const timeout = setTimeout(() => setIsOpen(false), 5000);

        return () => clearTimeout(timeout);
    }, [ roomName, roomOwner, roomTags ]);

    return (
        <>
            { isVisible && !!!isPlaying && roomName !== null &&
                <Flex className='toolbar-room-info'>
                    <div className='toolbar-room-info-text'>
                        <div className='mb-0'>
                            <Text variant="white" bold>
                                { roomName }
                            </Text>
                        </div>
                        <div className='toolbar-room-info-description'>
                            <Text variant="muted" small bold>
                                Dueño: { roomOwner }
                            </Text>
                        </div>
                        <div className="row mt-1">
                            <div className='col-md-2'>
                                <span className='badge bg-dark nitro-pointer' onClick={ () => handleToolClick('settings') }>
                                    <i className="fas fa-cog"></i>
                                </span>
                            </div>
                            <div className='col-md-2'>
                                <span className='badge bg-dark nitro-pointer' onClick={ () => handleToolClick('zoom') }>
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                            <div className='col-md-2'>
                                <span className='badge bg-dark nitro-pointer' onClick={ () => handleToolClick('chat_history') }>
                                    <i className="fas fa-comments"></i>
                                </span>
                            </div>
                            <div className='col-md-2'>
                                <span className='badge bg-dark nitro-pointer' onClick={ e => openBawTool() }>
                                    <i className="fas fa-tools"></i>
                                </span>
                            </div>
                            <div className='col-md-2'>
                                <span className='badge bg-dark nitro-pointer' onClick={ () => handleToolClick('like_room') }>
                                    <i className="fas fa-thumbs-up"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </Flex>
            }
        </>
    )
}

export default RoomWidgetsView
