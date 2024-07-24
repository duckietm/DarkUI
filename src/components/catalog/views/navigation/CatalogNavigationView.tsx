import { FC, useEffect, useState } from 'react';
import { ICatalogNode } from '../../../../api';
import { AutoGrid, Column } from '../../../../common';
import { useCatalog } from '../../../../hooks';
import { CatalogSearchView } from '../page/common/CatalogSearchView';
import { CatalogNavigationItemView } from './CatalogNavigationItemView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationViewProps
{
    node: ICatalogNode;
}

export const CatalogNavigationView: FC<CatalogNavigationViewProps> = props =>
{
    const { node = null } = props;
    const { searchResult = null } = useCatalog();
    const [favourites, setFavourites] = useState(null);
    
    useEffect(() => {
        var localStorage = window.localStorage;
        if(localStorage.getItem("catalog-favourites") === null){
            setFavourites([]);
            return;
        }

        setFavourites(JSON.parse(localStorage.getItem("catalog-favourites")));
    }, []);
    
    return (
        <>
            {favourites !== null &&
                <>
                    <CatalogSearchView />
                    <Column fullHeight className="nitro-catalog-navigation-grid-container rounded p-1" overflow="hidden">
                        <AutoGrid id="nitro-catalog-main-navigation" gap={ 1 } columnCount={ 1 }>
                            { searchResult && (searchResult.filteredNodes.length > 0) && searchResult.filteredNodes.map((n, index) =>
                            {
                                return <CatalogNavigationItemView key={ index } node={ n } favourite={
                                    favourites.filter(x => x.pageId == n.pageId).length > 0 ? true : false
                                } />;
                            }) }
                            { !searchResult &&
                                <CatalogNavigationSetView node={ node } /> }
                        </AutoGrid>
                    </Column>
                </>
            }
        </>
    );
}
