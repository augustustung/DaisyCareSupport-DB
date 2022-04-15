import React, { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { messagesRequested, newMessageAdded } from '../../store/actions';
import Message from '../../components/message/Message';
import './MessageList.scss';
import FormButton from '../../components/controls/buttons/FormButton';
import AttachmentIcon from '../../components/controls/icons/attachment-icon/AttachmentIcon';
import io from 'socket.io-client'
import { convertFileToBase64 } from '../../helper/common'

const isMessageEmpty = (textMessage) => {
    return adjustTextMessage(textMessage).length === 0;
}

const adjustTextMessage = (textMessage) => {
    return textMessage.trim();
};

let socket

const MessageList = ({
    conversationId,
    onMessageSubmitted,
    adminId,
    userId,
    userRole,
    userName,
    token,
    handleChangeLastMessage,
    callOtherSideChange
}) => {
    const [state, setState] = useState({
        allMessages: [],
        textMessage: '',
        skip: 0
    })
    const inputFileRef = useRef()

    const {
        allMessages,
        textMessage,
        skip
    } = state
    const dispatch = useDispatch()

    const disableButton = isMessageEmpty(textMessage);

    const _onReloadMessages = async (skip) => {
        let message = await messagesRequested({
            conversationId: conversationId,
            token: token,
            role: userRole,
            userId: userId,
            skip: skip
        }, dispatch)
        if (message && message.length > 0) {
            setState(prev => ({
                ...prev,
                textMessage: '',
                file: null,
                allMessages: message
            }))
        } else {
            setState({
                ...state,
                allMessages: []
            })
        }
    }

    const onScrollFetchData = async (skip) => {
        let message = await messagesRequested({
            conversationId: conversationId,
            token: token,
            role: userRole,
            userId: userId,
            skip: skip
        }, dispatch)
        if (message && message.length > 0) {
            setState(prev => ({
                ...prev,
                textMessage: '',
                file: null,
                allMessages:  [...state.allMessages, ...message]
            }))
        }
    }

    useEffect(() => {
        _onReloadMessages(0)
    }, [])

    useEffect(() => {
        if (conversationId) {
            _onReloadMessages(0)
        }
    }, [conversationId])

    useEffect(() => {
        socket = io(process.env.REACT_APP_API_URL || "https://daisycare-support.herokuapp.com")

        socket.emit('join', { userId: userId, userName: userName, roomId: conversationId }, async (e) => {
            console.log('connect error')
        })

        return () => {
            socket.disconnect()
            socket.off()
        }
    }, [socket])

    useEffect(() => {
        socket.on('receiveMessage', async (dataMessage) => {
            setState({
                ...state,
                allMessages: [
                    { ...dataMessage },
                    ...state.allMessages
                ]
            })
            handleChangeLastMessage({
                newMessage: dataMessage.image ? "File" : dataMessage.text,
                id: conversationId
            })
        })
    }, [socket])

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!adminId || !userId) return

        if (!isMessageEmpty(textMessage)) {
            const dataMessage = {
                "_id": Math.random(),
                "text": textMessage,
                "createdAt": new Date().toISOString(),
                "isRead": false,
                "image": null,
                "senderId": userId
            }
            await handleSendMessage(dataMessage)
        };

    }

    async function handleSendMessage(dataMessage) {
        await socket.emit('sendMessage',
            { roomId: conversationId, dataMessage: dataMessage },
            async (senderId) => {
                await onMessageSubmitted({
                    _id: conversationId,
                    text: textMessage,
                    senderId: userId,
                    userId: userId,
                    createdAt: new Date(),
                    token: token,
                    adminId: adminId._id,
                    image: dataMessage.image
                });

                if (senderId === userId) {
                    setState({
                        ...state,
                        allMessages: [
                            { ...dataMessage },
                            ...state.allMessages
                        ],
                        textMessage: ''
                    })
                    handleChangeLastMessage({
                        newMessage: textMessage ? textMessage : "File",
                        id: conversationId
                    })
                    callOtherSideChange()
                }
            })
    }

    const _onChooseFile = async (e) => {
        if (!adminId || !userId) return
        let attachment = e.target.files[0]
        convertFileToBase64(attachment).then(async dataUrl => {
            if (dataUrl) {
                const dataMessage = {
                    "_id": Math.random(),
                    "text": null,
                    "createdAt": new Date().toISOString(),
                    "isRead": false,
                    "image": dataUrl,
                    "senderId": userId
                }
                inputFileRef.current.value = ''
                await handleSendMessage(dataMessage)
            };
        })
    }

    const _onChangeTextInput = (e) => {
        const { value, name } = e.target
        setState(prev => ({
            ...prev,
            [name]: value
        }))
    }

    async function handleOnScroll(e) {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (Math.ceil((-scrollTop) + clientHeight) === scrollHeight) {
            const newSkip = skip + 10
            setState({
                ...state,
                skip: newSkip
            })
            await onScrollFetchData(newSkip)
        }
    }

    return (
        <>
            <div onScroll={handleOnScroll} id="chat-message-list">
                {allMessages.length > 0 ? allMessages.map((message, index) => {
                    return <Message
                        key={index}
                        isMyMessage={message.senderId === userId}
                        message={message} />;
                }) : (
                    <></>
                )}
            </div>
            <form id="chat-form" onSubmit={handleFormSubmit}>
                <div title="Add Attachment">
                    <AttachmentIcon handleChooseFile={_onChooseFile} inputFileRef={inputFileRef} />
                </div>
                <input
                    type="text"
                    placeholder="type a message"
                    value={textMessage}
                    name="textMessage"
                    onChange={_onChangeTextInput}
                />
                <FormButton disabled={disableButton}>Send</FormButton>
            </form>
        </>
    );
}

const mapStateToProps = state => {
    return {
        userId: state.userState.userId,
        userRole: state.userState.userRole,
        token: state.userState.token,
        userName: state.userState.fullName
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onMessageSubmitted: (data) => dispatch(newMessageAdded(data))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageList);