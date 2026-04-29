import React from 'react';

export default class SecurityErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('🛡️ SECURITY AUDIT FAILURE:', error);
  }

  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10 text-center">
        <div className="p-8 rounded-[3rem] bg-red-500/10 border-2 border-red-500/20 max-w-lg">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-red-500 mb-6">
            Expert Engine Fault
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-10 py-4 bg-white text-slate-900 rounded-full font-black uppercase tracking-tighter"
          >
            Restart
          </button>
        </div>
      </div>
    );
    return this.props.children;
  }
}
