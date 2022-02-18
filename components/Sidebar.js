import React, { useEffect, useState } from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import PodcastsOutlinedIcon from '@mui/icons-material/PodcastsOutlined'
import { signOut, useSession } from 'next-auth/react'
import { useRecoilState } from 'recoil'
import { playlistIdState } from '../atoms/spotifyAtoms'
import useSpotify from '../hooks/useSpotify'
import { handleError } from '../lib/utils'

function Sidebar() {

    const spotifyApi = useSpotify()
    const { data: session, status } = useSession()
    const [playlists, setPlaylists] = useState([])
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then(data => {
                setPlaylists(data.body.items)
            }).catch(err => handleError(err.body.error.message))
        }

    }, [session, spotifyApi])

    return (
        <div className='text-gray-500 p-5 border-r border-gray-900 scrollbar-hide
        text-xs lg:text-sm sm:max-w-[12rem] lg:min-w-[13rem] hidden md:inline-flex pb-36
        '>
            <div className='space-y-4'>
                <img className='mb-8 h-11' src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png" alt="" />
                <button className='flex items-center space-x-2 hover:text-white'>
                    <HomeOutlinedIcon className='h-5 w-5' />
                    <p>Home</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <SearchOutlinedIcon className='h-5 w-5' />
                    <p>Search</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <LibraryMusicOutlinedIcon className='h-5 w-5' />
                    <p>Your Library</p>
                </button>

                <hr className='border-t-[0.1px] border-gray-900' />

                <button className='flex items-center space-x-2 hover:text-white'>
                    <AddOutlinedIcon className='h-5 w-5' />
                    <p>Create Playlist</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <FavoriteBorderOutlinedIcon className='h-5 w-5' />
                    <p>Liked Songs</p>
                </button>
                <button className='flex items-center space-x-2 hover:text-white'>
                    <PodcastsOutlinedIcon className='h-5 w-5' />
                    <p>Your Episodes</p>
                </button>

                <hr className='border-t-[0.1px] border-gray-900' />

                {playlists.map(playlist => (
                    <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className='cursor-pointer hover:text-white'>
                        {playlist.name}
                    </p>
                ))}
            </div>
        </div>

    )
}

export default Sidebar
