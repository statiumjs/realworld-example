import React from 'react';

const ErrorMessage = ({ error }) => (
  <div>
    <h1>Oh noes! There's an error!</h1>
    <span>{error.toString()}</span>
  </div>
);

// We need to use a class Component to implement componentDidCatch()
// and there is only one state property, so it's easy to make this
// component not use any state management outside vanilla React.
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
