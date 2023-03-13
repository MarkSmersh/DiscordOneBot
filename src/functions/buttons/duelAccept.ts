import { Client, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"
import { Op } from "sequelize";
import { DuelData, UserBalance } from "../../database";
import { balance as balanceConfig, duel as duelConfig } from "../../config.json";
import duelTurnExpire from "../helpers/duelTurnExpire";

export default async function duelAccept(c: Client, e: ButtonInteraction) {
    const [buttonName, duelId, oldUpdateId] = e.customId.split(":");
    const duelData = await DuelData.findOne({ where: { id: duelId } }) as DuelData;
    
    if (oldUpdateId !== duelData.updateId) {
        await e.reply({ content: "Action is deprecated", ephemeral: true});
        return;
    }
    
    const updateId = Date.now().toString();

    if (duelData.offeredTo && duelData.offeredTo !== e.user.id) {
        await e.reply({ content: "That request is not for you", ephemeral: true});
        return;
    }

    if (duelData.offeredId === e.user.id) {
        await e.reply({ content: "Wtf", ephemeral: true});
        return;
    }

    if (duelData.bet) {
        const userBalance = await UserBalance.findOne({ where: { userId: e.user.id } });

        if (!userBalance) {
            await e.reply({ content: `Seems you haven't balance. You can create it with \`/balance\``, ephemeral: true });
            return;
        }

        if (userBalance.balance < duelData.bet) {
            await e.reply({ content: `Seems you haven't enough ${balanceConfig.name} to accept this bet`, ephemeral: true });
            return;
        }
    }

    const duelDataBusy = await DuelData.findOne({ where: { [Op.not]: [{ state: "end" }], [Op.or]: [{ offeredId: e.user.id }, { acceptedId: e.user.id }] } });

    if (duelDataBusy) {
        console.log(duelDataBusy);
        e.reply({ content: `Seems you have not ended duel. End it to before accept the duel!`, ephemeral: true });
        return;
    }

    await duelData.update({ acceptedId: e.user.id, updateId: updateId });

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`duel-gun:${duelId}:0:${updateId}`)
                .setLabel("I choose the left gun!")
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId(`duel-gun:${duelId}:1:${updateId}`)
                .setLabel("I choose the right gun!")
                .setStyle(ButtonStyle.Secondary),
        )

    await e.reply({ content: "Choose gun. Be faster than your opponent!", components: [row] });

    duelTurnExpire(e, updateId, duelId);
}