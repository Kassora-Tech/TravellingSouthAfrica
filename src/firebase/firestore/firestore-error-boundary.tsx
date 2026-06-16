'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class FirestoreErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorMessage = error.message || '';

    if (errorMessage.includes('FIRESTORE') && errorMessage.includes('INTERNAL ASSERTION FAILED')) {
      console.warn('Firestore internal assertion failed (non-critical):', error, errorInfo);
      return;
    }

    this.setState({ hasError: true });
    throw error;
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}
