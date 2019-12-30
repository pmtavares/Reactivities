import {observable, action, computed, runInAction} from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import {history} from '../../index';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';

/*
* In case we get a warning, go to tsconfig.js and add "experimentalDecorator": true
*
*/



export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore)
    {
        this.rootStore = rootStore;
    }


    @observable activityRegistry = new Map();
    @observable activities: IActivity[]=[];
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    //When inserting a new activity, sort by date
    @computed get activitiesByDate()
    {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
        //return Array.from(this.activityRegistry.values())
          //      .sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
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
        try
        {
            const activities = await agent.Activities.list();
            runInAction('Geting Activities',()=> {
                activities.forEach(activity =>{
                    activity.date = new Date(activity.date);
                    this.activityRegistry.set(activity.id, activity);
                }); 
                this.loadingInitial = false;    
            })  
            console.log(this.groupActivitiesByDate(activities));              
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
            try{
                activity = await agent.Activities.details(id);
                runInAction('getting activity',() =>{
                    activity.date = new Date(activity.date);
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
}

//export default createContext(new ActivityStore())