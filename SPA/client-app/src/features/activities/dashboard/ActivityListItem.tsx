import React from 'react';
import { Item, Button, Label, Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { IActivity } from '../../../app/models/activity';
import {format} from 'date-fns';
import ActivityListItemAttendees from './ActivityListemItemAttendees';

const ActivityListItem: React.FC<{activity: IActivity}> = ({activity}) =>
{
    //const host = activity.attendees.filter(x => x.isHost)[0];

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={'/assets/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                            
                            <Item.Description>
                                Hosted by Pedro
                            </Item.Description>
                            { activity.isHost &&
                                <Item.Description>
                                    <Label basic color='orange' content='you are hosting' />                                
                                </Item.Description>
                            }
                            { !activity.isHost && activity.isGoing &&
                                <Item.Description>
                                    <Label basic color='green' content='you are going' />                                
                                </Item.Description>
                            }
                            
                            <Item.Extra>                  
                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item> 
                </Item.Group>                
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees} />
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`}
                                floated='right' content='View' color='blue' />
            </Segment>
        </Segment.Group>
        
    )
}

export default ActivityListItem