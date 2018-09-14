import React from 'react';
import { Input } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css';

export default class Inp extends React.Component {
    constructor() {
        super();
        
        this.state = {
        username: '',
        message: '',
        }
        this.sendMessage = this.sendMessage.bind(this)
    }
    
    handleKeyEvent = (e) => {
        console.log('fromInput')
        if(e.key == 'Enter') {
            console.log('hello')
            this.sendMessage()
        }
    }

    sendMessage() {
        if(this.state.message !== '') {
            this.props.send(event, this.state);
            this.setState({
            })
            this.refs.input.clear();
        }
        else {
            console.log('errrrr')
        }
    }

    render() {
        return(
            <div className = "inputs" >
                <Input 
                    ref = 'input'
                    style = "overflow: hidden"
                    type="text" 
                    placeholder="Enter your username" 
                    value={this.state.username} 
                    onChange={ev => this.setState({username: ev.target.value})}></Input>
                <Input
                    maxlength = "240"
                    multiline = {true}
                    ref='input'
                    type="text" 
                    onKeyPress={this.handleKeyEvent} 
                    placeholder="Type your message" 
                    value={this.state.message} 
                    onChange = {ev => this.setState({message: ev.target.value})}></Input>
                    
                <i className="fa fa-paper-plane" type="Submit" onClick = {() => {
                    this.sendMessage();
                    // this.props.handleClick(event);
                }}></i>
            </div>
        )
    }
}