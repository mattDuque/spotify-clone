import React, { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/spotifyAtoms'
import { millisConverter } from '../lib/utils'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

function Center() {

    const colors = [
        'from-red-500', 'from-rose-500',
        'from-yellow-500', 'from-amber-500',
        'from-blue-500', 'from-sky-500',
        'from-green-500', 'from-emerald-500',
        'from-purple-500', 'from-violet-500',
        'from-pink-500', 'from-fuchsia-500'
    ]

    const { data: session, status } = useSession()
    const spotifyApi = useSpotify()
    const [color, setColor] = useState()
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState)
    const [playlistLenght, setPlaylistLenght] = useState()

    useEffect(() => {
        setColor(shuffle(colors).pop())
    }, [playlistId])

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getPlaylist(playlistId).then(data => {
                setPlaylist(data.body)
                let runtime = []
                data.body?.tracks.items.map((i) => {
                    runtime.push(i.track.duration_ms)
                })
                setPlaylistLenght(playlistRuntime(runtime))
            }).catch(e => { alert(e); console.log(e) })
        }
    }, [session, spotifyApi, playlistId])

    function playlistRuntime(runtime) {
        runtime = runtime.reduce(function (a, b) {
            return a + b;
        }, 0)

        return millisConverter(runtime, 'playlist')
    }

    return (
        <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
            <header className='absolute top-5 right-8'>
                <div className='flex items-center bg-black space-x-2 font-semibold text-white
                    opacity-90 hover:opacity-80 cursor-pointer rounded-full p-0.5 pr-2'
                    onClick={signOut}>
                    <img className='rounded-full w-7'
                        src={session?.user.image} alt="" />
                    <h2>{session?.user.name}</h2>
                    <ArrowDropDownOutlinedIcon className='w-6' />
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b ${color} h-80 text-white p-8`}>
                <img
                    className='h-48 shadow-2xl'
                    src={playlist?.images[0]?.url}
                    alt="playlist cover art" />
                <div>
                    <p className='font-semibold'>PLAYLIST</p>
                    <h1 className='text-4xl md:text-6xl xl:text-8xl font-bold'>{playlist?.name}</h1>
                    <p className='text-gray-500 mt-3'>{playlist?.description}</p>
                    <p className='text-gray-500'>
                        <a
                            className='text-white font-semibold no-underline hover:underline;'
                            href={playlist?.owner.external_urls.spotify}
                        >
                            {playlist?.owner.display_name}
                        </a> •
                        <span> {playlist?.followers.total} likes</span> •
                        <span> {playlist?.tracks.total} songs, {playlistLenght}</span>
                        <span> </span>
                    </p>
                </div>
            </section>
            <section>
                <Songs />
            </section>
        </div>
    )
}

export default Center
