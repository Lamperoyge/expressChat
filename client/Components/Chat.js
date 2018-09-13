import React from 'react';
import io from "socket.io-client";
import Button from './Button'
import Input from './Input'


export default class Chat extends React.Component {
    constructor() {
        super();
        this.onMsgChange = this.onMsgChange.bind(this)
        this.state = {
            username: '',
            message: '',
            id: 0,
            errMsg: '',
            messages: [],
            pubKey: '',
            connectedUsers: []
            
        };
    }

    onMsgChange(obj) {
        console.log("from onMsg",obj)
        this.setState({
            username: obj.username,
            message: obj.message
        },this.sendMessage())
    }

    componentDidMount() {
        this.socket = io();
        let aeskey;
        this.socket.on('rsa server encrypted message', (data) => {
            this.setState({
                pubKey: data
            })
        })
        this.socket.on('user disconnected', (data) => {
            data = this.socket
        })
        this.socket.on('users', (data) => {
            let usersJoined = this.state.connectedUsers.concat(data)
            this.setState({
                connectedUsers: usersJoined
            })
        })
        this.socket.on('user disconnected', (data) => {
        })
        this.socket.on('receiveMsg', (data) => {
            let joined = this.state.messages.concat(data)
            this.setState({
                messages: joined
            })
        });
    }
    deleteAll = () => {
            this.setState({
                messages: []
            })
    }
    sendMessage = (ev) => {
        console.log('xxx')
        console.log(this.state.username)
        // ev.preventDefault;
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
       const objDiv =  document.querySelector('.messages')
    //    objDiv.scrollTo(0,objDiv.scrollHeight);
    objDiv.scrollTop = objDiv.scrollHeight
        
    }
    handleKeyPress = (e) => {
        if(e.key == 'Enter') {
            this.sendMessage(e)
        }
    }
    divStyle = (val) => {
        if(val%2 == 0){
            let obj =  {
                color: `rgba(${val * 15}, ${val * 20}, ${255}, 0.3)`,
                pos: "50%"
            }
            return obj;
        }
        else {
            let obj =  {
               color: `rgba(${255}, ${val * val}, ${val * val}, 0.3)`
            }
            return obj;
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
                <div className="row" >
                        <h1> Your public key is </h1><span>{this.state.pubKey}</span>
                        <div className = "messages">
                            {this.state.messages.map(
                                (message, index) => {
                                    return(
                                        <div key = {index} id= {'message' + (index + 1)} className="message" style={{backgroundColor: this.divStyle(index + 1).color, right: this.divStyle(index + 1).pos, marginTop: 100 * index}}>
                                            <p><strong>{message.username} says:  </strong></p>
                                            <p>{message.message}</p> 
                                        </div>
                                    )
                                }
                            )}
                            <div className = "users" >
                                {this.state.connectedUsers.map(
                                    (user,index) => {
                                        return(
                                            <ul key = {index} >
                                                <li>{user}</li>
                                            </ul>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                        <span>{this.state.errMsg}</span>
                        {/* <div className = "inputs">
                            <input type="text" placeholder="Enter your username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})}></input>
                            <input type="text" onKeyPress={this.handleKeyPress} placeholder="Type your message" value={this.state.message} onChange = {ev => this.setState({message: ev.target.value})}></input>
                            <input type="Submit" onClick={this.sendMessage} ></input>
                        </div> */}
                        <Input handleClick={this.sendMessage} stateChange = {this.onMsgChange} />
                        <div className="buttons">
                            {button}
                            {scrollTop}
                    </div>
                </div>
            </div>
        )
    }
}