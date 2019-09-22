import _ from 'lodash'

import GamesApp from '../../model/GamesApp'

import checkUpdate from './checkUpdate'
import insertPrice from './insertPrice'
import MysqlConnector from '../../lib/sql/connection'
;(async () => {
  console.info('===== insertAppPrice Start =====')

  const connector = new MysqlConnector()
  const connection = await connector.createConnection()

  try {
    const gameAppModel = new GamesApp(connection)

    // games_app_listの総件数
    const appListCount = await gameAppModel.getAppListCount()
    // TEST CASE CODE
    // const appListCount = 10000

    let count = 0
    const limit = 1000
    // TEST CASE CODE
    // const limit = 1000

    while (count < appListCount) {
      const nextWhileCount = count + limit > appListCount ? appListCount : count + limit
      console.info(`${count} ~ ${nextWhileCount} の処理です`)

      const appList = await gameAppModel.getGamesAppInatermediateData({ limit, offset: count })

      const appidList = _.map(appList, val => {
        return val.appid
      })

      const updateInformation = await checkUpdate(appidList)

      if (updateInformation && !_.isEmpty(updateInformation)) {
        await insertPrice(updateInformation)
      }

      count = nextWhileCount
    }

    connection.end()
    console.info('===== insertAppPrice End =====')
    return
  } catch (error) {
    console.error(error)
    connection.end()
    return
  }
})()
