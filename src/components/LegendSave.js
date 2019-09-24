import React, { Component } from 'react';

class LegendSave extends Component {
    render() {
        return (
            <div className="legend-save-container">
                <div className="legend-save-size">
                    <label>Output Size</label>
                    <div className="legend-save-size-content">
                        <input type="number" value={this.props.squareSize} onChange={this.props.handleChangeSave.bind(this, 'squareSize')}></input>
                        <p className="units">px</p>
                    </div>
                </div>
                <div className="legend-save-crop">
                    <label>Crop To Fit</label>
                    <input type="checkbox" checked={this.props.cropToFit} onChange={this.props.handleChangeSave.bind(this, 'cropToFit')}></input>
                </div>
                <button onClick={this.props.save.bind(this, this.props.squareSize, this.props.cropToFit)}>Save As SVG</button>
            </div>
        );
    }
}

export default LegendSave;