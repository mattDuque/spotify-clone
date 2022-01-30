import { atom } from "recoil";

export const playlistState = atom({
    key: 'playlistState',
    default: null
})

export const playlistIdState = atom({
    key: 'playlistIdState',
    default: "5lryeZJqjo5hDvkhOc5Jpp"
})

export const currentTrackIdState = atom({
    key: 'currentTrackIdState',
    default: null
})

export const isPlayingState = atom({
    key: 'isPlayingState',
    default: false
})