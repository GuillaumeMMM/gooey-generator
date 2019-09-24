import React, { Component } from 'react';
import LegendAdd from './LegendAdd';
import LegendEdit from './LegendEdit';
import * as d3 from 'd3';
import LegendSave from './LegendSave';
import Input from './Input';

class Legend extends Component {

    state = {
        squareSize: 300,
        cropToFit: false
    }

    render() {
        return (
            <div className="legend-container">
                <div className="gooey-intensity">
                    <Input value={this.props.gooeyIntensity} onChange={this.handleChangeAdd.bind(this, 'gooeyIntensity')} type="range" min={0} max={50} label="Gooey Intensity"></Input>
                </div>
                <div className="inputs-container">
                    <ul className="legend-menu">
                        <li onClick={() => this.props.changeMode('add')} className={this.props.mode === 'add' ? 'active' : ''}>Add</li>
                        <li onClick={() => this.props.changeMode('edit')} className={this.props.mode === 'edit' ? 'active' : ''}>Edit</li>
                        <li onClick={() => this.props.changeMode('save')} className={this.props.mode === 'save' ? 'active' : ''}>Save</li>
                    </ul>
                    <div style={this.props.mode === 'add' ? {display: 'block'} : {display: 'none'}} className="legend-add">
                        <LegendAdd addValues={this.props.addValues} handleChange={this.handleChangeAdd}></LegendAdd>
                    </div>
                    <div style={this.props.mode === 'edit' ? {display: 'block'} : {display: 'none'}} className="legend-edit">
                        <LegendEdit editValues={this.props.editValues} handleChangeEdit={this.handleChangeEdit}></LegendEdit>
                    </div>
                    <div style={this.props.mode === 'save' ? {display: 'block'} : {display: 'none'}} className="legend-save">
                        <LegendSave squareSize={this.state.squareSize} cropToFit={this.state.cropToFit} handleChangeSave={this.handleChangeSave} save={this.save}></LegendSave>
                    </div>
                </div>
            </div>
        );
    }

    handleChangeAdd = (type, e) => {
        this.props.handleChangeAdd(type, e);
    }

    handleChangeEdit = (type, e) => {
        this.props.handleChangeEdit(type, e);
    }

    handleChangeSave = (type, e) => {
        switch (type) {
            case 'squareSize':
                this.setState({squareSize: e.target.value});
                break;
            case 'cropToFit':
                this.setState({cropToFit: !this.state.cropToFit});
                break;
            default: console.log('change save not found');
        }
    }

    save = (squareSide, cropToFit) => {
        //get svg element.
        var svg = document.getElementById("main-svg").cloneNode(true);

        d3.select(svg).select('.select-group').remove();
        d3.select(svg).select('.overlay-group').remove();
        d3.select(svg).select('.main-group').selectAll('.full-circle').style('cursor', 'auto');

        const svgRect = document.getElementById("main-svg").getBoundingClientRect();
        console.log(svgRect);

        d3.select(svg).attr('viewBox', '0 0 ' + svgRect.width + ' ' + svgRect.height);
        d3.select(svg).attr('width', squareSide + 'px');
        d3.select(svg).attr('height', squareSide + 'px');

        if (cropToFit) {
            let leftMin = svgRect.width;
            let rightMax = 0;
            let topMin = svgRect.height;
            let bottomMax = 0;

            const circles = svg.querySelectorAll('.full-circle');
            for (let i = 0; i < circles.length; i++) {
                console.log(circles[i].cx.baseVal.value)
                if (circles[i].cx.baseVal.value - circles[i].r.baseVal.value < leftMin) {
                    leftMin = Math.max(circles[i].cx.baseVal.value - circles[i].r.baseVal.value, 0);
                }
                if (circles[i].cx.baseVal.value + circles[i].r.baseVal.value > rightMax) {
                    rightMax = Math.min(circles[i].cx.baseVal.value + circles[i].r.baseVal.value, svgRect.width);
                }
                if (circles[i].cy.baseVal.value - circles[i].r.baseVal.value < topMin) {
                    topMin = Math.max(circles[i].cy.baseVal.value - circles[i].r.baseVal.value, 0);
                }
                if (circles[i].cy.baseVal.value + circles[i].r.baseVal.value > bottomMax) {
                    bottomMax = Math.min(circles[i].cy.baseVal.value + circles[i].r.baseVal.value, svgRect.height);
                }
            }
            let croppedWidth = rightMax - leftMin;
            let croppedHeight = bottomMax - topMin;

            d3.select(svg).attr('viewBox', (leftMin - 5) + ' ' + (topMin - 5) + ' ' + (croppedWidth + 10) + ' ' + (croppedHeight + 10));
            if (croppedWidth < croppedHeight) {
                d3.select(svg).attr('width', (squareSide * croppedWidth / croppedHeight) + 'px');
                d3.select(svg).attr('height', (squareSide) + 'px');
            } else {
                d3.select(svg).attr('width', (squareSide) + 'px');
                d3.select(svg).attr('height', (squareSide * croppedHeight / croppedWidth) + 'px');
            }
        }

        //get svg source.
        var serializer = new XMLSerializer();
        var source = serializer.serializeToString(svg);

        //add name spaces.
        if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        //add xml declaration
        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

        //convert svg source to URI data scheme.
        var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

        //set url value to a element's href attribute.
        /* document.getElementById("link").href = url; */
        //you can download svg file by right click menu.
        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "gooey.svg";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}

export default Legend;