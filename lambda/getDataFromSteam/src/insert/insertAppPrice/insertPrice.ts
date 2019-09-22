import _ from 'lodash'
import GamesApp from '../../model/GamesApp'
import GamesPriceList from '../../model/GamesPriceList'
import MysqlConnector from '../../lib/sql/connection'

import { ISteamDetailItem } from '../../dataInterface'

const insertPrice = async (updateInformation: Array<ISteamDetailItem>) => {
  const connector = new MysqlConnector()
  const connection = await connector.createConnection()

  try {
    const gameAppModel = new GamesApp(connection)
    const gamesPriceModel = new GamesPriceList(connection)

    const promises = _.map(updateInformation, async val => {
      console.dir(val)

      const insert = await gamesPriceModel.setGamePrice(val)
      // 最新バージョンのprice_versionidをgames_app_listテーブルに保存する
      const update = await gameAppModel.updateLatestVersionid({
        insertId: insert.insertId,
        appid: val.appid,
      })

      return update
    })

    const result = await Promise.all(promises)
    connection.end()

    return result
  } catch (error) {
    console.error(error)
    connection.end()
    throw error
  }
}

export default insertPrice
