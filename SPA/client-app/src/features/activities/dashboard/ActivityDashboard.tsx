import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import {observer} from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';

const ActivityDashboard: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {loadActivities, loadingInitial} = rootStore.activityStore;
    useEffect(() => {
      //axios.get<IActivity[]>('https://localhost:44333/api/activities') // No need for this line as I create agente fie to handle
      loadActivities();
    }, [loadActivities]);
  
    //After setting loading to false above, we can put the following code
    if(loadingInitial) return <LoadingComponent content='Loading activities...' />
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