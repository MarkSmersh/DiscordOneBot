import { Client, ChatInputCommandInteraction, EmbedBuilder } from "discord.js"
import { UserBalance } from "../../database"
import { balance as balanceConfig } from "../../config.json"

export default async function balance(c: Client, e: ChatInputCommandInteraction) {
    const userBalance = (await UserBalance.findOrCreate({
        where: { userId: e.user.id },
        defaults: { userId: e.user.id, balance: 0, lastGrantAt: new Date(0), updatedAt: new Date() }
    }))[0];

    const userBalanceEmbed = new EmbedBuilder()
        .setColor("DarkGreen")
        .setTitle(`${e.user.username}'s balance:`)
        .setAuthor({ name: e.user.username, iconURL: e.user.displayAvatarURL() })
        .setDescription(`**${userBalance.balance}** ${balanceConfig.name}` )
        .setFooter({ text: `Last time grant was taken: ${userBalance.lastGrantAt.toLocaleString()}` })

    e.reply({
        embeds: [userBalanceEmbed]
    })
}