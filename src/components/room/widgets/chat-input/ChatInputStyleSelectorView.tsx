import { FC, MouseEvent, useEffect, useState } from 'react';
import { Overlay, Popover } from 'react-bootstrap';
import { Base, Flex, Grid, NitroCardContentView } from '../../../../common';
import { FaCommentDots } from "react-icons/fa";

interface ChatInputStyleSelectorViewProps
{
    chatStyleId: number;
    chatStyleIds: number[];
    selectChatStyleId: (styleId: number) => void;
}

export const ChatInputStyleSelectorView: FC<ChatInputStyleSelectorViewProps> = props =>
{
    const { chatStyleId = 0, chatStyleIds = null, selectChatStyleId = null } = props;
    const [ target, setTarget ] = useState<(EventTarget & HTMLElement)>(null);
    const [ selectorVisible, setSelectorVisible ] = useState(false);

    const selectStyle = (styleId: number) =>
    {
        selectChatStyleId(styleId);
        setSelectorVisible(false);
    }

    const toggleSelector = (event: MouseEvent<HTMLElement>) =>
    {
        let visible = false;

        setSelectorVisible(prevValue =>
        {
            visible = !prevValue;

            return visible;
        });

        if(visible) setTarget((event.target as (EventTarget & HTMLElement)));
    }

    useEffect(() =>
    {
        if(selectorVisible) return;

        setTarget(null);
    }, [ selectorVisible ]);

    return (
        <>
            <div className='nitro-chat-bubble-icon-container icon chatstyles-icon nitro-pointer' onClick={ toggleSelector }></div>
            <Overlay show={ selectorVisible } target={ target } placement="top">
                <Popover className="nitro-chat-style-selector-container image-rendering-pixelated" style={{border: "0px !important"}}>
                    <NitroCardContentView overflow="hidden" className="nitro-tooltip-bg">
                        <Grid columnCount={ 3 } overflow="auto">
                            { chatStyleIds && (chatStyleIds.length > 0) && chatStyleIds.map((styleId) =>
                            {
                                return (
                                    <Flex center pointer key={ styleId } className="bubble-parent-container" onClick={ event => selectStyle(styleId) }>
                                        <Base key={ styleId } className="bubble-container">
                                            <Base className={ `chat-bubble bubble-${ styleId }` }>&nbsp;</Base>
                                        </Base>
                                    </Flex>
                                );
                            }) }
                        </Grid>
                    </NitroCardContentView>
                </Popover>
            </Overlay>
        </>
    );
}
