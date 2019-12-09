import React, { Component } from "react";
import { Menubar } from "primereact/menubar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
// import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import App from "../styles/App.css";
import req from "../helper/api";
import { Link } from "react-router-dom";
import { Form, Segment, Icon } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import logo from "..//assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

//Shows the current patients table
export default class Menu extends Component {
  constructor() {
    super();
    this.state = {
      patients: [],
      myPatient: null,
      id: null,
      name: null,
      age: null,
      toRecord: false,
      toAdd: false,
      edit: false,
      selParient: null,
      isNotAllowed: false
    };

    this.onPatientSelect = this.onPatientSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  //
  componentWillMount() {
    let isAdminLocal = localStorage.getItem("isAdmin");
    if (isAdminLocal === "false") {
      this.setState({ isNotAllowed: false });
    } else {
      this.setState({ isNotAllowed: true });
    }
    this.getNow();
  }
  getNow = () => {
    req
      .getPatients()
      .then(resp => {
        var tempArray = [];
        let datai = resp.data.data;
        datai.forEach(element => {
          let myobj = {
            id: element._id,
            Name: element.fname + " " + element.lname,
            Age: element.age,
            Date: new Date(element.currentdate).toDateString()
          }
          tempArray.push(myobj);
        });
        this.setState({ patients: tempArray });
      })
      .catch(err => {
        console.log("error on componentDidMount");
      });
  };
  handleAction(id) {
    console.log(id);
    this.setState({ actionId: id });
  }
  async onPatientSelect(e) {
    await this.setState({
      displayDialog: true,
      id: e.data.id,
      name: e.data.Name,
      age: e.data.Age
    });
  }
  dialogAlert = () => {
    this.setState({ toRecord: true });
  };

  gotoAddPatient = () => {
    this.setState({ toAdd: true });
  };

  onClick = () => {
    this.setState({ visible: true });
    localStorage.setItem("isAdmin", null);
  };
  async handleDelete(e) {
    await req
      .deletePatient(this.state.id)
      .then(resp => {
        this.getNow(); //request again
        this.setState({ displayDialog: false });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    if (this.state.toRecord === true) {
      return (
        <Redirect to={{ pathname: "/records", state: { id: this.state.id } }} />
      );
    }
    if (this.state.isNotAllowed === true) {
      return <Redirect to={{ pathname: "/" }} />;
    }
    if (this.state.toAdd === true) {
      return <Redirect to={{ pathname: "/addpatient" }} />;
    }
    //Shows current patients
    let header = (
      <div >
        <div style={{ lineHeight: "1.87em"}}>
          <h1 className="mydecor outlined">Current Patients</h1>
        </div>
        <div>
          <Form.Input
            type="search"
            icon="search"
            fluid
            placeholder="Search for patient"
            value={this.state.fname}
            onChange={e => this.setState({ globalFilter: e.target.value })}
            id="inputsearch"
          />
        </div>
      </div>
    );
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light hheader ">
          <a className="navbar-brand">
            <img src={logo} width="150" height="80" />
          </a>
          <div className="collpase nav-collapse">
            <ul className="navbar-nav mr-auto">
              <li>
                <div>
                  <Button variant="outline-info" id="heads"
                    onClick={this.gotoAddPatient} inverted>
                    <Icon name='add' /> Add Patient
                    </Button>
                </div>
              </li>
              <li>
                <div>
                  <Link to="/">
                    <Button variant="outline-info"id="heads1"
                      onClick={this.onClick} inverted>
                      <Icon name='checkmark' /> Logout
                    </Button>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </nav>
        {/* </Menubar> */}
        <br />
        
        <Card className="add-card">
        {/* //Showing the patients name and the date confined or checked up */}
          <div className="content-section implementation">
            <DataTable 
              filter={true}
              value={this.state.patients}
              header={header }
              globalFilter={this.state.globalFilter}
              emptyMessage="No records found"
              selectionMode="single"
              onRowSelect={this.onPatientSelect}
            >
              <Column field="Name" header="Name" />
              <Column field="Age" header="Age" />
              <Column field="Date" header="Date" />
            </DataTable>

            <Dialog
              visible={this.state.displayDialog}
              className="dialog"
              header="Patients"
              modal={true}
              onHide={() => this.setState({ displayDialog: false })}
            >
              <div>
                <h1>Name: {this.state.name}</h1>
                <h1>Age: {this.state.age}</h1>
              </div>
              <br />
              <div className="p-grid">
                <div className="p-col">
                  <Button variant="outline-success" className="block"
                     onClick={this.dialogAlert} inverted>
                      <Icon name='edit' /> Show/Edit Medical Records
                    </Button>
                </div>
                <div className="p-col">
                  <Button variant="outline-danger" className="block"
                    onClick={this.handleDelete} inverted>
                    <Icon name='remove' /> Delete
                  </Button>
                </div>
              </div>
            </Dialog>
          </div>
        </Card>
      </div>
      // </div>
    );
  }
}
