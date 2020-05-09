import React, {Fragment, useContext, useEffect} from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {observer} from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps, Switch } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivitiesDetails';
import NotFound from './NotFound';
import {ToastContainer} from 'react-toastify';
import LoginForm from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import RegisterForm from '../../features/user/RegisterForm';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoutes from './PrivateRoutes';

const App: React.FC<RouteComponentProps> = ({location}) => {
  const rootStore = useContext(RootStoreContext);
  const {setAppLoaded, token, appLoaded} = rootStore.commonStore;
  const {getUser} = rootStore.userStore;

  useEffect(()=>{
      if(token){
        getUser().finally(()=> setAppLoaded());
      }else
      {
        setAppLoaded();
      }
    }, [getUser, token, setAppLoaded]);

    if(!appLoaded)
    {
      return <LoadingComponent content='Loading app...' />
    }

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right'/>
      <Route exact path='/' component={HomePage}/>
      <Route path={'/(.+)'} render={()=> (
        <Fragment>
          <NavBar />
          <Container style={{marginTop: '100px'} }>    
          <Switch>
              <PrivateRoutes exact path={'/activities'} component={ActivityDashboard} />
              <PrivateRoutes exact path={'/activities/:id'} component={ActivityDetails} />
              <PrivateRoutes key={location.key} 
                path={['/createActivity', '/manage/:id']} 
                component={ActivityForm} />
              <Route exact path='/login' component={LoginForm} />
              <PrivateRoutes exact path='/profile/:username' component={ProfilePage} />
              <PrivateRoutes exact path='/register' component={RegisterForm} />
              <Route component={NotFound} />
          </Switch>
          </Container>
        </Fragment>
      )} />

    </Fragment>
  );



}

export default withRouter(observer(App));
