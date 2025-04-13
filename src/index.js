import express from 'express';
import querystring from 'querystring';

import { connect } from './config/db/index.js';
import logger from './config/logger/index.js';
import { getToken } from './spotify/token.js';

import spotifyRouter from './api/spotify/index.js';

const app = express();
const port = 8080;

async function main() {
    await connect();

    app.use(express.json());

    app.use('/spotify', spotifyRouter);

    app.get('/', (req, res) => {
        res.send('api is running');
    });

    var client_id = '11af8cd3f2bd441fb549fd7bd33bb64e';
    var redirect_uri = `http://127.0.0.1:${port}/callback`;

    app.get('/login', function (req, res) { // will shift to /auth later

        var state = generateRandomString(16);

        /* 
            my original plan to get the spotify token of users and save it into the database after that we can create a account of the user
            and show the details of each user in the app?
            so kind a automated process isn't it?
        */

        // i think these permissions are enough?
        const scope = 'user-read-private user-read-email user-top-read user-read-playback-state user-modify-playback-state streaming app-remote-control';

        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: client_id,
                scope: scope,
                redirect_uri: redirect_uri,
                state: state
            }));
    });

    app.get('/callback', async function (req, res) { // will shift to /auth later
        var code = req.query.code || null;
        var state = req.query.state || null;
        
        if(code){
            logger.info('Code received:', code);
            await getToken(code);
        }

        console.log('Code:', code);
        console.log('State:', state);
        res.send('Callback received!');
    });

    app.listen(port, () => {
        logger.info(`Example app listening on port ${port}`);
    });
}

function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

main();
