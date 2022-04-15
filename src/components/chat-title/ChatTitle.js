import React from 'react';

import TrashIcon from '../controls/icons/trash-icon/TrashIcon';

import './ChatTitle.scss';

const ChatTitle = ({ selectedConversation, onDeleteConversation }) => {
    
    return (
        <div id="chat-title">
            {selectedConversation && 
                <>
                <span>{selectedConversation.adminId.fullName}</span>
                <div onClick={() => onDeleteConversation()} title="Delete Conversation">
                    <TrashIcon />
                </div>
                </>
            }
        </div>
    );
}

export default ChatTitle;