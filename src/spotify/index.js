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
        // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-the-users-currently-playing-track
        const data = await fetchWebApi('v1/me/player/currently-playing', 'GET');
        if (!data || !data.item) {
            return { status: 'No song is currently playing' }; // No song is currently playing
        }
        console.log("Data: ", data.item); 

        return data.item; // better response later?
    } catch (error) {
        logger.error("Error fetching now playing: ", error);
        return { status: 'Error fetching now playing' };
    }
}