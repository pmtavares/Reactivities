import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react';
import {observer} from 'mobx-react-lite'
import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { RootStoreContext } from '../../app/stores/rootStore';
import { RouteComponentProps } from 'react-router';
import LoadingComponent from '../../app/layout/LoadingComponent';

interface RouteParams
{
    username: string
}

interface IProps extends RouteComponentProps<RouteParams>{}

const ProfilePage: React.FC<IProps> = ({match}) => {
    const rootStore = useContext(RootStoreContext);
    const {loadingProfile, profile, loadProfile} = rootStore.profileStore;

    useEffect(() => {
        loadProfile(match.params.username)
    }, [loadProfile, match])

    if(loadingProfile)
    {
        return <LoadingComponent content='Loading Profile...' />
    }

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader profile={profile!}/>
                <ProfileContent />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfilePage)
