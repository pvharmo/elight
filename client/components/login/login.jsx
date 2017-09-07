
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import {theme} from "../frame/MainLayout.jsx";
import {MuiThemeProvider} from "material-ui/styles";
import formStore from "/client/flux/stores/formStore";

import Form from "../FormGenerator/Form.jsx";

import Typography from "material-ui/Typography";
import Card, {CardActions, CardContent} from "material-ui/Card";
import Button from "material-ui/Button";

export default class login extends TrackerReact(React.Component) {

  login() {
    var email = formStore.getData("login").email;
    var password = formStore.getData("login").password;
    Meteor.loginWithPassword(email, password, function(error) {
      if (!error) {
        Meteor.call("onLogin");
        Meteor.call("idleTimer");
        FlowRouter.go("/admin/schemas");
      } else {
        alert("Le courriel et le mot de passe ne concordent pas.");
      }
    });
  }

  go(route) {
    FlowRouter.go(route);
  }

  render() {

    const fields = [
      {type:"text", name: "email", label: "Courriel"},
      {type:"password", name: "password", label: "Mot de passe"}
    ];

    return(
      <div style={{backgroundImage: "url('images/login-bg.jpg')", height: "99vh", paddingTop:"1vh"}} >
        <MuiThemeProvider theme={theme} >
          <Card style={{margin: "auto", marginTop: "34vh", width: 230}}>
            <CardContent>
              <Typography type="display1" color="accent" >Se connecter</Typography>
              <Form formId="login" fields={fields} data={{}} />
            </CardContent>
            <CardActions>
              <Button color="primary" onClick={this.login.bind(this)} >Connexion</Button>
              <Button color="accent" onClick={this.go.bind(this, "/signup")} >S'inscrire</Button>
            </CardActions>
          </Card>

        </MuiThemeProvider>
      </div>
    );
  }
}
