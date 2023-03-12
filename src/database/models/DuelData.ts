import sequelize from "../database";
import { CreationOptional, DataTypes as DT, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export default class DuelData extends Model<InferAttributes<DuelData>, InferCreationAttributes<DuelData>> {
    declare id: CreationOptional<number>;
    declare updateId: string;
    declare state: "start" | "in_process" | "end" ;
    declare offeredId: string;
    declare offeredTo: CreationOptional<string>;
    declare acceptedId: CreationOptional<string>;
    declare bet: CreationOptional<number>;
    declare turnId: CreationOptional<string>;
    declare waitId: CreationOptional<string>;
    declare winner: CreationOptional<string>;
    declare lastHideId: CreationOptional<"0" | "1" | "2">;
    declare updatedAt: CreationOptional<Date>;
}

DuelData.init({
    id: { type: DT.INTEGER, unique: true, autoIncrement: true, primaryKey: true },
    updateId: { type: DT.STRING },
    state: { type: DT.STRING },
    offeredId: { type: DT.STRING },
    offeredTo: { type: DT.STRING },
    acceptedId: { type: DT.STRING },
    bet: { type: DT.INTEGER },
    turnId: { type: DT.STRING },
    waitId: { type: DT.STRING },
    winner: { type: DT.STRING },
    lastHideId: { type: DT.STRING },
    updatedAt: { type: DT.DATE },
}, { tableName: 'duelsData', sequelize });