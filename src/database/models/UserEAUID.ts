import sequelize from "../database";
import { DataTypes as DT, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export default class UserUID extends Model<InferAttributes<UserUID>, InferCreationAttributes<UserUID>> {
    declare userId: string;
    declare uid: string;
}

UserUID.init({    
    userId: { type: DT.STRING, unique: true },
    uid: { type: DT.STRING, unique: true }
}, { tableName: 'userUIDs', sequelize });