import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import logos from "../assets/logo.png";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import req from "../helper/api";
import { Icon } from "semantic-ui-react";
import "bootstrap/dist/css/bootstrap.min.css";

//Adding of User
export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isNotAllowed: false,
      id: null,
      fullname: null,
      profession: null,
      toUpdate: false,
      toAddUser: false
    };
    this.onUserSelect = this.onUserSelect.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  componentDidMount() {
    let isAdminLocal = localStorage.getItem("isAdmin");
    if (isAdminLocal === "true") {
      this.setState({ isNotAllowed: false });
      this.getNow();
    } else {
      this.setState({ isNotAllowed: true });
    }
  }
  getNow = () => {
    req
      .getUsers()
      .then(resp => {
        console.log(resp);
        var tempArray = [];
        let datai = resp.data.data;
        datai.forEach(element => {
          if (!element.isAdmin) {
            let myobj = {
              id: element._id,
              fullname: element.firstname + " " + element.lastname,
              profession: element.profession
            };
            tempArray.push(myobj);
          }
        });
        this.setState({ users: tempArray });
        console.log("array ", this.state.users);
      })
      .catch(err => {
        console.log("error on getting records", err);
      });
  };
  userEdit = () => {
    this.setState({ toUpdate: true });
  };
  userAdd = () => {
    this.setState({ toAddUser: true });
  };
  async onUserSelect(e) {
    await this.setState({
      displayDialog: true,
      id: e.data.id,
      fullname: e.data.fullname,
      profession: e.data.profession
    });
  }
  async handleDelete(e) {
    await req
      .deleteUser(this.state.id)
      .then(resp => {
        this.getNow(); //request again
        this.setState({ displayDialog: false });
      })
      .catch(err => {
        console.log(err);
      });
  }
  onClick = () => {
    this.setState({ visible: true });
    localStorage.setItem("isAdmin", null);
  };

  render() {
    if (this.state.isNotAllowed === true) {
      return <Redirect to={{ pathname: "/" }} />;
    }
    //Condition for updating user
    if (this.state.toUpdate === true) {
      return (
        <Redirect
          to={{ pathname: "/updateuser", state: { id: this.state.id } }}
        />
      );
    }
    //Condition for adding user
    if (this.state.toAddUser === true) {
      return <Redirect to={{ pathname: "/create" }} />;
    }
    //Table for List of Users
    let header = (
      <div>
        <div style={{ lineHeight: "1.87em" }}>
          <h1 className="mydecor"> List Of Users</h1>
        </div>
        <div>
        </div>
      </div>
    );
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light hheader ">
          <a className="navbar-brand">
            <img src={logos} width="150" height="80" />
          </a>
          <div className="collpase nav-collapse">
            <ul className="navbar-nav mr-auto">
              <li>
                <div>
                  <Button
                    variant="outline-info"
                    id="adminhead"
                    onClick={this.userAdd}
                    inverted
                  >
                    <Icon name="add" /> Add User
                  </Button>
                </div>
              </li>
              <li>
                <div className="form-group">
                  <Link to="/">
                    <Button
                      variant="outline-info"
                      onClick={this.onClick}
                      inverted
                    >
                      <Icon name="checkmark" /> Logout
                    </Button>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </nav>
        <br />
        <br />
        <Card className="add-card">
          <div className="content-section implementation">
            <DataTable
              filter={true}
              value={this.state.users}
              header={header}
              globalFilter={this.state.globalFilter}
              emptyMessage="No records found"
              selectionMode="single"
              onRowSelect={this.onUserSelect}
            >
              <Column field="fullname" header="Fullname" />
              <Column field="profession" header="Profession" />
            </DataTable>

            <Dialog
              visible={this.state.displayDialog}
              className="dialoguser"
              header="User"
              modal={true}
              onHide={() => this.setState({ displayDialog: false })}
            >
              <div>
                <h1>Name: {this.state.fullname}</h1>
                <h1>Profession: {this.state.profession}</h1>
              </div>
              <br />
              <div className="p-grid">
                <div className="p-col">
                  <Button
                    variant="outline-success"
                    className="block"
                    onClick={this.userEdit}
                    inverted
                  >
                    <Icon name="checkmark" /> Edit
                  </Button>
                </div>
                <div className="p-col">
                  <Button
                    variant="outline-danger"
                    className="block"
                    onClick={this.handleDelete}
                    inverted
                  >
                    <Icon name="remove" /> Delete
                  </Button>
                </div>
              </div>
            </Dialog>
          </div>
        </Card>
      </div>
    );
  }
}
