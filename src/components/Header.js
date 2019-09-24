import React, { Component } from 'react';

import githubLogo from '../assets/github-logo.svg'

class Header extends Component {
    render() {
        return (
            <div className="header-container">
                <div className="header-title">
                    <h1>Gooey Generator</h1>
                </div>
                <div className="header-links">
                    <a href="https://github.com/GuillaumeMMM/gooey-generator" target="_blank" rel="noopener noreferrer"><img src={githubLogo} alt="github logo"></img></a>
                </div>
            </div>
        );
    }
}

export default Header;