import React, { Component } from "react";

import { Redirect,Link } from "react-router-dom";
import { Card, Form, Segment, Button, Icon } from "semantic-ui-react";
import req from "../helper/api";

export default class CreateTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      middlename: "",
      lastname: "",
      profession: "",
      username: "",
      password: "",
      repeatpass: "",
      todo_completed: false,
      values: [],
      toAdminHome: false,
      updating: false,
      hidden1: true,
      hidden2: true,
      eyeIcon1: "eye slash",
      eyeIcon2: "eye slash",
    };
    this.updateForUsers = this.updateForUsers.bind(this);
  }
  componentDidMount() {
    console.log("Current route ", this.props.location.pathname);
    let myroute = this.props.location.pathname;
    if (myroute.includes("create")) {
      this.setState({ updating: false });
    } else {
      this.setState({ updating: true });
      this.getNow();
      req
        .idUsers(this.props.location.state.id)
        .then(resp => {
          console.log("Users: ", resp.data.info);
          let datai = resp.data.info;
          this.setState({ firstname: datai.firstname });
          this.setState({ middlename: datai.middlename });
          this.setState({ lastname: datai.lastname });
          this.setState({ profession: datai.profession });
          this.setState({ username: datai.username });
          this.setState({ password: datai.password });
          this.setState({ repeatpass: datai.repeatpass });
        })
        .catch(err => {
          console.log("error on record");
        });
    }  
  }
  


  addtoDB = (e) => {
    e.preventDefault();
    if (this.state.password === this.state.repeatpass) {
      let user = {
        username: this.state.username,
        password: this.state.password,
        firstname: this.state.firstname,
        middlename: this.state.middlename,
        lastname: this.state.lastname,
        profession: this.state.profession,
        haschange:false
      };
      req.addUser(user).then(resp => {
        this.setState({ toAdminHome: true })
        console.log("addUser: ",resp)
      }).catch(err => {
        console.log(err)
      })
    } else {
      alert("Error!!")
    }

  }
  async updateForUsers(e){
    e.preventDefault()
    const body = {
      username: this.state.username,
      password: this.state.password,
      firstname: this.state.firstname,
      middlename: this.state.middlename,
      lastname: this.state.lastname,
      profession: this.state.profession
    };
    await req
      .updateUsers(this.props.location.state.id, body)
      .then(resp => {
        this.setState({ toAdminHome: true });
        console.log("updateuser: ",resp)
      })
      .catch(err => {
        console.log(err);
      });

  }
  handleCancel = () => {
    this.setState({ visible: true });
    
  }
  getNow = () => {
    req
      .idUsers(this.props.location.state.id)
      .then(resp => {
        console.log(resp)
      })
      .catch(err => {
        console.log("error on getting records");
      });
  };
  handleEyeClickpass1 = () => {
    if (this.state.hidden1) {
      this.setState({ eyeIcon1: "eye", hidden1: false });
    } else {
      this.setState({ eyeIcon1: "eye slash", hidden1: true });
    }
  };
  handleEyeClickpass2 = () => {
    if (this.state.hidden2) {
      this.setState({ eyeIcon2: "eye", hidden2: false });
    } else {
      this.setState({ eyeIcon2: "eye slash", hidden2: true });
    }
  };

  render() {
    if (this.state.toAdminHome === true) {
      return <Redirect to="/admin" />
    }
    const pageTitle = this.state.updating ? (
      <h1 className="title-text">Update User Information</h1>
    ) : (
      <h1 className="title-text">User Information</h1>
    );
    const update = this.state.updating ? (
      <div>
        <Segment id="segment" inverted color='teal'>
          <Button id = "segment-btn" basic inverted color="teal" onClick={this.updateForUsers}> Update </Button>
          <Link to="admin">
            <Button id = "segment-btn" basic inverted color="teal" onClick={this.handleCancel}> Cancel </Button>
          </Link>
        </Segment><br/>
      </div>
    ) : (
      <Segment id="segment" inverted color='teal'>
        <Button id = "segment-btn" basic inverted color="teal" onClick={this.addtoDB}> Add User </Button>
        <Link to="admin">
          <Button id = "segment-btn" basic inverted color="teal" onClick={this.handleCancel}> Cancel </Button>
        </Link>
      </Segment>
    );
    return (
      <div>
        <br />
        <br />
        <Card id="card_user">
          <div style={{ marginTop: 20 }}>
            <Form>
            <div>
                <center>{pageTitle}</center>
              </div><br/><br/>
              <div>
                <Form.Input fluid value={this.state.firstname} label="First Name " 
                placeholder="firstname"onChange={e => this.setState({ firstname: e.target.value })}/>
                <br />
                <Form.Input fluid value={this.state.middlename} label="Middle Name "
                  placeholder="middlename" onChange={e => this.setState({ middlename: e.target.value })}
                />
                <br />
                <Form.Input fluid value={this.state.lastname} label="Last Name "
                  placeholder="lastname" onChange={e => this.setState({ lastname: e.target.value })}/>
                <br />
                <Form.Input fluid value={this.state.profession} label="Profession "
                  placeholder="profession" onChange={e => this.setState({ profession: e.target.value })}
                />
                <br />
                <Form.Input fluid value={this.state.username} label="Username "
                  placeholder="username" onChange={e => this.setState({ username: e.target.value })} />
                <br />
                <Form.Input fluid value={this.state.password} type={this.state.hidden1 ? "password" : "text"}
                  icon={<Icon name={this.state.eyeIcon1} link onClick={this.handleEyeClickpass1} />} label="Password"
                  placeholder="password"onChange={e => this.setState({ password: e.target.value })} />
                <Form.Input fluid value={this.state.repeatpass}                   type={this.state.hidden2 ? "password" : "text"}
                  icon={<Icon name={this.state.eyeIcon2} link onClick={this.handleEyeClickpass2} />} label="Repeat Password"
                  placeholder="repeat password" onChange={e => this.setState({ repeatpass: e.target.value })} />
                <br />
                <div>{update}</div>
               
              </div>
            </Form>
          </div>
        </Card>
        <br/>
      </div>
    );
  }
}
