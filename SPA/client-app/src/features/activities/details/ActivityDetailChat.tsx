import React, { Fragment }  from 'react';
import { Header, Segment, Comment } from 'semantic-ui-react';

const ActivityDetailChat = () => {

    return (
        <Fragment>
            <Segment>
                <Header>
                    Chat about thi event
                </Header>
            </Segment>
            <Segment attached>
            <Comment.Group>
                <Comment>
                    <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                    <Comment.Content>
                        <Comment.Author as='a'>Matt</Comment.Author>
                        <Comment.Metadata>
                            <div>Today at 5:42PM</div>
                        </Comment.Metadata>
                        <Comment.Text>How artistic!</Comment.Text>
                        <Comment.Actions>
                        <   Comment.Action>Reply</Comment.Action>
                        </Comment.Actions>
                    </Comment.Content>
                </Comment>
            </Comment.Group>
        </Segment>
        </Fragment>   
    )
}

export default ActivityDetailChat