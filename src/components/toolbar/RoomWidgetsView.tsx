import { GetGuestRoomResultEvent, ILinkEventTracker, NavigatorSearchComposer, RateFlatMessageComposer } from '@nitrots/nitro-renderer';
import { useEffect, useState } from 'react';
import { AddEventLinkTracker, CreateLinkEvent, GetRoomEngine, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { FaCog, FaComments, FaSearch, FaRegThumbsUp } from "react-icons/fa";
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
    const [ isVisible, setIsVisible ] = useState(true);
    const { isPlaying } = useIsPlaying();

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
                        <div className='mb-0'> <Text wrap variant="white" fontSize={4} truncate>{roomName}</Text> </div>
                        <div className='toolbar-room-info-description'> <Text variant="muted" fontSize={6} truncate>{ LocalizeText('navigator.filter.owner') }: {roomOwner}</Text> </div>
                        <div className="row mt-1">
                            <div className='col-md-2'> <span className='badge bg-dark nitro-pointer' onClick={ () => handleToolClick('settings') }> <FaCog  className="fa-icon" /> </span> </div>
                            <div className='col-md-2'> <span className='badge bg-dark nitro-pointer' onClick={ () => handleToolClick('zoom') }> <FaSearch  className="fa-icon" /> </span> </div>
                            <div className='col-md-2'> <span className='badge bg-dark nitro-pointer' onClick={ () => handleToolClick('chat_history') }> <FaComments  className="fa-icon" /> </span> </div>
                            <div className='col-md-2'> <span className='badge bg-dark nitro-pointer' onClick={ () => handleToolClick('like_room') }> <FaRegThumbsUp  className="fa-icon" /> </span> </div>
                        </div>
                    </div>
                </Flex>
            }
        </>
    )
}

export default RoomWidgetsView
