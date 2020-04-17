import React from 'react'
import {Tab} from 'semantic-ui-react'
import ProfilePhotos from './ProfilePhotos';


const panes = [
    {menuItem: 'About', render: () => <Tab.Pane>About</Tab.Pane>},
    {menuItem: 'Photos', render: () => <ProfilePhotos />},
    {menuItem: 'Events', render: () => <Tab.Pane>Events</Tab.Pane>},
    {menuItem: 'Followers', render: () => <Tab.Pane>Followers</Tab.Pane>},
    {menuItem: 'Following', render: () => <Tab.Pane>Following</Tab.Pane>},
]
const ProfileContent = () => {
    return (
        <Tab 
            menu={{fluid: true, vertical:true}}
            menuPosition='right'
            panes={panes}
            activeIndex={1}
        />
    )
}

export default ProfileContent
