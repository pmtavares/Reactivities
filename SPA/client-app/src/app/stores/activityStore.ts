import {observable, action, computed, runInAction, reaction} from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import {history} from '../../index';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { setActivityProps, createAttendee } from '../common/util/util';
import {HubConnection, LogLevel, HubConnectionBuilder} from '@microsoft/signalr';

/*
* In case we get a warning, go to tsconfig.js and add "experimentalDecorator": true
*
*/

const LIMIT = 2;

export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore)
    {
        this.rootStore = rootStore;

        reaction(
            () => this.predicates.keys(),
            () => {
                this.pageNumber = 0;
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }


    @observable activityRegistry = new Map();
    @observable activities: IActivity[]=[];
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;
    @observable.ref hubConnection: HubConnection | null = null;

    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
                                .withUrl('http://localhost:58333/chat'!, 
                                    {accessTokenFactory: () => this.rootStore.commonStore.token!})
                                .configureLogging(LogLevel.Information)
                                .build();

       /* this.hubConnection.start().then(() => this.hubConnection!.state)
                                  .then(() => {
                                        this.hubConnection!.invoke("AddToGroup", activityId)
                                  })
                                  .catch(error => console.log("Error establishing connection: ", error));
*/
        this.hubConnection
            .start()
            .then(() => console.log(this.hubConnection!.state))
            .catch(error => console.log("Error establishing connection: ", error));                         

        this.hubConnection.on("ReceiveComment", comment => {
            runInAction(() => {
                this.activity!.comments.push(comment)
            })

        })

        this.hubConnection.on("Send", message => {
            console.info(message)
        });
    }

    @action stopHubConnection = () => {
        this.hubConnection!.invoke("RemoveFromGroup", this.activity!.id)
        .then(() => {
            this.hubConnection!.stop();
        })
        .then(() => console.log("Connection stopped"))
        .catch(err => console.log(err))
    }

    @action addComment = async (values: any) => {
        values.activityId = this.activity!.id;
        try
        {
            await this.hubConnection!.invoke("SendComment", values); //Method name in the api

        }
        catch(error)
        {
            console.log(error)
            toast.error("Error: Could not add comment")
        }
    }

    @action setPredicates = (predicate: string, value: string | Date) => {
        this.predicates.clear();
        if(predicate !== 'all')
        {
            this.predicates.set(predicate, value);
        }
    } 

    @computed get axiosParams()
    {
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.pageNumber ? this.pageNumber * LIMIT : 0}`);
        this.predicates.forEach((value, key)=> {
            if(key === 'startDate')
            {
                params.append(key, value.toISOString())
            }
            else{
                params.append(key, value);
            }
            
        })
        return params;
    }
    //Get total number of pages
    @computed get totalPages()
    {
        return Math.ceil(this.activityCount / LIMIT);
    }
    //When inserting a new activity, sort by date
    @computed get activitiesByDate()
    {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
        //return Array.from(this.activityRegistry.values())
          //      .sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

   

    @action setPage = (page:number) =>
    {    
        this.pageNumber = page;
    }

    groupActivitiesByDate(activities: IActivity[]){
        const sortedActivities =  activities.sort(
            (a,b) => a.date.getTime() - b.date.getTime()
        );
        return Object.entries(sortedActivities.reduce((activities, activity) => {
                    const date = activity.date.toISOString().split('T')[0];
                    activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                    return activities;
                }, {} as {[key: string]: IActivity[]}
            )
        );
    }

    @action loadActivities = async () =>
    {
        this.loadingInitial = true;    
        const user = this.rootStore.userStore.user!;    
        try
        {
            const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
            const {activities, activityCount} = activitiesEnvelope;

            runInAction('Geting Activities',()=> {
                activities.forEach(activity =>{
                    setActivityProps(activity, user);

                    this.activityRegistry.set(activity.id, activity);
                }); 
                this.activityCount = activityCount;
                this.loadingInitial = false;    
            })  
                     
        }
        catch(error)
        {
            runInAction(()=> {
                this.loadingInitial = false;
                console.log(error);
            })            
        }
    }

    @action loadActivity= async (id: string) =>{
        let activity = this.getActivity(id);
        if(activity)
        {
            this.activity = activity;
            return activity;
        }
        else{
            this.loadingInitial = true;
            const user = this.rootStore.userStore.user!;    
            try{
                activity = await agent.Activities.details(id);
                runInAction('getting activity',() =>{
                    setActivityProps(activity, user);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })

                return activity;
            }
            catch(error)
            {
                runInAction('getting activity error', () =>{
                    this.loadingInitial = false;
                })
                console.log(error)
                
            }
        }
    }
    @action clearActivity = () =>
    {
        this.activity = null;
    }

    getActivity = (id: string) => 
    {
        return this.activityRegistry.get(id);
    }

    @action selectActivity = (id: string) =>
    {
        this.activity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    @action createActivity = async (activity : IActivity) =>
    {
        this.submitting = true;
        try{
            await  agent.Activities.create(activity);

            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true;
            runInAction('Creating activity',()=> {
                this.activityRegistry.set(activity.id, activity);
                //this.activity = this.activityRegistry.get(activity.id);
                //this.editMode = false;
                this.submitting = false;
            })
            history.push(`/activities/${activity.id}`)
    
        }
        catch(error)
        {
            runInAction(()=> {
                this.submitting = false;
            })
            toast.error("Problem submiting data");
            console.log(error);
        }
    }

    @action editActivity = async (activity: IActivity) =>
    {
        this.submitting = true;
        try{
            await agent.Activities.update(activity);
            runInAction(()=> {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                //this.editMode = false;         
                this.submitting = false;
            })
            history.push(`/activities/${activity.id}`)
            
        }
        catch(error)
        {
            runInAction(()=> {
                console.log(error);
                this.submitting = false;
            })
        }
    }

    @action openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action openCreateForm = () =>
    {
        this.editMode = true;
        this.activity = null;
    }

    @action cancelSelectedActivity =() =>
    {
        this.activity = null;
        
    }

    @action cancelEditForm =() =>
    {
        this.editMode = false;
        
    }

    @action deleteActivity= async (event: SyntheticEvent<HTMLButtonElement> , id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try{
            await agent.Activities.delete(id);
            runInAction('Deleting activity',()=> {
                this.activityRegistry.delete(id);     
                this.submitting = false;
                this.target = ''; 
            })
                 
        }
        catch(error)
        {
            runInAction(()=> {
                console.log(error);
                this.submitting = false;
                this.target = '';
            })

        }
    }

    @action attendActivity = async () =>{
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try{
            await agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if(this.activity)
                {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
                this.loading = false;
            });
        }
        catch(error){
            runInAction(() => {
                this.loading = false;
            });

            toast.error('Problem sigining up to activity')
        }
        
    }

    @action cancelAttendance = async () =>{
        this.loading = true;
        try{
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if(this.activity)
                {
                    this.activity.attendees = this.activity.attendees.filter(
                        a => a.username !== this.rootStore.userStore.user!.username
                    );
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                }
                this.loading = false;
            })
            
        }
        catch(error)
        {
            runInAction(() => {
                this.loading = false;
            });
            toast.error("Problem canceling attendance");
        }
       
    }
}

//export default createContext(new ActivityStore())