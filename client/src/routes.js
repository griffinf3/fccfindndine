import Home from './components/Home.jsx';
import Options from './components/Options.jsx';
import LoginPage from './containers/LoginPage.jsx';
import SignUpPage from './containers/SignUpPage.jsx';
import SearchPage from './components/SearchPage.jsx';
import Help from './components/Help.jsx';
import SignLog from './components/SignLog.jsx';
import Auth from './modules/Auth';
import Parent from './components/Parent.jsx';

const routes = {
  // base component (wrapper for the whole application).
  component: Parent,
  childRoutes: [
    {
      path: '/',
      component: Home
    },

    
    {
      path: '/search',
      component: SearchPage
    },
      
    {
      path: '/options',
      component: Options
    },
    
    {
      path: '/help',
      component: Help
    },

    {
      path: '/login', 
      component: LoginPage
    },

    {
      path: '/signup',
      component: SignUpPage
    },
      
    {
      path: '/signlog',
      component: SignLog
    },
      
    {
      path: '/logout',
      onEnter: (nextState, replace) => {
        Auth.deauthenticateUser();
        // change the current URL to /
        replace('/');
      }
    }
  ]
};

export default routes;
