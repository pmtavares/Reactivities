import React from 'react'
import {observer} from 'mobx-react-lite'
import { Segment, Grid, Reveal, Item, Header, Statistic, Divider, Button } from 'semantic-ui-react';
import { IProfile } from '../../app/models/profile';

interface IProps {
    profile: IProfile
}

const ProfileHeader:React.FC<IProps> = ({profile}) => {
    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image
                            avatar size='small' src={profile.image || '/assets/user.png'}
                            >
                                
                            </Item.Image>
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1'>
                                    {profile.displayName}
                                </Header>
                            </Item.Content>

                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                        <Statistic.Group>
                            <Statistic label='Followers' value='5'/>
                            <Statistic label='Following' value='42'/>
                        </Statistic.Group>
                        <Divider />
                        <Reveal animated='move'>
                            <Reveal.Content visible style={{width: '100%'}}>
                                <Button 
                                    fluid color='teal' content='Following'
                                />
                            </Reveal.Content>
                            <Reveal.Content hidden>
                                <Button 
                                    fluid basic color={true ? 'red' : 'green'} 
                                    content={true? 'Unfollow': 'Follow'}
                                />
                            </Reveal.Content>
                        </Reveal>
                </Grid.Column>
            </Grid>
        </Segment>
    )
}

export default observer(ProfileHeader)
