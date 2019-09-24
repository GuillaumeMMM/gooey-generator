import React, { Component } from 'react';
import Input from './Input';

class LegendEdit extends Component {
    render() {
        return (
            <div className="legend-edit-container">
                <div className="edit-radius">
                    <Input value={this.props.editValues.editRadius} onChange={this.props.handleChangeEdit.bind(this, 'editRadius')} type="range" min={0} max={200} label='Circle Radius'></Input>
                </div>
                <div className="edit-color-picker">
                    <label>Circle Color</label>
                    <input type="color" value={this.props.editValues.editColor} onChange={this.props.handleChangeEdit.bind(this, 'editColor')}/>
                </div>
                <div className="edit-buttons-container">
                    <div className="edit-delete">
                        <button onClick={this.props.handleChangeEdit.bind(this, 'editDelete')}>Delete node</button>
                    </div>

                    <div className="edit-z-index">
                        <button onClick={this.props.handleChangeEdit.bind(this, 'editZIndexBF')}>Bring forward</button>
                        <button onClick={this.props.handleChangeEdit.bind(this, 'editZIndexSB')}>Send Backwards</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default LegendEdit;