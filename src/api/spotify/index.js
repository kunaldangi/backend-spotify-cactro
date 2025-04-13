import express from 'express';

import { getDevices, getTopTracks, stopCurrentPlayingSong } from '../../spotify/index.js';
import { getNowPlaying } from '../../spotify/index.js';
import logger from '../../config/logger/index.js';

const router = express.Router();

// middleware that is specific to this router
// const timeLog = (req, res, next) => {
//     console.log('Time: ', Date.now())
//     next()
// }
// router.use(timeLog)

let token = process.env.SPOTIFY_TOKEN;

router.get('/', async (req, res) => {
    try {
        const { action } = req.query;

        if (action === 'top-tracks'){ // seperate function later
            let topTracks = await getTopTracks(token);

            if(!topTracks) {
                logger.error('No top tracks found');
                return res.status(404).send('No top tracks found');
            }
    
            logger.info('Top tracks fetched successfully:', topTracks);
            return res.send(topTracks);
        }

        if (action === 'now-playing') { // seperate function later
            logger.info('Now Playing action received');

            let nowPlaying = await getNowPlaying(token);

            if (!nowPlaying) {
                logger.error('No song is currently playing');
                return res.status(404).send('No song is currently playing');
            }

            return res.send(nowPlaying);
        }

        if (action === 'pause') {
            logger.info('Stop action received');
            
            /*
                it can be better, we can look for active device and then currently playing song
                and then stop the song on that device

                may be we don't need to think about what song is currrently playing or not and
                spotify is smart enough to handle it
            */


            let devices = await getDevices(token);
            
            if (!devices[0].id) {
                logger.error('No devices found');
                return res.status(404).send('No devices found');
            }

            let nowPlaying = await getNowPlaying(token);
            if (!nowPlaying) {
                logger.error('No song is currently playing');
                return res.status(404).send('No song is currently playing');
            }
            
            let stop = await stopCurrentPlayingSong(devices[0].id, token);

            if(stop.error.reason === 'PREMIUM_REQUIRED'){
                logger.error('Premium spotify account required to stop playback');
                return res.status(403).send('Premium spotify account required to stop playback');
            }

            return res.send(stop);
        }

        logger.error('Invalid Request!', action);
        return res.status(400).send('Invalid Request!');
    } catch (error) {
        logger.error('Error fetching top tracks:', error);
        return res.status(500).send('Something went wrong!');
    }
})

export default router;