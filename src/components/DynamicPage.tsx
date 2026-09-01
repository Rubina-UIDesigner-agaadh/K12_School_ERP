import React, { Suspense, lazy, Component } from 'react';
import { pageRegistry } from '../pages/PageRegistry';
import { FileQuestion, Loader2, AlertTriangle } from 'lucide-react';
interface DynamicPageProps {
  moduleName: string;
  subModuleName: string;
  screenName: string;
  pageId: string;
}
function PageLoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
        <p className="text-sm text-gray-500">Loading page...</p>
      </div>
    </div>);

}
function PageNotFound({
  screenName,
  pageId



}: {screenName: string;pageId: string;}) {
  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Page Under Development
        </h2>
        <p className="text-gray-500">
          The <span className="font-medium text-gray-700">{screenName}</span>{' '}
          page is currently being developed.
        </p>
        <p className="text-xs text-gray-400 mt-4">Page ID: {pageId}</p>
      </div>
    </div>);

}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
class PageErrorBoundary extends Component<
  {
    children: React.ReactNode;
    pageId: string;
  },
  ErrorBoundaryState>
{
  constructor(props: {children: React.ReactNode;pageId: string;}) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(
      `[DynamicPage] Error loading page "${this.props.pageId}":`,
      error,
      errorInfo
    );
  }
  componentDidUpdate(prevProps: {children: React.ReactNode;pageId: string;}) {
    if (prevProps.pageId !== this.props.pageId && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null
      });
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-500 mb-4">
              This page encountered an error while loading.
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Page ID: {this.props.pageId}
            </p>
            <button
              onClick={() =>
              this.setState({
                hasError: false,
                error: null
              })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">

              Try Again
            </button>
          </div>
        </div>);

    }
    return this.props.children;
  }
}
export function DynamicPage({
  moduleName,
  subModuleName,
  screenName,
  pageId
}: DynamicPageProps) {
  const factory = pageRegistry[pageId];

  const SpecificComponent = factory ? factory() : null;
  return (
    <div className="flex-1 bg-gray-50/50 min-h-full flex flex-col">
      <PageErrorBoundary pageId={pageId}>
        <Suspense fallback={<PageLoadingFallback />}>
          {SpecificComponent ?
          <SpecificComponent /> :

          <PageNotFound screenName={screenName} pageId={pageId} />
          }
        </Suspense>
      </PageErrorBoundary>
    </div>);

}