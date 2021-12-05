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
      await conn.query('CREATE TABLE IF NOT EXISTS `users` (`userId` VARCHAR(255), `ingameName` VARCHAR(255), `guild` VARCHAR(255), PRIMARY KEY (`userId`))');
      await conn.query('CREATE TABLE IF NOT EXISTS `guilds` (`guildId` VARCHAR(255), `guildName` VARCHAR(255), PRIMARY KEY (`guildId`))');
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.end();
    }
  }

  public async registerUser(userId: string, ingameName: string, guild: string) {
    return await this.executeSingleQuery(`INSERT INTO users (userId, ingameName, guild) VALUES (${this.pool.escape(userId)}, ${this.pool.escape(ingameName)}, ${this.pool.escape(guild)}`);
  }

  public async removeUser(userId: string) {
    return await this.executeSingleQuery(`DELETE FROM users WHERE userId = ${this.pool.escape(userId)}`);
  }

  public async addGuild(guildId: string, guildName: string) {
    return await this.executeSingleQuery(`INSERT INTO guilds (guildId, guildName) VALUES (${this.pool.escape(guildId)}, ${this.pool.escape(guildName)})`);
  }

  public async removeGuild(guildId: string) {
    return await this.executeSingleQuery(`DELETE FROM guilds WHERE guildId = ${this.pool.escape(guildId)}`);
  }
}