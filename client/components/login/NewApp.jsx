
import React, {Component} from "react";
import language from "../../languages/languages.js";
import {theme} from "../frame/MainLayout.jsx";
import {MuiThemeProvider} from "material-ui/styles";
import formStore from "/client/flux/stores/formStore";

import Form from "../FormGenerator/Form.jsx";

import Typography from "material-ui/Typography";
import Card, {CardActions, CardContent} from "material-ui/Card";
import MobileStepper from "material-ui/MobileStepper";
import Button from "material-ui/Button";
import KeyboardArrowLeft from "material-ui-icons/KeyboardArrowLeft";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";

export default class NewApp extends Component {

  constructor() {
    super();

    this.state = {
      activeStep:0
    };
  }

  previous() {
    var step = this.state.activeStep - 1;
    this.setState({activeStep:step});
  }

  next() {
    var step = this.state.activeStep + 1;
    this.setState({activeStep:step});
  }

  render() {

    const fieldsApp = [
      {type:"text", name: "name", label: "Nom de l'application"},
      {type:"text", name: "category", label: "Catégorie"}
    ];

    const fieldsEntities = [
      {type:"text", name: "name", label: "Nom de l'application"},
      {type:"text", name: "category", label: "Catégorie"}
    ];

    const fieldsFields = [
      {type:"text", name: "name", label: "Nom de l'application"},
      {type:"text", name: "category", label: "Catégorie"}
    ];

    const fieldsSections = [
      {type:"text", name: "name", label: "Nom de l'application"},
      {type:"text", name: "category", label: "Catégorie"}
    ];

    const fieldsModules = [
      {type:"text", name: "name", label: "Nom de l'application"},
      {type:"text", name: "category", label: "Catégorie"}
    ];

    return(
      <div style={{backgroundImage: "url('/images/login-bg.jpg')", height: "99vh", paddingTop:"1vh"}} >
        <MuiThemeProvider theme={theme} >
          <Card style={{margin: "auto", marginTop: "34vh", width: 600}}>
            <CardContent style={{textAlign:"center"}} >
              {this.state.activeStep >= 1 && <Typography gutterBottom type="display1" color="accent" >Nouvelle application</Typography>}
              {this.state.activeStep >= 1 && <Typography gutterBottom > Étape {this.state.activeStep} de 6</Typography>}
              {this.state.activeStep === 0 &&
                <div>
                  <Button disabled={this.state.activeStep >= 5} onClick={this.next.bind(this)} ><KeyboardArrowRight /></Button>
                </div>
              }
              {this.state.activeStep === 1 &&
                <Form formId="NewApp" fields={fieldsApp} data={{}} />
              }
              {this.state.activeStep === 2 &&
                <Form formId="NewAppEntities" fields={fieldsEntities} data={{}} />
              }
              {this.state.activeStep === 3 &&
                <Form formId="NewAppFields" fields={fieldsFields} data={{}} />
              }
              {this.state.activeStep === 4 &&
                <Form formId="NewAppSections" fields={fieldsSections} data={{}} />
              }
              {this.state.activeStep === 5 &&
                <Form formId="NewAppModules" fields={fieldsModules} data={{}} />
              }
            </CardContent>
            <CardActions>
              {this.state.activeStep >= 1 &&
                <div style={{margin:"auto"}}>
                  <Button disabled={this.state.activeStep <= 0} onClick={this.previous.bind(this)} >
                    <KeyboardArrowLeft /><Typography>Retour</Typography>
                  </Button>
                  <Button disabled={this.state.activeStep >= 6} onClick={this.next.bind(this)} >
                    <Typography>Suivant</Typography><KeyboardArrowRight />
                  </Button>
                </div>
              }
            </CardActions>
          </Card>
        </MuiThemeProvider>
      </div>
    );
  }
}

//
