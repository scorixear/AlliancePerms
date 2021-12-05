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

  /**
   * Initializes the DataBase
   */
  public async initDB() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      console.log('DB Connection established');
      await conn.query('CREATE TABLE IF NOT EXISTS `users` (`userid` VARCHAR(255), `ingameName` VARCHAR(255), `guild` VARCHAR(255), PRIMARY KEY (`userId`))');
      await conn.query('CREATE TABLE IF NOT EXISTS `guilds` (`guildId` VARCHAR(255), `guildName` VARCHAR(255), PRIMARY KEY (`guildId`))');
    } catch (error) {
      throw error;
    } finally {
      if (conn) conn.end();
    }
  }
}