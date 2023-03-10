import { Client, ChatInputCommandInteraction } from "discord.js"
import { UserBalance } from "../../database"
import { balance as balanceConfig } from "../../config.json"

export default async function grant(c: Client, e: ChatInputCommandInteraction) {
    const userBalance = await UserBalance.findOne({
        where: { userId: e.user.id },
    })

    if (!userBalance) {
        await e.reply("You haven't balance for now. Use `/balance` commands to create it");
        return;
    }

    const timeDifferenceGrant = Math.round((Date.now() - userBalance.lastGrantAt.getTime()) / 1000);

    if (timeDifferenceGrant < balanceConfig.grantUpdate) {
        await e.reply(`You have used you posibility to take the grant. For next one you need wait for ${(balanceConfig.grantUpdate - timeDifferenceGrant)} seconds`);
    } else {
        await userBalance.update({ balance: (userBalance.balance + balanceConfig.grantAmount), lastGrantAt: new Date() });

        await e.reply(`To your balance was tranfered ${balanceConfig.grantAmount} ${balanceConfig.name}! For next one wait for ${balanceConfig.grantUpdate} seconds`);
    }
}