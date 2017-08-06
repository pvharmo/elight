/* global AggregationResult:true */
import React, {Component} from "react";
import ReactDOM from "react-dom";
import language from "../../../languages/languages.js";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import moment from "moment";
import _ from "lodash";
import Chart from "chart.js";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import {cyan50, red500, blue500} from "material-ui/styles/colors";
//import DataTables from "material-ui-datatables";
import {Card, CardActions, CardHeader, CardText, CardMedia} from "material-ui/Card";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from "material-ui/Table";
import Snackbar from "material-ui/Snackbar";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import Checkbox from "material-ui/Checkbox";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import IconButton from "material-ui/IconButton";
import ArrowDropDown from "material-ui/svg-icons/navigation/arrow-drop-down";
import ArrowDropUp from "material-ui/svg-icons/navigation/arrow-drop-up";
import FloatingActionButton from "material-ui/FloatingActionButton";
import Done from "material-ui/svg-icons/action/done";
import AvNotInterested from "material-ui/svg-icons/av/not-interested";
import Clear from "material-ui/svg-icons/content/clear";
import NavNext from "material-ui/svg-icons/image/navigate-next";
import NavPrev from "material-ui/svg-icons/image/navigate-before";

export default class FormWrapper extends TrackerReact(React.Component) {
  constructor(props) {
    super(props);

    this.state = {
      datasets: [],
      labels: [],
      labelsCount: 0
    };
  }

  componentDidMount() {
    this.dataRequest();
  }

  componentDidUpdate() {
    this.chart();
  }

  chart() {
    console.log("test");
    var module = this.props.module;
    var labels = [];

    if (this.props.module.params.x == "date") {

      switch (this.props.module.params.groupByDate) {
      case "days":
        for (var i = 0; i <= this.state.labelsCount; i++) {
          labels.push(i);
        }
        break;
      case "weekDays":
        labels = [1,2,3,4,5,6,7];
        break;
      case "MonthsOfYear":
        labels = [1,2,3,4,5,6,7,8,9,10,11,12];
        break;
      default:
        labels = [1,2,3,4];
      }
    }

    //console.log(this.state.datasets[0].data);

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: module.params.graphType,
      data: {
        labels,
        datasets: this.state.datasets
        /*[{
          label: "# of Votes",
          data: [0,2,5,9,10],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }]*/
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }

  dataRequest() {
    var _this = this;
    var borderColors = ["rgba(244, 67, 54, 1)", "rgba(103, 58, 183, 1)", "rgba(3, 169, 244, 1)", "rgba(76, 175, 80, 1)", "#FFEB3B", "#FF5722", "#607D8B", "#E91E63", "#3F51B5", "#00BCD4", "#8BC34A", "#FFC107", "#795548", "#9C27B0", "#2196F3", "#009688", "#CDDC39", "#FF9800"];
    var backbroundColors = ["rgba(244, 67, 54, 0.2)", "rgba(103, 58, 183, 0.2)", "rgba(3, 169, 244, 0.2)", "rgba(76, 175, 80, 0.2)", "#FFEB3B", "#FF5722", "#607D8B", "#E91E63", "#3F51B5", "#00BCD4", "#8BC34A", "#FFC107", "#795548", "#9C27B0", "#2196F3", "#009688", "#CDDC39", "#FF9800"];
    Meteor.call("chartRequest", this.props.module, function(err, res) {
      var labelsCount = 0;
      if (err) {
        console.error(err);
      } else {
        console.log(res);
        var datasets = _this.state.datasets;
        var labels = [];
        var graphStart = moment(res[0][0]._id);
        var graphEnd = moment(res[0][res[0].length - 1]._id);
        for (var x = 1; x < res.length; x++) {
          if (moment(res[x][0]._id).isBefore(graphStart)) {
            graphStart = moment(res[x][0]._id);
          }
          if (moment(res[x][res[x].length - 1]._id).isAfter(graphEnd)) {
            graphEnd = moment(res[x][res[x].length - 1]._id);
          }
        }
        for (var i = 0; i < res.length; i++) {
          var data = [];
          var groupByDate = _this.props.module.params.groupByDate;
          var graphStartInterval = moment(res[i][0]._id).diff(graphStart, _this.props.module.params.groupByDate);
          var graphEndInterval = graphEnd.diff(moment(res[i][res[i].length - 1]._id), _this.props.module.params.groupByDate);
          //console.log(res[i]);
          //console.log(graphEnd);
          //console.log(moment(res[i][res[i].length - 1]._id));
          for (var y = 0; y < graphStartInterval; y++) {
            data.push(0);
          }
          for (var j = 0; j < res[i].length; j++) {
            data.push(res[i][j].total);
            if (j + 1 < res[i].length) {
              var datasetStart = moment(res[i][j]._id);
              var datasetEnd = moment(res[i][j + 1]._id);
              var datasetInterval = datasetEnd.diff(datasetStart, _this.props.module.params.groupByDate);
              for (var k = 0; k < datasetInterval - 1; k++) {
                data.push(0);
              }
            }
          }
          for (var z = 0; z < graphEndInterval; z++) {
            data.push(0);
          }
          datasets.push({data, label: res[i][0].refItem, borderColor: borderColors[i], backgroundColor: backbroundColors[i]});
          if (labelsCount < data.length) {
            labelsCount = data.length - 1;
          }
        }
        _this.setState({datasets, labels, labelsCount});
      }
    });
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Card style={{width: "99%", margin: "1% auto"}}>
            <CardHeader
              title={this.props.module.name}
              titleStyle={{fontWeight: "400", fontSize: "24px"}}
              style={{paddingBottom: "8px"}}
            />
            <CardText style={{paddingBottom: "8px"}} >
              <canvas id="myChart" width="400" height="200"></canvas>
            </CardText>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }
}
