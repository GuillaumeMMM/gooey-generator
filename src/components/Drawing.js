import React, { Component } from 'react';
import * as d3 from 'd3';

class Drawing extends Component {

    state = {
        elements: [],
        selectElements: [],
        dragging: false,
    }

    render() {
        return (
            <div className="drawing-container" id="drawing-container">
                
            </div>
        );
    }

    componentDidMount() {
        const svg = d3.select('#drawing-container').append('svg').attr('id', 'main-svg').attr('width', '100%').attr('height', '100%');

        const mainGroup = svg.append('g').attr('class', 'main-group');

        svg.append('g').attr('class', 'select-group');

        const overlayGroup = svg.append('g').attr('class', 'overlay-group');

        const that = this;

        svg.on('click', function(event) {
            if (that.props.mode === 'add') {
                that.appendElement(this, d3.event.pageX, d3.event.pageY);
            } else {
                if (d3.event.target.id === "main-svg") {
                    that.props.setSelected(null);
                }
            }
        });

        /* const trash = svg.append('g').attr('class', 'trash-group'); */
        /* this.drawTrashGroup(trash); */

        svg.on('mousemove', () => {
            /* console.log(this.state.draggedElementId) */
            if (this.state.draggedElementId) {
                if (this.props.mode === 'edit') {
                    svg.selectAll('#form-' + this.state.draggedElementId)
                    .attr('cx', d3.event.pageX - document.getElementById('main-svg').getBoundingClientRect().x)
                    .attr('cy', d3.event.pageY - document.getElementById('main-svg').getBoundingClientRect().y - window.scrollY)
                }
            }
            if (this.props.mode === 'add') {
                overlayGroup.select('circle')   
                    .attr('cx', d3.event.pageX - document.getElementById('main-svg').getBoundingClientRect().x)
                    .attr('cy', d3.event.pageY - document.getElementById('main-svg').getBoundingClientRect().y - window.scrollY)
            }
        })

        svg.on('mouseleave', () => {
            /* console.log('mouse out') */
            this.setState({draggedElementId: null, dragging: false});
            if (this.props.mode === 'add') {
                overlayGroup.select('circle').remove();
            }
        });

        svg.on('mouseenter', () => {
            if (this.props.mode === 'add') {
                overlayGroup.append('circle')
                .attr('cx', d3.event.pageX - document.getElementById('main-svg').getBoundingClientRect().x)
                .attr('cy', d3.event.pageY - document.getElementById('main-svg').getBoundingClientRect().y - window.scrollY)
                .attr('r', this.props.addValues.addRadius + 'px')
                .attr('opacity', 0.3).attr('stroke', 'blue');
            }
        });

        this.addGooeyEffect(mainGroup, this.props.gooeyIntensity)
    }

    drawTrashGroup = (trash) => {
        /* trash.attr('transform', 'translate(' + ).append('circle') */
    }

    appendElement = (elm, posX, posY) => {
        let xAjusted = posX - document.getElementById('main-svg').getBoundingClientRect().x;
        let yAjusted = posY - document.getElementById('main-svg').getBoundingClientRect().y - window.scrollY;
        console.log(xAjusted, yAjusted);

        const index = this.state.elements.length === 0 ? 0 : Number(this.state.elements[this.state.elements.length - 1].attr('id').split('form-')[1]) + 1;

        const circle = d3.select(elm).select('.main-group').append('circle')
            .attr('id', 'form-' + index)
            .attr('class', 'created-form full-circle')
            .attr('cx', xAjusted + 'px')
            .attr('cy', yAjusted + 'px')
            .attr('r', this.props.addValues.addRadius + 'px')
            .attr('fill', this.props.addValues.addColor)
            .style('cursor', 'pointer');


        const circleSelect = d3.select(elm).select('.select-group').append('circle')
            .attr('id', 'form-' + index)
            .attr('class', 'created-form')
            .attr('cx', xAjusted + 'px')
            .attr('cy', yAjusted + 'px')
            .attr('r', (Number(this.props.addValues.addRadius) + 1) + 'px')
            .attr('fill', 'none')
            .attr('stroke', 'blue')
            .attr('stroke-width', '2px')
            .style('pointer-events', 'none');

        circle.on('mouseenter', () => {
            if (this.props.mode === 'edit' && !this.state.dragging) {
                circleSelect.attr('stroke', 'blue');
            }
        })

        circle.on('mouseleave', () => {
            if (this.props.mode === 'edit' && this.props.selectedElmId !== index && !this.state.dragging) {
                circleSelect.attr('stroke', 'none');
            }
        })
    

        this.makeDragable(circle);

        const newElements = this.state.elements;
        const newSelectElements = this.state.selectElements;
        newElements.push(circle);
        newSelectElements.push(circleSelect);
        this.setState({elements: newElements, selectElements: newSelectElements});
        this.props.setSelected(index);
        this.updateHighlighted();
    }

    updateElement = (type, id) => {
        switch (type) {
            case 'radius':
                d3.select('#drawing-container').selectAll('#form-' + id).attr('r', this.props.editValues.editRadius + 'px');
                break;
            case 'color':
                d3.select('#drawing-container').select('.main-group').select('#form-' + id).attr('fill', this.props.editValues.editColor);
            break;
            default: console.log('no update');
        }
    }

    updateHighlighted = () => {
        d3.select('#drawing-container').select('.select-group').selectAll('.created-form').attr('stroke', 'none');
        if (this.props.mode === 'edit') {
            d3.select('#drawing-container').select('.select-group').selectAll('#form-' + this.props.selectedElmId).attr('stroke', 'blue');
        }
    }

    componentDidUpdate = (prevProps) => {
        if (prevProps.selectedElmId !== this.props.selectedElmId || prevProps.mode !== this.props.mode) {
            this.updateHighlighted();
        }

        if (prevProps.gooeyIntensity !== this.props.gooeyIntensity) {
            this.updateGooeyEffect(this.props.gooeyIntensity);
        }

        if (prevProps.editValues.editRadius !== this.props.editValues.editRadius) {
            this.updateElement('radius', this.props.selectedElmId);
        }

        if (prevProps.editValues.editColor !== this.props.editValues.editColor) {
            this.updateElement('color', this.props.selectedElmId);
        }

        if (prevProps.editValues.deletedNodes.length !== this.props.editValues.deletedNodes.length) {
            this.deleteNode(this.props.selectedElmId);
        }

        if (prevProps.editValues.bringForward.length !== this.props.editValues.bringForward.length) {
            this.bringForward(this.props.selectedElmId);
        }

        if (prevProps.editValues.sendBackward.length !== this.props.editValues.sendBackward.length) {
            this.sendBackward(this.props.selectedElmId);
        }
    }

    makeDragable = (selection) => {
        const that = this;
        selection.on('mousedown', function() {
            if (that.props.mode === 'edit') {
                that.startDrag(d3.select(this));
                /* console.log('mouse down', d3.select(this).attr('id').split('form-')[1]); */
            }
        })
        selection.on('mouseup', function() {
            if (that.props.mode === 'edit') {
                console.log('stop drag')
                that.stopDrag();
            }
        })
    }

    startDrag = (selection) => {
        this.props.setSelected(Number(selection.attr('id').split('form-')[1]));
        this.setState({draggedElementId: selection.attr('id').split('form-')[1], dragging: true})
    }

    stopDrag = () => {
        this.setState({draggedElementId: null, dragging: false}, () => {
            this.updateHighlighted();
        });
    }

    addGooeyEffect = (container, intensity) => {
        const defs = container.append('defs');
        const filter = defs.append('filter').attr('id', 'gooey').attr('width', 5).attr('height', 5).attr('x', -2.5).attr('y', -2.5);
        filter.append('feGaussianBlur')
            .attr('in', 'SourceGraphic')
            .attr('class', 'gooey-blur')
            .attr('stdDeviation', intensity)
            .attr('result', 'blur');
        filter.append('feColorMatrix')
            .attr('in', 'blur')
            .attr('mode', 'matrix')
            .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7')
            .attr('result', 'gooey');

        container.style("filter", "url(#gooey)");
    }

    updateGooeyEffect = (intensity) => {
        if (intensity !== '') {
            d3.select('#drawing-container').select('#gooey').select('feGaussianBlur').attr('stdDeviation', intensity);
        }
    }

    deleteNode = (id) => {
        if (id || id === 0) {
            const newElements = this.state.elements.filter(element => {
                return d3.select(element.node()).attr('id') !== 'form-' + id;
            });

            this.props.setSelected(this.state.elements.length > 0 ? d3.select(this.state.elements[this.state.elements.length - 1].node()).attr('id').split('form-')[1] : null);

            this.setState({elements: newElements}, () => {
                d3.select('#drawing-container').select('.main-group').selectAll('#form-' + id).remove();
                d3.select('#drawing-container').select('.select-group').selectAll('#form-' + id).remove();
            });
        }
    }

    bringForward = (id) => {
        console.log('bring')
        if (id || id === 0) {
            let newElements = [];
            let indexOfElement = -1;
            newElements = this.state.elements.filter((element, i) => {
                if (d3.select(element.node()).attr('id') === 'form-' + id) {
                    indexOfElement = i;
                    return false;
                } else {
                    return true;
                }
            });

            if (indexOfElement === this.state.elements.length - 1) {
                newElements = this.state.elements;
            } else {
                newElements.splice(indexOfElement + 1, 0, this.state.elements[indexOfElement]);
            }
            this.setState({elements: newElements}, this.redrawElements);
        }
    }

    sendBackward = (id) => {
        if (id || id === 0) {
            let newElements = [];
            let indexOfElement = -1;
            newElements = this.state.elements.filter((element, i) => {
                if (d3.select(element.node()).attr('id') === 'form-' + id) {
                    indexOfElement = i;
                    return false;
                } else {
                    return true;
                }
            });

            if (indexOfElement === 0) {
                newElements = this.state.elements;
            } else {
                newElements.splice(indexOfElement - 1, 0, this.state.elements[indexOfElement]);
            }
            this.setState({elements: newElements}, this.redrawElements);
        }
    }

    redrawElements = () => {
        console.log('elements at redraw', JSON.parse(JSON.stringify(this.state.elements)));
        for (let i = 0; i < this.state.elements.length; i++) {
            if (this.state.elements[i]) {
                d3.select('#drawing-container').select('.main-group').selectAll('#' + d3.select(this.state.elements[i].node()).attr('id')).remove();
                d3.select('#drawing-container').select('.select-group').selectAll('#' + d3.select(this.state.elements[i].node()).attr('id')).remove();
            }
        }
        this.state.elements.forEach(element => {
            d3.select('#drawing-container').select('.main-group').append(() => element.node());
        });
        this.state.selectElements.forEach(element => {
            d3.select('#drawing-container').select('.select-group').append(() => element.node());
        });
    }
}

export default Drawing;