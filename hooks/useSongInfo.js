import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentTrackIdState } from '../atoms/spotifyAtoms';
import useSpotify from './useSpotify';

function useSongInfo() {

    const spotifyApi = useSpotify()
    const [songInfo, setSongInfo] = useState(null)
    const currentTrackId = useRecoilValue(currentTrackIdState)

    const url = `https://api.spotify.com/v1/tracks/${currentTrackId}`

    useEffect(() => {
        const fetchSongInfo = async () => {
            if (currentTrackId) {
                const trackInfo = await fetch(url, {
                    headers: {
                        Authorization: `Bearer ${spotifyApi.getAccessToken()}`
                    }
                }
                ).then(res => res.json())
                setSongInfo(trackInfo)
            }
        }
        fetchSongInfo()
    }, [currentTrackId, spotifyApi]);
    return songInfo
}

export default useSongInfo;
