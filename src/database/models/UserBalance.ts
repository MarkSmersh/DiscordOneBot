import sequelize from "../database";
import { DataTypes as DT, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export default class UserBalance extends Model<InferAttributes<UserBalance>, InferCreationAttributes<UserBalance>> {
    declare userId: string;
    declare balance: number; 
    declare lastGrantAt: Date;
    declare updatedAt: Date;
}

UserBalance.init({    
    userId: { type: DT.STRING, unique: true },
    balance: { type: DT.NUMBER },
    lastGrantAt: { type: DT.DATE },
    updatedAt: { type: DT.DATE }
}, { tableName: 'userBalance', sequelize });