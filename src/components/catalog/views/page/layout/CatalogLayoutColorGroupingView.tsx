import { ColorConverter } from '@nitrots/nitro-renderer';
import { FC, useMemo, useState } from 'react';
import { FaFillDrip } from 'react-icons/fa';
import { IPurchasableOffer } from '../../../../../api';
import { AutoGrid, Base, Button, Column, Flex, Grid, LayoutGridItem, Text } from '../../../../../common';
import { useCatalog } from '../../../../../hooks';
import { CatalogGridOfferView } from '../common/CatalogGridOfferView';
import { CatalogAddOnBadgeWidgetView } from '../widgets/CatalogAddOnBadgeWidgetView';
import { CatalogLimitedItemWidgetView } from '../widgets/CatalogLimitedItemWidgetView';
import { CatalogPurchaseWidgetView } from '../widgets/CatalogPurchaseWidgetView';
import { CatalogSpinnerWidgetView } from '../widgets/CatalogSpinnerWidgetView';
import { CatalogTotalPriceWidget } from '../widgets/CatalogTotalPriceWidget';
import { CatalogViewProductWidgetView } from '../widgets/CatalogViewProductWidgetView';
import { CatalogLayoutProps } from './CatalogLayout.types';

export interface CatalogLayoutColorGroupViewProps extends CatalogLayoutProps
{

}

export const CatalogLayoutColorGroupingView : FC<CatalogLayoutColorGroupViewProps> = props =>
{
    const { page = null } = props;
    const [ colorableItems, setColorableItems ] = useState<Map<string, number[]>>(new Map<string, number[]>());
    const { currentOffer = null, setCurrentOffer = null } = useCatalog();
    const [ colorsShowing, setColorsShowing ] = useState<boolean>(false);

    const sortByColorIndex = (a: IPurchasableOffer, b: IPurchasableOffer) =>
    {
        if (((!(a.product.furnitureData.colorIndex)) || (!(b.product.furnitureData.colorIndex))))
        {
            return 1;
        }
        if (a.product.furnitureData.colorIndex > b.product.furnitureData.colorIndex)
        {
            return 1;
        }
        if (a == b)
        {
            return 0;
        }
        return -1;
    }

    const sortyByFurnitureClassName = (a: IPurchasableOffer, b: IPurchasableOffer) =>
    {
        if (a.product.furnitureData.className > b.product.furnitureData.className)
        {
            return 1;
        }
        if (a == b)
        {
            return 0;
        }
        return -1;
    }

    const selectOffer = (offer: IPurchasableOffer) =>
    {
        offer.activate();
        setCurrentOffer(offer);
    }

    const selectColor = (colorIndex: number, productName: string) =>
    {
        const fullName = `${ productName }*${ colorIndex }`;
        const index = page.offers.findIndex(offer => offer.product.furnitureData.fullName === fullName);
        if (index > -1)
        {
            selectOffer(page.offers[index]);
        }
    }

    const offers = useMemo(() =>
    {
        const offers: IPurchasableOffer[] = [];
        const addedColorableItems = new Map<string, boolean>();
        const updatedColorableItems = new Map<string, number[]>();

        page.offers.sort(sortByColorIndex);

        page.offers.forEach(offer =>
        {
            if(!offer.product) return;

            const furniData = offer.product.furnitureData;

            if(!furniData || !furniData.hasIndexedColor)
            {
                offers.push(offer);
            }
            else
            {
                const name = furniData.className;
                const colorIndex = furniData.colorIndex;

                if(!updatedColorableItems.has(name))
                {
                    updatedColorableItems.set(name, []);
                }

                let selectedColor = 0xFFFFFF;
                
                if(furniData.colors)
                {
                    for(let color of furniData.colors)
                    {
                        if(color !== 0xFFFFFF) // skip the white colors
                        {
                            selectedColor = color;
                        }
                    }

                    if(updatedColorableItems.get(name).indexOf(selectedColor) === -1)
                    {
                        updatedColorableItems.get(name)[colorIndex] = selectedColor;
                    }

                }

                if(!addedColorableItems.has(name))
                {
                    offers.push(offer);
                    addedColorableItems.set(name, true);
                }
            }
        });
        offers.sort(sortyByFurnitureClassName);
        setColorableItems(updatedColorableItems);
        return offers;
    }, [ page.offers ]);

    return (
        <Grid>
            <Column size={ 7 } overflow="hidden">
                <AutoGrid columnCount={ 5 }>
                    { (colorsShowing && currentOffer && colorableItems.has(currentOffer.product.furnitureData.className)) && colorableItems.get(currentOffer.product.furnitureData.className).map((color, index) => (
                        <LayoutGridItem key={index} itemHighlight itemActive={currentOffer.product.furnitureData.colorIndex === index} className="clear-bg" onClick={() => selectColor(index, currentOffer.product.furnitureData.className)} >
                            <div style={{ width: '100%', height: '100%', backgroundColor: ColorConverter.int2rgb(color) }} />
						</LayoutGridItem>
					)) }
                </AutoGrid>
            </Column>
            <Column center={ !currentOffer } size={ 5 } overflow="hidden">
                { !currentOffer &&
                    <>
                        { !!page.localization.getImage(1) && <img alt="" src={ page.localization.getImage(1) } /> }
                        <Text variant="white" center dangerouslySetInnerHTML={ { __html: page.localization.getText(0) } } />
                    </> }
                { currentOffer &&
                    <>
                        <Base position="relative" overflow="hidden">
                            <CatalogViewProductWidgetView />
                            <CatalogAddOnBadgeWidgetView position="absolute" className="bg-muted rounded bottom-1 end-1" />
                            { currentOffer.product.furnitureData.hasIndexedColor &&
                                <Button position="absolute" className="bottom-1 start-1" onClick={ event =>setColorsShowing(prev => !prev) }>
                                    <FaFillDrip className="fa-icon" />
                                </Button> }
                        </Base>
                        <Column grow gap={ 1 }>
                            <CatalogLimitedItemWidgetView fullWidth />
                            <Text variant="white" grow truncate>{ currentOffer.localizationName }</Text>
                            <Flex justifyContent="between">
                                <Column gap={ 1 }>
                                    <CatalogSpinnerWidgetView />
                                </Column>
                                <CatalogTotalPriceWidget justifyContent="end" alignItems="end" />
                            </Flex>
                            <CatalogPurchaseWidgetView />
                        </Column>
                    </> }
            </Column>
        </Grid>
    );
}
