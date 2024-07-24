import { RoomDataParser } from '@nitrots/nitro-renderer';
import { FC, MouseEvent } from 'react';
import { CreateRoomSession, DoorStateType, GetSessionDataManager, TryVisitRoom } from '../../../../api';
import { Flex, LayoutGridItemProps, Text } from '../../../../common';
import { LayoutRoomSmallThumbnailView } from '../../../../common/layout/LayoutRoomSmallThumbnailView';
import { useNavigator } from '../../../../hooks';
import { NavigatorSearchResultItemInfoSmallView } from './NavigatorSearchResultItemInfoSmallView';

export interface NavigatorSearchResultItemViewProps extends LayoutGridItemProps
{
    roomData: RoomDataParser
    thumbnail?: boolean
}

export const NavigatorSearchResultItemView: FC<NavigatorSearchResultItemViewProps> = props =>
{
    const { roomData = null, children = null, thumbnail = false, ...rest } = props;
    const { setDoorData = null } = useNavigator();

    const getUserCounterColor = () =>
    {
        const num: number = (100 * (roomData.userCount / roomData.maxUserCount));

        let bg = 'bg-primary';

        if (num >= 92)
        {
            bg = 'bg-danger';
        }
        else if (num >= 50)
        {
            bg = 'bg-warning';
        }
        else if (num > 0)
        {
            bg = 'bg-success';
        }

        return bg;
    }

    const visitRoom = (event: MouseEvent) =>
    {
        if (roomData.ownerId !== GetSessionDataManager().userId)
        {
            if (roomData.habboGroupId !== 0)
            {
                TryVisitRoom(roomData.roomId);

                return;
            }

            switch (roomData.doorMode)
            {
                case RoomDataParser.DOORBELL_STATE:
                    setDoorData(prevValue =>
                    {
                        const newValue = { ...prevValue };

                        newValue.roomInfo = roomData;
                        newValue.state = DoorStateType.START_DOORBELL;

                        return newValue;
                    });
                    return;
                case RoomDataParser.PASSWORD_STATE:
                    setDoorData(prevValue =>
                    {
                        const newValue = { ...prevValue };

                        newValue.roomInfo = roomData;
                        newValue.state = DoorStateType.START_PASSWORD;

                        return newValue;
                    });
                    return;
            }
        }

        CreateRoomSession(roomData.roomId);
    }

    return (
        <Flex pointer overflow="hidden" alignItems="center" onClick={visitRoom} gap={2} className="navigator-item py-1" {...rest}>
            <Flex center gap={1}>
                <LayoutRoomSmallThumbnailView roomId={roomData.roomId} customUrl={roomData.officialRoomPicRef} />
                <div style={{ position: "relative" }}>
                    <div style={{position: "absolute", width: "60px", top: "10px", left: "-64px"}} className={ 'badge p-1 ' + getUserCounterColor() }>
                    <i className="fas fa-user" />
                        { roomData.userCount }
                    </div>
                    { (roomData.doorMode !== RoomDataParser.OPEN_STATE) && 
                        <i style={{position: "absolute", top: "-27px", left: "-19px"}} className={ ('icon icon-navigator-room-' + ((roomData.doorMode === RoomDataParser.DOORBELL_STATE) ? 'locked' : (roomData.doorMode === RoomDataParser.PASSWORD_STATE) ? 'password' : (roomData.doorMode === RoomDataParser.INVISIBLE_STATE) ? 'invisible' : '')) } /> }
                    { roomData.habboGroupId > 0 && <i style={{position: "absolute", top: "-26px", right: "49px"}} className="icon icon-navigator-room-group" /> }
                </div>
            </Flex>
            <Flex grow>
                <div>
                    <Text variant="white" bold fontSize={6} truncate>
                        {roomData.roomName === null || roomData.roomName === "" ? <>Descripción</> : (
                            <>{roomData.roomName.length < 38 ? <>{roomData.roomName}</> : <>{roomData.roomName.substring(0, 38)}...</>}</>
                        )}
                    </Text>
                    <div style={{ marginTop: "0px", marginBottom: "1px" }} />
                    <Text variant="white" truncate fontSize={6} small>{roomData.description === null || roomData.description === "" ? <>Descripción</> : (
                        <>{roomData.description.length < 45 ? <>{roomData.description}</> : <>{roomData.description.substring(0, 45)}...</>}</>
                    )}</Text>
                    <div style={{ marginTop: "-4px", marginBottom: "1px" }} />
                    <Text variant="muted" truncate style={{fontSize: "13px", textDecoration: "underline"}}>
                        {roomData.ownerName}
                    </Text>
                </div>
            </Flex>
            <Flex reverse alignItems="center" gap={1} className="px-2">
                <NavigatorSearchResultItemInfoSmallView roomData={roomData} />
            </Flex>
            {children}
        </Flex>
    );
}
