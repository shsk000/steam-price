import axios, { AxiosResponse } from 'axios'
import * as _ from 'lodash'
import { IAPIRequest } from './apiCommon'
import { ISteamDetailItem } from '../dataInterface'

interface IAPIRequestToSteam extends IAPIRequest {
  request(appid: number | Array<number>): Promise<Array<ISteamDetailItem>>
}

class GetAppDetail implements IAPIRequestToSteam {
  async request(appid: number | Array<number>) {
    try {
      if (typeof appid === 'number') {
        appid = [appid]
      }

      const formattedAppid = _.join(appid, ',')

      const response: AxiosResponse = await axios.get(
        `https://store.steampowered.com/api/appdetails?appids=${formattedAppid}&cc=jp&filters=price_overview`
      )

      return this.filter(response)
    } catch (e) {
      throw e
    }
  }

  /**
   * price情報を取得できないデータを排除する
   */
  filter({ data }: AxiosResponse): Array<ISteamDetailItem> {
    const filteredData: Array<ISteamDetailItem> = _.map(data, (val, key) => {
      if (!_.has(val, `success`) || !_.has(val, `data.price_overview`) || val.success === false) {
        // console.log(
        //   `cron/api/getAppDetailOfPrice: appid: ${parseInt(key, 10)} 正式なデータ取得ができないためスキップします`
        // )
        return undefined
      }
      return {
        ...val.data.price_overview,
        appid: parseInt(key, 10),
      }
    })

    return _.compact(filteredData)
  }
}

export default GetAppDetail
