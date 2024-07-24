import { FC, useEffect, useState } from 'react';
import { AvatarEditorGridColorItem, GetConfiguration } from '../../../../api';
import { LayoutCurrencyIcon, LayoutGridItemProps } from '../../../../common';
import { LayoutGridItemNative } from '../../../../common/layout/LayoudGridItemNative';

export interface AvatarEditorPaletteSetItemProps extends LayoutGridItemProps
{
    colorItem: AvatarEditorGridColorItem;
}

export const AvatarEditorPaletteSetItem: FC<AvatarEditorPaletteSetItemProps> = props =>
{
    const { colorItem = null, children = null, ...rest } = props;
    const [ updateId, setUpdateId ] = useState(-1);

    const hcDisabled = GetConfiguration<boolean>('hc.disabled', false);

    useEffect(() =>
    {
        const rerender = () => setUpdateId(prevValue => (prevValue + 1));

        colorItem.notify = rerender;

        return () => colorItem.notify = null;
    }, [ colorItem ]);

    return (
        <LayoutGridItemNative itemHighlight itemColor={ colorItem.color } itemActive={ colorItem.isSelected } color className="clear-bg" { ...rest }>
            { !hcDisabled && colorItem.isHC && <LayoutCurrencyIcon className="position-absolute end-1 bottom-1" type="hc" /> }
            { children }
        </LayoutGridItemNative>
    );
}
