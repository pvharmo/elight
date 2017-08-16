/*jshint esversion: 6 */
import React from "react";
import Header from "./Header.jsx";
import Nav from "./Nav.jsx";
import RightDrawer from "../admin/rightDrawer/RightDrawer.jsx";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

var style = {};
if (window.innerWidth > 900) {
  style.paddingLeft = "200px";
}

export const MainLayout = ({content, resetIdleTimer}) => (
  <div id="main-container" onTouchTap={resetIdleTimer} >
    <Header />
    <div id="secondary-container" className="row" >
      <div id="nav-container">
        <Nav />
      </div>
      <div id="content-container" style={style} >
        <div className="row" >
          {content}
        </div>
      </div>
    </div>
  </div>
);
