import React, { Component } from 'react';
import Drawing from './Drawing';
import Legend from './Legend';
import * as d3 from 'd3';
import Header from './Header';
import Footer from './Footer';

class Content extends Component {

    state = {
        mode: 'add',
        addValues: {
            addRadius: 60,
            addColor: '#e66465',
        },
        editValues: {
            editRadius: 60,
            editColor: '#e66465',
            deletedNodes: [],
            bringForward: [],
            sendBackward: [],
        },
        gooeyIntensity: '8',
        selectedElmId: null
    }

    render() {
        return (
            <div className="content-container">
                <Header></Header>
                <div className="content">
                    <div className="content-drawing">
                        <Drawing
                            mode={this.state.mode}
                            addValues={this.state.addValues}
                            selectedElmId={this.state.selectedElmId}
                            setSelected={this.setSelected}
                            gooeyIntensity={this.state.gooeyIntensity}
                            editValues={this.state.editValues}
                        ></Drawing>
                    </div>
                    <div className="content-legend">
                        <Legend changeMode={this.changeMode} mode={this.state.mode} handleChangeAdd={this.handleChangeAdd} handleChangeSelected={this.handleChangeSelected} addValues={this.state.addValues} editValues={this.state.editValues} gooeyIntensity={this.state.gooeyIntensity} handleChangeEdit={this.handleChangeEdit}></Legend>
                    </div>
                </div>
                {/* <Footer></Footer> */}
            </div>
        );
    }

    changeMode = (newMode) => {
        this.setState({ mode: newMode });
    }

    handleChangeAdd = (type, e) => {
        let newAddValues = JSON.parse(JSON.stringify(this.state.addValues))
        switch (type) {
            case 'addRadius':
                newAddValues.addRadius = e.target.value;
                break;
            case 'addColor':
                newAddValues.addColor = e.target.value;
                break;
            case 'gooeyIntensity':
                this.setState({ gooeyIntensity: String(e.target.value) });
                break;
            default: console.log('default');
        }
        this.setState({ addValues: newAddValues });
    }

    handleChangeEdit = (type, e) => {
        let newEditValues = JSON.parse(JSON.stringify(this.state.editValues))
        switch (type) {
            case 'editRadius':
                newEditValues.editRadius = e.target.value;
                break;
            case 'editColor':
                newEditValues.editColor = e.target.value;
                break;
            case 'editDelete':
                newEditValues.deletedNodes.push(this.state.selectedElmId);
                break;

            case 'editZIndexBF':
                newEditValues.bringForward.push(this.state.selectedElmId);
                break;
            case 'editZIndexSB':
                newEditValues.sendBackward.push(this.state.selectedElmId);
                break;
            default: console.log('default');
        }
        this.setState({ editValues: newEditValues });
    }

    setSelected = (elmId) => {
        console.log(elmId, d3.select('#drawing-container').select('.main-group').select('#form-' + elmId))
        let newEditValues = JSON.parse(JSON.stringify(this.state.editValues));
        if (document.querySelector('#drawing-container').querySelector('#form-' + elmId) && elmId !== null) {
            if ( d3.select('#drawing-container').select('.main-group').select('#form-' + elmId)) {
                newEditValues.editRadius = Number(d3.select('#drawing-container').select('#form-' + elmId).attr('r').split('px')[0]);
                newEditValues.editColor = d3.select('#drawing-container').select('.main-group').select('#form-' + elmId).attr('fill');
            }
            console.log(newEditValues)
        }
        this.setState({ selectedElmId: elmId, editValues: newEditValues });
    }
}

export default Content;