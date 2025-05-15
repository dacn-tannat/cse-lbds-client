import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import * as testingLibrary from '@testing-library/dom';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { Toaster } from '@/components/ui/toaster';

// Create a portal root for Dialog components
const createPortalRoot = () => {
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'portal-root');
  document.body.appendChild(portalRoot);
  return portalRoot;
};

// Create a custom render function that includes providers
function renderWithProviders(
  ui: React.ReactElement,
  {
    route = '/',
    initialEntries = [route],
    ...renderOptions
  }: { route?: string; initialEntries?: string[] } & Omit<RenderOptions, 'wrapper'> = {}
) {
  window.history.pushState({}, 'Test page', route);

  // Create portal root for dialogs
  const portalRoot = createPortalRoot();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div id="root">{children}</div>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  const utils = render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  });

  // Cleanup function to remove portal root
  const cleanup = () => {
    document.body.removeChild(portalRoot);
  };

  return {
    ...utils,
    queryClient,
    user: userEvent.setup({ delay: null }),
    cleanup,
  };
}

// Re-export everything
export * from '@testing-library/react';
export * from '@testing-library/dom';
export { renderWithProviders as render };
export { default as userEvent } from '@testing-library/user-event'; 