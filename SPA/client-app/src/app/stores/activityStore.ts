import {observable, action, computed} from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';


/*
* In case we get a warning, go to tsconfig.js and add "experimentalDecorator": true
*
*/

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
        try{
            const activities = await agent.Activities.list();
            activities.forEach(activity =>{
                activity.date = activity.date.split('.')[0];
                this.activityRegistry.set(activity.id, activity);
              });            
        }
        catch(error)
        {
            console.log(error);
        }
        finally
        {
            this.loadingInitial = false
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
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = this.activityRegistry.get(activity.id);
            this.editMode = false;
        
        }catch(error)
        {
            console.log(error);
        }
        finally
        {
            this.submitting = false;
        }
    }

    @action editActivity = async (activity: IActivity) =>
    {
        this.submitting = true;
        try{
            await agent.Activities.update(activity);
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;          

        }
        catch(error)
        {
            console.log(error);
        }
        finally
        {
            this.submitting = false;
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
            this.activityRegistry.delete(id);                       
        }
        catch(error)
        {
            console.log(error);
        }
        finally
        {
            this.submitting = false;
            this.target = '';
        }
    }
}

export default createContext(new ActivityStore())