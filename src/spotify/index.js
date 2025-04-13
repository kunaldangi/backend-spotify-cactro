import logger from '../config/logger/index.js';

let token = process.env.SPOTIFY_TOKEN; // maybe we can get this from the database?

async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
};

export async function getTopTracks() {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi(
        'v1/me/top/tracks?time_range=long_term&limit=10', 'GET'
    )).items; // better response later?
}

export async function getNowPlaying() {
    logger.info("Fetching now playing...");

    try {
        // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
        const data = await fetchWebApi('v1/me/player', 'GET');
        if (!data || !data.item) {
            return { status: 'No song is currently playing' }; // No song is currently playing
        }
        return data.item; // better response later?
    } catch (error) {
        logger.error("Error fetching now playing: ", error);
        return { status: 'Error fetching now playing' };
    }
}

export async function getDevices() {
    logger.info("Fetching devices...");

    try {
        // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
        const data = await fetchWebApi('v1/me/player/devices', 'GET');
        if (!data || !data.devices) {
            return { status: 'No devices found' }; // No devices found
        }
        return data.devices; // better response later?
    } catch (error) {
        logger.error("Error fetching devices: ", error);
        return { status: 'Error fetching devices' };
    }
}

export async function stopCurrentPlayingSong(device_id){
    logger.info("Stopping current song...");

    try {
        // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/put-pause-a-users-playback
        const data = await fetchWebApi(`v1/me/player/pause?device_id=${device_id}`, 'PUT');
        if (!data) {
            return { status: 'No song is currently playing' }; // No song is currently playing
        }
        return data; // better response later?
    } catch (error) {
        logger.error("Error stopping current song: ", error);
        return { status: 'Error stopping current song' };
    }
}