import React from 'react';
import { useSelector } from 'react-redux';

import './LogOutButton.scss';

const LogOutButton = ({ onLogout }) => {

    const { userId } = useSelector(state => state.userState)

    return (
        <div id="new-message-container">
            <button onClick={() => onLogout(userId)}>
                <img src="https://img.icons8.com/flat-round/64/000000/shutdown--v1.png" alt="Logout" />
            </button>
        </div>
    );
}

export default LogOutButton;