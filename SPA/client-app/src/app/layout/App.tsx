import React, {useEffect, Fragment, useContext} from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite';
import { Route } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';


const App = () => {
  const activityStore = useContext(ActivityStore);
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
          <Route exact path='/' component={HomePage}/>
          <Route path='/activities' component={ActivityDashboard} />
          <Route path='/createActivity' component={ActivityForm} />
      </Container>

    </Fragment>
  );



}

export default observer(App);
