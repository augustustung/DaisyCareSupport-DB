import React from 'react';

import Button from '../../controls/buttons/Button';

import './NoConversations.scss';

const NoConversations = () => {
    return (
        <div id="no-coversation-layout">
            <div id="no-conversation-content">
                <h2>No Admin Online Now</h2>
                <p>Currently, We work from 8:00 a.m to 9:00 p.m.</p>
                <p>Sorry for making you have to wait!.</p>
                <p>If you want to receive notification when Channel is on. Click the button bellow!</p>
                <Button onClick={() => Notification.requestPermission()}>Notify Me</Button>
            </div>
        </div>
    );
}

export default NoConversations;