import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../src/style.css'
import '../App.css'
import { HouseDoor } from 'react-bootstrap-icons';
import { Button } from 'antd';

const Header = () => {
    const styleButton = {
        margin: 'auto 5px',
        background: '#B9CFFB',
        color: '#fff',
        fontWeight: 'bold',
        height: '40px',
        border: 'none',
    };

    const handleLogout = () => {
        localStorage.removeItem("TOKEN");
      }

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-blue">

                <div className="col-sm">
                    <ul>
                        <li className="li-list-item center-nd">
                            <a href="/home"><HouseDoor color="white" size={50} /></a>
                        </li>
                    </ul>
                </div>
                <div className="col-sm header-title">
                    <h1>Trello</h1>
                </div>
                <div className="col-sm ">
                    <ul className="ul-right">
                        <li className="li-list-item">
                            <a href="/">
                                <Button style={styleButton} onClick={handleLogout}>
                                    Logout
                                </Button>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

export default Header;