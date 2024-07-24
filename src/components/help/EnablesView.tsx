import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { SanctionSatusView } from './views/SanctionStatusView';
import { NameChangeView } from './views/name-change/NameChangeView';

export const EnablesView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [effects, setEffects] = useState(null);

    const onClose = () =>
    {
        setIsVisible(false);
    }

    const getEffectsData = () =>
    {
        fetch("https://swfs.habbe.es/gamedata/EffectMap.json")
            .then((response) => response.json())
            .then((obj) =>
            {
                setEffects(obj.effects.filter(obj => !obj.id.includes(".")));
            });
    }

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
                        getEffectsData();
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                }
            },
            eventUrlPrefix: 'enable-list/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, []);


    return (
        <>
            {isVisible &&
                <NitroCardView className="nitro-help">
                    <NitroCardHeaderView headerText="Lista de enables" onCloseClick={onClose} />
                    <NitroCardContentView className="text-black">
                        {effects === null ? <div className='alert bg-warning text-white text-center'><h4>Cargando, espera por favor.</h4></div> : (
                            <div className='row'>
                                {effects.length > 0 && effects.map((effect, index) =>
                                    <div className='col-md-3 text-center' key={index}>
                                        <img src={`https://imager.bobba.chat/avatarimage/hd-180-1390.hr-989999843-61.ch-215-94.lg-275-62.sh-300-62&gesture=sml&direction=2&effect=${effect.id}&img_format=gif`} />
                                        <span className='badge bg-dark text-white'>ID: {effect.id}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </NitroCardContentView>
                </NitroCardView>}
            <SanctionSatusView />
            <NameChangeView />
        </>
    );
}
