import { IDBConnection } from '../lib/sql/connection'

interface IGamesAppVersionid {
  latest_price_versionid: number
}

interface IGamesAppProperties extends IGamesAppVersionid {
  appid: number
  name: string
  creation_time: Date
  modification_time: Date
}

interface IGameSetOK {
  fieldCount: number
  affectedRows: number
  insertId: number
  serverStatus: number
  warningCount: number
  message: string
  protocol41: boolean
  changedRows: number
}

export default class GamesApp {
  connection: IDBConnection

  constructor(connection: IDBConnection) {
    this.connection = connection
  }

  async getAppListCount(): Promise<number> {
    return (await this.connection.query('select count(*) from game.games_app_list'))[0]['count(*)']
  }

  async getGamesAppByAppid(appid: number): Promise<IGamesAppProperties | null> {
    const data: Array<IGamesAppProperties> = await this.connection.query(
      'select * from game.games_app_list where appid = ?',
      appid
    )
    if (data.length > 0) {
      return data[0] as IGamesAppProperties
    } else {
      return null
    }
  }

  async getGamesAppInatermediateData({
    limit,
    offset,
  }: {
    limit: number
    offset: number
  }): Promise<Array<IGamesAppProperties>> {
    return await this.connection.query('select * from game.games_app_list limit ? offset ?', [limit, offset])
  }

  async getLatestVersionidByAppid(appid: number): Promise<IGamesAppVersionid | null> {
    const data = await this.connection.query(
      'select latest_price_versionid from game.games_app_list where appid = ?',
      appid
    )

    if (data.length > 0) {
      return data[0] as IGamesAppVersionid
    }

    return null
  }

  async setGamesApp({ appid, name }: { appid: number; name: string }): Promise<IGameSetOK> {
    return await this.connection.query('insert into game.games_app_list SET ?', {
      appid,
      name,
    })
  }

  async updateLatestVersionid({ insertId, appid }: { insertId: number; appid: number }): Promise<IGameSetOK> {
    return await this.connection.query('update game.games_app_list SET latest_price_versionid = ? where appid = ?', [
      insertId,
      appid,
    ])
  }
}
