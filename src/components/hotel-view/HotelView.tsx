import { NitroConfiguration, RoomSessionEvent } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import { GetConfiguration } from '../../api';
import { useRoomSessionManagerEvent, useSessionInfo } from '../../hooks';

const widgetSlotCount = 7;

export const HotelView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(true);
    const { userFigure = null } = useSessionInfo();

    const [ topDiamonds, setTopDiamonds ] = useState([]);
    const [ topDuckets, setTopDuckets ] = useState([]);
    const [ viewPoints, setViewPoints ] = useState('');
    const sso = new URLSearchParams(window.location.search).get('sso');
    const [ loading, setLoading ] = useState(true);

    useEffect(() => 
    {
        fetch('https://int.habbe.es/?type=getHotelViewStats&sso=' + sso)
            .then(response => response.json())
            .then((response) => 
            { 
                setViewPoints(response.viewPoints);
                setTopDiamonds(response.diamonds);
                setTopDuckets(response.duckets);
                setLoading(false);
            })
    }, [])

    function getWidthProgressBar() 
    {
     
        return (parseInt(viewPoints) / 1.5) + '%'; 
    }

    function getImagerByFigure(figure) 
    {
        return 'url(https://imager.bobba.chat/avatarimage/' + figure + '&amp;direction=2&amp;head_direction=2)'; 
    } 

    function getProfileUrl(username) 
    {
        return 'https://bobba.chat/community/profile?user=' + username; 
    }

    useRoomSessionManagerEvent<RoomSessionEvent>([
        RoomSessionEvent.CREATED,
        RoomSessionEvent.ENDED ], event =>
    {
        switch(event.type)
        {
            case RoomSessionEvent.CREATED:
                setIsVisible(false);
                return;
            case RoomSessionEvent.ENDED:
                setIsVisible(event.openLandingView);
                return;
        }
    });

    if(!isVisible) return null;

    const backgroundColor = GetConfiguration('hotelview')['images']['background.colour'];
    const background = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['background']);
    const sun = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['sun']);
    const drape = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['drape']);
    const left = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['left']);
    const rightRepeat = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['right.repeat']);
    const right = NitroConfiguration.interpolate(GetConfiguration('hotelview')['images']['right']);

    return (
        <>
            <div className="landing-view" style={ { zIndex: '9' } }>
                <div className="left" />
            </div>
            <div className="nitro-hotel-view" style={ { zIndex: '9' } }>
                <div className="container h-100 py-3 overflow-hidden landing-widgets">
                    <div className="row h-100 animate__animated animate__fadeInDown" style={ { marginLeft: '100px', marginTop: '50px' } }>
                        { !loading && 
                        <div className="col-md-10 animate__animated animate__fadeInDown">
                            <div className="card" style={ { backgroundColor: 'rgba(24, 24, 24, 0.6)', border: '2px solid rgba(44, 45, 42, 255)', borderEndEndRadius: '6px', padding: '20px', borderRadius: '5px', marginBottom: '15px', } }>
                                <div className="row">
                                    <div className="col-md-10">
                                        <h4 style={ { color: '#fff' } }><b>Recompensa mensual</b></h4><br/>
                                        <div style={ { height: '30px' } } className="progress">
                                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={ { width: getWidthProgressBar() } }>
                                                { parseInt(viewPoints) / 1.5 }%
                                            </div>
                                        </div>
                                        <small style={ { color: '#fff' } }>Mantente conectado durante 150 horas para recibir la recompensa <b>({ viewPoints }/150)</b> - Disponible hasta el 1 de enero 2023</small>
                                    </div>
                                    <div className="col-md-2 text-center">
                                        <img style={ { marginTop: '17px' } } src="https://i.imgur.com/RJNXe26.png" />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="card" style={ { backgroundColor: 'rgba(24, 24, 24, 0.6)', border: '2px solid rgba(44, 45, 42, 255)', borderEndEndRadius: '6px' ,padding: '20px', borderRadius: '5px', marginBottom: '15px' } }>
                                        <h4 style={ { color: '#fff' } }><b>Top liras</b></h4><br/>
                                        { topDiamonds.map((top) => 
                                            <div className="row" style={ { padding: '7px', borderRadius: '5px', marginBottom: '5px' } }>
                                                <div className="col-md-2">
                                                    <div style={ { paddingBottom: '-15px' } }>
                                                        <div className="user-img" style={ { backgroundImage: getImagerByFigure(top.figure), backgroundPosition: '-11px -14px', width: '45px', height: '48px', marginLeft: '5px' } }></div>
                                                    </div>
                                                </div>
                                                <div className="col-md-10">
                                                    <br/>
                                                    <div style={ { float: 'right' } }>
                                                        <b>
                                                            <span style={ { fontSize: '14px' } } className="badge bg-dark"> 
                                                                <a className="text-white" href={ getProfileUrl(top.username) } target="_blank" rel="noreferrer">{ top.username }</a>
                                                            </span>
                                                        </b> &nbsp;
                                                        <b><span style={ { fontSize: '14px' } } className="badge bg-primary">{ top.vip_points } liras</span></b>
                                                    </div>
                                                </div>
                                            </div>
                                        ) }
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="card" style={ { backgroundColor: 'rgba(24, 24, 24, 0.6)', border: '2px solid rgba(44, 45, 42, 255)', borderEndEndRadius: '6px', padding: '20px', borderRadius: '5px', marginBottom: '15px' } }>
                                        <h4 style={ { color: '#fff' } }><b>Top créditos</b></h4><br/>
                                        { topDuckets.map((top) => 
                                            <div className="row" style={ { padding: '7px', borderRadius: '5px', marginBottom: '5px' } }>
                                                <div className="col-md-2">
                                                    <div style={ { paddingBottom: '-15px' } }>
                                                        <div className="user-img" style={ { backgroundImage: getImagerByFigure(top.figure), backgroundPosition: '-11px -14px', width: '45px', height: '48px', marginLeft: '5px' } }></div>
                                                    </div>
                                                </div>
                                                <div className="col-md-10">
                                                    <br/>
                                                    <div style={ { float: 'right' } }>
                                                        <b>
                                                            <span style={ { fontSize: '14px' } } className="badge bg-dark"> 
                                                                <a className="text-white" href={ getProfileUrl(top.username) } target="_blank" rel="noreferrer">{ top.username }</a>
                                                            </span>
                                                        </b> &nbsp;
                                                        <b><span style={ { fontSize: '14px' } } className="badge bg-info">{ top.activity_points } créditos</span></b>
                                                    </div>
                                                </div>
                                            </div>
                                        ) }
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}
