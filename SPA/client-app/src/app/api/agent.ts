import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';

axios.defaults.baseURL = 'https://localhost:44333/api';

const responseBody = (response: AxiosResponse) => response.data;


const resquests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url,body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody)

}

const Activities = {
    list: () : Promise<IActivity[]>=> resquests.get('/activities'),
    details: (id: string) => resquests.get(`/activities/${id}`),
    create: (activity: IActivity) => resquests.post('/activities', activity),
    update: (activity: IActivity) => resquests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => resquests.del(`/activities/${id}`)
}

export default {
    Activities
}