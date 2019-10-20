import React, {useState, useEffect, Fragment} from 'react';
//import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';


const App = () => {
  const [activities, setActivities]=useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity =(id: string) =>
  {
      setSelectedActivity(activities.filter(a=> a.id === id)[0]);
      setEditMode(false);
  }

  //Function to handle the form for creation of activities and details
  const handleOpenCreateForm = () =>
  {
      setSelectedActivity(null);
      setEditMode(true);
  }


const handleCreateActivity = (activity: IActivity)=>{
  agent.Activities.create(activity).then(()=> {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  })


}

const handleEditActivity = (activity: IActivity)=> 
{
  agent.Activities.update(activity).then(()=>{
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  })

}

const handleDeleteActivity = (id: string) =>
{
  agent.Activities.delete(id).then(()=>{
    setActivities([...activities.filter(a=> a.id !== id)]);
  })

}

  useEffect(() => {
    //axios.get<IActivity[]>('https://localhost:44333/api/activities') // No need for this line as I create agente fie to handle
    agent.Activities.list()
      .then((response) => {
        let activities:IActivity[] = [];
        response.forEach(activity =>{
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        })
        //setActivities(activities);
        setActivities(response)
      });
  }, []);


 return (
    <Fragment>
      <NavBar openCreateForm = {handleOpenCreateForm} />
      <Container style={{marginTop: '100px'}}>
          <ActivityDashboard 
            activities={activities} 
            selectActivity={handleSelectActivity}
            selectedActivity ={selectedActivity}
            editMode = {editMode}
            setEditMode = {setEditMode}
            setSelectedActivity = {setSelectedActivity}
            createActivity = {handleCreateActivity}
            editActivity = {handleEditActivity}
            deleteActivity = {handleDeleteActivity}
            />
      </Container>

    </Fragment>
  );



}

export default App;
