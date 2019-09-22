import _ from 'lodash'
import GetAppDetail from '../../api/getAppDetail'
import GamesApp from '../../model/GamesApp'
import GamesPriceList from '../../model/GamesPriceList'
import MysqlConnector from '../../lib/sql/connection'

const checkUpdate = async (appidList: Array<number>) => {
  const connector = new MysqlConnector()
  const connection = await connector.createConnection()

  try {
    const gameAppModel = new GamesApp(connection)
    const gamesPriceList = new GamesPriceList(connection)
    const apiDetail = new GetAppDetail()

    const priceOverviewList = await apiDetail.request(appidList)

    if (_.isEmpty(priceOverviewList)) {
      return false
    }

    const promises = _.map(priceOverviewList, async val => {
      const versionid = (await gameAppModel.getLatestVersionidByAppid(val.appid)).latest_price_versionid

      // game.games_app_listテーブル該当ゲームにlatest_price_versionidのデータがある場合
      // API取得したデータとgame.games_price_listのデータを比較し
      // 異なる場合のみgame.games_app_listテーブルにinsertする
      if (versionid) {
        const selectedLatestPrice = await gamesPriceList.getFinalByVersionid(versionid)

        // 最新のgames_price_listのfinalとAPIのfinalが同等だった場合
        // games_price_listを更新しない
        if (val.final === selectedLatestPrice.final) {
          return undefined
        }
      }

      return val
    })

    const result = _.compact(await Promise.all(promises))
    connection.end()

    return result
  } catch (error) {
    console.error(error)
    connection.end()
    throw error
  }
}

export default checkUpdate
