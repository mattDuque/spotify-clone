import React, { useCallback, useEffect, useState } from 'react'
import RepeatIcon from '@mui/icons-material/Repeat'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/spotifyAtoms'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from '../hooks/useSongInfo'
import Link from 'next/link'
import { debounce } from 'lodash'
import { handleError } from '../lib/utils'
import { resolveHref } from 'next/dist/shared/lib/router/router'

function Player() {

    const songInfo = useSongInfo()
    const spotifyApi = useSpotify()
    const [volume, setVolume] = useState(50);
    const { data: session, status } = useSession()
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState)

    const playSong = () => {
        spotifyApi.play()
            .catch(err => handleError(err.body.error.message))
        setIsPlaying(true)
    }

    const pauseSong = () => {
        spotifyApi.pause()
            .catch(err => handleError(err.body.error.message))
        setIsPlaying(false)
    }

    useEffect(() => {
        volumeDebounce(volume)
    }, [volume])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => setCurrentTrackId(data.body?.item.id)).catch(err => handleError(err.body.error.message))
            spotifyApi.getMyCurrentPlaybackState().then(data => setIsPlaying(data.body?.is_playing)).catch(err => handleError(err.body.error.message))
        }
    }, [currentTrackIdState, spotifyApi, session])

    const volumeDebounce = useCallback(
        debounce((volume) =>
            spotifyApi.setVolume(volume).catch(err => handleError(err.body.error.message))
            , 500), [])

    async function skipSong() {
        await spotifyApi.skipToNext()
        spotifyApi.getMyCurrentPlayingTrack().
            then(data => {
                setCurrentTrackId(data.body.item.id)
            }).catch(err => handleError(err.body.error.message))
    }

    return (
        <div className='sticky bottom-0'>
            {songInfo && <div className='h-24 bg-[#181818] grid grid-cols-3 px-2 md:px-3'>
                <div className='flex items-center' key={currentTrackId}>
                    <img
                        className='w-14 ml-1'
                        src={songInfo?.album.images[0].url}
                        alt="song cover art"
                    />
                    <div className='ml-4 text-white'>
                        <Link href={songInfo?.album.external_urls.spotify} >
                            <p className='w-36 lg:w-64 truncate hover:underline cursor-pointer text-sm'>{songInfo?.name}</p>
                        </Link>

                        <Link href={songInfo?.artists[0].external_urls.spotify} >
                            <p className='w-40 text-xs hover:underline cursor-pointer'>{songInfo?.artists[0].name}</p>
                        </Link>

                    </div>
                </div>
                <div className='text-[#b3b3b3] m-auto'>
                    <div className='space-x-4'>
                        <ShuffleIcon
                            onClick={() => spotifyApi.setShuffle('true').catch(err => handleError(err.body.error.message))}
                            className='text-xl hover:text-white' />
                        <SkipPreviousIcon
                            onClick={() => spotifyApi.skipToPrevious().catch(err => handleError(err.body.error.message))}
                            className='hover:text-white' />
                        {isPlaying
                            ? <PauseCircleIcon onClick={pauseSong} className='text-5xl text-white hover:scale-105' />
                            : <PlayCircleIcon onClick={playSong} className='text-5xl text-white hover:scale-105' />
                        }
                        <SkipNextIcon
                            onClick={skipSong}
                            className='hover:text-white ' />
                        <RepeatIcon
                            onClick={() => spotifyApi.setRepeat().catch(err => handleError(err.body.error.message))}
                            className='text-xl hover:text-white' />
                    </div>
                </div>
                <div className='flex items-center text-white ml-auto mr-3 space-x-1 '>
                    <VolumeUpIcon className='text-xl' />
                    <input type="range" className='h-1' min={0} max={100} onChange={e => setVolume(Number(e.target.value))} />
                </div>
            </div>}
        </div>
    )
}

export default Player

// ? <p> {isPlaying ? <PauseOutlinedIcon /> : <PlayArrowIcon onClick={() => playSong()} />} </p>
