# DiscordOneBot
*Last README update: 09.03.2023*

## Used technologies
- **DiscordJS** (*ver. 14.7.1*)
- **Apex Legends Api** (*via https://api.mozambiquehe.re/*)
- **Postgres Database** (*via sequelize package*)

## How to use?
You shouldn`t, but...

### Setup
1. Run `npm i`
2. Create `.env` file in same folder, as `index.ts` in `./src`. Insert data, using `env.ts` types in `./src/types` folder.
3. Run `npm run start`
4. Spin around yourself `10 times`, jump `15 times`, pray to `all the gods` and look under the `pillow` *(you are unlikely to find anything)*. If the code works - **REJOY**!

### Basic functional (commands)

`/dice [score?: number]` - Roles the dice and shows the score. If arg `score` provided - shows, if user guess the score.

`/setup-roles [apex-legends?: boolean]` - Setups required roles for provided options, that will be used in bind commands. For example, `apex-legends` used for `/apex-*` like commands.

`/apexLink [username: string]` - Search EA account with same provided `username`. If account not played ever in Apex: Legends - doesn't work.

`/apexStats [user?: User]` - Get statistics in Apex: Legends by provided `user`, otherwise by current user. Example:

![Statictics, that shows /apexStats](https://i.imgur.com/1uhvaYh.png)

### Configuration

You can edit `config.json` in `./src` folder.

- Change `Rank-Role` names in `apexLegends.Roles`. **Be careful**, you shouldn't change `keys` names, othewise it`ll have bad consequences.

## Star the repository if you liked it!