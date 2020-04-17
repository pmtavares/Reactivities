import axios, { AxiosResponse } from 'axios';
import { IActivity } from '../models/activity';
import { history } from '../..';
import { toast } from 'react-toastify';
import { IUser, IUserFormValues } from '../models/user';
import { IProfile, IPhoto } from '../models/profile';



axios.defaults.baseURL = 'https://localhost:44333/api';

//Midleware for requests
axios.interceptors.request.use((config) => {
    const token = window.localStorage.getItem('jwt');
    if(token)
    {
        config.headers.Authorization = `Bearer ${token}`;        
    };
    return config
}, error => {
    return Promise.reject(error);
})


//Midleware for errors
axios.interceptors.response.use(undefined, error =>{
    if(error.message === "Network Error" && !error.response)
    {
        toast.error("Network error - make sure api is running!");
    }

    const {status, data, config} = error.response;
    if(status === 404)
    {
        history.push('/notfound');
    }

    if(status === 400 && config.method === 'get' && data.errors.hasOwnProperty('id'))
    {
        history.push('/notfound');
    }
    
    if(status === 500)
    {
        toast.error("Server error -  check terminal for  more info!");
    }

    throw error.response;

});

const responseBody = (response: AxiosResponse) => response.data;

//Function to delay the requests. Then add a "then" to request in the requests function below
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(()=> resolve(response), ms));

const resquests = {
    get: (url: string) => axios.get(url).then(sleep(1000)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(sleep(1000)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url,body).then(sleep(1000)).then(responseBody),
    del: (url: string) => axios.delete(url).then(sleep(1000)).then(responseBody),
    postForm: (url: string, file: Blob)=>{
        let formData = new FormData();
        formData.append('File', file);
        return axios.post(url, formData, {headers: {'Content-type': 'multipart/form-data'}})
                    .then(responseBody)
    } 
}

const Activities = {
    list: () : Promise<IActivity[]>=> resquests.get('/activities'),
    details: (id: string) => resquests.get(`/activities/${id}`),
    create: (activity: IActivity) => resquests.post('/activities', activity),
    update: (activity: IActivity) => resquests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => resquests.del(`/activities/${id}`),
    attend: (id: string) => resquests.post(`/activities/${id}/attend`,{}),
    unattend: (id: string) =>resquests.del(`/activities/${id}/attend`)
}

const User = {
    current: (): Promise<IUser> => resquests.get('/user'),
    login: (user: IUserFormValues): Promise<IUser> => resquests.post('/user/login', user),
    register: (user: IUserFormValues): Promise<IUser> => resquests.post('/user/register', user)
}

const Profiles = {
    get: (username: string): Promise<IProfile> => resquests.get(`/profiles/${username}`),
    uploadPhoto: (photo: Blob) : Promise<IPhoto> => resquests.postForm(`/photos`, photo)
}

export default {
    Activities,
    User,
    Profiles
}