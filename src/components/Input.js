import React, { Component } from 'react';

class Input extends Component {
    render() {
        return (
            <div className="input-container">
                <label>{this.props.label}</label>
                <div className="input-content">
                    <input type={this.props.type} max={this.props.max} min={this.props.min} onChange={this.props.onChange} value={this.props.value} className="input-container"></input>
                    <p className="value">{this.props.value}</p>
                </div>
            </div>
        );
    }
}

export default Input;