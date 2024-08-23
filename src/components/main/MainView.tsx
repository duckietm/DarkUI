import { GetTicker, HabboWebTools, ILinkEventTracker, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { AddEventLinkTracker, GetCommunication, GetConfiguration, RemoveLinkEventTracker } from '../../api';
import { Base, TransitionAnimation, TransitionAnimationTypes } from '../../common';
import { useRoomSessionManagerEvent } from '../../hooks';
import PingComposer from '../../packets/PingComposer';
import { SSOComposer } from '../../packets/SSOComposer';
import { AchievementsView } from '../achievements/AchievementsView';
import { AvatarEditorView } from '../avatar-editor/AvatarEditorView';
import { CameraWidgetView } from '../camera/CameraWidgetView';
import { CampaignView } from '../campaign/CampaignView';
import { CatalogView } from '../catalog/CatalogView';
import { ChatHistoryView } from '../chat-history/ChatHistoryView';
import { FloorplanEditorView } from '../floorplan-editor/FloorplanEditorView';
import { FriendsView } from '../friends/FriendsView';
import { GroupsView } from '../groups/GroupsView';
import { GuideToolView } from '../guide-tool/GuideToolView';
import { HcCenterView } from '../hc-center/HcCenterView';
import { EnablesView } from '../help/EnablesView';
import { HelpView } from '../help/HelpView';
import { HotelView } from '../hotel-view/HotelView';
import { InventoryView } from '../inventory/InventoryView';
import { ModToolsView } from '../mod-tools/ModToolsView';
import { NavigatorView } from '../navigator/NavigatorView';
import { NitropediaView } from '../nitropedia/NitropediaView';
import { RightSideView } from '../right-side/RightSideView';
import { RoomView } from '../room/RoomView';
import SideToolbarView from '../toolbar/SideToolbarView';
import { ToolbarView } from '../toolbar/ToolbarView';
import { UpsideView } from '../upside/UpsideView';
import { UserProfileView } from '../user-profile/UserProfileView';
import { UserSettingsView } from '../user-settings/UserSettingsView';
import { WiredView } from '../wired/WiredView';

export const MainView: FC<{}> = props =>
{
    const [ isReady, setIsReady ] = useState(false);
    const [ landingViewVisible, setLandingViewVisible ] = useState(true);

    const [ socketUrl ] = useState(GetConfiguration<string>('api.socket.url'));
    const [ messageHistory, setMessageHistory ] = useState([]);
    const [ interval, setInvertal ] = useState(null);
    const sso = new URLSearchParams(window.location.search).get('sso');

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
        onOpen: () => 
        { 
            if(interval !== null) clearInterval(interval);
            sendMessage(JSON.stringify(new SSOComposer(sso)))

            var intervalInt = setInterval(() => 
            {
                sendMessage(JSON.stringify(new PingComposer()))
            }, 5000)

            setInvertal(intervalInt);
        },
        shouldReconnect: (closeEvent) => true,
        share: true
    });

    useEffect(() => 
    {
        if (lastMessage !== null) 
        {
            var message = JSON.parse(lastMessage.data);
            if(message.type === 'authResponse' && message.data !== 'error')
            {

            }
        }
    }, [ lastMessage, setMessageHistory ]);

    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.CREATED, event => setLandingViewVisible(false));
    useRoomSessionManagerEvent<RoomSessionEvent>(RoomSessionEvent.ENDED, event => setLandingViewVisible(event.openLandingView));

    useEffect(() =>
    {
        setIsReady(true);

        GetCommunication().connection.onReady();

        const secondaryColor = window.localStorage.getItem('colors.secondary');

        if(secondaryColor === null) window.localStorage.setItem('colors.secondary', GetConfiguration<string>('colors.secondary', ''));
        document.querySelector('html').style.setProperty('--colors-secondary', window.localStorage.getItem('colors.secondary'));

        const fps = window.localStorage.getItem('fps.limiter')
        if(fps != null) GetTicker().maxFPS = parseInt(fps);
    }, []);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = { 
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');
        
                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'open':
                        if(parts.length > 2)
                        {
                            switch(parts[2])
                            {
                                case 'credits':
                                    //HabboWebTools.openWebPageAndMinimizeClient(this._windowManager.getProperty(ExternalVariables.WEB_SHOP_RELATIVE_URL));
                                    break;
                                default: {
                                    const name = parts[2];
                                    HabboWebTools.openHabblet(name);
                                }
                            }
                        }
                        return;
                }
            },
            eventUrlPrefix: 'habblet/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    return (
        <Base fit>
            <TransitionAnimation type={ TransitionAnimationTypes.FADE_IN } inProp={ landingViewVisible } timeout={ 300 }>
                <HotelView />
            </TransitionAnimation>
            <ToolbarView isInRoom={ !landingViewVisible } />
            <SideToolbarView isInRoom={ !landingViewVisible }  />
            <ModToolsView />
            <RoomView />
            <ChatHistoryView />
            <WiredView />
            <AvatarEditorView />
            <AchievementsView />
            <NavigatorView />
            <InventoryView />
            <CatalogView />
            <FriendsView />
            <UpsideView />
            <RightSideView />
            <UserSettingsView />
            <UserProfileView />
            <GroupsView />
            <CameraWidgetView />
            <HelpView />
            <EnablesView />
            <NitropediaView />
            <GuideToolView />
            <HcCenterView />
            <CampaignView />
            <FloorplanEditorView />
        </Base>
    );
}
