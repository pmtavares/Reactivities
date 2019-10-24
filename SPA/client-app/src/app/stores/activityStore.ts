import {observable, action, computed} from 'mobx';
import { createContext } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

/*
* In case we get a warning, go to tsconfig.js and add "experimentalDecorator": true
*
*/

class ActivityStore {
    
    @observable activities: IActivity[]=[];
    @observable loadingInitial = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
    @observable submitting = false;

    //When inserting a new activity, sort by date
    @computed get activityByDate()
    {
        return this.activities.sort((a,b) => Date.parse(a.date) - Date.parse(b.date));    

    }

    @action loadActivities = async () =>
    {
        this.loadingInitial = true;        
        try{
            const activities = await agent.Activities.list();
            activities.forEach(activity =>{
                activity.date = activity.date.split('.')[0];
                this.activities.push(activity);
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
        this.selectedActivity = this.activities.find(a=> a.id === id);
        this.editMode = false;
    }

    @action createActivity = async (activity : IActivity) =>
    {
        this.submitting = true;
        try{
            await  agent.Activities.create(activity);
            this.activities.push(activity);
            this.selectedActivity = this.activities.find(a=> a.id === activity.id);
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

    @action openCreateForm = () =>
    {
        this.editMode = true;
        this.selectedActivity = undefined;
    }
}

export default createContext(new ActivityStore())