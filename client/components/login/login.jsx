
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import language from "../../languages/languages.js";
import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";

export default class login extends TrackerReact(React.Component) {

  login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
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

  render() {
    return(
      <div id="login">
        <h1>Système de gestion d'inventaire</h1>
        <div id="login-fields">
          <input id="email" type="email" placeholder="Courriel" /> <br/>
          <input id="password" type="password" placeholder="Mot de passe" />
          <div className="btn-rec-transparent" onClick={this.login.bind(this)}>Connexion</div>
          <div className="divider"></div>
          <a href="/signup"><div className="btn-rec-transparent">S'inscrire</div></a>
        </div>
      </div>
    );
  }
}
