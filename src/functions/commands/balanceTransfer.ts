import { Client, ChatInputCommandInteraction, User } from "discord.js";
import { UserBalance } from "../../database";
import { balance as balanceConfig } from "../../config.json"
import balanceRulesCheck from "../helpers/balanceRulesCheck";

export default async function balanceTransfer(c: Client, e: ChatInputCommandInteraction) {
    const transferAmount = e.options.getNumber("amount") as number;

    const ok = await balanceRulesCheck(c, e, transferAmount, true, e.options.getUser("user") as User);
    if (!ok) return;

    const [senderBalance, receiverBalance] = ok;


    if (!receiverBalance) {
        await e.reply("**Receiver hasn't balance now**. It can be create with `/balance` command");
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