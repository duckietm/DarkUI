import { useMemo, useState } from 'react';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useBetween } from 'use-between';
import { GetConfiguration } from '../../api';

const useDataState = () =>
{

    // SSO Ticket Import from URL
    const SSO = new URLSearchParams(window.location.search).get('sso');

    // WebSocket Connection
    const [ messageHistory, setMessageHistory ] = useState([]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(GetConfiguration<string>('api.socket.url'), { share: true });

    const getResponse = useMemo(() =>
    {
        
        let response = '';

        if ( lastMessage === null ) 
        {
            return response = JSON.stringify('No response yet');
        }

        if ( lastMessage.origin !== GetConfiguration<string>('api.socket.url') ) 
        {
            return response = JSON.stringify('Response is not from the same origin');
        }

        if ( lastMessage.isTrusted === false ) 
        {
            return response = JSON.stringify('Response is not trusted');
        }

        response = lastMessage.data;

        // console.log(response)

        return response;

    }, [ lastMessage ]);

    return { SSO, getResponse, lastMessage, sendMessage };
}

export const useData = () => useBetween(useDataState);
