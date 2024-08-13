import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { SanctionSatusView } from './views/SanctionStatusView';
import { NameChangeView } from './views/name-change/NameChangeView';

export const EnablesView: FC<{}> = props =>
{
    const [isVisible, setIsVisible] = useState(false);
    const [effects, setEffects] = useState(null);

    const onClose = () => {
        setIsVisible(false);
    }

    const getEffectsData = () => {
        const effectsUrl = GetConfiguration('enable-list.url') || '';

        fetch(effectsUrl)
            .then(response => response.json())
            .then(obj => {
                setEffects(obj.effects.filter(effect => !effect.id.includes('.')));
            })
            .catch(error => {
                console.error('Error fetching effects:', error);
            });
    }

    useEffect(() => {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) => {
                const parts = url.split('/');

                if (parts.length < 2) return;

                switch (parts[1]) {
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
                    <NitroCardHeaderView headerText={ LocalizeText('widget.memenu.effects') } onCloseClick={onClose} />
                    <NitroCardContentView className="text-white bg-black">
                        {effects === null ? (
                            <div className='alert bg-warning text-white text-center'>
                                <h4>{ LocalizeText('navigator.loading') }</h4>
                            </div>
                        ) : (
                            <div className='row'>
                                {effects.length > 0 && effects.map((effect, index) => {
                                    const avatarBaseUrl = GetConfiguration('avatar.loading.url') || '';
                                    const avatarUrl = `${avatarBaseUrl}hd-180-1390.hr-989999843-61.ch-215-94.lg-275-62.sh-300-62&gesture=sml&direction=2&effect=${effect.id}&img_format=gif`;
                                    
                                    return (
                                        <div className='col-md-4 text-center' key={index}>
                                            <img
                                                src={avatarUrl}
                                                alt={`Effect ${effect.id}`}
                                                className="img-fluid"
                                            />
                                            <span className='badge bg-dark text-white'>Enable ID: {effect.id}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </NitroCardContentView>
                </NitroCardView>}
            <SanctionSatusView />
            <NameChangeView />
        </>
    );
}
