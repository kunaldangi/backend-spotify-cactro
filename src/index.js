import express from 'express';

import { connect } from './config/db/index.js';
import logger from './config/logger/index.js';

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
    
    app.listen(port, () => {
        logger.info(`Example app listening on port ${port}`);
    });
}
main();