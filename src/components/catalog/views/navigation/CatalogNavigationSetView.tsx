import { FC, useEffect, useState } from 'react';
import { ICatalogNode } from '../../../../api';
import { CatalogNavigationItemView } from './CatalogNavigationItemView';

export interface CatalogNavigationSetViewProps
{
    node: ICatalogNode;
    child?: boolean;
}

export const CatalogNavigationSetView: FC<CatalogNavigationSetViewProps> = props =>
{
    const { node = null, child = false } = props;
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
                    { node && (node.children.length > 0) && node.children.map((n, index) =>
                    {
                        if(!n.isVisible) return null;
                            
                        return <CatalogNavigationItemView key={ index } node={ n } child={ child } favourite={
                            favourites.filter(x => x.pageId == n.pageId).length > 0 ? true : false
                        } />
                    }) }
                </>
            }
        </>
    );
}
