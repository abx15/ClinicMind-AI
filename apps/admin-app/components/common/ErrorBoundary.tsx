'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center
                        text-center p-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="font-syne font-bold text-xl text-[#1A2420] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[#8A9E98] mb-6 max-w-sm">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-5 py-2 bg-[#0F6E56] text-white rounded-lg text-sm
                       font-semibold hover:bg-[#094D3C] transition-colors"
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
