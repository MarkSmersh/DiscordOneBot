// function, that all balance rules are ok, as is balance exist, user have enough balance, receiver have balance etc.

import { ChatInputCommandInteraction, Client, User } from "discord.js";
import { UserBalance } from "../../database";

export default async function balanceRulesCheck(c: Client, e: ChatInputCommandInteraction, amount: number, text: boolean = true, receiver?: User): Promise<UserBalance[] | false> {
    const result = [] // [userBalance, receiverBalance]

    const userBalance = await UserBalance.findOne({
        where: { userId: e.user.id },
    })

    if (!userBalance) {
        if (text) await e.reply({ content: "You haven't balance for now. Use `/balance` commands to create it", ephemeral: true });
        return false;
    }

    if (userBalance.balance < amount) {
        if (text) await e.reply({ content: `You haven't enough balance. You have **${userBalance.balance}** ${amount > 1 ? "coins" : "coin"}`, ephemeral: true });
        return false;
    }

    result.push(userBalance);

    if (receiver) {
        const receiverBalance = await UserBalance.findOne({ where: { userId: receiver.id } });

        if (!receiverBalance) {
            if (text) await e.reply({ content: "Receiver hasn't balance now. It can be create with `/balance` command", ephemeral: true });
            return false;
        }

        result.push(receiverBalance);
    }


    return result;
}