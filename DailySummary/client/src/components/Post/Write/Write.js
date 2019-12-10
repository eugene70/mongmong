import React, { Component } from 'react';
import { Input, Button, Modal } from 'antd';
import LiveClock from './LiveClock';
import Emotion from './Emotion';
import { withRouter } from 'react-router';
import axios from 'axios';

const { TextArea } = Input;
const config = require('../../../config');

class Write extends Component {
  constructor(props) {
    super(props) 

    this.state = {
      visible: false,
      paragraph: "",
      affectivity: "",
    }
    this.paragraphChanged = this.paragraphChanged.bind(this)
    this.selectedEmotion = this.selectedEmotion.bind(this)
  }  
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  };


  handleOk = e => { 
    console.log(this.state)

    axios.post(config.serverUrl + "/api/post_input", {
        paragraph: this.state.paragraph,
        strength_of_feeling: this.state.affectivity,
    }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`,
    }})      
    .then((response) => {       
      axios.post(config.serverUrl + "/api/summary", {
        paragraph: this.state.paragraph,
        strength_of_feeling: Number(this.state.affectivity),
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.token}`,
      }})      
      .then((response) => {       
        // alert("당신의 소중한 하루가 저장되었습니다.")  
        this.setState({
          visible: false,
          paragraph: "",
          affectivity: "",     
        })
        const year = '2019'
        const month = '12'
        this.props.history.push('/posts/' + year + '/' + month)       
      })
      .catch((error) => {
        console.error(error)
        alert("에러 발생: " + error.message)
      })
    })
    .catch((error) => {
      console.error(error)
      alert("에러 발생: " + error.message)
    })
  }

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  paragraphChanged(event) {
    this.setState({
      paragraph: event.target.value,
    })
  }

  selectedEmotion(e) {
    this.setState({
      affectivity: e.target.value
    })
  }

  render() {

    return (
      <div className="one-post-write">
        <div className="one-liveClock-container">
          <LiveClock />
        </div> 
        <TextArea className="one-textarea" 
          placeholder="마음 가는대로~"
          value={this.state.paragraph}
          onChange={this.paragraphChanged}  />
        <div className="one-post-btn-container flex">
          <Emotion clickHandler={this.selectedEmotion}/>
          <Button type="primary" onClick={this.showModal} className="btn btn-submit">저장</Button>
          <Modal title="글이 완성되었습니다." visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel} >
{/*  리뷰 페이지로 이동 */}
              저장하시겠습니까?
          </Modal>       
        </div>
      </div>
    )
  }
}
export default withRouter(Write) 