import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { AddEventLinkTracker, GetConfiguration, LocalizeText, RemoveLinkEventTracker } from '../../api';
import { Column, Flex, Grid, NitroCardContentView, NitroCardHeaderView, NitroCardTabsItemView, NitroCardTabsView, NitroCardView } from '../../common';
import { useCatalog } from '../../hooks';
import { CatalogIconView } from './views/catalog-icon/CatalogIconView';
import { CatalogGiftView } from './views/gift/CatalogGiftView';
import { CatalogNavigationView } from './views/navigation/CatalogNavigationView';
import { GetCatalogLayout } from './views/page/layout/GetCatalogLayout';
import { MarketplacePostOfferView } from './views/page/layout/marketplace/MarketplacePostOfferView';

export const CatalogView: FC<{}> = props =>
{
    const { isVisible = false, setIsVisible = null, rootNode = null, currentPage = null, navigationHidden = false, setNavigationHidden = null, activeNodes = [], searchResult = null, setSearchResult = null, openPageByName = null, openPageByOfferId = null, activateNode = null, getNodeById, openPageById } = useCatalog();
    const [favourites, setFavourites] = useState(null);
    const [isFavoriteActive, setIsFavoriteActive] = useState(false);

    const goToFavouritePage = (id) => {
        setIsFavoriteActive(false);
        openPageById(id);
    }

    const deleteFavouritePage = (id) => {
        setFavourites(favourites.filter(x => x.pageId != id));
        window.localStorage.setItem("catalog-favourites", JSON.stringify(favourites.filter(x => x.pageId != id)));
    }

    useEffect(() => {
        if(isFavoriteActive){
            var localStorage = window.localStorage;
            if(localStorage.getItem("catalog-favourites") === null){
                setFavourites([]);
                return;
            }

            setFavourites(JSON.parse(localStorage.getItem("catalog-favourites")));
        }
    }, [isFavoriteActive])

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');
        
                if(parts.length < 2) return;
        
                switch(parts[1])
                {
                    case 'show':
                        setIsVisible(true);
                        return;
                    case 'hide':
                        setIsVisible(false);
                        return;
                    case 'toggle':
                        setIsVisible(prevValue => !prevValue);
                        return;
                    case 'open':
                        if(parts.length > 2)
                        {
                            if(parts.length === 4)
                            {
                                switch(parts[2])
                                {
                                    case 'offerId':
                                        openPageByOfferId(parseInt(parts[3]));
                                        return;
                                }
                            }
                            else
                            {
                                openPageByName(parts[2]);
                            }
                        }
                        else
                        {
                            setIsVisible(true);
                        }
        
                        return;
                }
            },
            eventUrlPrefix: 'catalog/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible, openPageByOfferId, openPageByName ]);

    return (
        <>
            { isVisible &&
                <NitroCardView uniqueKey="catalog" className="nitro-catalog" style={GetConfiguration('catalog.headers') ? { width: 710 } : {}}>
                    <NitroCardHeaderView headerText={LocalizeText('catalog.title')} onCloseClick={event => setIsVisible(false)} />
                    <NitroCardTabsView subClassName="w-100">
                        {rootNode && rootNode.children.length > 0 && rootNode.children.map((child, index) => {
                                if (!child.isVisible) return null;
                                // Generate a unique key using the index of the map function
                                const uniqueKey = `${child.pageId}-${index}`;
                                return (
                                    <NitroCardTabsItemView
                                        key={uniqueKey}
                                        isActive={child.isActive}
                                        onClick={(event) => {
                                            if (searchResult) setSearchResult(null);
                                            activateNode(child);
                                        }}
                                    >
                                        <Flex gap={GetConfiguration('catalog.tab.icons') ? 1 : 0} alignItems="center">
                                            {GetConfiguration('catalog.tab.icons') && <CatalogIconView icon={child.iconId} />}
                                            {child.localization}
                                        </Flex>
                                    </NitroCardTabsItemView>
                                );
                            })}
                    </NitroCardTabsView>
                    <NitroCardContentView>
                        {isFavoriteActive ?  (
                            <>
                                {favourites !== null && favourites.length > 0 ? (
                                    <div className='row gx-2'>
                                        {favourites.map((favourite) => 
                                            <div key={favourite.pageId} className='col-md-4 mb-2'>
                                                <div className='card' style={{backgroundColor: "#f0f0f0"}}>
                                                    <div className='card-body'>
                                                        <CatalogIconView icon={favourite.icon}></CatalogIconView>
                                                        <div className='text-dark' style={{display: "inline-block", float: "right"}}>{
                                                            favourite.name.length > 20 ? favourite.name.substring(0,20)+"..." : favourite.name
                                                        }</div>
                                                        <div className='row gx-1 mt-2'>
                                                            <div className='col-md-6'>
                                                                <button className='btn btn-success btn-sm w-100' onClick={() => goToFavouritePage(favourite.pageId)}>Ir</button>
                                                            </div>
                                                            <div className='col-md-6'>
                                                                <button className='btn btn-danger btn-sm w-100' onClick={() => deleteFavouritePage(favourite.pageId)}>Borrar</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ):(
                                    <div className='alert bg-danger text-white text-center'>
                                        <b>No tienes ninguna categoría seleccionada como favorita.</b>
                                    </div>
                                )}
                            </>
                        ):(
                            <Grid>
                                { !navigationHidden &&
                                    <Column size={ 3 } overflow="hidden">
                                        { activeNodes && (activeNodes.length > 0) &&
                                            <CatalogNavigationView node={ activeNodes[0] } /> }
                                    </Column> }
                                <Column size={ !navigationHidden ? 9 : 12 } overflow="hidden">
                                    { GetCatalogLayout(currentPage, () => setNavigationHidden(true)) }
                                </Column>
                            </Grid>
                        )}
                    </NitroCardContentView>
                </NitroCardView> }
            <CatalogGiftView />
            <MarketplacePostOfferView />
        </>
    );
}
