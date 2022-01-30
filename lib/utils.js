export function millisConverter(millis, songOrPlaylist) {

    var hours = Math.floor((millis / 3600000) % 24),
        minutes = Math.floor((millis / 60000) % 60),
        seconds = Math.floor((millis / 1000) % 60)

    minutes = (minutes < 10) ? "0" + minutes : minutes
    seconds = (seconds < 10) ? "0" + seconds : seconds

    if (songOrPlaylist === 'playlist') {
        if (hours === 4) return 'more than 4 hr'
        if (hours < 1) return minutes + " min " + seconds + ' sec'
        if (hours >= 1) return hours + " hr " + minutes + " min"
    }

    if (songOrPlaylist === 'song') return minutes + ':' + seconds
}

export function dateFormatter(date) {

    var added = new Date(date)
    var now = new Date()

    const diffTime = Math.abs(now - added);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return diffDays + ' days ago'
    else {
        var dateSplit = added.toString().split(' ')
        return dateSplit[2] + ' ' + dateSplit[1] + ', ' + dateSplit[3]
    }
}