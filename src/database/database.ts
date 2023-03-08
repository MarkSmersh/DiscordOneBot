import { Sequelize } from "sequelize";

import path from "path";
import * as dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname + "/../.env") });

export default new Sequelize (process.env.DATABASE_URL as string, { dialect: "postgres", logging: false, dialectOptions: {
    ssl: {
        require: true, rejectUnauthorized: false
    }
}});