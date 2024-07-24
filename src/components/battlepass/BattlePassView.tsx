import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { AddEventLinkTracker, GetConfiguration, RemoveLinkEventTracker } from '../../api';
import { NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../common';
import { openBattlePass } from '../../packets/OpenBattlePass';

import "./BattlePass.css";
import BattlePassReward from './BattlePassReward';

export const BattlePassView: FC<{}> = props =>
{
    const sso = new URLSearchParams(window.location.search).get('sso');
    const [isVisible, setIsVisible] = useState(false)
    const [questsCategory, setQuestsCategory] = useState("main");
    const [battlePassInfo, setBattlePassInfo] = useState(null);
    const [missions, setMissions] = useState(null);
    const [rewards, setRewards] = useState(null);

    const [messageHistory, setMessageHistory] = useState([]);
    const [socketUrl, setSocketUrl] = useState(GetConfiguration<string>('api.socket.url'));

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, { share: true });

    useEffect(() =>
    {
        if (isVisible)
        {
            setTimeout(() =>
            {
                sendMessage(JSON.stringify(new openBattlePass(sso)))
            }, 500)
        }
    }, [isVisible])

    useEffect(() =>
    {
        if (lastMessage !== null)
        {
            var message = JSON.parse(lastMessage.data);

            if (message.header === "battlepass" && message.data !== null)
            {
                setMissions(JSON.parse(message.data.missions));
                setRewards(JSON.parse(message.data.rewards).reverse())
                setBattlePassInfo(message.data);
            }

        }
    }, [lastMessage, setMessageHistory]);

    useEffect(() =>
    {
        const linkTracker: ILinkEventTracker = {
            linkReceived: (url: string) =>
            {
                const parts = url.split('/');

                if (parts.length < 2) return;

                switch (parts[1])
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
                }
            },
            eventUrlPrefix: 'battlepass/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [setIsVisible]);

    const renderer = ({ days, hours, minutes }) =>
    {
        return (
            <>
                <span className='badge bg-light text-dark'>{days} dias</span>&nbsp;
                <span className='badge bg-light text-dark'>{hours} horas</span>&nbsp;
                <span className='badge bg-light text-dark'>{minutes} minutos</span>&nbsp;
            </>
        );
    };

    const renderer2 = ({ days, hours, minutes }) =>
    {
        return (
            <>
                <span className='badge bg-light text-dark'>Acaba en {days}d {hours}h {minutes}m</span>&nbsp;
            </>
        );
    };

    const renderer3 = ({ hours, minutes }) =>
    {
        return (
            <>
                <span className='badge bg-light text-dark'>Acaba en {hours}h {minutes}m</span>
            </>
        );
    };

    return (
        <>
            {isVisible &&
                <NitroCardView className='battlepass-card'>
                    <NitroCardHeaderView headerText="Bobba Battle Pass" onCloseClick={event => setIsVisible(false)} />
                    <NitroCardContentView className='text-dark'>
                        {battlePassInfo !== null ? (
                            <>
                                <div className='alert bg-dark text-white text-center'>
                                    <b>LA TEMPORADA SE ACABARÁ EN</b> &nbsp;
                                    <Countdown
                                        date={battlePassInfo.endSeason * 1000}
                                        renderer={renderer}
                                    />
                                </div>
                                <div className='row' style={{ marginTop: "-15px" }}>
                                    <div className="col-md-3">
                                        <div className='battlepass-user'>
                                            <div className="row">
                                                <div className='col-md-4'>
                                                    <div className='battlepass-user-circle' style={{ backgroundImage: `url(https://imager.bobba.chat/?figure=${battlePassInfo.pLook}&direction=2&head_direction=2`, backgroundRepeat: "no-repeat", backgroundPosition: "center -10px" }} />
                                                </div>
                                                <div className='col-md-8'>
                                                    <div style={{ float: "right" }}>
                                                        <div style={{ textAlign: "right" }}>
                                                            <h3>
                                                                <span className='badge bg-dark'>
                                                                    {battlePassInfo.pUsername}
                                                                </span>
                                                            </h3>
                                                            <span style={{ fontSize: "12px" }} className='badge bg-primary'>
                                                                Nivel {battlePassInfo.pLevel}
                                                            </span>&nbsp;
                                                            <span style={{ fontSize: "12px" }} className='badge bg-light text-dark'>
                                                                XP {battlePassInfo.pXp}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-md-12 mt-4'>
                                                    <div className="progress" style={{ height: "31px" }}>
                                                        <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" role="progressbar" style={{ width: `${battlePassInfo.pXp}%` }}>{battlePassInfo.pXp}/100</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className='card battlepass-shadow text-white' style={{ backgroundColor: "rgb(42, 42, 42)" }}>
                                            <div className='card-body'>
                                                <b style={{ fontSize: "15px" }}>TUS PRÓXIMOS PREMIOS SON:</b><br />
                                                {battlePassInfo.pLevel >= 100 ? <div className='alert bg-success text-white text-center'><b>Has completado el pase de batalla.</b></div> : (
                                                    <>
                                                        {(battlePassInfo.pLevel % 5) === 0 ? (
                                                            <>
                                                                {rewards.filter(x => (x.levelRequired) === (5 * (Math.ceil(Math.abs((battlePassInfo.pLevel + 1) / 5))))).map((reward) =>
                                                                    <div key={reward.id}>
                                                                        <div className="row mt-3">
                                                                            <div className='col-md-4 text-center'>
                                                                                <BattlePassReward name={reward.rNormal.name} src={reward.rNormal.image} />
                                                                            </div>
                                                                            <div className='col-md-4 text-center'>
                                                                                <h3 className='mt-3'><span className='badge bg-dark text-white'>Nivel {reward.levelRequired}</span></h3>
                                                                            </div>
                                                                            <div className='col-md-4 text-center'>
                                                                                <BattlePassReward vip={true} name={reward.rVip.name} src={reward.rVip.image} />
                                                                            </div>
                                                                        </div>
                                                                        <div className='text-center'>
                                                                            <span className='badge bg-primary text-white mt-2'>
                                                                                {reward.levelRequired - battlePassInfo.pLevel} niveles para conseguir las recompensas
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {rewards.filter(x => x.levelRequired === (5 * (Math.ceil(Math.abs(battlePassInfo.pLevel / 5))))).map((reward) =>
                                                                    <div key={reward.id}>
                                                                        <div className="row mt-3">
                                                                            <div className='col-md-4 text-center'>
                                                                                <BattlePassReward name={reward.rNormal.name} src={reward.rNormal.image} />
                                                                            </div>
                                                                            <div className='col-md-4 text-center'>
                                                                                <h3 className='mt-3'><span className='badge bg-dark text-white'>Nivel {reward.levelRequired}</span></h3>
                                                                            </div>
                                                                            <div className='col-md-4 text-center'>
                                                                                <BattlePassReward vip={true} name={reward.rVip.name} src={reward.rVip.image} />
                                                                            </div>
                                                                        </div>
                                                                        <div className='text-center'>
                                                                            <span className='badge bg-primary text-white mt-2'>
                                                                                {reward.levelRequired - battlePassInfo.pLevel} niveles para conseguir las recompensas
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}

                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className='card battlepass-shadow text-white' style={{ backgroundColor: "rgb(42, 42, 42)" }}>
                                            <div className='card-body'>
                                                <b style={{ fontSize: "15px" }}>RETOS POR COMPLETAR ({missions.filter(x => x.taskUser > 0 && x.taskUser !== x.taskTotal).length})</b><br />
                                                <div className='battlepass-quests-to-complete mt-2'>
                                                    {missions.filter(x => x.taskUser > 0 && x.taskUser !== x.taskTotal).length > 0 && missions.filter(x => x.taskUser > 0 && x.taskUser !== x.taskTotal).map((mission) =>
                                                        <div key={mission.id} className='battlepass-quest-to-complete text-white mb-2'>
                                                            <div className='row'>
                                                                <div className='col-md-2 text-center'>
                                                                    <img style={{ width: "32px", height: "32px" }} src={mission.image} /><br />
                                                                    <span className='mt-1 badge bg-light text-dark'>{mission.taskUser}/{mission.taskTotal}</span>
                                                                </div>
                                                                <div className='col-md-10 battlepass-text-small'>
                                                                    <b>{mission.name.toUpperCase()}</b><br />
                                                                    {mission.description}
                                                                    <span className='badge bg-success text-white' style={{ float: "right" }}>+{mission.rewardXp} XP</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {missions.filter(x => x.taskUser > 0 && x.taskUser !== x.taskTotal).length === 0 &&
                                                        <div className='alert bg-success w-100 text-center text-white'>
                                                            <b>No tienes retos empezados sin completar.</b>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-4'>
                                        <div className='card battlepass-shadow text-white' style={{ backgroundColor: "rgb(42, 42, 42)" }}>
                                            <div className='card-body'>
                                                <b style={{ fontSize: "15px" }}>PREMIOS</b><br />
                                                <div className='battlepass-rewards'>
                                                    {rewards.map((reward) =>
                                                        <div key={reward.id} className="row mt-3">
                                                            <div className='col-md-4 text-center'>
                                                                <BattlePassReward name={reward.rNormal.name} src={reward.rNormal.image} />
                                                            </div>
                                                            <div className='col-md-4 text-center'>
                                                                <h3 className='mt-3'><span className='badge bg-dark text-white'>Nivel {reward.levelRequired}</span></h3>
                                                            </div>
                                                            <div className='col-md-4 text-center'>
                                                                <BattlePassReward vip={true} name={reward.rVip.name} src={reward.rVip.image} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-md-8'>
                                        <div className='card battlepass-shadow text-white' style={{ backgroundColor: "rgb(42, 42, 42)" }}>
                                            <div className='card-body'>
                                                <div className="d-flex justify-content-between">
                                                    <div>
                                                        <b style={{ fontSize: "15px" }}>RETOS</b><br />
                                                    </div>
                                                    <div>
                                                        {questsCategory !== "main" &&
                                                            <span onClick={() => setQuestsCategory("main")} className='badge bg-danger text-white' style={{ cursor: "pointer" }}>Volver</span>
                                                        }
                                                    </div>
                                                </div>
                                                {questsCategory === "main" &&
                                                    <div className='row mt-2'>
                                                        <div onClick={() => setQuestsCategory("first")} className='col-md-6 mb-2'>
                                                            <div className='battlepass-quests-categories'>
                                                                <div className='row'>
                                                                    <div className='col-md-3 text-center'>
                                                                        <img src="https://1.bp.blogspot.com/-l-LOh0VYaRc/X6d4on5TYfI/AAAAAAABfBc/Suc_j31l-o0eOmHR6s_10VMyWp3_6ZJFwCPcBGAsYHg/s0/1319__-7P.png" /><br />
                                                                        <span className='badge bg-light text-dark'>{missions.filter(x => x.categoryId === 1 && x.taskUser === x.taskTotal).length}/{missions.filter(x => x.categoryId === 1).length}</span>
                                                                    </div>
                                                                    <div className='col-md-9 text-white battlepass-text-small'>
                                                                        <b>PRIMEROS RETOS</b><br />
                                                                        Estas recompensas son para aquellos jugadores nuevos.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => setQuestsCategory("legendary")} className='col-md-6 mb-2'>
                                                            <div className='battlepass-quests-categories'>
                                                                <div className='row'>
                                                                    <div className='col-md-3 text-center'>
                                                                        <img src="https://4.bp.blogspot.com/-ZAhJWtog7dk/XK0oYhr-REI/AAAAAAABOsg/XPCdWA03pcosUsFOPQpoi4n_Okn133RaACKgBGAs/s1600/Image%2B1430.png" /><br />
                                                                        <span className='badge bg-light text-dark'>{missions.filter(x => x.categoryId === 2 && x.taskUser === x.taskTotal).length}/{missions.filter(x => x.categoryId === 2).length}</span>
                                                                    </div>
                                                                    <div className='col-md-9 text-white battlepass-text-small'>
                                                                        <b>RETOS LEGENDARIOS</b><br />
                                                                        Retos para verdaderas leyendas.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => setQuestsCategory("daily")} className='col-md-6 mb-2'>
                                                            <div className='battlepass-quests-categories'>
                                                                <div className='row'>
                                                                    <div className='col-md-3 text-center'>
                                                                        <img src="https://1.bp.blogspot.com/-r8_RZbeLImU/XK0oYru2UMI/AAAAAAABOsg/z_5fYAmOU0cGYkQ0NUX4G3868KEZtFjvACKgBGAs/s1600/v22_44.gif" /><br />
                                                                        <span className='badge bg-light text-dark'>{missions.filter(x => x.categoryId === 3 && x.taskUser === x.taskTotal).length}/{missions.filter(x => x.categoryId === 3).length}</span>
                                                                    </div>
                                                                    <div className='col-md-9 text-white battlepass-text-small'>
                                                                        <b>RETOS DIARIOS</b><br />
                                                                        Retos express de 24h.<br />
                                                                        <Countdown
                                                                            date={battlePassInfo.pDailyReset * 1000}
                                                                            renderer={renderer3}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => setQuestsCategory("quests")} className='col-md-6 mb-2'>
                                                            <div className='battlepass-quests-categories'>
                                                                <div className='row'>
                                                                    <div className='col-md-3 text-center'>
                                                                        <img src="https://1.bp.blogspot.com/-vVC46Yjuc7Y/X7MoU3dK7FI/AAAAAAABfRk/D0oBBODUfHgHtkTi7HrZkg6TCRHrEs9nwCPcBGAsYHg/s0/2330__-47B.png" /><br />
                                                                        <span className='badge bg-light text-dark'>{missions.filter(x => x.categoryId === 4 && x.taskUser === x.taskTotal).length}/{missions.filter(x => x.categoryId === 4).length}</span>
                                                                    </div>
                                                                    <div className='col-md-9 text-white battlepass-text-small'>
                                                                        <b>RETOS COMUNES</b><br />
                                                                        Retos para los jugadores mas casuales.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => setQuestsCategory("weekly")} className='col-md-6'>
                                                            <div className='battlepass-quests-categories'>
                                                                <div className='row'>
                                                                    <div className='col-md-3 text-center'>
                                                                        <img src="https://4.bp.blogspot.com/-fBLmpzBn8Zk/XK0oYhpISoI/AAAAAAABOsg/PAHDhpMOTQ48tEJcB6Mh4FKq1fb92Ba5ACKgBGAs/s1600/Image%2B1173.png" /><br />
                                                                        <span className='badge bg-light text-dark'>{missions.filter(x => x.categoryId === 5 && x.taskUser === x.taskTotal).length}/{missions.filter(x => x.categoryId === 5).length}</span>
                                                                    </div>
                                                                    <div className='col-md-9 text-white battlepass-text-small'>
                                                                        <b>RETOS SEMANALES</b><br />
                                                                        Reseteados cada semana.<br />
                                                                        <Countdown
                                                                            date={battlePassInfo.pWeeklyReset}
                                                                            renderer={renderer2}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div onClick={() => setQuestsCategory("special")} className='col-md-6'>
                                                            <div className='battlepass-quests-categories'>
                                                                <div className='row'>
                                                                    <div className='col-md-3 text-center'>
                                                                        <img src="https://1.bp.blogspot.com/-sBGlBKZstZw/X6Dc7tNSwyI/AAAAAAABe9M/5M_UHtB88hgozAahu2WyV7rQdZxv-mh_QCPcBGAsYHg/s0/1021__-5jG.png" /><br />
                                                                        <span className='badge bg-light text-dark'>{missions.filter(x => x.categoryId === 6 && x.taskUser === x.taskTotal).length}/{missions.filter(x => x.categoryId === 6).length}</span>
                                                                    </div>
                                                                    <div className='col-md-9 text-white battlepass-text-small'>
                                                                        <b>RETOS ESPECIALES</b><br />
                                                                        Retos especiales y raros.
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }

                                                {questsCategory === "first" &&
                                                    <div className='battlepass-quests-category mt-2'>
                                                        <div className='row'>
                                                            {missions.filter(x => x.categoryId === 1).map((mission) =>
                                                                <div key={mission.id} className='col-md-6'>
                                                                    <div className='battlepass-quest-to-complete text-white mb-2'>
                                                                        <div className='row'>
                                                                            <div className='col-md-2 text-center'>
                                                                                <img style={{ width: "32px", height: "32px" }} src={mission.image} /><br />
                                                                                <span className='mt-1 badge bg-light text-dark'>{mission.taskUser}/{mission.taskTotal}</span>
                                                                            </div>
                                                                            <div className='col-md-10'>
                                                                                <b>{mission.name.toUpperCase()}</b><br />
                                                                                {mission.description}
                                                                                <span className='badge bg-success text-white' style={{ float: "right" }}>+{mission.rewardXp} XP</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                }

                                                {questsCategory === "legendary" &&
                                                    <div className='battlepass-quests-category mt-2'>
                                                        <div className='row'>
                                                            {missions.filter(x => x.categoryId === 2).map((mission) =>
                                                                <div key={mission.id} className='col-md-6'>
                                                                    <div className='battlepass-quest-to-complete text-white mb-2'>
                                                                        <div className='row'>
                                                                            <div className='col-md-2 text-center'>
                                                                                <img style={{ width: "32px", height: "32px" }} src={mission.image} /><br />
                                                                                <span className='mt-1 badge bg-light text-dark'>{mission.taskUser}/{mission.taskTotal}</span>
                                                                            </div>
                                                                            <div className='col-md-10'>
                                                                                <b>{mission.name.toUpperCase()}</b><br />
                                                                                {mission.description}
                                                                                <span className='badge bg-success text-white' style={{ float: "right" }}>+{mission.rewardXp} XP</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                }

                                                {questsCategory === "daily" &&
                                                    <div className='battlepass-quests-category mt-2'>
                                                        <div className='row'>
                                                            {missions.filter(x => x.categoryId === 3).map((mission) =>
                                                                <div key={mission.id} className='col-md-6'>
                                                                    <div className='battlepass-quest-to-complete text-white mb-2'>
                                                                        <div className='row'>
                                                                            <div className='col-md-2 text-center'>
                                                                                <img style={{ width: "32px", height: "32px" }} src={mission.image} /><br />
                                                                                <span className='mt-1 badge bg-light text-dark'>{mission.taskUser}/{mission.taskTotal}</span>
                                                                            </div>
                                                                            <div className='col-md-10'>
                                                                                <b>{mission.name.toUpperCase()}</b><br />
                                                                                {mission.description}
                                                                                <span className='badge bg-success text-white' style={{ float: "right" }}>+{mission.rewardXp} XP</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                }

                                                {questsCategory === "quests" &&
                                                    <div className='battlepass-quests-category mt-2'>
                                                        <div className='row'>
                                                            {missions.filter(x => x.categoryId === 4).map((mission) =>
                                                                <div key={mission.id} className='col-md-6'>
                                                                    <div className='battlepass-quest-to-complete text-white mb-2'>
                                                                        <div className='row'>
                                                                            <div className='col-md-2 text-center'>
                                                                                <img style={{ width: "32px", height: "32px" }} src={mission.image} /><br />
                                                                                <span className='mt-1 badge bg-light text-dark'>{mission.taskUser}/{mission.taskTotal}</span>
                                                                            </div>
                                                                            <div className='col-md-10'>
                                                                                <b>{mission.name.toUpperCase()}</b><br />
                                                                                {mission.description}
                                                                                <span className='badge bg-success text-white' style={{ float: "right" }}>+{mission.rewardXp} XP</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                }

                                                {questsCategory === "weekly" &&
                                                    <div className='battlepass-quests-category mt-2'>
                                                        <div className='row'>
                                                            {missions.filter(x => x.categoryId === 5).map((mission) =>
                                                                <div key={mission.id} className='col-md-6'>
                                                                    <div className='battlepass-quest-to-complete text-white mb-2'>
                                                                        <div className='row'>
                                                                            <div className='col-md-2 text-center'>
                                                                                <img style={{ width: "32px", height: "32px" }} src={mission.image} /><br />
                                                                                <span className='mt-1 badge bg-light text-dark'>{mission.taskUser}/{mission.taskTotal}</span>
                                                                            </div>
                                                                            <div className='col-md-10'>
                                                                                <b>{mission.name.toUpperCase()}</b><br />
                                                                                {mission.description}
                                                                                <span className='badge bg-success text-white' style={{ float: "right" }}>+{mission.rewardXp} XP</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                }

                                                {questsCategory === "special" &&
                                                    <div className='battlepass-quests-category mt-2'>
                                                        <div className='row'>
                                                            {missions.filter(x => x.categoryId === 6).map((mission) =>
                                                                <div key={mission.id} className='col-md-6'>
                                                                    <div className='battlepass-quest-to-complete text-white mb-2'>
                                                                        <div className='row'>
                                                                            <div className='col-md-2 text-center'>
                                                                                <img style={{ width: "32px", height: "32px" }} src={mission.image} /><br />
                                                                                <span className='mt-1 badge bg-light text-dark'>{mission.taskUser}/{mission.taskTotal}</span>
                                                                            </div>
                                                                            <div className='col-md-10'>
                                                                                <b>{mission.name.toUpperCase()}</b><br />
                                                                                {mission.description}
                                                                                <span className='badge bg-success text-white' style={{ float: "right" }}>+{mission.rewardXp} XP</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className='h-100 d-flex align-items-center justify-content-center'>
                                <img src="https://www.habborator.org/archive/stickers/limited/NL/nl_coinguy_animated.gif" />
                            </div>
                        )}
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    );
}
