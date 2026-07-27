'use client';

import React, { Component, ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>
            오류가 발생했습니다
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-sub)' }}>
            {this.state.error?.message ?? '알 수 없는 오류'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            다시 시도
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
