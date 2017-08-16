
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

export default class signup extends TrackerReact(React.Component) {

  signin() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var verif = document.getElementById("password-verification").value;
    if(verif == password) {
      Accounts.createUser({email:email,password:password,loggin:true}, function(error) {
        if (!error) {
          Meteor.call("sendVerificationLink", (sendError)=>{
            if (!sendError) {
              Meteor.call("idleTimer");
              FlowRouter.go("/admin/schemas");
            } else {
              console.error(sendError);
            }
          });
        } else {
          console.error(error.error);
        }
      });
    } else {
      alert("Passwords don't match.");
    }
  }

  render() {
    return(
      <div id="login">
        <h1>Système de gestion d'inventaire</h1>
        <p><a className="left-align-login" href="/login">Se connecter</a></p>
        <div id="login-fields">
          <input id="email" type="email" placeholder="Courriel" /> <br/>
          <input id="password" type="password" placeholder="Mot de passe" />
          <input id="password-verification" type="password" placeholder="Confirm your password" />
          <div className="btn-rec-transparent" onClick={this.signin.bind(this)}>S'inscrire</div>
        </div>
      </div>
    );
  }
}
