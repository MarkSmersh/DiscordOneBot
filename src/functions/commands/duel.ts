import { Client, ChatInputCommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { DuelData, UserBalance } from "../../database";
import { Op } from "sequelize";
import { balance as balanceConfig } from "../../config.json";
import balanceRulesCheck from "../helpers/balanceRulesCheck";

export default async function duel(c: Client, e: ChatInputCommandInteraction) {
    const duelData = await DuelData.findOne({ where: { [Op.not]: [{ state: "end" }], [Op.or]: [{ offeredId: e.user.id }, { acceptedId: e.user.id }] } });
    const updateId = Date.now().toString();

    if (duelData) {
        await e.reply({ content: `Seems you have not ended duel. End it to create a new duel request!`, ephemeral: true });
        return;
    }

    const bet = e.options.getNumber("bet");

    if (bet) {
        if (!await balanceRulesCheck(c, e, bet)) return;
    }

    const opponent = e.options.getUser("opponent");
    const newDuelData = await DuelData.create({ offeredId: e.user.id, state: "start", bet: (bet) ? bet : undefined, offeredTo: opponent?.id, updateId: updateId });

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`duel-accept:${newDuelData.id}:${updateId}`)
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`duel-cancel:${newDuelData.id}:${updateId}`)
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("duel-rules")
                .setLabel("Rules")
                .setStyle(ButtonStyle.Secondary),
        )

    await e.reply({ content: `Created duel request${(bet) ? ` on ${bet} ${balanceConfig.name}` : ""}${(opponent) ? ` for <@${opponent.id}>` : ""}!`, components: [row] });
}