import React, { Component } from "react";
import { Panel } from "primereact/panel";
import App from "../styles/App.css";
import { Icon } from "semantic-ui-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container,Row,Col,Button } from "react-bootstrap";

//Add Medical records
export default class AddedRecords extends Component {
  
  componentDidMount(){
    console.log("kani: ",this.props.record)
  }
  render() {
    const header = (
      <div id = "recedit">
      <Container>
      <Row>
        <Col sm={11}>
          <h3>{new Date(this.props.record.date).toDateString()}</h3>
        </Col>
        <Col sm={1}>
          <Button variant="outline-info" id = "adminhead"onClick={this.props.onClick.bind(null, this.props.record.recordID)} inverted>
            <Icon name='edit' />Edit
        
          </Button>
        </Col> 
      </Row>
      </Container>
      </div>
    );
    return (
      //Add medical records 
      <div>
        <div className="content-section implementation">
          <Panel className="recpan p-panel-titlebar" header={header}>
            <h4>Condition: {this.props.record.title}</h4>
            <h4>Findings: {this.props.record.findings}</h4>
            <h4>Primary Care Physician/Clinician: {this.props.record.name}</h4>
          </Panel>
        </div>
      </div>
    );
  }
}
