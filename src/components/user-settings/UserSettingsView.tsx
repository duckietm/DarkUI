import { GetTicker, ILinkEventTracker, NitroSettingsEvent, UserSettingsCameraFollowComposer, UserSettingsEvent, UserSettingsOldChatComposer, UserSettingsRoomInvitesComposer, UserSettingsSoundComposer } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { FaVolumeDown, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { AddEventLinkTracker, DispatchMainEvent, DispatchUiEvent, GetConfiguration, LocalizeText, RemoveLinkEventTracker, SendMessageComposer } from '../../api';
import { Column, Flex, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView, Text, classNames } from '../../common';
import { useCatalogPlaceMultipleItems, useCatalogSkipPurchaseConfirmation, useMessageEvent } from '../../hooks';

export const UserSettingsView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [userSettings, setUserSettings] = useState<NitroSettingsEvent>(null);
    const [catalogPlaceMultipleObjects, setCatalogPlaceMultipleObjects] = useCatalogPlaceMultipleItems();
    const [catalogSkipPurchaseConfirmation, setCatalogSkipPurchaseConfirmation] = useCatalogSkipPurchaseConfirmation();

    const [section, setSection] = useState("general");
    const [secondaryColor, setSecondaryColor] = useState(window.localStorage.getItem("colors.secondary"))

    const [loaded, isLoaded] = useState(true);

    const changeFps = (fps) => 
    {
        if (!(fps === "120" || fps === "60" || fps === "30" || fps === "0")) return;
        window.localStorage.setItem("fps.limiter", fps);
        GetTicker().maxFPS = fps;
        setIsVisible(false);
    }

    const changeSecondaryColor = (value) => 
    {
        setSecondaryColor(value);
        window.localStorage.setItem("colors.secondary", value);
        document.querySelector('html').style.setProperty('--colors-secondary', value);
    }

    const resetColors = () =>
    {
        setSecondaryColor(GetConfiguration<string>('colors.secondary', ''))
        window.localStorage.setItem("colors.secondary", GetConfiguration<string>('colors.secondary', ''))
    }

    const processAction = (type: string, value?: boolean | number | string) =>
    {
        let doUpdate = true;

        const clone = userSettings.clone();

        switch (type)
        {
            case 'close_view':
                setIsVisible(false);
                doUpdate = false;
                return;
            case 'oldchat':
                clone.oldChat = value as boolean;
                SendMessageComposer(new UserSettingsOldChatComposer(clone.oldChat));
                break;
            case 'room_invites':
                clone.roomInvites = value as boolean;
                SendMessageComposer(new UserSettingsRoomInvitesComposer(clone.roomInvites));
                break;
            case 'camera_follow':
                clone.cameraFollow = value as boolean;
                SendMessageComposer(new UserSettingsCameraFollowComposer(clone.cameraFollow));
                break;
            case 'system_volume':
                clone.volumeSystem = value as number;
                clone.volumeSystem = Math.max(0, clone.volumeSystem);
                clone.volumeSystem = Math.min(100, clone.volumeSystem);
                break;
            case 'furni_volume':
                clone.volumeFurni = value as number;
                clone.volumeFurni = Math.max(0, clone.volumeFurni);
                clone.volumeFurni = Math.min(100, clone.volumeFurni);
                break;
            case 'trax_volume':
                clone.volumeTrax = value as number;
                clone.volumeTrax = Math.max(0, clone.volumeTrax);
                clone.volumeTrax = Math.min(100, clone.volumeTrax);
                break;
        }

        if (doUpdate) setUserSettings(clone);

        DispatchMainEvent(clone)
    }

    const saveRangeSlider = (type: string) =>
    {
        switch (type)
        {
            case 'volume':
                SendMessageComposer(new UserSettingsSoundComposer(Math.round(userSettings.volumeSystem), Math.round(userSettings.volumeFurni), Math.round(userSettings.volumeTrax)));
                break;
        }
    }

    useMessageEvent<UserSettingsEvent>(UserSettingsEvent, event =>
    {
        const parser = event.getParser();
        const settingsEvent = new NitroSettingsEvent();

        settingsEvent.volumeSystem = parser.volumeSystem;
        settingsEvent.volumeFurni = parser.volumeFurni;
        settingsEvent.volumeTrax = parser.volumeTrax;
        settingsEvent.oldChat = parser.oldChat;
        settingsEvent.roomInvites = parser.roomInvites;
        settingsEvent.cameraFollow = parser.cameraFollow;
        settingsEvent.flags = parser.flags;
        settingsEvent.chatType = parser.chatType;

        setUserSettings(settingsEvent);
        DispatchMainEvent(settingsEvent);
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
            eventUrlPrefix: 'user-settings/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);

    useEffect(() =>
    {
        if (!userSettings) return;

        DispatchUiEvent(userSettings);
    }, [userSettings]);

    if (!isVisible || !userSettings) return null;

    return (
        <>{loaded &&
            <NitroCardView uniqueKey="user-settings" className="user-settings-window" style={{ width: "470px" }}>
                <NitroCardHeaderView headerText={LocalizeText('widget.memenu.settings.title')} onCloseClick={event => processAction('close_view')} />
                <NitroCardTabsView>
                    <NitroCardTabsItemView onClick={(e) => setSection("general")} isActive={section === "general" ? true : false}>
                        <Flex gap={0} alignItems="center">
                            General
                        </Flex>
                    </NitroCardTabsItemView>
                    <NitroCardTabsItemView onClick={(e) => setSection("volume")} isActive={section === "volume" ? true : false}>
                        <Flex gap={0} alignItems="center">
                            Volumen
                        </Flex>
                    </NitroCardTabsItemView>
                    <NitroCardTabsItemView onClick={(e) => setSection("performance")} isActive={section === "performance" ? true : false}>
                        <Flex gap={0} alignItems="center">
                            Interfaz
                        </Flex>
                    </NitroCardTabsItemView>
                </NitroCardTabsView>
                <NitroCardContentView className="text-black">
                    {section === "general" &&
                        <Column gap={1}>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Text variant="white" bold fontSize={5}>General</Text>
                                </div>
                                <div>
                                    <Text variant="white">Ajustes generales de Nitro</Text>
                                </div>
                            </div>
                            <div className='w-100 mt-1 mb-3' style={{ borderBottom: "1px solid rgb(54, 54, 54)" }}></div>
                            <Flex alignItems="center" gap={1}>
                                <input className="form-check-input" type="checkbox" checked={userSettings.oldChat} onChange={event => processAction('oldchat', event.target.checked)} />
                                <Text variant="white">Activar la versión de chat antigua (modo flash)</Text>
                            </Flex>
                            <Flex alignItems="center" gap={1}>
                                <input className="form-check-input" type="checkbox" checked={userSettings.roomInvites} onChange={event => processAction('room_invites', event.target.checked)} />
                                <Text variant="white">Ignorar invitaciones a salas enviadas por otros usuarios</Text>
                            </Flex>
                            <Flex alignItems="center" gap={1}>
                                <input className="form-check-input" type="checkbox" checked={userSettings.cameraFollow} onChange={event => processAction('camera_follow', event.target.checked)} />
                                <Text variant="white">No enfocar al avatar al moverte por cualquier sala</Text>
                            </Flex>
                            <Flex alignItems="center" gap={1}>
                                <input className="form-check-input" type="checkbox" checked={catalogPlaceMultipleObjects} onChange={event => setCatalogPlaceMultipleObjects(event.target.checked)} />
                                <Text variant="white">Comprar mas de un furni desde el catálogo</Text>
                            </Flex>
                            <Flex alignItems="center" gap={1}>
                                <input className="form-check-input" type="checkbox" checked={catalogSkipPurchaseConfirmation} onChange={event => setCatalogSkipPurchaseConfirmation(event.target.checked)} />
                                <Text variant="white">Mensaje de confirmación al comprar furnis desde el catálogo</Text>
                            </Flex>
                        </Column>
                    }

                    {section === "volume" &&
                        <Column>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Text variant="white" bold fontSize={5}>Volumen</Text>
                                </div>
                                <div>
                                    <Text variant="white">Ajustes de volumen</Text>
                                </div>
                            </div>
                            <div className='w-100 mt-1 mb-2' style={{ borderBottom: "1px solid rgb(54, 54, 54)" }}></div>
                            <Column gap={1}>
                                <Text variant="white">Alertas, notificaciones y sonidos generales</Text>
                                <Flex alignItems="center" gap={1}>
                                    {(userSettings.volumeSystem === 0) && <FaVolumeMute className={classNames((userSettings.volumeSystem >= 50) && 'text-muted', 'fa-icon')} />}
                                    {(userSettings.volumeSystem > 0) && <FaVolumeDown className={classNames((userSettings.volumeSystem >= 50) && 'text-muted', 'fa-icon')} />}
                                    <input type="range" className="custom-range w-100" min="0" max="100" step="1" id="volumeSystem" value={userSettings.volumeSystem} onChange={event => processAction('system_volume', event.target.value)} onMouseUp={() => saveRangeSlider('volume')} />
                                    <FaVolumeUp className={classNames((userSettings.volumeSystem < 50) ? 'text-muted' : 'text-white', 'fa-icon')} />
                                </Flex>
                            </Column>
                            <Column gap={1}>
                                <Text variant="white">Sonidos realizados por furnis</Text>
                                <Flex alignItems="center" gap={1}>
                                    {(userSettings.volumeFurni === 0) && <FaVolumeMute className={classNames((userSettings.volumeFurni >= 50) && 'text-muted', 'fa-icon')} />}
                                    {(userSettings.volumeFurni > 0) && <FaVolumeDown className={classNames((userSettings.volumeFurni >= 50) && 'text-muted', 'fa-icon')} />}
                                    <input type="range" className="custom-range w-100" min="0" max="100" step="1" id="volumeFurni" value={userSettings.volumeFurni} onChange={event => processAction('furni_volume', event.target.value)} onMouseUp={() => saveRangeSlider('volume')} />
                                    <FaVolumeUp className={classNames((userSettings.volumeFurni < 50) ? 'text-muted' : 'text-white', 'fa-icon')} />
                                </Flex>
                            </Column>
                            <Column gap={1}>
                                <Text variant="white">Canciones reproducidas por una Trax Machine</Text>
                                <Flex alignItems="center" gap={1}>
                                    {(userSettings.volumeTrax === 0) && <FaVolumeMute className={classNames((userSettings.volumeTrax >= 50) && 'text-muted', 'fa-icon')} />}
                                    {(userSettings.volumeTrax > 0) && <FaVolumeDown className={classNames((userSettings.volumeTrax >= 50) && 'text-muted', 'fa-icon')} />}
                                    <input type="range" className="custom-range w-100" min="0" max="100" step="1" id="volumeTrax" value={userSettings.volumeTrax} onChange={event => processAction('trax_volume', event.target.value)} onMouseUp={() => saveRangeSlider('volume')} />
                                    <FaVolumeUp className={classNames((userSettings.volumeTrax < 50) ? 'text-muted' : 'text-white', 'fa-icon')} />
                                </Flex>
                            </Column>
                        </Column>
                    }

                    {section === "performance" &&
                        <div>
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Text variant="white" bold fontSize={5}>Interfaz</Text>
                                </div>
                                <div>
                                    <Text variant="white">Ajustes de interfaz</Text>
                                </div>
                            </div>
                            <div className='w-100 mt-1 mb-3' style={{ borderBottom: "1px solid rgb(54, 54, 54)" }}></div>
                            <button onClick={() => changeFps("30")} className="btn btn-sm w-100 btn-dark" style={{ marginBottom: "2px" }}>Cambiar a 30 FPS</button>
                            <button onClick={() => changeFps("60")} className="btn btn-sm w-100 btn-dark" style={{ marginBottom: "2px" }}>Cambiar a 60 FPS</button>
                            <button onClick={() => changeFps("120")} className="btn btn-sm w-100 btn-dark" style={{ marginBottom: "2px" }}>Cambiar a 120 FPS</button>
                            <button onClick={() => changeFps("0")} className="btn btn-sm w-100 btn-dark">Deslimitar FPS</button>
                            <center>
                                <span className='badge bg-muted text-dark mt-1'>Deslimitar los FPS puede producir bajones de rendimiento.</span>
                            </center>

                            <Column gap={1} style={{ marginTop: "30px" }}>
                                <div className="d-flex justify-content-between">
                                    <div>
                                        <Text className='mt-1' variant="white" fontSize={6} bold>Color secundario</Text>
                                    </div>
                                    <div>
                                        <input onChange={(e) => changeSecondaryColor(e.target.value)} className="form-control form-control-color" type="color" value={secondaryColor} />
                                    </div>
                                </div>
                                <button onClick={() => resetColors()} className="btn btn-danger btn-sm w-100 mt-2">Restear color secundario</button>
                            </Column>
                        </div>
                    }
                </NitroCardContentView>
            </NitroCardView>
        }</>
    );
}
