import React, { Component } from 'react';
import './splash.css';
import { Logo } from '../../Firebase';


class Splash extends Component {
    render() {
        return (
            <div>
                <Logo />
                <p className='welcome-title'>Welcome!</p>
            </div>
        );
    }
}

export default Splash;
