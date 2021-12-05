import { Message, MessageActionRow, MessageButton, TextChannel } from "discord.js";
import messageHandler from "./messageHandler";
import SqlHandler from "./sqlHandler";

declare const sqlHandler: SqlHandler;
export class IntervalHandlers {
  public static initInterval() {
    setInterval(async () => {
      
    }, 1000*60);
  }
}