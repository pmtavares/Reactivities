import React from 'react';
import { Component } from 'react';
import './App.css';
import axios from 'axios';
import { Header, Icon, List } from 'semantic-ui-react';

class App extends Component {
  state = {
    values: []
  }

  componentDidMount() {
    axios.get('https://localhost:44333/api/values')
      .then((response) => {
        console.log(response);
        this.setState({
          values: response.data
        })
      })


  }

  render() {
    return (
      <div>
        <Header as='h2'>
          <Icon name='users' />
          <Header.Content>Reactivity</Header.Content>
        </Header>
        <List>
          {this.state.values.map((data: any) => (
            <List.Item key={data.id}>{data.name}</List.Item>
          ))}

        </List>
        <ul>
         

        </ul>

      </div>
    );
  }


}

export default App;
