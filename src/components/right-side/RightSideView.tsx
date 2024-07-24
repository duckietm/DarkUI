import { FC, useState } from 'react';
import { Column } from '../../common';
import { useIsPlaying } from '../../hooks';
import { OfferView } from '../catalog/views/targeted-offer/OfferView';
import { GroupRoomInformationView } from '../groups/views/GroupRoomInformationView';
import { NotificationCenterView } from '../notification-center/NotificationCenterView';
import { PurseView } from '../purse/PurseView';
import { MysteryBoxExtensionView } from '../room/widgets/mysterybox/MysteryBoxExtensionView';
import { RoomPromotesWidgetView } from '../room/widgets/room-promotes/RoomPromotesWidgetView';
import RadioView from './RadioView';

export const RightSideView: FC<{}> = props =>
{

    //
    const [ isVisible, setIsVisible ] = useState(true);
    const { isPlaying } = useIsPlaying();

    return (
        <>
            { isVisible && !!!isPlaying &&
                <div className="nitro-right-side animate__animated animate__backInDown">
                    <Column position="relative" gap={ 1 }>
                        <PurseView />
                        <RadioView />
                        <GroupRoomInformationView />
                        <MysteryBoxExtensionView />
                        <OfferView/>
                        <RoomPromotesWidgetView />
                        <NotificationCenterView />
                    </Column>
                </div>
            }
        </>
    );
}
