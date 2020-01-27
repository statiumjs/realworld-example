import React from 'react';
import { Bind } from 'statium';

import Tab from '../Tab.js'
import ArticleList from '../Article/List.js';

const YourFeedTab = props => (
    <Tab id="feed" name="Your Feed" {...props} />
);

const GlobalFeedTab = props => (
    <Tab id="global" name="Global Feed" {...props} />
);

const TagFilterTab = ({ name, ...props }) => (
    <Tab id="tagFilter" name={name} {...props} />
);

const options = [
    { value: 10 },
    { value: 25 },
    { value: 50 },
//     { value: 0, text: "All" }, // TODO This crashes Chrome?!
];

const ArticleCountSelect = () => (
    <Bind props={[['limit', true]]}>
        { ({ limit, setLimit }) => (
            <li className="nav-item pull-xs-right">
                <span>Articles to display:&nbsp;</span>
        
                <select className="custom-select"
                    value={limit}
                    onChange={e => { setLimit(Number(e.target.value)); }}>
            
                    { options.map(o => (
                        <option key={o.value} value={o.value}>
                            {o.text || o.value}
                        </option>
                    ))}
                </select>
            </li>
        )}
    </Bind>
);

const Feeds = ({ articles, articlesCount }) => (
    <Bind props={[
            'user', ["tab", true], ["page", true], "limit", 'articles', 'articlesCount',
            'selectedTag',
        ]}>
        { ({ user, tab, setTab, loading, selectedTag, ...rest }) => (
            <div className="col-md-9">
                <div className="feed-toggle">
                    <ul className="nav nav-pills outline-active">
                        {user && <YourFeedTab tab={tab} setTab={setTab} />}

                        <GlobalFeedTab tab={tab} setTab={setTab} />

                        {selectedTag && <TagFilterTab
                            tab="tagFilter" name={selectedTag} />}
                        
                        <ArticleCountSelect />
                    </ul>
                </div>
                
                <ArticleList {...rest} />
            </div>
        )}
    </Bind>
);

export default Feeds;
