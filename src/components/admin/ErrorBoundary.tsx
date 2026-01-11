'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './ui/button/Button';
import { Icon } from './ui/Icon';
import alertIconSrc from '@/icons/admin/alert.svg';

// #region agent log
fetch('http://127.0.0.1:7242/ingest/6acb7073-f940-4321-8607-c58da75d05e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ErrorBoundary.tsx:imports',message:'ErrorBoundary imports check',data:{Button:typeof Button,alertIconSrc:typeof alertIconSrc,ButtonIsFunction:typeof Button==='function'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
// #endregion

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6acb7073-f940-4321-8607-c58da75d05e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ErrorBoundary.tsx:render',message:'ErrorBoundary render',data:{hasError:this.state.hasError,ButtonType:typeof Button,alertIconSrcType:typeof alertIconSrc,childrenType:typeof this.props.children},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6acb7073-f940-4321-8607-c58da75d05e3',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ErrorBoundary.tsx:error-state',message:'Rendering error state',data:{Button:typeof Button,alertIconSrc:typeof alertIconSrc,ButtonIsValid:typeof Button==='function'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-4">
              <Icon src={alertIconSrc} alt="Alert" width={64} height={64} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white/90 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={this.handleReset} variant="primary">
                Reload Page
              </Button>
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

