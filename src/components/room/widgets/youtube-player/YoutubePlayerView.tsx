import { ILinkEventTracker } from '@nitrots/nitro-renderer';
import { FC, useEffect, useState } from 'react';
import Youtube, { Options } from 'react-youtube';
import { AddEventLinkTracker, RemoveLinkEventTracker } from '../../../../api';
import { Button, NitroCardContentView, NitroCardHeaderView, NitroCardView } from '../../../../common';
import { useNotification, useRoom } from '../../../../hooks';
import BackendApi from './api/BackendApi';
import YoutubeApi from './api/YoutubeApi';

import "./YoutubePlayer.css";

const KEY = "AIzaSyAFd7FdtRaSCP1-9QP5_vJ_voudKYi-SAs";

export const YoutubePlayerView: FC<{}> = props =>
{
    const [ isVisible, setIsVisible ] = useState(false)
    const [ videos, setVideos ] = useState([]);
    const [ termToSearch, setTermToSearch ] = useState("");
    const [ videoToPlay, setVideoToPlay ] = useState(null);
    const [ roomInfo, setRoomInfo ] = useState(null);
    const [ intervalId, setIntervalId ] = useState(null);
    const [ nextVideo, setNextVideo ] = useState("nope");

    const [ startVideo, setStartVideo ] = useState(0);
    const room = useRoom();
    const notification = useNotification();

    var vidToPlay = null;

    useEffect(() => {
        getSongStatus();
    }, [videoToPlay])

    useEffect(() => {
        if(nextVideo === "nope" || nextVideo === videoToPlay) return;
        else{
            if(nextVideo === null){
                setStartVideo(0);
                setVideoToPlay(null);
            } else {
                setVideoToPlay(nextVideo);
                setStartVideo(0);
            }
        }
    }, [nextVideo])

    useEffect(() => {
        if(isVisible){
            getRoomInfo();
            if(intervalId !== null) clearInterval(intervalId);
            setIntervalId(
                setInterval(getRoomInfo, 5000)
            );
        } else {
            if(intervalId !== null) clearInterval(intervalId);
            setIntervalId(null);
            setRoomInfo(null);
            setVideoToPlay(null);
            setNextVideo("nope");
            setStartVideo(0);
        }
    }, [isVisible])

    useEffect(() => () => {
        if(intervalId !== null) clearInterval(intervalId);
        setIntervalId(null);
        setRoomInfo(null);
        setVideoToPlay(null);
        setNextVideo("nope");
        setStartVideo(0);
    }, []);

    async function getRoomInfo(){
        if(isVisible){
            const responseApi = await BackendApi.get("/roomInfo", {
                params: {
                    id: room.roomSession.roomId
                }
            });
    
            setRoomInfo(responseApi.data);

            if(responseApi.data.actualVideo !== null){
                setNextVideo(responseApi.data.actualVideo.id);
            }
            else setVideoToPlay(null);
        }
    }

    const searchTerm = async () => {
        if(!(room.roomSession.isRoomOwner || room.roomSession.moderationSettings.allowKick)) return;
        const response = await YoutubeApi.get("/search", {
            params: {
                q: termToSearch,
                part: "snippet",
                maxResults: 4,
                type: 'video',
                key: `${KEY}`
            }
        });


        setVideos(response.data.items);
    }

    const queueVideo = async (video) => {
        if(!(room.roomSession.isRoomOwner || room.roomSession.moderationSettings.allowKick)) return;

        const response = await YoutubeApi.get("/videos", {
            params: {
                id: video.id.videoId,
                key: `${KEY}`,
                part: "contentDetails",
            }
        });

        const responseApi = await BackendApi.get("/addSong", {
            params: {
                roomId: room.roomSession.roomId,
                songId: video.id.videoId,
                thumbnail: encodeURIComponent(video.snippet.thumbnails.default.url),
                title: video.snippet.title,
                description: video.snippet.description,
                duration:YTDurationToSeconds(response.data.items[0].contentDetails.duration)
            }
        });

        if(responseApi.data.data === "room not found") console.log("error al subir una cancion");
        else{
            await getRoomInfo();
        }
    
        setVideos([]);
    }

    const deleteVideo = async (video) => {
        await BackendApi.get("/deleteSong", {
            params: {
                roomId: room.roomSession.roomId,
                songId: video
            }
        });

        await getRoomInfo();
    }

    const skipVideo = async () => {
        await BackendApi.get("/skipSong", {
            params: {
                roomId: room.roomSession.roomId
            }
        });

        await getRoomInfo();
    }

    function YTDurationToSeconds(duration) {
        var match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
      
        match = match.slice(1).map(function(x) {
          if (x != null) {
              return x.replace(/\D/, '');
          }
        });
      
        var hours = (parseInt(match[0]) || 0);
        var minutes = (parseInt(match[1]) || 0);
        var seconds = (parseInt(match[2]) || 0);
      
        return hours * 3600 + minutes * 60 + seconds;
    }

    useEffect(() => {
        if(termToSearch.length < 2) setVideos([]);
    }, [termToSearch])

    const youtubeOptions: Options = {
        height: '375',
        width: '508',
        playerVars: {
            autoplay: 1,
            disablekb: 1,
            controls: 1,
            origin: window.origin,
            modestbranding: 1,
            start: startVideo,
            end: 0,
        }
    }

    const changeTimeVideo = () => {
        setStartVideo(random(1, 100));
    }

    function random(min: number, max: number) {
        return Math.floor((Math.random() * (max - min + 1)) + min);
    }

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
                }
            },
            eventUrlPrefix: 'ytplayer/'
        };

        AddEventLinkTracker(linkTracker);

        return () => RemoveLinkEventTracker(linkTracker);
    }, [ setIsVisible ]);

    async function getSongStatus(){
        const responseApi = await BackendApi.get("/getCurrentTime", {
            params: {
                id: room.roomSession.roomId
            }
        });

        if(!(responseApi.data.data === "nothing playing" || responseApi.data.data === "room not found")){
            setStartVideo(responseApi.data.data);
        }
    }

    return (
        <>
            { isVisible &&
                <NitroCardView className='youtube-player-card'>
                    <NitroCardHeaderView headerText="YouTube Room"  onCloseClick={ event => setIsVisible(false) }/>
                    <NitroCardContentView>
                        {roomInfo === null ? <div className='alert bg-primary text-white text-center'><b>Cargando, espera por favor</b></div> : (
                        <div className='row'>
                            <div className='col-md-7'>
                                <div className='row gx-1'>
                                    <div className="col-md-11">
                                        <input className='form-control' onChange={(e) => setTermToSearch(e.target.value)} />
                                    </div>
                                    <div className="col-md-1">
                                        <Button className='w-100' style={{background: "var(--colors-main)", height: "34px"}} onClick={ searchTerm }>
                                            <img src="https://4.bp.blogspot.com/-Uvk9RYWRoXw/Xz2Pzw-_65I/AAAAAAABdL4/nd7f66N6EHY_W4TfTCJP0EkBrC3-fD1TgCPcBGAsYHg/s1600/Lupa2.png" />
                                        </Button>
                                    </div>
                                </div>
                                {videos.length > 0 && (
                                    <div className=''>
                                        <div className="row mt-2 gx-0">
                                            {videos.map((video) => 
                                                <div style={{cursor: "pointer"}} onClick={() => queueVideo(video)} key={video.id.videoId} className='row text-dark mb-2 youtube-search-video-card'>
                                                    <div className='col-md-3'>
                                                        <img src={video.snippet.thumbnails.default.url} />
                                                    </div>
                                                    <div className='col-md-8'>
                                                        <div className='youtube-search-video-title'>{video.snippet.title}</div>
                                                        <div><small>{video.snippet.description}</small></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {videoToPlay !== null &&
                                    <Youtube id="youtubePlayer" className={`mt-2 ${videos.length > 0 && 'youtube-player-hidden'}`} opts={youtubeOptions} videoId={videoToPlay} /> 
                                }
                            </div>
                            <div className='col-md-5'>
                                <b className='text-white'>Videos en cola</b> <span className='badge bg-primary' onClick={() => skipVideo()} style={{cursor: "pointer"}}>Saltar video actual</span>
                                {roomInfo.videos.length === 0 ? <div className='mt-2 alert bg-danger text-white text-center'>No hay videos en cola</div> : (
                                    <>
                                        {roomInfo.videos.map((video) =>
                                            <div style={{cursor: "pointer"}} key={video.id} className='row gx-0 text-dark mb-2 youtube-search-video-card'>
                                                <div className='col-md-5'>
                                                    <img src={decodeURIComponent(video.thumbnail)} />
                                                </div>
                                                <div className='col-md-6'>
                                                    <div className='youtube-search-video-title'>{video.title}</div>
                                                    <div><small>{video.title}</small></div>
                                                    <span style={{cursor: "pointer"}} onClick={() => deleteVideo(video.id)} className='badge bg-danger text-white'>Saltar</span>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        )}
                    </NitroCardContentView>
                </NitroCardView>
            }
        </>
    );
}
