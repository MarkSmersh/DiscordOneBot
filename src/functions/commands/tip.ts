import { Client, ChatInputCommandInteraction, User } from "discord.js"
import { balance as balanceConfig } from "../../config.json"
import Jimp from "jimp";
import balanceRulesCheck from "../helpers/balanceRulesCheck";

export default async function tip(c: Client, e: ChatInputCommandInteraction) {
    const target = e.options.getUser("user") as User;
    const amount = e.options.getNumber("amount") || 50;

    const ok = await balanceRulesCheck(c, e, amount, false, target);

    const img = await Jimp.read("./src/assets/tip3.png").then(async (image) => {
        // use Heiro to generate .fnt from .ttf

        const font = await Jimp.loadFont("./src/assets/roboto.fnt");
        const amountFont = await Jimp.loadFont("./src/assets/roboto1.fnt");

        const userImage = await Jimp.read(e.user.displayAvatarURL({ extension: "png", size: 256 }));
        const targetImage = await Jimp.read(target.displayAvatarURL({ extension: "png", size: 256 }));

        if (userImage) {
            userImage.resize(171, 95);
            image.composite(userImage, 17, 17);
        }

        if (targetImage) {
            targetImage.resize(171, 95);
            image.composite(targetImage, 325, 17);
        }

        const params = {
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }

        image.print(font, 17, 112,  { text: e.user.username, ...params }, 175, 45);
        image.print(font, 325, 112, { text: target.username, ...params}, 175, 45);

        image.print(amountFont, 258, 68, { text: `${amount}`, alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE }, 100, 24);

        image.resize(320, 100);

        return image.getBufferAsync(Jimp.MIME_PNG);
    })

    if (ok) {
        const [senderBalance, receiverBalance] = ok;

        await senderBalance.update({ balance: senderBalance.balance - amount });
        await receiverBalance.update({ balance: receiverBalance.balance + amount });
    }

    await e.reply({ files: [img], content: `${e.user} have tipped ${(ok) ? `${amount} ${balanceConfig.name} ` : "" }to ${target}` });
}
