import React from 'react';
import ViewModel, { Bind } from 'statium';

import LoadMask from '../LoadMask.js';
import { Form, Input, SubmitButton } from '../Form.js';
import TagInput from './TagInput.js';

const defaultState = {
    loading: true,
    error: null,
    slug: null,
    article: null,
};

const emptyArticle = {
    title: '',
    description: '',
    body: '',
    tagList: [],
};

const loadArticle = async ({ $get, $set }, { match }) => {
    const { slug } = match.params;
    
    if (slug) {
        try {
            const api = $get('api');
            
            await $set('loading', true);
        
            const article = await api.Articles.get(slug);
            
            await $set({
                slug,
                article,
                error: null,
                loading: false,
            });
        }
        catch (e) {
            await $set({
                error: e.toString(),
                loading: false,
            });
        }
    }
    else {
        $set({
            article: emptyArticle,
            loading: false,
        });
    }
};

const postArticle = async ({ $get, $set }, article) => {
    const api = $get('api');
    let slug = $get('slug');
    const apiFn = slug ? api.Articles.update : api.Articles.create;
    
    await $set('loading', true);
    
    try {
        const updated = await apiFn(slug, article);
        slug = updated.slug;
        delete updated.slug;
        
        await $set({
            slug,
            article: updated,
        });
    }
    catch (e) {
        await $set('error', e.toString());
    }
    
    await $set('loading', false);
};

const EditorForm = props => (
    <ViewModel id="Editor" initialState={defaultState}
        controller={{
            initialize: vc => loadArticle(vc, props),
            handlers: {
                postArticle,
            },
        }}>
        
        <Bind props={["loading", "slug", "article"]} controller>
            { ({ loading, slug, article }, { $dispatch }) => {
                if (loading && !article) {
                    return (
                        <div>
                            <LoadMask loading={loading} />
                        </div>
                    );
                }
                
                return (
                    <Form values={article} busy={loading}
                        onSubmit={values => {
                            $dispatch('postArticle', values);
                        }}>
                    
                        <fieldset>
                            <fieldset className="form-group">
                                <Input
                                    binding="title"
                                    className="form-control form-control-lg"
                                    type="text"
                                    placeholder="Article Title" />
                            </fieldset>
                        
                            <fieldset className="form-group">
                                <Input
                                    binding="description"
                                    className="form-control"
                                    type="text"
                                    placeholder="What this article is about?" />
                            </fieldset>
        
                            <fieldset className="form-group">
                                <Input
                                    binding="body"
                                    component="textarea"
                                    className="form-control"
                                    rows="8"
                                    placeholder="Write your article here (in markdown)" />
                            </fieldset>
        
                            <fieldset className="form-group">
                                <Input
                                    binding="tagList"
                                    component={TagInput} />
                            </fieldset>
                        
                        
                            <SubmitButton className="btn btn-lg btn-primary pull-xs-right">
                                { slug ? "Update Article" : "Publish Article" }
                            </SubmitButton>
                        </fieldset>
                    </Form>
                );
            }}
        </Bind>
    </ViewModel>
);


const Editor = props => (
    <div className="editor-page">
        <div className="container page">
            <div className="row">
                <div className="col-md-10 offset-md-1 col-xs-12">
                    <EditorForm {...props} />
                </div>
            </div>
        </div>
    </div>
);

export default Editor;
