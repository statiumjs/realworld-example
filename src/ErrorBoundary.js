import React from 'react';

const ErrorMessage = ({ error }) => (
    <div>
        <h1>Oh noes! There's an error!</h1>
        <span>{error.toString()}</span>
    </div>
);

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = { error: null };
    }
    
    componentDidCatch(error) {
        this.setState({ error });
    }
    
    render() {
        if (this.state.error) {
            return (
                <ErrorMessage error={this.state.error} />
            );
        }
        
        return this.props.children;
    }
}
