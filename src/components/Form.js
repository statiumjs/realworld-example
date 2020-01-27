import React from 'react';
import ViewModel, { Bind } from 'statium';
import isEqual from 'lodash.isequal';

import LoadMask from './LoadMask.js';

const isValid = $get => Object.keys($get('form.errors')).length === 0;

const initialize = async ({ $get, $set }, values) => {
    await $set('form.previousValues', values);
};

const invalidate = async ({ $get, $set }, values) => {
    const form = $get('form');
    const { previousValues } = form;
    
    if (!isEqual(previousValues, values)) {
        await $set({
            form: {
                ...form,
                previousValues: values,
                values,
                errors: {},
            },
        });
    }
};

const submitForm = async ({ $get, $set }, onSubmit) => {
    const formValid = isValid($get);
    const [values, errors] = $get('form.values', 'form.errors');
    
    // This should not be reachable but in case there's an error somewhere
    if (!formValid) {
        console.error('Attempted to submit invalid form. Errors: ', errors, ', values: ', values);
        
        return;
    }
    
    await $set('form.busy', true);
    await onSubmit(values);
    await $set('form.busy', false);
};

export const Form = ({ values, validate, busy, onSubmit, children, ...formProps }) => (
    <ViewModel id="Form"
        initialState={{
            form: {
                previousValues: null,
                values,
                errors: {},
                busy,
            },
        }}
        applyState={validate}
        controller={{
            initialize: vc => initialize(vc, values),
            invalidate: vc => invalidate(vc, values),
            handlers: {
                submit: vc => submitForm(vc, onSubmit),
            },
        }}>
        
        <Bind props="busy" controller>
            { ({ busy }, { $dispatch }) => (
                <form {...formProps} onSubmit={e => {
                        e.preventDefault();
                        
                        $dispatch('submit');
                    }}>
                    
                    <LoadMask loading={busy} />
                    
                    {children}
                </form>
            )}
        </Bind>
    </ViewModel>
);

export const Input = ({ component = 'input', binding, ...props }) => (
    <Bind props={{
            value: {
                key: `form.values.${binding}`,
                publish: true,
            },
            error: `form.errors.${binding}`,
        }} controller>
        
        { ({ value, setValue, error }, { $dispatch }) => {
            const cmpProps = {
                value,
                error,
                ...props,
            };
            
            if (typeof component === 'string') {
                cmpProps.onChange = e => { setValue(e.target.value); };
            }
            else {
                cmpProps.setValue = setValue;
            }
            
            return React.createElement(component, cmpProps);
        }}
    </Bind>
);

export const SubmitButton = ({ children, ...props }) => (
    <Bind controller
        props={{
            busy: 'form.busy',
            isValid,
        }}>
        { ({ busy, isValid }, { $dispatch }) =>
            // We cannot use <button type="submit"> here because pressing Enter key
            // in any input field within the form will cause the default action
            // (form submission) to happen. TL;DR version: this is because of the way
            // React handles event propagation.
            // We want more control over what happens and when, so we simulate
            // form submission via a ViewController event instead.
            <button type="button"
                disabled={busy || !isValid}
                onClick={() => { $dispatch('submit'); }}
                {...props}>
                { children }
            </button>
        }
    </Bind>
);
