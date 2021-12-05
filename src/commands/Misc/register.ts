import {CommandInteraction, TextChannel} from 'discord.js';
import messageHandler from '../../misc/messageHandler';
import config from '../../config';
import { CommandInteractionHandle } from '../../interactions/interactionHandles';
import { SlashCommandStringOption } from '@discordjs/builders';
import { LanguageHandler } from '../../misc/languageHandler';
import SqlHandler from '../../misc/sqlHandler';
import DiscordHandler from '../../misc/discordHandler';

declare const languageHandler: LanguageHandler;
declare const sqlHandler: SqlHandler;
declare const discordHandler: DiscordHandler;

export default class Register extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandStringOption().setName('ingame_name').setDescription(languageHandler.language.commands.register.options.ingame_name).setRequired(true));
    super(
      'register',
      ()=>languageHandler.replaceArgs(languageHandler.language.commands.register.description, [config.botPrefix]),
      'register "Scorix"',
      'Moderation',
      'register <Ingame Name>',
      commandOptions,
      false
    );
  }

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }
  }
}