
import React from "react";
import ReactDOM from "react-dom";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import RoleSingle from "./RoleSingle.jsx";
import RolesTopToolbar from "./RolesTopToolbar.jsx";

import {Scrollbars} from "react-custom-scrollbars";
import List from "@material-ui/core/List";
export default class RolesWrapper extends TrackerReact(React.Component) {
  constructor() {
    super();

    this.state = {
      subscription: {
        roles: Meteor.subscribe("appRoles"),
      }
    };
  }

  roles() {
    return Roles.find().fetch();
  }

  render() {
    var height = window.innerHeight - 199;

    return (
      <div>
        <RolesTopToolbar />
        <Scrollbars style={{width: "100%", height}} >
          <List>
            {this.roles().map( (role)=>{
              return (
                <RoleSingle
                  key={role.id}
                  role={role} />
              );
            })}
          </List>
        </Scrollbars>
      </div>
    );
  }
}
