import mariadb from 'mariadb';

export default class SqlHandler {
  private pool: mariadb.Pool;
  constructor() {
    this.pool = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT, 10),
      database: process.env.DB_DATABASE,
      multipleStatements: true,
      connectionLimit: 5,
    });
  }

  private async executeSingleQuery(query: string) {
    let conn;
    let returnValue = true;
    try {
      conn = await this.pool.getConnection();
      await conn.query(query);
    } catch (err) {
      console.error(err);
      returnValue = false;
    } finally {
      if (conn) conn.end();
    }
    return returnValue;
  }

  private async executeQueryWithCallback(callback: (conn: mariadb.PoolConnection) => Promise<any>, error: (error: any) => Promise<any> ) {
    let conn;
    let returnValue;
    try {
      conn = await this.pool.getConnection();
      returnValue = await callback(conn);
    } catch(err) {
      returnValue = await error(err);
    } finally {
      if (conn) conn.end();
    }
    return returnValue;
  }

  /**
   * Initializes the DataBase
   */
  public async initDB() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      console.log('DB Connection established');
      await conn.query('CREATE TABLE IF NOT EXISTS `users` (`userId` VARCHAR(255), `ingameName` VARCHAR(255), `guildId` VARCHAR(255), PRIMARY KEY (`userId`), UNIQUE(ingameName))');
      await conn.query('CREATE TABLE IF NOT EXISTS `guilds` (`guildId` VARCHAR(255), `guildName` VARCHAR(255), PRIMARY KEY (`guildId`))');
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.end();
    }
  }

  public async registerUser(userId: string, ingameName: string, guildId: string) {
    return await this.executeSingleQuery(`INSERT INTO users (userId, ingameName, guildId) VALUES (${this.pool.escape(userId)}, ${this.pool.escape(ingameName)}, ${this.pool.escape(guildId)})`);
  }

  public async removeUser(userId: string) {
    return await this.executeSingleQuery(`DELETE FROM users WHERE userId = ${this.pool.escape(userId)}`);
  }

  public async addGuild(guildId: string, guildName: string) {
    return await this.executeSingleQuery(`INSERT INTO guilds (guildId, guildName) VALUES (${this.pool.escape(guildId)}, ${this.pool.escape(guildName)})`);
  }

  public async removeGuild(guildName: string, printError: boolean = false) {
    return await this.executeQueryWithCallback(async (conn)=> {
      const rows = await conn.query(`SELECT * FROM guilds WHERE guildName = ${this.pool.escape(guildName)}`);
      if(rows && rows[0]) {
        await conn.query(`DELETE FROM guilds WHERE guildName = ${this.pool.escape(guildName)}`);
        return true;
      }
      return false;
    }, async (error) => {
      if(printError) {
        console.error(error);
      }
      return false;
    });
  }

  public async getGuild(guildId: string) {
    return await this.executeQueryWithCallback(async (conn) => {
      const rows = await conn.query(`SELECT guildId FROM guilds WHERE guildId = ${conn.escape(guildId)}`);
      if(rows && rows[0]) {
        return true;
      }
      return false;
    }, async (error) => {
      return false;
    });
  }

  public async setGuild(userId: string, guildId: string) {
    return await this.executeSingleQuery(`UPDATE users SET guildId = ${this.pool.escape(guildId)} WHERE userId = ${this.pool.escape(userId)}`)
  }

  public async getRegisteredMembers(): Promise<{userId: string, ingameName: string, guildId: string}[]> {
    return await this.executeQueryWithCallback(async (conn) => {
      const rows = await conn.query(`SELECT * from users`);
      const result = [];
      if(rows) {
        for(const row of rows) {
          result.push({
            userId: row.userId,
            ingameName: row.ingameName,
            guildId: row.guildId,
          });
        }
      }
      return result;
    }, async (error) => {
      console.error(error);
      return [];
    });
  }

  public async getGuilds(): Promise<{guildId: string, guildName: string}[]> {
    return await this.executeQueryWithCallback(async (conn) => {
      const rows = await conn.query(`SELECT * from guilds`);
      const result = [];
      if(rows) {
        for(const row of rows) {
          result.push({
            guildId: row.guildId,
            guildName: row.guildName,
          });
        }
      }
      return result;
    }, async (error) => {
      console.error(error);
      return [];
    });
  }
}