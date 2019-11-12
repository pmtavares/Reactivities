import React from 'react';
import {Link} from 'react-router-dom';
import { Segment, Header, Icon, Button } from 'semantic-ui-react';

const NotFound = () =>
{
    return (
        <Segment placeholder>
            <Header icon>
                <Icon  name='search'/>
                Oops, we have lost you somewhere...
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' primary>
                    Return to activities page
                </Button>
            </Segment.Inline>
        </Segment>
    );
}

export default NotFound;

