import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC, useState } from 'react';
import { ICatalogNode } from '../../../../api';
import { Base, LayoutGridItem, Text } from '../../../../common';
import { useCatalog } from '../../../../hooks';
import { CatalogIconView } from '../catalog-icon/CatalogIconView';
import { CatalogNavigationSetView } from './CatalogNavigationSetView';

export interface CatalogNavigationItemViewProps
{
    node: ICatalogNode;
    child?: boolean;
    favourite: boolean;
}

export const CatalogNavigationItemView: FC<CatalogNavigationItemViewProps> = props =>
{
    const { node = null, child = false } = props;
    const { activateNode = null } = useCatalog();
    const [favourite, setFavourite] = useState(props.favourite);

    const changeFavourite = (status) => {
        var localStorage = window.localStorage;
        setFavourite(status);
        
        if(status){
            if(localStorage.getItem("catalog-favourites") === null){
                var catalogFavourites = [];
                catalogFavourites.push(
                    {
                        name: node.localization,
                        icon: node.iconId,
                        pageId: node.pageId
                    }
                )

                localStorage.setItem("catalog-favourites", JSON.stringify(catalogFavourites));
            }
            else{
                var catalogF = JSON.parse(localStorage.getItem("catalog-favourites"));
                if(catalogF.filter(x => x.pageId == node.pageId).length > 0) return;
                catalogF.push(
                    {
                        name: node.localization,
                        icon: node.iconId,
                        pageId: node.pageId
                    }
                )

                localStorage.setItem("catalog-favourites", JSON.stringify(catalogF));
            }
        } else {
            if(localStorage.getItem("catalog-favourites") === null) return;
            else{
                var catalogF = JSON.parse(localStorage.getItem("catalog-favourites"));
                localStorage.setItem("catalog-favourites", JSON.stringify(catalogF.filter(x => x.pageId != node.pageId)));
            }
        }
    }

    return (
        <Base className="nitro-catalog-navigation-section">
            <LayoutGridItem gap={ 1 } column={ false } itemActive={ node.isActive } onClick={ event => activateNode(node) } className={ child ? 'inset' : '' }>
                <CatalogIconView icon={ node.iconId } />
                <Text variant={node.isActive ? "black" : "white"} grow truncate>{ node.localization }</Text>
                <i onClick={() => changeFavourite(!favourite)} style={{color: `${favourite ? "#fff" : "#000"}`, cursor: "pointer"}} className="fas fa-star"></i>
                { node.isBranch &&
                    <FontAwesomeIcon icon={ node.isOpen ? 'caret-up' : 'caret-down' } /> }
            </LayoutGridItem>
            { node.isOpen && node.isBranch &&
                <CatalogNavigationSetView node={ node } child={ true } /> }
        </Base>
    );
}
