/*jshint esversion: 6 */
import React, {Component} from "react";
import {Meteor} from "meteor/meteor";

export default class AccountsUI extends Component {

  constructor() {
    super();

    this.state = {
      // Subscribe to collections
      email: "",
      subscription: {
        user:Meteor.subscribe("user"),
      }
    };
  }

  componentWillUnmount() {
    this.state.subscription.user.stop();
  }

  logout() {
    Meteor.logout();
    setTimeout(function () {
      FlowRouter.go("/login");
    }, 100);
  }

  dropMenu() {
    var userMenu = document.getElementById("user-menu");
    if (userMenu.style.display == "none") {
      userMenu.style.display = "block";
    } else {
      userMenu.style.display = "none";
    }
  }

  userEmail() {
    thisObject = this;
    setTimeout(function() {thisObject.setState({email:Meteor.users.find().fetch()[0].emails[0].address}); }, 1000);
    return this.state.email;
  }

  render() {

    return(
      <div className="user-menu-container" onClick={this.userEmail.bind(this)}>
        <div id="user-email" onClick={this.dropMenu.bind(this)}>{this.userEmail()}{/*Meteor.users.emails[0].address*/}</div>
        <ul id="user-menu">
          <li><a href="/settings">Settings</a></li>
          <li><a href="/login" onClick={this.logout.bind(this)}>Logout</a></li>
        </ul>
      </div>
    );
  }
}
