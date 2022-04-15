import React, { useState } from 'react';
import './ConversationSearch.scss';

const ConversationSearch = ({ conversations }) => {
    const [searchInput, setSearchInput] = useState('')

    return (
        <div id="search-container">
            {conversations && conversations.length > 0 && <input type="text" placeholder="Search" />}
        </div>
    );
}

export default ConversationSearch;