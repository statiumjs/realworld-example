import React from 'react';
import { withBindings } from 'statium';
import { Link } from 'react-router-dom';
import get from 'lodash.get';

import CommentInput from './CommentInput.js';
import CommentView from './CommentView.js';

const SignIn = () => (
    <p>
        <Link to="/login">Sign in</Link>
        &nbsp;
        or
        &nbsp;
        <Link to="/register">sign up</Link>
        &nbsp;
        to add comments on this article.
    </p>
);

const CommentList = ({ user, articleSlug, articleAuthor, comments = [] }) => (
    <div>
        { comments.map((comment, idx) =>
            <CommentView
                key={get(comment, 'id', idx)}
                user={user}
                slug={articleSlug}
                comment={comment}
                articleAuthor={articleAuthor} />
        )}
    </div>
);

const Comments = ({ user, comments, canModify, articleSlug, articleAuthor }) => (
    <div className="col-xs-12 col-md-8 offset-md-2">
        <div>
            { user ? <CommentInput slug={articleSlug} /> : <SignIn /> }
        </div>
        
        <CommentList user={user}
            articleSlug={articleSlug}
            articleAuthor={articleAuthor}
            comments={comments} />
    </div>
);

export default withBindings({
    user: 'user',
    articleSlug: 'article.slug',
    articleAuthor: 'article.author.username',
    comments: 'article.comments',
})(Comments);
