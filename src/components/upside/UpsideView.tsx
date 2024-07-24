import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useRef, useState } from 'react';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../api';
import { Text } from '../../common';
import { useIsPlaying } from '../../hooks';
import './UpsideView.scss';
export const UpsideView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(true)
    const [ alerts, setAlerts ] = useState([]);
    const [ answer, setAnswer ] = useState('');
    const myRef = useRef();
    const sso = new URLSearchParams(window.location.search).get('sso');

    //
    const { isPlaying } = useIsPlaying();

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if(parts.length < 2) return;

                switch(parts[1])
                {
                    case 'o':
                        addNewAlert(parts[2], parts[3]);
                        return;
                }
            },
            eventUrlPrefix: 'mal/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    function getAlert(name, text, identifier)
    {
        return(
            <div className="animate__animated animate__fadeInDown" style={ { padding: '10px', backgroundColor: 'rgba(24, 24, 24, 0.6)', color: '#fff', borderRadius: '5px', width: '270px', marginBottom: '20px', wordBreak: 'break-all' } }>
                <div style={ { textAlign: 'left', marginBottom: '10px' } }>
                    <span className="badge bg-danger">Nueva mención recibida</span>
                    <span style={ { float: 'right', cursor: 'pointer' } }>
                        <span onClick={ () => closeAlert(identifier) } className="badge bg-danger">x</span>
                    </span>
                </div>
                <div style={ { marginBottom: '10px', fontSize: "13px" } }>
                    <b>{ name }:</b> &nbsp;
                    { text }
                </div>
                <div className='row gx-1'>
                    <div className='col-md-10'>
                        <input onChange={ e => handleAnswer(e.target.value) } className="form-control" type="text" style={ { marginBottom: '4px', fontSize: "11px" } } />
                    </div>
                    <div className='col-md-2'>
                        <button onClick={ () => sendResponse(name, identifier) } className="btn btn-dark btn-sm w-100">
                            <Text style={{fontSize: "9px"}} variant="white" bold><i className="fas fa-paper-plane"></i></Text>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    var response = '';

    function handleAnswer(a)
    {
        response = a;
    }

    function sendResponse(username, identifier)
    {
        fetch('https://int.habbe.es/?type=mentionUser&userToMention=' + username + '&message=' + response + '&sso=' + sso);
        closeAlert(identifier);
    }

    function closeAlert(identifier)
    {
        setAlerts(prev => (prev.filter(item => item.id !== identifier)));
    }
    

    async function addNewAlert(name, text)
    {
        var identifier = Math.random();
        var alert = getAlert(name, text, identifier);
        setAlerts((oldArray => [ ...oldArray, { id: identifier, alert: alert } ]));
        var audio = new Audio('https://swfs.habbe.es/sounds/plin.mp3');
        audio.play();
    }
    return (
        <>
            { isVisible && !!!isPlaying &&
                <>
                    <div className="nitro-left-side animate__animated animate__backInDown">
                        <div id="mentionAlerts" style={ { marginTop: '20px' } }>
                            { alerts != null &&
                            <>
                                { alerts.map((alert) => 
                                    <>{ alert.alert }</>
                                ) }
                            </>
                            }
                        </div>
                    </div>
                </>
            }
        </>
    );
}
