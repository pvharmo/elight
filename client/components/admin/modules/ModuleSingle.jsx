
import React, {Component} from "react";
import {DragSource, DropTarget} from "react-dnd";
import flow from "lodash.flow";
import * as adminActions from "/client/flux/actions/adminActions";

import ListItem from "@material-ui/core/List";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Toc from "@material-ui/icons/Toc";

const moduleSource = {
  beginDrag(props) {
    return {id:props.module.id};
  }
};

var lastId = "";

const moduleTarget = {
  hover(props) {
    if (props.module.id !== lastId) {
      lastId = props.module.id;
      props.onHover(props.module.id);
    }
  },
  drop(props, monitor) {
    props.onHover(undefined);
    Meteor.call("moveModule", props.module.id, monitor.getItem().id);
  }
};

class ModuleSingle extends Component {

  constructor() {
    super();
  }

  moduleType() {
    return this.props.module.type;
  }

  deleteModule() {
    var prompt = confirm("Êtes-vous sûr de vouloir supprimer ce module?");
    if (prompt) {
      Meteor.call("deleteModule", this.props.module.id, this.props.module.order, this.props.module.page);
    }
  }

  // Change state of editState to true
  editModule() {
    adminActions.editModule(this.props.module);
    // FlowRouter.go("/admin/modules/"+this.props.module.type+"/"+this.props.module.id);
  }

  render() {
    return flow(this.props.connectDragSource, this.props.connectDropTarget)(
      <div>
        {this.props.hover === this.props.module.id && <Divider inset />}
        <ListItem button >
          <ListItemText primary={this.props.module.name} secondary={this.props.module.type} onClick={this.editModule.bind(this)} />
          <ListItemSecondaryAction>
            <IconButton aria-label="Delete" disabled >
              <Toc style={{width:32, height: 32}} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </div>
    );
  }
}

export default flow(DragSource("module", moduleSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
})), DropTarget("module", moduleTarget, connect => ({
  connectDropTarget: connect.dropTarget()
})))(ModuleSingle);
