import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import {observer} from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';
import LoadingComponent from '../../../app/layout/LoadingComponent';

const ActivityDashboard: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    useEffect(() => {
      //axios.get<IActivity[]>('https://localhost:44333/api/activities') // No need for this line as I create agente fie to handle
      activityStore.loadActivities();
    }, [activityStore]);
  
    //After setting loading to false above, we can put the following code
    if(activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />                
            </Grid.Column>
            <Grid.Column width={6}>
                <h3>Activity filters</h3>
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard)