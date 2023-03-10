import { Client, ChatInputCommandInteraction } from "discord.js";
import { UserBalance } from "../../database";
import { balance as balanceConfig } from "../../config.json"

export default async function balanceTransfer(c: Client, e: ChatInputCommandInteraction) {
    const senderBalance = await UserBalance.findOne({ where: { userId: e.user.id } });
    const receiverBalance = await UserBalance.findOne({ where: { userId: e.options.getUser("user")?.id } });
    const transferAmount = e.options.getNumber("amount") as number;

    if (!senderBalance) {
        await e.reply(`**Interesting... How you imagine transfer money, when you even haven't balance**. You can create it with \`/balance\` command`);
        return;
    }

    if (!receiverBalance) {
        await e.reply("**Receiver hasn't balance now**. It can be create with `/balance` command");
        return;
    }

    if (senderBalance.balance < transferAmount) {
        await e.reply(`You haven't enough money on your balance to make this transfer`);
        return;
    }

    if (senderBalance.userId === receiverBalance.userId) {
        await e.reply(`You can't transfer money for self`);
        return;
    }

    await senderBalance.update({ balance: senderBalance.balance - transferAmount });
    await receiverBalance.update({ balance: receiverBalance.balance + transferAmount });

    await e.reply(`From <@${e.user.id}> to <@${e.options.getUser("user")?.id}> was transered **${transferAmount} ${balanceConfig.name}**`);
}