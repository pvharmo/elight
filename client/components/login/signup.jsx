
import React, {Component} from "react";
import language from "../../languages/languages.js";
import {theme} from "../frame/MainLayout.jsx";
import {MuiThemeProvider} from "material-ui/styles";
import formStore from "/client/flux/stores/formStore";

import Form from "../FormGenerator/Form.jsx";

import Typography from "material-ui/Typography";
import Card, {CardActions, CardContent} from "material-ui/Card";
import Button from "material-ui/Button";

export default class signup extends Component {

  signup() {
    var email = formStore.getData("signup").email;
    var password = formStore.getData("signup").password;
    Accounts.createUser({email:email,password:password}, function(error) {
      if (!error) {
        Meteor.call("sendVerificationLink", (sendError)=>{
          if (!sendError) {
            FlowRouter.go("/admin/schemas");
          } else {
            console.error(sendError);
          }
        });
      } else {
        console.error(error.error);
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
              <Typography type="display1" color="accent" >S'inscrire</Typography>
              <Form formId="signup" fields={fields} data={{}} />
            </CardContent>
            <CardActions>
              <Button color="accent" onClick={this.go.bind(this, "/login")} >Connexion</Button>
              <Button color="primary" onClick={this.signup.bind(this)} >Inscription</Button>
            </CardActions>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }
}
