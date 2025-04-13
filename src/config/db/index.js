import { config } from 'dotenv'; config();
import { Sequelize } from "sequelize";

import logger from "../logger/index.js";

const sequelize = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/`);

export async function connect(){
    try {
        logger.info('Connecting to the database...'); // log the connection attempt
        await sequelize.authenticate();
        logger.info('Connection has been established successfully.'); // log the success
    } catch (error) {
        logger.error('Unable to connect to the database:', error); // log the error
    }
}

export default sequelize;