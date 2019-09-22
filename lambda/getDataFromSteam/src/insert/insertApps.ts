import _ from 'lodash'

import GetAppList from '../api/getAppList'
import MysqlConnector from '../lib/sql/connection'
import GamesApp from '../model/GamesApp'

console.info('/===== insertApps Start =====/')
;(async () => {
  const connector = new MysqlConnector()
  const connection = await connector.createConnection()

  try {
    const getAppList = new GetAppList()
    const model = new GamesApp(connection)

    const {
      applist: { apps },
    } = await getAppList.request()

    console.info(`gameAppsList: ${apps.length} 件`)

    // insertする予定のゲーム情報を格納する
    const insertGamesApps = []

    const promises = _.map(apps, async app => {
      const gameApp = await model.getGamesAppByAppid(app.appid)

      // 登録されていない場合のみinsertする
      if (!gameApp) {
        console.log(`insertGame: appid ${app.appid} name ${app.name}`)
        insertGamesApps.push(app)

        return await model.setGamesApp({ appid: app.appid, name: app.name })
      }
    })

    await Promise.all(promises)

    if (insertGamesApps.length > 0) {
      console.log(JSON.stringify(insertGamesApps))
    } else {
      console.log('games_app_listテーブルの更新をしませんでした')
    }

    connection.end()

    console.info('/===== insertApps End =====/')
    return
  } catch (e) {
    console.error(e)
    connection.end()
    return
  }
})()
