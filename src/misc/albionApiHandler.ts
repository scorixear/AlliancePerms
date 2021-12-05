import fetch from "node-fetch";


export default class AlbionApiHandler {
  private static baseUri = 'https://gameinfo.albiononline.com/api/gameinfo/';
  private static searchQueryStr = 'search?q='

  public static  async getPlayerGuildId(playerName: string) {
    const jsonResponse = await this.request(this.baseUri+ this.searchQueryStr + playerName.replace(/ /, '%20'));
    if(jsonResponse && jsonResponse.players && jsonResponse.players[0] && jsonResponse.players[0].Name === playerName && jsonResponse.players[0].GuildId !== '') {
      return jsonResponse.players[0].GuildId;
    }
    return undefined;
  }

  public static async getGuildId(guildName: string) {
    const jsonResponse = await this.request(this.baseUri + this.searchQueryStr + guildName.replace(/ /, '%20'));
    if ( jsonResponse && jsonResponse.guilds && jsonResponse.guilds[0] && jsonResponse.guilds[0].Name === guildName) {
      return jsonResponse.guilds[0].Id as string;
    }
  }

  public static async getPlayers(guildId: string) {
    const guildMembers: string[] = [];
    const jsonResponse = await this.request(this.baseUri + 'guilds/'+guildId+'/members');
    if(jsonResponse) {
      for(const player of jsonResponse) {
        guildMembers.push(player.Name);
      }
    }
    return guildMembers;
  }


  public static async request(url: string) {
    try {
      const result = await fetch(url);
      if(result.ok) {
        return result.json();
      }
    } catch (err) {
      console.error('Albion API Error', err);
      return undefined;
    }
  }
}