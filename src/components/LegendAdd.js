import React, { Component } from 'react';
import Input from './Input';

class LegendAdd extends Component {
    render() {
        return (
            <div className="legend-add-container">
                <div className="add-type">
                    {/* <select value={this.props.addValue} onChange={this.props.handleChange.bind(this, 'addType')}>
                        <option value="circle">Circle</option>
                        <option value="rectangle">Rectangle</option>
                    </select> */}
                    
                </div>
                <div className="add-radius">
                    <Input type="range" min={0} max={200} value={this.props.addValues.addRadius} onChange={this.props.handleChange.bind(this, 'addRadius')} label='Circle Radius'></Input>
                </div>
                <div className="add-color-picker">
                    <label>Circle Color</label>
                    <input type="color" value={this.props.addValues.addColor} onChange={this.props.handleChange.bind(this, 'addColor')}/>
                </div>
            </div>
        );
    }
}

export default LegendAdd;