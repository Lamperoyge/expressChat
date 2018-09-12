import React from 'react';
import io from "socket.io-client";


class Button extends React.Component {
    constructor() {
        super()
    }

    render() {
        return(
            <div>
                <input type="Submit" onClick={this.props.func} defaultValue={this.props.value}></input>
            </div>
        )
    }
}

export default class Chat extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            message: '',
            id: 0,
            errMsg: '',
            messages: [],
            pubKey: ''
        
        };
        
        this.socket = io();


        //CRYPTO
        let aeskey;
        this.socket.on('rsa server encrypted message', (data) => {
            this.setState({
                pubKey: data
            })
        })


        this.socket.on('receiveMsg', (data) => {
            console.log(data)
            let joined = this.state.messages.concat(data)
            this.setState({
                messages: joined
            })
        });
    }
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
    deleteAll = () => {
            this.setState({
                messages: []
            })
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
            document.body.scrollIntoView(false)
        }
        else {
            this.setState({
                errMsg: "enter your name and msg mofo"
            })
        }
    }

    render() {
        let button;
        let scrollTop;
        if(this.state.messages.length > 0) {
            button = <Button func={this.deleteAll} value="delete all"></Button>
            scrollTop = <Button func={this.scrollToTop} value = "scroll To Top"></Button>
        }
        return(
            <div className = "container">
                <input type="text" placeholder="Enter your username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})}></input>
                <input type="text" placeholder="Type your message" value={this.state.message} onChange = {ev => this.setState({message: ev.target.value})}></input>
                <input type="Submit" onClick={this.sendMessage} ></input>
                <span>{this.state.errMsg}</span>
                <div className = "messages">
                <h1> Your public key is </h1><span>{this.state.pubKey}</span>
                    {this.state.messages.map(
                        (message, index) => {
                            return(
                                <ul key = {index}>
                                    <li>{message.username} {message.message} </li>
                                </ul>
                            )
                        }
                    )}
                    {button}
                    {scrollTop}
                </div>
            </div>
        )
    }
}