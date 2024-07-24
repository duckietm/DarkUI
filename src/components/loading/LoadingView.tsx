import { FC, useCallback, useMemo } from 'react';
import { GetConfiguration } from '../../api';
import { Base, Column, LayoutProgressBar, Text } from '../../common';

interface LoadingViewProps
{
    isError: boolean;
    message: string;
    percent: number;
}

export const LoadingView: FC<LoadingViewProps> = props =>
{
    const { isError = false, message = '', percent = 0 } = props;
    
    const loadingAdvices = GetConfiguration<string>('loading.text');
    
    const LoadingAdvice = useCallback(() => 
    {
        return (
            <div className="small w-75 mx-auto">
                { loadingAdvices ? loadingAdvices[Math.floor(Math.random() * loadingAdvices.length) + 0] : 'Cargando textos...' }
            </div>
        )
    }, [ loadingAdvices ]);

    const LoadingAdviceCached = useMemo(() => <LoadingAdvice />, [ LoadingAdvice ])
    
    return (
        <Column fullHeight position="relative" className="nitro-loading">
            <Base fullHeight className="container h-100 advice-height">
                <Column fullHeight alignItems="center" justifyContent="center">
                    <div className='nitro-loading-logo' />
                    <Column size={ 12 } className="text-center" alignItems="center">
                        { isError && (message && message.length) ?
                            <Base className="fs-4 text-shadow">{ message }</Base>
                            :
                            <>
                                <LayoutProgressBar progress={ percent } className="large" text={ `Bobba está cargando (${ percent.toFixed() }%)...` } />
                            </>
                        }
                    </Column>
                    <Base className="advice-loading">
                        <Text variant="white" fontWeight="bold">Consejos de Bobba</Text>
                        { LoadingAdviceCached }
                    </Base>
                </Column>
            </Base>
        </Column>
    );
}
