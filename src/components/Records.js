import React, { Component } from "react";
import { Button, Form, Segment, TextArea, Container, Modal, Card, Icon } from "semantic-ui-react";
import { Dropdown } from "primereact/dropdown";
import { Link, Redirect } from "react-router-dom";
import req from "../helper/api";
import "semantic-ui-css/semantic.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AddedRecords from './AddedRecords'
export default class Records extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      mname: "",
      lname: "",
      birthdate: "",
      age: null,
      sex: "",
      status: "",
      address: "",
      email: "",
      contact: null,
      emercontfname: "",
      emercontmname: "",
      emercontlname: "",
      emercontaddress: "",
      emercontnumber: null,
      emercontemail: "",
      relationship: "",
      open: false,
      date: "",
      title: "",
      findings: "",
      pcpName: "",
      medRecords: [],
      SexOptions: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" }
      ],
      StatusOptions: [
        { label: "Single", value: "Single" },
        { label: "Married", value: "Married" },
        { label: "Divorced", value: "Divorced" },
        { label: "Widowed", value: "Widowed" }
      ],
      toHome: false,
      updating: false,
      today: new Date().toLocaleString(),
      editingRecord: false,
      indRecID: null,
      modalOpen: false,
      notifiaction: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editForRecords = this.editForRecords.bind(this);
  }

  componentDidMount() {
    console.log("Current route ", this.props.location.pathname);
    let myroute = this.props.location.pathname;
    if (myroute.includes("addpatient")) {
      this.setState({ updating: false });
    } else {
      this.setState({ updating: true });
      this.getNow();
      req
        .idPatient(this.props.location.state.id)
        .then(resp => {
          console.log("char2x", resp.data.info);
          let datai = resp.data.info;
          this.setState({ fname: datai.fname });
          this.setState({ mname: datai.mname });
          this.setState({ lname: datai.lname });
          this.setState({ birthdate: datai.birthdate });
          this.setState({ age: datai.age });
          this.setState({ sex: datai.sex });
          this.setState({ address: datai.address });
          this.setState({ status: datai.status });
          this.setState({ email: datai.email });
          this.setState({ contact: datai.contact });
          this.setState({ emercontfname: datai.emercontfname });
          this.setState({ emercontmname: datai.emercontmname });
          this.setState({ emercontlname: datai.emercontlname });
          this.setState({ emercontnumber: datai.emercontnumber });
          this.setState({ emercontemail: datai.emercontemail });
          this.setState({ emercontaddress: datai.emercontaddress });
          this.setState({ relationship: datai.relationship });
        })
        .catch(err => {
          console.log("error on record");
        });
    }
  }
  createToDB = () => {
    const profile = {
      fname: this.state.fname,
      mname: this.state.mname,
      lname: this.state.lname,
      sex: this.state.sex,
      status: this.state.status,
      age: this.state.age,
      birthdate: this.state.birthdate,
      address: this.state.address,
      email: this.state.email,
      contact: this.state.contact,
      emercontfname: this.state.emercontfname,
      emercontmname: this.state.emercontmname,
      emercontlname: this.state.emercontlname,
      emercontnumber: this.state.emercontnumber,
      emercontaddress: this.state.emercontaddress,
      emercontemail: this.state.emercontemail,
      relationship: this.state.relationship,
      currentdate: new Date()
    };
    req
      .addPatient(profile)
      .then(resp => {
        if (resp.status) {
          this.setState({ toHome: true });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  async handleSubmit(e) {
    e.preventDefault();
    const body = {
      fname: this.state.fname,
      mname: this.state.mname,
      lname: this.state.lname,
      sex: this.state.sex,
      status: this.state.status,
      age: this.state.age,
      birthdate: this.state.birthdate,
      address: this.state.address,
      email: this.state.email,
      contact: this.state.contact,
      emercontfname: this.state.emercontfname,
      emercontmname: this.state.emercontmname,
      emercontlname: this.state.emercontlname,
      emercontnumber: this.state.emercontnumber,
      emercontaddress: this.state.emercontaddress,
      emercontemail: this.state.emercontemail,
      relationship: this.state.relationship
    };
    console.log(body)
    await req
      .updatePatient(this.props.location.state.id, body)

      .then(resp => {
        this.setState({ toHome: true });
      })
      .catch(err => {
        console.log(err)
      });
  }
  handleChange = (e, { status }) => {
    e.preventDefault();
    this.setState({ status });
  };
  handleSexChange = (e, { sex }) => {
    e.preventDefault();
    this.setState({ sex });
  };
  show = size => () => this.setState({ size, open: true, title: "", findings: "", pcpName: "", editingRecord: false });
  close = () => this.setState({ open: false });
  //Patients medical record
  getNow = () => {
    req
      .idMedRecords(this.props.location.state.id)
      .then(resp => {
        var tempArray = [];
        let datai = resp.data.info;
        datai.forEach(element => {
          let myobj = {
            ownerID: element.ownerID,
            date: new Date(element.date).toLocaleString(),
            title: element.title,
            findings: element.findings,
            name: element.pcpName,
            recordID: element._id
          };
          tempArray.push(myobj);
        })
        this.setState({ medRecords: tempArray });
      })
      .catch(err => {
        console.log("error on getting records");
      });
  };
  //Function for saving of medical records
  handleSaveMed = e => {
    e.preventDefault();
    let body = {
      ownerID: this.props.location.state.id, date: this.state.today, title: this.state.title, findings:
        this.state.findings, pcpName: this.state.pcpName
    }
    req.addRecords(body).then(resp => {
      this.getNow()
    }).catch(err => {
      console.log(err)
    })
    this.setState({ open: false });
  };
  onClick = () => {
    this.setState({ visible: true });
  };
  async editForRecords(e) {
    e.preventDefault();
    const body = {
      title: this.state.title,
      findings: this.state.findings,
      pcpName: this.state.pcpName
    };
    console.log("body: ", body)
    await req
      .updateRecords(this.state.indRecID, body)
      .then(resp => {
        this.getNow()
        this.setState({ open: false })
        console.log("updaterecord: ", resp);
      })
      .catch(err => {
        console.log(err);
      });
  }
  handleCancel = () => {
    this.setState({ visible: true });
  };
  openEdit = (passID) => {

    this.state.medRecords.forEach(record => {
      if (record.recordID === passID) {
        this.setState({
          indRecID: passID, title: record.title, findings: record.findings,
          pcpName: record.name, editingRecord: true, open: true
        })
        return
      }
    })
  }

  // handleClose=()=>{
  //   this.setState({modalOpen:false})
  // }

  render() {
    if (this.state.toHome === true) {
      return <Redirect to="/home" />;
    }
    var modalButtons = this.state.editingRecord ? (<div><Button negative onClick={e => this.setState({ open: false })}><Icon name='remove' /> Cancel</Button> <Button positive icon="checkmark" labelPosition="right" content="Update" onClick={this.editForRecords} /></div>) : (
      <div><Button negative onClick={e => this.setState({ open: false })}><Icon name='remove' /> Cancel</Button>
        <Button positive icon="checkmark" labelPosition="right" content="Save" onClick={this.handleSaveMed} /></div>)
    const { open, size } = this.state;
    const pageTitle = this.state.updating ? (
      <h1 className="title-text">Clinical Record Form</h1>
    ) : (
        <h1 className="title-text">Patient Information</h1>
      );
    const allmedicalrecords = this.state.medRecords.map(element =>
      <div><AddedRecords onClick={this.openEdit} record={element} /><br /></div>);
    //add medical records
    const addmed = this.state.updating ? (
      <div>
        <h2 className="emercontact"> Medical Condition </h2>
        <div>{allmedicalrecords}</div>
        <Button color="teal" onClick={this.show("large")}> Add Medical Record </Button>
        <div>
          <Container>
            <Modal id="modal" size={size} open={open} onClose={this.close}>
              <Modal.Header>Medical Record </Modal.Header>
              <Modal.Content>
                <Form>
                  <div>
                    <p>Date: {new Date(this.state.today).toDateString()}</p>
                    <Form.Input fluid label="Condition: " value={this.state.title} placeholder="What is Patient's Condition? " onChange={e => this.setState({ title: e.target.value })} />
                    <b><p>Findings:</p></b>
                    <TextArea placeholder="What is your findings? " value={this.state.findings} onChange={e => this.setState({ findings: e.target.value })}
                    /><br /><br />
                    <Form.Input fluid label="Primary Care Physician/Clinician  Name: " placeholder="Fullname"
                      value={this.state.pcpName} onChange={e => this.setState({ pcpName: e.target.value })} /><br />
                  </div>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <div>{modalButtons}</div>
              </Modal.Actions>
            </Modal>
          </Container>
        </div><br />
        <Segment id="segment" inverted color='teal'>
          <Button id="segment-btn" basic inverted color="teal" onClick={this.handleSubmit}> Update </Button>
          <Link to="home">
            <Button id="segment-btn" basic inverted color="teal" onClick={this.onClick}> Cancel</Button>
          </Link>
        </Segment>
      </div>
    ) : (
        <Segment id="segment" inverted color='teal'>
          <Button id="segment-btn" basic inverted color="teal" onClick={this.createToDB}> Add Patient </Button>
          <Link to="home">
            <Button id="segment-btn" basic inverted color="teal" onClick={this.onClick}> Cancel </Button>
          </Link>
        </Segment>
      );
    return (
      <div>
        <Container>
          <Card id="card">
            <Form><br /><br />
              <div>
                <center>{pageTitle}</center>
              </div><br /><br />
              <div>
                <h2 className="emercontact"> Personal Details</h2>
                <Form.Group widths="equal">
                  <Form.Input icon="pencil alternate" required={true} fluid label="First Name" placeholder="First Name"
                    value={this.state.fname} onChange={e => this.setState({ fname: e.target.value })} id="input" />
                  <Form.Input icon="pencil alternate" required={true} fluid label="Middle name" placeholder="Middle Name "
                    value={this.state.mname} onChange={e => this.setState({ mname: e.target.value })} id="input" />
                  <Form.Input icon="pencil alternate" required={true} fluid label="Last Name" placeholder="Last Name"
                    value={this.state.lname} onChange={e => this.setState({ lname: e.target.value })} id="input" />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input fluid icon="birthday cake" required={true} label="Date of Birth" placeholder="Date of Birth"
                    value={this.state.birthdate} onChange={e => this.setState({ birthdate: e.target.value })} id="input" />
                  <Form.Input fluid icon="calendar" required={true} type="number" label="Age" placeholder="Age"
                    value={this.state.age} onChange={e => this.setState({ age: e.target.value })} id="input" />
                  <Form.Input fluid icon="call" required={true} type="number" label="Contact Number" placeholder="Contact Number"
                    value={this.state.contact} onChange={e => this.setState({ contact: e.target.value })} id="input" />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Input fluid icon="address book" required={true} label="Address " placeholder="Address"
                    value={this.state.address} onChange={e => this.setState({ address: e.target.value })} id="input" />
                  <Form.Input fluid icon="mail" required={true} label="Email" placeholder="Email"
                    value={this.state.email} onChange={e => this.setState({ email: e.target.value })} id="input" />
                </Form.Group><br />
                <Form.Group widths="equal">
                  <Dropdown className="dropdown" required={true} placeholder="Select Sex" fluid selection
                    value={this.state.sex} onChange={e => this.setState({ sex: e.target.value })} options={this.state.SexOptions} /><br />
                  <Dropdown placeholder="Select Status" required={true} fluid className="dropdown" selection
                    value={this.state.status} onChange={e => this.setState({ status: e.target.value })} options={this.state.StatusOptions} />
                </Form.Group><br />
              </div>
              <div>
                <h2 className="emercontact">Emergency Contact</h2>
                <Form.Group widths="equal">
                  <Form.Input required={true} fluid icon="pencil" id="input" label="First name" placeholder="First name"
                    value={this.state.emercontfname} onChange={e => this.setState({ emercontfname: e.target.value })} />
                  <Form.Input required={true} fluid icon="pencil" id="input" label="Middle name" placeholder="Middle name"
                    value={this.state.emercontmname} onChange={e => this.setState({ emercontmname: e.target.value })} />
                  <Form.Input required={true} fluid icon="pencil" id="input" label="Last name" placeholder="Last name"
                    value={this.state.emercontlname} onChange={e => this.setState({ emercontlname: e.target.value })} />
                </Form.Group>
                <br></br>
                <Form.Input required={true} fluid id="input" label="Address " icon="address book" placeholder="Address"
                  value={this.state.emercontaddress} onChange={e => this.setState({ emercontaddress: e.target.value })} /><br />
                <Form.Group widths="equal">
                  <Form.Input required={true} fluid id="input" label="Email" icon="mail" placeholder="Email"
                    value={this.state.emercontemail} onChange={e => this.setState({ emercontemail: e.target.value })} />
                  <Form.Input required={true} fluid id="input" type="number" label="Contact Number" icon="call" placeholder="Contact Number"
                    value={this.state.emercontnumber} onChange={e => this.setState({ emercontnumber: e.target.value })} />
                </Form.Group><br />
                <Form.Input required={true} fluid icon="pencil" id="input" label="Relationship " placeholder="Relationship"
                  value={this.state.relationship} onChange={e => this.setState({ relationship: e.target.value })} /><br />
              </div><br />
              <div>{addmed}</div><br />
            </Form>
          </Card>
        </Container>
      </div>
    );
  }
}