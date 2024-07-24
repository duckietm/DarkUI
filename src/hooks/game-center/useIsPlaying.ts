import { useEffect, useState } from 'react';
import { useBetween } from 'use-between';
import { useData } from '../communicator';

const useIsPlayingState = () => 
{

    const { getResponse, sendMessage, lastMessage, SSO } = useData();
    const [ isPlaying, setIsPlaying ] = useState(false);
    const [ winners, setWinners ] = useState([]);

    useEffect(() => 
    {
        let message = JSON.parse(getResponse);

        if(message.header === 'gameInfo' && message.data !== null) 
        {
            setIsPlaying(true);
        }

    }, [ getResponse, lastMessage ]);
    
    return {
        isPlaying, setIsPlaying,
        winners, setWinners
    }
}

export const useIsPlaying = () => useBetween(useIsPlayingState);
