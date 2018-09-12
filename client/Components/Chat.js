import React from 'react';
import io from "socket.io-client";

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            message: '',
            messages: [],
        };

        this.socket = io();
        this.socket.on('receiveMsg', (data) => {
            // this.messages.push(data)
            let joined = this.state.messages.concat(data)
            this.setState({
                messages: joined
            })
        });
    }


    sendMessage = (ev) => {
        ev.preventDefault;
        this.socket.emit('sendMessage', {
            username: this.state.username,
            message: this.state.message
        })
        this.setState({
            message: ''
        })
    }

    // connect = () => {
    //     this.socket.emit('user', function(data) {
    //         data = this.username
    //     })
    // }

    render() {
        
        return(
            <div className = "container">
                <input type="text" placeholder="Enter your username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})}></input>
                <input type="text" placeholder="Type your message" value={this.state.message} onChange = {ev => this.setState({message: ev.target.value})}></input>
                <input type="Submit" onClick={this.sendMessage}></input>
                <div className = "messages">
                    {this.state.messages.map(
                        message => {
                            return(
                                <ul>
                                    <li>{message.username} {message.message}</li>
                                </ul>
                            )
                        }
                    )}
                </div>
            </div>
        )
    }
}