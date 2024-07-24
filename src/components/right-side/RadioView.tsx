import { useState } from 'react';

const RadioView = () =>
{
    const radioUrl = "https://radio.playsec.net:8010/radio.mp3";
    const [ audio, setAudio ] = useState(new Audio(radioUrl))
    const [ volume, setVolume ] = useState(null);
    
    var isPlayed = false;
    var firstCheck = false;

    const startRadio = () => {
        audio.src = radioUrl;
        var resp = audio.play();

        if (resp!== undefined) {
            resp.then(_ => {
                document.getElementById("startRadio").style.display = "none";
                document.getElementById("pauseRadio").style.display = "inline-block";
                isPlayed = true;
            }).catch(error => {});
        }
    }

    const pauseRadio = () => {
        document.getElementById("startRadio").style.display = "inline-block";
        document.getElementById("pauseRadio").style.display = "none";
        audio.pause();

        audio.src = "";
        isPlayed = false;
    }

    const volumeChange = (vol) => {
        if(vol !== volume) setVolume(vol);
        if(vol == 100) return;
        else{
            if(vol.toString().length == 1) audio.volume = parseFloat("0.0" + vol);
            else audio.volume = parseFloat("0." + vol);
        }
    }
    

    if(volume !== null) volumeChange(volume);
    audio.autoplay = true; 

    return (
        <div className='nitro-purse-container nitro-notification' style={{ marginTop: "0px" }}>
            <div style={{ float: "right" }}>
                <div className="nitro-purse-element" style={{ width: "214px", height: "30px" }}>
                    <div className='row' style={{marginTop: "11px"}}>
                        <div className='col-md-2'>
                            <i className='fas fa-play' id="startRadio" style={{ display: "none", fontSize: "17px", cursor: "pointer" }} onClick={e => startRadio()} />
                            <i className='fas fa-pause' id="pauseRadio" style={{ fontSize: "17px", cursor: "pointer" }} onClick={e => pauseRadio()} />
                        </div>
                        <div className="col-md-9">
                            <input onChange={(e) => volumeChange(e.target.value)} style={{ display: "inline-block" }} type="range" className="form-range" id="customRange1"></input>
                        </div>
                        <div className="col-md-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RadioView
