import React, {useState, useEffect, Fragment, SyntheticEvent, useContext} from 'react';
//import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';


const App = () => {
  const activityStore = useContext(ActivityStore);
  const [activities, setActivities]=useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);
  //Loading component
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  //Method to fix all the buttons loading
  const [target, setTarget] = useState('');

  const handleSelectActivity =(id: string) =>
  {
      setSelectedActivity(activities.filter(a=> a.id === id)[0]);
      setEditMode(false);
  }


const handleCreateActivity = (activity: IActivity)=>{
  setSubmitting(true);
  agent.Activities.create(activity).then(()=> {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }).then(()=> setSubmitting(false));
}

const handleEditActivity = (activity: IActivity)=> 
{
  setSubmitting(true);
  agent.Activities.update(activity).then(()=>{
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }).then(()=> setSubmitting(false))

}

const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement> ,id: string) =>
{
  setSubmitting(true);
  setTarget(event.currentTarget.name);
  agent.Activities.delete(id).then(()=>{
    setActivities([...activities.filter(a=> a.id !== id)]);
  }).then(()=> setSubmitting(false))

}

  useEffect(() => {
    //axios.get<IActivity[]>('https://localhost:44333/api/activities') // No need for this line as I create agente fie to handle
    activityStore.loadActivities();
  }, [activityStore]);

  //After setting loading to false above, we can put the following code
  if(activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />


 return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '100px'}}>
          <ActivityDashboard 
            activities={activityStore.activities} 
            selectActivity={handleSelectActivity}
            setEditMode = {setEditMode}
            setSelectedActivity = {setSelectedActivity}
            editActivity = {handleEditActivity}
            deleteActivity = {handleDeleteActivity}
            submitting = {submitting}
            target = {target}
            />
      </Container>

    </Fragment>
  );



}

export default observer(App);
