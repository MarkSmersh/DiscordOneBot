import { ButtonInteraction, Client } from "discord.js";
import { duel as duelConfig, balance as balanceConfig } from "../../config.json"
import { DuelData, UserBalance } from "../../database";

export default function duelTurnExpire (e: ButtonInteraction, oldUpdateId: string, duelId: string ) {
    if (duelConfig.turn !== 0) {
        setTimeout(async () => {
            const duelData = await DuelData.findByPk(duelId);
    
            if (duelData?.updateId === oldUpdateId) {
                const updateId = Date.now().toString()

                if (duelData.state === "start") {
                    await e.editReply(`<@${duelData.offeredId}> and <@${duelData.acceptedId}> decided to not take the gun. Duel ends without casualties!`);
                }

                if (duelData.state === "in_process") {
                    if (duelData.bet) {
                        const winnerBalance = await UserBalance.findOne({ where: { userId: duelData.waitId } });
                        const looserBalance = await UserBalance.findOne({ where: { userId: duelData.turnId } });
    
                        await winnerBalance?.update({ balance: winnerBalance.balance + duelData.bet });
                        await looserBalance?.update({ balance: looserBalance.balance - duelData.bet });
                    }
    
                    await e.editReply(`<@${duelData.turnId}> lost duel due to inactivity. <@${duelData.waitId}> wins${(duelData.bet) ? `${duelData.bet} ${balanceConfig.name}` : ""}!`)
                }

                await duelData.update({ state: "end", winner: duelData.waitId, updateId: updateId });
            }
        }, duelConfig.turn * 1000)
    }
}