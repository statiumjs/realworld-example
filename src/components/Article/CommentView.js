import React from 'react';
import { Bind } from 'statium';
import { Link } from 'react-router-dom';
import get from 'lodash.get';

import Userpic from '../Userpic.js';

const DeleteButton = ({ slug, commentId }) => (
    <Bind controller>
        { (_, { $dispatch }) => {
            const deleteComment = () => {
                $dispatch('deleteComment', { slug, commentId });
            };
    
            return (
                <span className="mod-options" onClick={deleteComment}>
                    <i className="ion-trash-a" />
                </span>
            );
        }}
    </Bind>
);

const CommentView = ({ user, slug, articleAuthor, comment }) => {
    const currentUsername = get(user, 'username');
    const commentId = get(comment, 'id');
    const commentAuthor = get(comment, 'author.username');
    const commentAuthorImage = get(comment, 'author.image');
    const createdAt = get(comment, 'createdAt');
    
    const canDelete = currentUsername && (
        currentUsername === articleAuthor ||
        currentUsername === commentAuthor
    );
    
    return (
        <div className="card">
            <div className="card-block">
                <p className="card-text">{get(comment, 'body')}</p>
            </div>
            
            <div className="card-footer">
                <Link to={`/@${commentAuthor}`} className="comment-author">
                    <Userpic src={commentAuthorImage}
                        className="comment-author-img"
                        alt={commentAuthor} />
                    &nbsp;
                    {commentAuthor}
                </Link>
                
                <span className="date-posted">
                    {new Date(createdAt).toDateString()}
                </span>
                
                { canDelete && <DeleteButton slug={slug} commentId={commentId} /> }
            </div>
        </div>
    );
};

export default CommentView;
