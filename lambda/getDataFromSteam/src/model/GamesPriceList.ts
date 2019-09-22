import { IDBConnection } from '../lib/sql/connection'
import { ISteamDetailItem } from '../dataInterface'

interface IPriceListFinal {
  final: number
  final_formatted: string
}

// interface IPriceList extends IPriceListFinal {
//   appid: number
//   initial: number
//   discount_percent: number
// }

interface IGamePriceSetOK {
  fieldCount: number
  affectedRows: number
  insertId: number
  serverStatus: number
  warningCount: number
  message: string
  protocol41: boolean
  changedRows: number
}

export default class GamesPriceList {
  connection: IDBConnection

  constructor(connection: IDBConnection) {
    this.connection = connection
  }

  async getFinalByVersionid(versionid: number): Promise<IPriceListFinal | null> {
    const data = await this.connection.query(
      'select final, final_formatted from game.games_price_list where versionid = ?',
      versionid
    )

    if (data.length > 0) {
      return data[0] as IPriceListFinal
    }

    return null
  }

  async setGamePrice(data: ISteamDetailItem): Promise<IGamePriceSetOK> {
    return await this.connection.query('insert into game.games_price_list SET ?', {
      appid: data.appid,
      initial: data.initial,
      final: data.final,
      discount_percent: data.discount_percent,
      final_formatted: data.final_formatted,
    })
  }
}
