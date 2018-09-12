import React from 'react';
import io from "socket.io-client";

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            message: '',
            id: 0,
            errMsg: '',
            messages: []
        };
        
        this.socket = io();
        this.socket.on('receiveMsg', (data) => {
            console.log(data)
            let joined = this.state.messages.concat(data)
            this.setState({
                messages: joined
            })
        });
    }


    sendMessage = (ev) => {
        ev.preventDefault;
        if(this.state.username !== '' && this.state.message !== '') {
            this.setState({
                id: this.id + 1
            })
            this.socket.emit('sendMessage', {
                username: this.state.username,
                message: this.state.message,
                id: this.id
            })
            this.setState({
                message: '',
                errMsg: ''
            })
        }
        else {
            this.setState({
                errMsg: "enter your name and msg mofo"
            })
        }
    }

    render() {
        
        return(
            <div className = "container">
                <input type="text" placeholder="Enter your username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})}></input>
                <input type="text" placeholder="Type your message" value={this.state.message} onChange = {ev => this.setState({message: ev.target.value})}></input>
                <input type="Submit" onClick={this.sendMessage}></input>
                <span>{this.state.errMsg}</span>
                <div className = "messages">
                    {this.state.messages.map(
                        
                        message => {
                            console.log(message.id)
                            return(
                                <ul>
                                    <li>{message.username} {message.message} {message.id}</li>
                                </ul>
                            )
                        }
                    )}
                </div>
            </div>
        )
    }
}