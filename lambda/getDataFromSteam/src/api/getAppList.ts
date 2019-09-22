import axios, { AxiosResponse } from 'axios'
import { IAPIRequest } from './apiCommon'

interface IAPIRequestToSteam extends IAPIRequest {
  request(any): Promise<ISteamAppsList>
}

interface ISteamAppsList {
  applist: {
    apps: [
      {
        appid: number
        name: string
      }
    ]
  }
}

class GetAppList implements IAPIRequestToSteam {
  async request() {
    try {
      const response: AxiosResponse = await axios.get('http://api.steampowered.com/ISteamApps/GetAppList/v2')
      const data: ISteamAppsList = response.data

      return data
    } catch (e) {
      throw e
    }
  }
}

export default GetAppList
