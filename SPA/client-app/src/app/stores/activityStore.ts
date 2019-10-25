import {observable, action, computed, configure, runInAction} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';


/*
* In case we get a warning, go to tsconfig.js and add "experimentalDecorator": true
*
*/

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[]=[];
    @observable loadingInitial = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    //When inserting a new activity, sort by date
    @computed get activityByDate()
    {
        return Array.from(this.activityRegistry.values())
                .sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    @action loadActivities = async () =>
    {
        this.loadingInitial = true;        
        try
        {
            const activities = await agent.Activities.list();
            runInAction(()=> {
                activities.forEach(activity =>{
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                }); 
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

    @action selectActivity = (id: string) =>
    {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    @action createActivity = async (activity : IActivity) =>
    {
        this.submitting = true;
        try{
            await  agent.Activities.create(activity);
            runInAction('Creating activity',()=> {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = this.activityRegistry.get(activity.id);
                this.editMode = false;
                this.submitting = false;
            })
            
    
        }
        catch(error)
        {
            runInAction(()=> {
                this.submitting = false;
            })
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
                this.selectedActivity = activity;
                this.editMode = false;         
                this.submitting = false;
            })
            
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
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action openCreateForm = () =>
    {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action cancelSelectedActivity =() =>
    {
        this.selectedActivity = undefined;
        
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

export default createContext(new ActivityStore())