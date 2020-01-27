import React from 'react';
import ViewModel, { Bind } from 'statium';

const keyUp = async ({ $get, $set }, { value, setValue }) => {
    const tagInput = $get('tagInput');
    
    const tagSet = new Set(value).add(tagInput);
    
    await setValue([...tagSet]);
    await $set('tagInput', '');
};

const removeTag = ({ $get, $set }, { value, setValue, tag }) => {
    const tagSet = new Set(value);
    tagSet.delete(tag);
    
    setValue([...tagSet]);
};

const TagInput = ({ value, setValue }) => (
    <ViewModel id="TagInput"
        initialState={{ tagInput: '' }}
        controller={{
            handlers: {
                keyUp,
                removeTag,
            },
        }}>
        <Bind props={[["tagInput", true]]} controller>
            { ({ tagInput, setTagInput }, { $dispatch }) => (
                <>
                    <input className="form-control"
                        type="text"
                        value={tagInput}
                        onChange={e => { setTagInput(e.target.value); }}
                        onKeyUp={e => {
                            // DOM event handlers are invoked synchronously,
                            // and we need to call preventDefault() here
                            // before dispatching ViewController event -
                            // which is asynchronous and is scheduled for the next
                            // even loop.
                            // If we simply pass the event object to ViewController
                            // handler, by the time it fires the event will have
                            // caused the default action and preventDefault() call
                            // will be ineffective.
                            if (e.keyCode === 13) {
                                e.preventDefault();
                                
                                $dispatch('keyUp', { value, setValue });
                            }
                        }} />
                
                    <div className="tag-list">
                        {(value || []).map(tag => (
                            <span key={tag} className="tag-default tag-pill">
                                <i className="ion-close-round"
                                    onClick={e => {
                                        e.preventDefault();
                                        
                                        $dispatch('removeTag', { value, setValue, tag });
                                    }} />
                                {tag}
                            </span>
                        ))}
                    </div>
                </>
            )}
        </Bind>
    </ViewModel>
);

export default TagInput;
