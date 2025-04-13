const client_id = process.env.SPOTIFY_CLIENT_ID || null;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || null;
const redirect_uri = 'http://127.0.0.1:8080/callback'; // maybe dynamic later?

export async function getToken(code) {
    try {
        const body = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect_uri
        });
        
        const authHeader = 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'); // we need to encode the auth header that's how spotify wants it

        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Access Token:', data.access_token);
            console.log('Refresh Token:', data.refresh_token);
            return true;
        } else {
            console.error('Error fetching tokens:', data);
            return false;
        }
    } catch (error) {
        console.error('Error:', error);
        return false
    }
}
