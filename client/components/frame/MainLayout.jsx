
import React from "react";
import Header from "./Header.jsx";
import Nav from "./Nav.jsx";
import createMuiTheme from "material-ui/styles/theme";
import {MuiThemeProvider} from "material-ui/styles";
/*import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();*/

var style = {};

if (window.innerWidth > 900) {
  style.marginLeft = 250;
}

const theme = createMuiTheme();

export const MainLayout = ({content/*, resetIdleTimer*/}) => (
  <div id="main-container" >
    <MuiThemeProvider theme={theme}>
      <div>
        <Header />
        <div id="secondary-container" className="row" >
          <div id="nav-container">
            <Nav />
          </div>
          <div id="content-container" style={{width:"100%"}} >
            <div style={style} >
              {content}
            </div>
          </div>
        </div>
      </div>
    </MuiThemeProvider>
  </div>
);
