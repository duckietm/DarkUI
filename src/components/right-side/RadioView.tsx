import React, { useState, useEffect, useRef } from 'react';
import { GetConfiguration } from '../../api';
import { FaPause, FaPlay } from 'react-icons/fa';

const RadioView = () => {
  const radioUrl = GetConfiguration('stream.url') || ''; // Ensure radioUrl is defined
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (radioUrl) {
      const audioInstance = new Audio(radioUrl);
      audioInstance.volume = volume / 100;
      audioRef.current = audioInstance;

      const autoPlay = async () => {
        try {
          // Wait for 10 seconds before attempting to play
          await new Promise(resolve => setTimeout(resolve, 10000));
          await audioRef.current.play();
          setIsPlaying(true);
          setError('');
        } catch (err) {
          console.error('Error playing audio:', err);
          setError('Unable to play audio. Please try again.');
        }
      };

      autoPlay();

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = ''; // Clear the source
          audioRef.current = null; // Clear the reference
        }
      };
    } else {
      console.log('No radio stream available. Check UI-Config');
    }
  }, [radioUrl, volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayClick = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setError('');
        })
        .catch(err => {
          console.error('Error playing audio:', err);
          setError('Unable to play audio. Please try again.');
        });
    }
  };

  const handlePauseClick = (event) => {
    event.stopPropagation();
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  if (!radioUrl) {
    return <div>No radio stream available. Please try again later.</div>;
  }

  return (
    <div className='nitro-purse-container nitro-notification' style={{ marginTop: '0px', cursor: 'pointer' }}>
      <div style={{ float: 'right' }}>
        <div className='nitro-purse-element' style={{ width: '214px', height: '30px' }}>
          <div className='row' style={{ marginTop: '11px' }}>
            <div className='col-md-2'>
              {isPlaying ? (
                <FaPause
                  id='pauseRadio'
                  style={{ fontSize: '17px', cursor: 'pointer' }}
                  onClick={handlePauseClick}
                />
              ) : (
                <FaPlay
                  id='startRadio'
                  style={{ fontSize: '17px', cursor: 'pointer' }}
                  onClick={handlePlayClick}
                />
              )}
            </div>
            <div className='col-md-9'>
              <input
                type='range'
                className='form-range'
                id='customRange1'
                min='0'
                max='100'
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{ display: 'inline-block' }}
                disabled={!radioUrl}
                aria-label='Volume'
              />
            </div>
            <div className='col-md-1' />
          </div>
          {error && <div className='alert alert-warning'>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default RadioView;