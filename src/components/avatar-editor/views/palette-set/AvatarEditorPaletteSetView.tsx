import { FC, useCallback, useEffect, useRef } from 'react';
import { AvatarEditorGridColorItem, CategoryData, IAvatarEditorCategoryModel } from '../../../../api';
import { AutoGrid } from '../../../../common';
import { AvatarEditorPaletteSetItem } from './AvatarEditorPaletteSetItemView';

export interface AvatarEditorPaletteSetViewProps {
    model: IAvatarEditorCategoryModel;
    category: CategoryData;
    paletteSet: AvatarEditorGridColorItem[];
    paletteIndex: number;
}

export const AvatarEditorPaletteSetView: FC<AvatarEditorPaletteSetViewProps> = ({ model, category, paletteSet, paletteIndex }) => {
    const elementRef = useRef<HTMLDivElement>(null);

    const selectColor = useCallback((item: AvatarEditorGridColorItem) => {
        const index = paletteSet.indexOf(item);

        if(index === -1) return;

        model.selectColor(category.name, index, paletteIndex);
    }, [model, category, paletteSet, paletteIndex]);

    useEffect(() => {
        if (!model || !category || !elementRef?.current) return;

        elementRef.current.scrollTop = 0;
    }, [model, category]);

    if (!model || !category) return <div>Loading...</div>;

    return (
        <AutoGrid innerRef={ elementRef } gap={ 1 } columnCount={ 5 } columnMinWidth={ 30 }>
            { paletteSet.length > 0 ? paletteSet.map((item, index) => (
                <AvatarEditorPaletteSetItem key={ index } colorItem={ item } onClick={() => selectColor(item)} />
            )) : <div>No colors available</div> }
        </AutoGrid>
    );
}
