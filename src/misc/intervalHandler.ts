import { Message, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import config from "../config";
import AlbionApiHandler from "./albionApiHandler";
import messageHandler from "./messageHandler";
import SqlHandler from "./sqlHandler";

declare const sqlHandler: SqlHandler;
export class IntervalHandlers {
  public static initInterval() {
    setInterval(async () => {
      await this.checkRegisteredMembers();
    }, 1000*60*60);
  }

  private static async checkRegisteredMembers() {
    console.log("Updating Alliance Roles...");
    const members = await sqlHandler.getRegisteredMembers();
    const guilds = await sqlHandler.getGuilds();
    for(const member of members) {
      let found;
      for(const guild of discordHandler.client.guilds.cache) {
        try {
          found = await guild[1].members.fetch(member.userId);
          if(found) {
            break;
          } else {
            found = undefined;
          }
        } catch(err) {}
      }
      if(!found) {
        await sqlHandler.removeUser(member.userId);
        console.log("Removed alliance role from member "+member.userId)
        continue;
      }

      const guildId = await AlbionApiHandler.getPlayerGuildId(member.ingameName);
      if(guildId) {
        const newGuild = guilds.find(guild => guild.guildId === guildId);
        if(newGuild && member.guildId !== guildId) {
          await sqlHandler.setGuild(member.userId, guildId);
          console.log("Updated guildId for member "+member.userId);
        } else {
          found.roles.remove(config.allianceRole);
          await sqlHandler.removeUser(member.userId)
          console.log("Removed alliance role from member "+member.userId)
        }
      }
    }
    console.log("Updating Alliance Roles... Done");
  }
}