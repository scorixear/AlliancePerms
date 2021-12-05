import dotenv from 'dotenv';
import { LanguageHandler } from './misc/languageHandler';
import SqlHandler from './misc/sqlHandler';
import DiscordHandler from './misc/discordHandler';
import InteractionHandler from './misc/interactionHandler';
import { Interaction } from 'discord.js';
import { IntervalHandlers } from './misc/intervalHandler';

// initialize configuration
dotenv.config();

declare global {
  var discordHandler: DiscordHandler;
  var sqlHandler: SqlHandler;
  var languageHandler: LanguageHandler;
  var interactionHandler: InteractionHandler;
}
global.languageHandler = new LanguageHandler();
global.interactionHandler = new InteractionHandler();
global.discordHandler = new DiscordHandler();
global.sqlHandler = new SqlHandler();


discordHandler.client.on('interactionCreate', (interaction: Interaction)=> global.interactionHandler.handle(interaction));



process.on('uncaughtException', (err: Error) => {
  console.error('Unhandled exception', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason);
});

sqlHandler.initDB().then(async () => {
  await discordHandler.client.login(process.env.DISCORD_TOKEN);
  await interactionHandler.Init();
  console.log('Alliance Perms Bot live!')

  IntervalHandlers.initInterval();
});