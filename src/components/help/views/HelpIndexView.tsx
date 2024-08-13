import { GetCfhStatusMessageComposer } from '@nitrots/nitro-renderer';
import { FC } from 'react';
import { CreateLinkEvent, DispatchUiEvent, GetConfiguration, LocalizeText, ReportState, ReportType, SendMessageComposer } from '../../../api';
import { Button, Column, Text } from '../../../common';
import { GuideToolEvent } from '../../../events';
import { useHelp } from '../../../hooks';

export const HelpIndexView: FC<{}> = props =>
{
    const { setActiveReport = null } = useHelp();

    const onReportClick = () =>
    {
        setActiveReport(prevValue =>
        {
            const currentStep = ReportState.SELECT_USER;
            const reportType = ReportType.BULLY;

            return { ...prevValue, currentStep, reportType };
        });
    }

    const showEnables = () => {
        CreateLinkEvent('enable-list/show');
    }

    return (
        <>
            <Column grow center gap={ 1 }>
                <Text variant="white"  fontSize={ 3 }>{ LocalizeText('help.main.frame.title') }</Text>
                <Text variant="white" >{ LocalizeText('help.main.self.description') }</Text>
            </Column>
            <Column gap={ 1 }>
                <Button onClick={showEnables}>{ LocalizeText('widget.memenu.effects') }</Button>
                <Button onClick={ onReportClick }>{ LocalizeText('help.main.bully.subtitle') }</Button>
                <Button onClick={ () => DispatchUiEvent(new GuideToolEvent(GuideToolEvent.CREATE_HELP_REQUEST)) } disabled={ !GetConfiguration('guides.enabled') }>{ LocalizeText('help.main.help.title') }</Button>
                <Button disabled={ true }>{ LocalizeText('help.main.self.tips.title') }</Button>
            </Column>
            <Button variant="link" textColor="white" onClick={ () => SendMessageComposer(new GetCfhStatusMessageComposer(false)) }>{ LocalizeText('help.main.my.sanction.status') }</Button>
        </>
    )
}
