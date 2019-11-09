import React from 'react'
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const HomePage = () =>
{
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h2' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}>
                    </Image>
                    Reactivities
                </Header>
                <Header as='h3' inverted content='Welcome to reactivities'></Header>
                <Button as={Link} to='/activities' size='huge' inverted>
                    Go to activities
                </Button>
            </Container>
        </Segment>

    )
}

export default HomePage