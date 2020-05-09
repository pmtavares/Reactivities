import React, { useContext, useEffect, useState } from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import {observer} from 'mobx-react-lite';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfiniteScroll from 'react-infinite-scroller';
import ActivityFilters from './ActivityFilters';
import ActivityListItemPlaceHolder from './ActivityListItemPlaceHolder';

const ActivityDashboard: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const {loadActivities, loadingInitial, pageNumber, setPage, totalPages} = rootStore.activityStore;
    //Paging
    const [loadingNext, setLoadingNext] = useState(false);

    const handleGetNext = () => {

        setLoadingNext(true);
        setPage(pageNumber + 1);
        loadActivities().then(() => setLoadingNext(false));
    }

    useEffect(() => {
      //axios.get<IActivity[]>('https://localhost:44333/api/activities') // No need for this line as I create agente fie to handle
      loadActivities();
    }, [loadActivities]);
  
    //After setting loading to false above, we can put the following code
   // if(loadingInitial && pageNumber === 0) return <LoadingComponent content='Loading activities...' />
    return (
        <Grid>
            <Grid.Column width={10}>
            {loadingInitial && pageNumber === 0 ? (<ActivityListItemPlaceHolder />) :
            (
                <InfiniteScroll
                    pageStart={0}
                    loadMore={handleGetNext}
                    hasMore={!loadingNext && pageNumber + 1 < totalPages}
                    initialLoad={false}
                >
                    <ActivityList />  
                </InfiniteScroll>
            )
        
        
            }

                       
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityFilters />
            </Grid.Column>
            <Grid.Column width={10}>
                <Loader active={loadingNext}/>
            </Grid.Column>
        </Grid>
    );
}

export default observer(ActivityDashboard)