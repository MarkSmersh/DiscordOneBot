import { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { Op } from "sequelize";
import { DuelData, UserBalance } from "../../database";
import { balance as balanceConfig } from "../../config.json";
import { v4 } from "uuid";
import duelTurnExpire from "../helpers/duelTurnExpire";

export default async function duelShoot(c: Client, e: ButtonInteraction) {
    const [buttonName, duelId, shotId, oldUpdateId] = e.customId.split(":");
    const duelData = await DuelData.findOne({ where: { id: duelId } }) as DuelData;

    if (oldUpdateId !== duelData.updateId) {
        await e.reply({ content: "Action is deprecated", ephemeral: true});
        return;
    }

    const updateId = Date.now().toString();

    if (e.user.id !== duelData.offeredId && e.user.id !== duelData.acceptedId) {
        e.reply({ content: "That's not your game. Just watch...", ephemeral: true })
        return;
    }

    if (e.user.id !== duelData.turnId) {
        e.reply({ content: "**Not your turn now**", ephemeral: true });
        return;
    }

    if (shotId === "3") {
        if (duelData.bet) {
            const winnerBalance = await UserBalance.findOne({ where: { userId: duelData.waitId } });
            const looserBalance = await UserBalance.findOne({ where: { userId: duelData.turnId } });

            await winnerBalance?.update({ balance: winnerBalance.balance + duelData.bet });
            await looserBalance?.update({ balance: looserBalance.balance - duelData.bet });
        }

        await duelData.update({ state: "end", winner: duelData.waitId, updateId: updateId });
        await e.reply(`<@${duelData.turnId}>... committed suicide. <@${duelData.waitId}> wins${(duelData.bet) ? ` **${duelData.bet} ${balanceConfig.name}!**` : ""}!`);
        return;
    }

    if (duelData.lastHideId === shotId) {
        if (duelData.bet) {
            const winnerBalance = await UserBalance.findOne({ where: { userId: duelData.turnId } });
            const looserBalance = await UserBalance.findOne({ where: { userId: duelData.waitId } });

            await winnerBalance?.update({ balance: winnerBalance.balance + duelData.bet });
            await looserBalance?.update({ balance: looserBalance.balance - duelData.bet });
        }

        await duelData.update({ state: "end", winner: duelData.turnId, updateId: updateId });
        await e.reply(`<@${duelData.turnId}> shots <@${duelData.waitId}> and wins${(duelData.bet) ? ` **${duelData.bet} ${balanceConfig.name}!**` : ""}!`);
    } else {
        await duelData.update({ updateId: updateId });

        const text = `<@${duelData.turnId}> misses... <@${duelData.waitId}> realoded and ready fire. But, firstly, <@${duelData.turnId}> needs hide`

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`duel-hide:${duelId}:0:${updateId}`)
                    .setLabel("Hide at the left")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`duel-hide:${duelId}:1:${updateId}`)
                    .setLabel("Hide at the center")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId(`duel-hide:${duelId}:2:${updateId}`)
                    .setLabel("Hide at the right")
                    .setStyle(ButtonStyle.Secondary),
            )

        await e.reply({ content: text, components: [buttons] });
    }

    duelTurnExpire(e, updateId, duelId);
}