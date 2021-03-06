import React from 'react';
import io from "socket.io-client";
import Button from './Button'
import Input from './Input'
import { ChatList } from 'react-chat-elements'
import { MessageBox } from 'react-chat-elements'
import { MessageList } from 'react-chat-elements'
import 'react-chat-elements/dist/main.css';
import Inp from './Input';
export default class Chat extends React.Component {
    constructor() {
        super();
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

    componentDidMount() {
        this.socket = io();
        let aeskey;
        this.socket.on('rsa server encrypted message', (data) => {
            this.setState({
                pubKey: data
            })
        })
        this.socket.on('user disconnected', (data) => {
            console.log(data)
        })
        this.socket.on('users', (data) => {
            this.setState({
                connectedUsers: []
            })
            let usersJoined = this.state.connectedUsers.concat(data)
            this.setState({
                connectedUsers: usersJoined
            })
        })
        this.socket.on('user disconnected', (data) => {
            let index = this.state.connectedUsers.indexOf(data)
            this.setState({
                connectedUsers: this.connectedUsers.splice(index, 1)
            })
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
    sendMessage = (ev, msg) => {
        this.setState({
            username: msg.username,
            message: msg.message
        }, () => {
            
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
        })
        
    }
    handleKeyEvent = (e) => {
        console.log('outtz')
        if(e.key == 'Enter') {
            console.log('hello')
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
        return(
            <div className = "container">
                <div className="row" >
                        <h1> Your public key is </h1><span>{this.state.pubKey}</span>
                        <div className = "messages">
                            {this.state.messages.map(
                                (message, index) => {
                                    return(                                       
                                    <div key = {index} id= {'message' + (index + 1)} className="message" style={{right: this.divStyle(index + 1).pos, marginTop: 100 * index}}>
                                        <MessageBox
                                            
                                            type={'text'}
                                            title = {message.username}
                                            text={message.message}
                                            data={{
                                            uri: 'https://facebook.github.io/react/img/logo.svg',
                                            status: {
                                                click: false,
                                                loading: 0,
                                            }
                                        }}/>
                                    </div>
                                    )
                                }
                            )}

                            <div className = "users" >
                                {this.state.connectedUsers.map(
                                    (user,index) => {
                                        return(
                                            // <ul key = {index} >
                                            //     <li>{user}</li>
                                            // </ul>
                                            <ChatList
                                                className = 'chat-list'
                                                title = {user}
                                                dataSource={[
                                                    {
                                                        avatar: 'https://facebook.github.io/react/img/logo.svg',
                                                        alt: 'Reactjs',
                                                        title: user,
                                                        subtitle: 'connected',
                                                        date: '?3!#23?',
                                                        unread: 0,
                                                },
                                            ]} />
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
                        <Inp send={this.sendMessage} sendOnKey = {this.handleKeyEvent}/>
                        <div className="buttons">
                        {(this.state.messages.length > 0 ? <Button func={this.deleteAll} value="delete all"></Button> : console.log('zz'))}
                    </div>
                </div>
            </div>
        )
    }
}