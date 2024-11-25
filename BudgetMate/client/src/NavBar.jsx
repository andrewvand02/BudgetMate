import React from 'react';
import { Link } from 'react-router-dom';
import ImageSwitcher from './ImageSwitcher';
import lightImage from "./assets/budget.png";

const NavBar = () => {
    return (
        <ul style={{backgroundColor: 'lightgrey', width: '100vw', marginLeft: '-18vw'}}>
            <li style={{display: 'inline'}}>
                <Link to="/">
                    <img src="src/assets/budget.png" height='100px'/>
                </Link>
            </li>
            <li style={{display: 'inline'}}>
                <Link to="/income">
                    Income Input
                </Link>
            </li>
            <li style={{display: 'inline'}}>
                <Link to="/fetch-income">
                    View Income
                </Link>
            </li>
            <li style={{display: 'inline'}}>
                <Link to="/expenses">
                    Input Expenses
                </Link>
            </li>
            <li style={{display: 'inline'}}>
                <Link to="/fetch-expenses">
                    View Expenses
                </Link>
            </li>
        </ul>
    );
};

export default NavBar;