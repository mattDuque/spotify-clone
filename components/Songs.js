import React from 'react'
import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/spotifyAtoms'
import Song from './Song'

function Songs() {

    const playlist = useRecoilValue(playlistState)

    return (
        <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
            {playlist?.tracks.items.map((item, i) => (
                <Song key={item.track.id} item={item} order={i} />
            ))}
        </div>
    )
}

export default Songs
