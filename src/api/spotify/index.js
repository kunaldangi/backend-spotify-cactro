import express from 'express';

import { getTopTracks } from '../../spotify/index.js';
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
        let topTracks = await getTopTracks();
        
        if(!topTracks) {
            logger.error('No top tracks found');
            return res.status(404).send('No top tracks found');
        }

        logger.info('Top tracks fetched successfully:', topTracks);
        res.send(topTracks);
    } catch (error) {
        logger.error('Error fetching top tracks:', error);
        res.status(500).send('Error fetching top tracks');
    }
})

export default router;