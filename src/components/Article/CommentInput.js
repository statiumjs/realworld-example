import React from 'react';
import ViewModel, { Bind } from 'statium';
import get from 'lodash.get';

import Userpic from '../Userpic.js';

const CommentInput = ({ slug }) => (
    <ViewModel id="Comment-form" initialState={{ comment: '' }}>
        <Bind controller props={["user", ["comment", true]]}>
            { ({ user, comment, setComment }, { $dispatch }) => (
                <form className="card comment-form" onSubmit={e => {
                        e.preventDefault();
                        $dispatch('postComment', { slug, comment });
                    }}>
                    <div className="card-block">
                        <textarea className="form-control"
                            placeholder="Write a comment"
                            value={comment}
                            onChange={e => { setComment(e.target.value); }}
                            rows="3" />
                    </div>

                    <div className="card-footer">
                        <Userpic src={get(user, 'image')}
                            className="comment-author-img"
                            alt={get(user, 'username')} />

                        <button className="btn btn-sm btn-primary" type="submit">
                            Post comment
                        </button>
                    </div>
                </form>
            )}
        </Bind>
    </ViewModel>
);

export default CommentInput;
