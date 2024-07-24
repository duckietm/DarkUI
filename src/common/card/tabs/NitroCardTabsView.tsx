import { FC, useEffect, useMemo, useState } from 'react';
import { Flex, FlexProps } from '../..';

export const NitroCardTabsView: FC<FlexProps> = props =>
{
    const [backgroundUrl, setBackgroundUrl] = useState("https://files.habboemotion.com/resources/images/website_backgrounds/02.gif");
    const { justifyContent = 'center', gap = 1, classNames = [], children = null, ...rest } = props;

    const getClassNames = useMemo(() =>
    {
        const newClassNames: string[] = [ 'container-fluid', 'nitro-card-tabs', 'pt-1' ];

        if(classNames.length) newClassNames.push(...classNames);

        return newClassNames;
    }, [ classNames ]);

    useEffect(() => {
        var localStorage = window.localStorage;
        if(localStorage.getItem("tabs-background") != null) setBackgroundUrl(localStorage.getItem("tabs-background"));
    }, [])    

    return (
        <div style={{background: "rgba(24, 24, 24, 0.6)"}}>
            <Flex justifyContent={ justifyContent } gap={ gap } classNames={ getClassNames } { ...rest }>
                { children }
            </Flex>
        </div>
    );
}
