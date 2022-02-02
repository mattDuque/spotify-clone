import React, { useEffect, useState } from 'react'
import { millisConverter, dateFormatter } from '../lib/utils'
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/spotifyAtoms';
import useSpotify from '../hooks/useSpotify';

function Song(props) {

    const spotifyApi = useSpotify()
    const [textColor, setTextColor] = useState('');
    const [showButton, setShowButton] = useState(false);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)


    const playSong = () => {
        setCurrentTrackId(props.item.track.id)
        spotifyApi.play({
            uris: [props.item.track.uri]
        }).catch(err => alert(err.body.error.message))
        setIsPlaying(true)
    }

    const pauseSong = () => {
        spotifyApi.pause()
            .catch(err => alert(err.body.error.message))
        setIsPlaying(false)
    }

    const handleClick = (e) => {
        if (e.detail === 2) {
            playSong()
        }
    }

    useEffect(() => {
        if (currentTrackId == props.item.track.id) setTextColor('text-[#1db954]')
        else setTextColor('')
    }, [currentTrackId]);

    return (
        <div className='flex text-white py-2 hover:bg-[#2a2a2a] rounded-sm justify-between'
            onMouseEnter={() => setShowButton(true)} onMouseLeave={() => setShowButton(false)} onClick={handleClick}
        >
            <div className={`flex items-center ${textColor}`}>
                <span className={!showButton ? 'mr-4' : 'mr-[9px]'}>
                    {showButton
                        ? <p>{
                            (isPlaying && (currentTrackId == props.item.track.id))
                                ? <PauseOutlinedIcon className='text-white' onClick={pauseSong} />
                                : <PlayArrowIcon onClick={playSong} />}
                        </p>
                        : <p>{(props.order < 9) && <span className='text-[#121212]'>0</span>}{props.order + 1}</p>}
                </span>
                <img
                    className='w-10 ml-1'
                    src={props.item.track.album.images[0].url}
                    alt="song cover art"
                />
                <div className='ml-4'>
                    <p className='w-36 lg:w-64 truncate'>{props.item.track.name}</p>
                    <p className='w-40 text-gray-400 text-sm'>{props.item.track.artists[0].name}</p>
                </div>
            </div>
            <div className='flex-1 items-left ml-auto md:ml-0 hidden md:inline px-3 w-2/5'>
                <p className='w-1/2 float-left truncate mr-3'>{props.item.track.album.name} </p>
                <p className='float-left hidden md:inline'>{dateFormatter(props.item.added_at)}</p>
            </div>
            <div className='pr-5'>
                <p > {millisConverter(props.item.track.duration_ms, 'song')} </p>
            </div>
        </div>
    )
}

export default Song