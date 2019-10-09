import React, {useState, useEffect, Fragment} from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';


const App = () => {

  const [activities, setActivities]=useState<IActivity[]>([]);

  useEffect(() => {
    axios.get<IActivity[]>('https://localhost:44333/api/activities')
      .then((response) => {
        setActivities(response.data)
      });
  }, []);


 return (
    <Fragment>
      <NavBar />
      <Container style={{marginTop: '100px'}}>
          <ActivityDashboard activities={activities} />
      </Container>

    </Fragment>
  );



}

export default App;
