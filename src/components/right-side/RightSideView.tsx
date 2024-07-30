import { FC, useState, useEffect } from 'react';
import { Column } from '../../common';
import { useIsPlaying } from '../../hooks';
import { OfferView } from '../catalog/views/targeted-offer/OfferView';
import { GroupRoomInformationView } from '../groups/views/GroupRoomInformationView';
import { NotificationCenterView } from '../notification-center/NotificationCenterView';
import { PurseView } from '../purse/PurseView';
import { MysteryBoxExtensionView } from '../room/widgets/mysterybox/MysteryBoxExtensionView';
import { RoomPromotesWidgetView } from '../room/widgets/room-promotes/RoomPromotesWidgetView';
import RadioView from './RadioView';
import { GetConfiguration } from '../../api'; // Import your configuration function

export const RightSideView: FC<{}> = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [radioEnabled, setRadioEnabled] = useState<boolean>(false); // State to store radioEnabled
    const { isPlaying } = useIsPlaying();

    useEffect(() => {
        // Fetch radio player configuration
        const fetchRadioConfig = async () => {
            const enabled = GetConfiguration('radioplayer');
            setRadioEnabled(enabled);
        };

        fetchRadioConfig();
    }, []);

    return (
        <>
            {isVisible && !isPlaying && (
                <div className="nitro-right-side animate__animated animate__backInDown">
                    <Column position="relative" gap={1}>
                        <PurseView />
                        {radioEnabled && <RadioView />} {/* Conditionally render RadioView */}
                        <GroupRoomInformationView />
                        <MysteryBoxExtensionView />
                        <OfferView />
                        <RoomPromotesWidgetView />
                        <NotificationCenterView />
                    </Column>
                </div>
            )}
        </>
    );
};
