import { createConnection } from 'promise-mysql'

export interface IDBConnector {
  createConnection(): Promise<IDBConnection>
  getConnection(): IDBConnection
}

export interface IDBConnection {
  query(...any): any
  end(): void
}

class MysqlConnector implements IDBConnector {
  static connection: null | IDBConnection = null

  async createConnection(): Promise<IDBConnection> {
    MysqlConnector.connection = await createConnection({
      host: 'db',
      user: 'root',
      password: 'root',
      charset: 'utf8mb4',
    })

    return MysqlConnector.connection
  }

  getConnection(): IDBConnection {
    return MysqlConnector.connection
  }
}

export default MysqlConnector
