import React from 'react';


export default class Input extends React.Component {
    constructor() {
        super();
        
        this.state = {
        username: '',
        message: '',
        }



    }
    
    handleChange() {
        this.props.stateChange(this.state, event)
    }

    render() {
        return(
            <div className = "inputs" >
                <input type="text" placeholder="Enter your username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})}></input>
                <input type="text" onKeyPress={this.handleKeyPress} placeholder="Type your message" value={this.state.message} onChange = {ev => this.setState({message: ev.target.value})}></input>
                <input type="Submit" onClick = {() => {
                    this.props.stateChange(this.state, event);
                    // this.props.handleClick(event);
                }}></input>
            </div>
        )
    }
}