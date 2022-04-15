import React from 'react';
import classNames from 'classnames';
import './Message.scss';
import { useSelector } from 'react-redux';
import { imageAdmin, imageUser } from '../../images';
import moment from 'moment';

const Message = ({ isMyMessage, message }) => {
    const messageClass = classNames('message-row', {
        'you-message': isMyMessage,
        'other-message': !isMyMessage
    });

    const { userRole } = useSelector(state => state.userState)

    const imageThumbnail = isMyMessage
        ? null
        : <img src={userRole === "R2" ? imageAdmin : imageUser} alt={'imageAlt'} />;

    return (
        <div className={messageClass}>
            <div className="message-content">
                {imageThumbnail}
                <div className="message-text">
                    {message.image ? <img src={message.image} className='w-100' /> : message.text}
                </div>
                <div className="message-time">{moment(message.createdAt).startOf('second').fromNow()}</div>
            </div>
        </div>
    );
}

export default Message;