import React from 'react';

export default class Button extends React.Component {
    constructor() {
        super()
    }

    render() {
        return(
            <div>
                <input type="Submit" onClick={this.props.func} defaultValue={this.props.value} className="btn"></input>
            </div>
        )
    }
}