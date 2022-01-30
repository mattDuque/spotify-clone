import React, { useState } from 'react'
import { millisConverter, dateFormatter } from '../lib/utils'
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useRecoilState } from 'recoil';
import { currentTrackIdState, isPlayingState } from '../atoms/spotifyAtoms';
import useSpotify from '../hooks/useSpotify';

function Song(props) {

    const spotifyApi = useSpotify()
    const [showButton, setShowButton] = useState(false);
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)

    const playSong = () => {
        setCurrentTrackId(props.item.track.id)
        spotifyApi.play({
            uris: [props.item.track.uri]
        }).catch(err => alert(err.body.error.message))
    }

    return (
        <div className='flex text-gray-400 py-1 hover:bg-[#2a2a2a] rounded-sm justify-between'
            onMouseEnter={() => setShowButton(true)} onMouseLeave={() => setShowButton(false)}
        >
            <div className='flex items-center space-x-4'>
                <span >
                    {showButton
                        ? <p> {isPlaying ? <PauseOutlinedIcon /> : <PlayArrowIcon onClick={() => playSong()} />} </p>
                        : <p>{props.order + 1}</p>}
                </span>
                <img
                    className='w-10 '
                    src={props.item.track.album.images[0].url}
                    alt="song cover art"
                />
                <div>
                    <p className='w-36 lg:w-64 truncate text-white'>{props.item.track.name}</p>
                    <p className='w-40'>{props.item.track.artists[0].name}</p>
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