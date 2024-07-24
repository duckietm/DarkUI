import { FriendlyTime, HabboClubLevelEnum } from '@nitrots/nitro-renderer';
import { FC, useCallback, useMemo } from 'react';
import { CreateLinkEvent, GetConfiguration, LocalizeText } from '../../api';
import { Column, Flex, LayoutCurrencyIcon, Text } from '../../common';
import { usePurse } from '../../hooks';

export const PurseView: FC<{}> = props =>
{
    const { purse = null, hcDisabled = false } = usePurse();
    const displayedCurrencies = useMemo(() => GetConfiguration<number[]>('system.currency.types', []), []);
    const currencyDisplayNumberShort = useMemo(() => GetConfiguration<boolean>('currency.display.number.short', false), []);

    const getClubText = useMemo(() =>
    {
        if (!purse) return null;

        const totalDays = ((purse.clubPeriods * 31) + purse.clubDays);
        const minutesUntilExpiration = purse.minutesUntilExpiration;

        if (purse.clubLevel === HabboClubLevelEnum.NO_CLUB) return LocalizeText('purse.clubdays.zero.amount.text');

        else if ((minutesUntilExpiration > -1) && (minutesUntilExpiration < (60 * 24))) return FriendlyTime.shortFormat(minutesUntilExpiration * 60);

        else return FriendlyTime.shortFormat(totalDays * 86400);
    }, [purse]);

    const getCurrencyElements = useCallback((offset: number, limit: number = -1, seasonal: boolean = false) =>
    {
        if (!purse || !purse.activityPoints || !purse.activityPoints.size) return null;

        const types = Array.from(purse.activityPoints.keys()).filter(type => (displayedCurrencies.indexOf(type) >= 0));

        let count = 0;

        while (count < offset)
        {
            types.shift();

            count++;
        }

        count = 0;

        const elements: JSX.Element[] = [];

        for (const type of types)
        {
            if ((limit > -1) && (count === limit)) break;

            if (seasonal) elements.push(<div className='col-md-4 text-center'>
                <div style={{ display: "inline-block" }}>
                    <b>{purse.activityPoints.get(type)}</b>
                </div>
                <LayoutCurrencyIcon type={type} style={{ display: "inline-block", marginLeft: "5px", position: "relative", top: "3px" }} />
            </div>);
            else elements.push(<div className='col-md-4 text-center'>
                <div style={{ display: "inline-block" }}>
                    <b>{purse.activityPoints.get(type)}</b>
                </div>
                <LayoutCurrencyIcon type={type} style={{ display: "inline-block", marginLeft: "5px", position: "relative", top: "3px" }} />
            </div>);

            count++;
        }

        return elements;
    }, [purse, displayedCurrencies, currencyDisplayNumberShort]);

    if (!purse) return null;

    return (
        <Column className="nitro-purse-container" gap={1}>
            <div className="nitro-purse nitro-notification p-2">
                <div style={{borderBottom: "1px #363636 solid", paddingRight: "5px", paddingBottom: "10px" }}>
                    <div className='row gx-0'>
                        <div className='col-md-8'>
                            <div className='row gx-0'>
                                <div className='col-md-4 text-center'>
                                    <div style={{ display: "inline-block" }}>
                                        <b>{purse.credits}</b>
                                    </div>
                                    <LayoutCurrencyIcon type={-1} style={{ display: "inline-block", marginLeft: "5px", position: "relative", top: "3px" }} />
                                </div>
                                {getCurrencyElements(0, 2)}
                            </div>
                        </div>
                        <div className='col-md-4 text-center' style={{ borderLeft: "1px #363636 solid" }}>
                            <LayoutCurrencyIcon style={{ display: "inline-block", marginLeft: "5px", position: "relative", top: "3px" }} className="club-text" type="hc" />
                            <div style={{ display: "inline-block" }}>
                                <Text variant='white' small bold>Infinito</Text>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-2'>
                    <div className='row gx-2'>
                        <div className="col-md-4">
                            <Flex style={{height: "20px !important"}} center pointer className="nitro-purse-right-button help p-1 w-100" onClick={event => CreateLinkEvent('help/show')}>
                                <Text variant="white" small>{LocalizeText('help.button.cfh')}</Text>
                            </Flex>
                        </div>
                        <div className="col-md-4">
                            <Flex style={{height: "20px !important"}} center pointer className="nitro-purse-right-button disconnect p-1 w-100" onClick={event => window.location.href = "/index"}>
                                <i className="icon icon-purse-disconnect" />
                            </Flex>
                        </div>
                        <div className="col-md-4">
                            <Flex style={{height: "20px !important"}} center pointer className="nitro-purse-right-button settings p-1 w-100" onClick={event => CreateLinkEvent('user-settings/toggle')} >
                                <i className="icon icon-purse-settings" />
                            </Flex>
                        </div>
                    </div>
                </div>
            </div>
            {getCurrencyElements(2, -1, true)}
        </Column>
    );
}
