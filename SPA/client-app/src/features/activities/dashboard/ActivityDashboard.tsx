import React from 'react';
import { Menu, Container, Button, Grid, GridColumn, List } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivitiesDetails';

interface IProps {
    activities: IActivity[]
}

const ActivityDashboard: React.FC<IProps> = ({activities}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList activities={activities}/>
                {/*<List>
                    {activities.map((activity) => (
                        <List.Item key={activity.id}>{activity.title}</List.Item>
                    ))}
                    </List> */}
            </Grid.Column>
            <Grid.Column width={6}>
                    <ActivityDetails />
            </Grid.Column>
        </Grid>
    );
}

export default ActivityDashboard