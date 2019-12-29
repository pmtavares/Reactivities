import React, { useContext, Fragment } from 'react'
import { Container, Segment, Header, Button, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';

const HomePage = () =>
{
    const rootStore = useContext(RootStoreContext);
    const {isLoggedIn, user} = rootStore.userStore;

    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h2' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{marginBottom: 12}}>
                    </Image>
                    Reactivities
                </Header>
                {isLoggedIn && user ? (
                    <Fragment>
                        <Header as='h3' inverted content={`Welcome back ${user.displayName}`}></Header>
                        <Button as={Link} to='/activities' size='huge' inverted>
                            Go to activities
                        </Button>
                    </Fragment>
                ):(<Fragment>
                       <Header as='h3' inverted content='Welcome to reactivities'></Header>
                        <Button as={Link} to='/login' size='huge' inverted>
                            Login
                        </Button>
                        <Button as={Link} to='/register' size='huge' inverted>
                            Register
                        </Button>
                </Fragment> 
                )}
             
            </Container>
        </Segment>

    )
}

export default HomePage