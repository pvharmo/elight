/*jshint esversion: 6 */
import React from "react";
import Header from "./Header.jsx";
import Nav from "./Nav.jsx";
import RightDrawer from "../rightDrawer/RightDrawer.jsx";
//import AccountsUI from "./AccountsUI.jsx";
import injectTapEventPlugin from "react-tap-event-plugin";

injectTapEventPlugin();

Session.set("admin-rights", false);

/*var admin = /\/admin\//;

setInterval(function() {
  if (window.location.pathname.match(admin) && !Meteor.userId() && !Meteor.loggingIn()) {
    location.reload();
  }
}, 1000);*/

var style = {};

if (window.innerWidth > 900) {
  style.paddingLeft = "200px";
}

/*if (process.env.NODE_ENV !== "production") {
  const {whyDidYouUpdate} = require('why-did-you-update')
  whyDidYouUpdate(React)
}*/

export const MainLayout = ({content, resetIdleTimer}) => (
  <div id="main-container" onTouchTap={resetIdleTimer} >
    <Header />
    <div id="secondary-container" className="row" >
      <div id="nav-container">
        <Nav />
      </div>
      <div id="content-container" style={style/*window.innerWidth > 900 ? {paddingLeft: "200px"} : {paddingLeft: "0px"}*/} >
        <div className="row" >
          {content}
        </div>
      </div>
    </div>
  </div>
);
