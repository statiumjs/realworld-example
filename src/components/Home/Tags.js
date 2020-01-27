import React from 'react';
import { Link } from 'react-router-dom';
import { withBindings } from 'statium';

import './Tags.css';

const Cell = ({ tag, selectedTag, setSelectedTag }) => (
    <Link to="" className={`tag-default tag-pill ${tag === selectedTag ? 'active' : ''}`}
        onClick={e => {
            e.preventDefault();
            
            setSelectedTag(tag === selectedTag ? null : tag);
        }}>
        
        {tag}
    </Link>
);

const Tags = ({ tags, selectedTag, setSelectedTag }) => {
    if (!Array.isArray(tags)) {
        return null;
    }
    
    return (
        <div className="tag-list">
            {tags.map(tag => 
                <Cell key={tag}
                    tag={tag}
                    selectedTag={selectedTag}
                    setSelectedTag={setSelectedTag}
                />
            )}
        </div>
    );
}

export default withBindings(['tags', ['selectedTag', true]])(Tags);
