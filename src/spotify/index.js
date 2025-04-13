

async function fetchWebApi(endpoint, method, token, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        method,
        body: JSON.stringify(body)
    });
    return await res.json();
};

export async function getTopTracks(token) {
    // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
    return (await fetchWebApi('v1/me/top/tracks?time_range=long_term&limit=10', 'GET', token)).items; // better response later?
}

export async function getNowPlaying(token) {
    try {
        // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
        const data = await fetchWebApi('v1/me/player', 'GET', token);
        if (!data || !data.item) {
            return { status: 'No song is currently playing' }; // No song is currently playing
        }
        return data.item; // better response later?
    } catch (error) {
        return { status: 'Error fetching now playing' };
    }
}

export async function getDevices(token) {
    try {
        // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/get-information-about-the-users-current-playback
        const data = await fetchWebApi('v1/me/player/devices', 'GET', token);
        if (!data || !data.devices) {
            return { status: 'No devices found' }; // No devices found
        }
        return data.devices; // better response later?
    } catch (error) {
        return { status: 'Error fetching devices' };
    }
}

export async function stopCurrentPlayingSong(device_id, token){
    try {
        // Endpoint reference: https://developer.spotify.com/documentation/web-api/reference/put-pause-a-users-playback
        const data = await fetchWebApi(`v1/me/player/pause?device_id=${device_id}`, 'PUT', token);
        if (!data) {
            return { status: 'No song is currently playing' }; // No song is currently playing
        }
        return data; // better response later?
    } catch (error) {
        return { status: 'Error stopping current song' };
    }
}