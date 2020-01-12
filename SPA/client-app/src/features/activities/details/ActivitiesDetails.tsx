import React, { useContext, useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import {observer} from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailInfo from './ActivityDetailInfo';
import ActivityDetailChat from './ActivityDetailChat';
import ActivityDetailSideBar from './ActivityDetailSideBar';
import { RootStoreContext } from '../../../app/stores/rootStore';

interface DetailParams
{
  id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) =>
{
    const rootStore = useContext(RootStoreContext)
    const {activity, loadActivity, loadingInitial } = rootStore.activityStore;

    useEffect(() =>{
      loadActivity(match.params.id);
    }, [loadActivity, match.params.id, history])

    if(loadingInitial) return <LoadingComponent content='Loading activity...' /> 

    if(!activity){
      return <h1>Activity Not found</h1>
    }

    return(
        <Grid>
          <Grid.Column width={10}>
            <ActivityDetailedHeader activity={activity}/>
            <ActivityDetailInfo activity={activity}/>
            <ActivityDetailChat />
          </Grid.Column>
          <Grid.Column width={6}>
            <ActivityDetailSideBar attendees={activity.attendees}/>
          </Grid.Column>
        </Grid>      

    );

}


export default observer(ActivityDetails);