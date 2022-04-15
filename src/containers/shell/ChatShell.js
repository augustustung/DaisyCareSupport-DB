import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import {
    conversationChanged,
    conversationDeleted,
    loadConversation,
    HandleSignOut,
    handleChangeLastMessage
} from '../../store/actions';
import ConversationSearch from '../../components/conversation/conversation-search/ConversationSearch';
import NoConversations from '../../components/conversation/no-conversations/NoConversations';
import ConversationList from '../../components/conversation/conversation-list/ConversationList';
import LogoutButton from '../../components/conversation/button-logout/LogOutButton';
import ChatTitle from '../../components/chat-title/ChatTitle';
import MessageList from '../message/MessageList';
import CustomModal from '../../components/modal'

import './ChatShell.scss';

const ChatShell = ({
    conversations,
    selectedConversation,
    conversationChanged,
    onDeleteConversation,
    loadConversations,
    onLogout,
    userRole,
    userId,
    token,
    handleChangeLastMessage
}) => {
    useEffect(() => {
        loadConversations(userId, userRole, token);
    }, [])

    function callOtherSideChange() {
        loadConversations(userId, userRole, token);
    }

    const [modal, setModal] = useState(userRole === "R2" ? true : false);

    const toggle = () => setModal(!modal);

    return (
        <>
            <div id="chat-container">
                <ConversationSearch conversations={conversations} />
                <ConversationList
                    onConversationItemSelected={conversationChanged}
                    conversations={conversations}
                    selectedConversation={selectedConversation} />
                <LogoutButton
                    onLogout={onLogout}
                />
                <ChatTitle
                    selectedConversation={selectedConversation}
                    onDeleteConversation={onDeleteConversation}
                />
                {
                    conversations.length > 0 ? (
                        <MessageList
                            conversationId={(selectedConversation && selectedConversation._id) || ''}
                            adminId={(selectedConversation && selectedConversation.adminId) || ''}
                            handleChangeLastMessage={handleChangeLastMessage}
                            callOtherSideChange={callOtherSideChange}
                        />
                    ) : (
                        <NoConversations />
                    )
                }
            </div>
            <CustomModal toggle={toggle} modal={modal} />
        </>
    );
}

const mapStateToProps = state => {
    return {
        conversations: state.conversationState.conversations,
        selectedConversation: state.conversationState.selectedConversation,
        userRole: state.userState.userRole,
        token: state.userState.token,
        userId: state.userState.userId
    };
};

const mapDispatchToProps = dispatch => ({
    conversationChanged: (data) => dispatch(conversationChanged(data)),
    onDeleteConversation: () => dispatch(conversationDeleted()),
    loadConversations: (userId, userRole, token) => dispatch(loadConversation(userId, userRole, token)),
    onLogout: (userId) => dispatch(HandleSignOut(userId)),
    handleChangeLastMessage: (data) => dispatch(handleChangeLastMessage(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ChatShell);