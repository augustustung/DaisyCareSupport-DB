import React from 'react';

import ConversationItem from '../conversation-item/ConversationItem';
import './ConversationList.scss';

const ConversationList = ({ conversations, selectedConversation, onConversationItemSelected }) => {
    const conversationItems = conversations.map((conversation) => {
        const conversationIsActive = selectedConversation && conversation._id === selectedConversation._id;

        return <ConversationItem
            key={conversation._id}
            onConversationItemSelected={onConversationItemSelected}
            isActive={conversationIsActive}
            conversation={conversation} />;
    });

    return (
        <div id="conversation-list">
            {conversationItems}
        </div>
    );
}

export default ConversationList;