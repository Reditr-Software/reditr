import React from 'react';
import { render } from 'react-dom';
import history from '../utilities/History';
import HeaderView from './HeaderView';
import QuickSwitchView from './QuickSwitchView';
import StreamView from './StreamView';
import PostView from './PostView';
import LeftSidebarView from './LeftSidebarView';
import Keystrokes from '../utilities/Keystrokes';
import Observable from '../utilities/Observable';
import Device from '../utilities/Device';
import UserManager from '../account/UserManager';
import { BrowserRouter as Router, Route, Switch, Link, withRouter } from 'react-router-dom';

// Then we delete a bunch of code from App and
// add some <Link> elements...
class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = { quickSwitchVisible: false };
  }

  // this method is invoked when the user hits enter within the quickSwitcher, and
  // we want to close the quick switcher from here
  closeQuickSwitcher() {
    this.setState({ quickSwitchVisible: false });
  }

  showQuickSwitcher() {
    this.setState({ quickSwitchVisible: !this.state.quickSwitchVisible });
  }

  componentDidMount() {
    Observable.global.on(this, 'requestQuickSwitcher', this.showQuickSwitcher);
    Observable.global.on(this, 'requestExitQuickSwitcher', this.closeQuickSwitcher);
    Keystrokes.listen(['⌘e','⌃e'], this.showQuickSwitcher.bind(this));
    Keystrokes.listen("⎋", event => {
      if(this.state.quickSwitchVisible) this.closeQuickSwitcher();
    });
  }

  classForAppView() {
    var curClass = 'app-view';
    if (Device.isIE()) {
      curClass += ' isie';
    } else if (Device.isIOS()) {
      curClass += ' isios';
    }
    return curClass;
  }

  render() {
    var quickSwitch = this.state.quickSwitchVisible ? <QuickSwitchView onSubredditChanged={this.closeQuickSwitcher.bind(this)}/> : false;
    var curClass = this.classForAppView();
    return (
      <div className={curClass}>
        <HeaderView/>
        <LeftSidebarView/>
          <Router>
            <Switch>
              <Route exact path="/" component={StreamView} />
              <Route exact path="/r/:subreddit" component={StreamView} />
              <Route exact path="/r/:subreddit/:sort" component={StreamView} />
              <Route exact path="/r/:subreddit/comments/:id/" component={PostView} />
              <Route exact path="/r/:subreddit/comments/:id/:title/" component={PostView} />
              <Route exact path="/u/:user" component={StreamView} />
              <Route exact path="/user/:user" component={StreamView} />
            </Switch>
          </Router>
          {quickSwitch}
        </div>
      );
  }
}

Observable.global.always("UserManagerInitialized", userManager => {
  // Finally, we render a <Router> with some <Route>s.
  // It does all the fancy routing stuff for us.
  render(<App/>, document.getElementById('App'));
});