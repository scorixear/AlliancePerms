import { ApplicationCommandPermissionData, ButtonInteraction, CommandInteraction, Interaction, SelectMenuInteraction } from 'discord.js';
import {ButtonInteractionHandle, SelectMenuInteractionHandle, CommandInteractionHandle} from '../interactions/interactionHandles';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config';
import Help from '../commands/Misc/help';
import TwoWayMap from './TwoWayMap';
import Register from '../commands/Misc/register';
import AddGuild from '../commands/Moderation/addGuild';
import RemoveGuild from '../commands/Moderation/removeGuild';


export default class InteractionHandler {
  public buttonInteractions: TwoWayMap<string, ButtonInteractionHandle>;
  public selectMenuInteractions: TwoWayMap<string, SelectMenuInteractionHandle>;
  private commandInteractions: CommandInteractionHandle[];
  constructor() {
    this.buttonInteractions = new TwoWayMap(new Map([
    ]));
    this.selectMenuInteractions = new TwoWayMap(new Map([
    ]));

    const help = new Help();
    this.commandInteractions = [
      new Register(),
      new AddGuild(),
      new RemoveGuild(),
      help,
    ];
    help.init(this.commandInteractions);
  }

  public async Init() {
    const commands = this.commandInteractions.map(command => command.slashCommandBuilder.toJSON());
    const rest = new REST( {version: '9'}).setToken(process.env.DISCORD_TOKEN);

    global.discordHandler.client.guilds.cache.forEach(async guild=> {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID, guild.id), {body: commands})
      console.log('Successfully registered application commands for guild', guild.id);
      const guildRoles = await guild.roles.fetch();
      const guildCommands = await guild.commands.fetch();
      const configurationRoles = guildRoles.filter(role => config.configurationRoles.includes(role.name));
      const permissionsObject: ApplicationCommandPermissionData[] = [];
      configurationRoles.forEach(role => permissionsObject.push({
        id: role.id,
        type: 'ROLE',
        permission: true,
      }));
      this.commandInteractions.forEach(interaction => {
        if(interaction.requirePermissions) {
          const applicationCommand = guildCommands.find(appCommand => appCommand.name === interaction.command);
          applicationCommand.permissions.set({
            permissions: permissionsObject,
          })
        }
      })
    });


  }

  public async handle(interaction: Interaction) {
    try {
      if (interaction.isButton()) {
        const buttonInteraction: ButtonInteraction = interaction as ButtonInteraction;
        const interactionHandle: ButtonInteractionHandle = this.buttonInteractions.find(id => buttonInteraction.customId.startsWith(id));
        if(interactionHandle) {
          await interactionHandle.handle(buttonInteraction);
        }
      } else if (interaction.isCommand()) {
        const commandInteraction: CommandInteraction = interaction as CommandInteraction;
        const handler = this.commandInteractions.find(interactionHandle => interactionHandle.command === commandInteraction.commandName);
        if (handler) {
          await handler.handle(commandInteraction);
        }
      } else if (interaction.isSelectMenu()) {
        const selectMenuInteraction: SelectMenuInteraction = interaction as SelectMenuInteraction;
        const interactionHandle: SelectMenuInteractionHandle = this.selectMenuInteractions.find(id => selectMenuInteraction.customId.startsWith(id));
        if (interactionHandle) {
          await interactionHandle.handle(selectMenuInteraction);
        }
      } else {
        return;
      }
    } catch (err) {
      console.error('Error handling Interaction', err);
    }

  }
}
