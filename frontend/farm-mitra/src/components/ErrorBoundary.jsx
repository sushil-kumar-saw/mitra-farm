// ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error to an external service here if you want
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Customize your fallback UI here
      return <h2>Oops! Something went wrong. Please try again later.</h2>;
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;
