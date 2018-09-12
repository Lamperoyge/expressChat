import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';
import { render } from 'react-dom';
import Chat from './Chat'
import '../../public/stylesheets/style.css'
export default class App extends Component {
    constructor() {
        super();

    }


    render() {
        return(
            <div>
                <Chat/>
            </div>
        )
    }
}