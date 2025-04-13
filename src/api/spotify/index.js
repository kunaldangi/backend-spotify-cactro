import express from 'express';

import { getTopTracks } from '../../spotify/index.js';
import { getNowPlaying } from '../../spotify/index.js';
import logger from '../../config/logger/index.js';

const router = express.Router();

// middleware that is specific to this router
// const timeLog = (req, res, next) => {
//     console.log('Time: ', Date.now())
//     next()
// }
// router.use(timeLog)

router.get('/', async (req, res) => {
    try {
        const { action } = req.query;

        if (!action){
            let topTracks = await getTopTracks();

            if(!topTracks) {
                logger.error('No top tracks found');
                return res.status(404).send('No top tracks found');
            }
    
            logger.info('Top tracks fetched successfully:', topTracks);
            return res.send(topTracks);
        }

        if (action === 'nowPlaying') {
            logger.info('Now Playing action received');
            // Handle now playing action here
            let nowPlaying = await getNowPlaying();
            return res.send('Now Playing action received!');
        }

        logger.error('Invalid Request!', action);
        return res.status(400).send('Invalid Request!');
    } catch (error) {
        logger.error('Error fetching top tracks:', error);
        return res.status(500).send('Error fetching top tracks');
    }
})

export default router;