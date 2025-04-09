/**
 * © Copyright IBM Corp. 2022, 2023
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { render, screen } from '@testing-library/react';
import TopN from './TopN';
import { GROUP_BY as groups } from '../constants';
import mockAlerts from '../../mocks/alerts.json';

// @ts-ignore
import getReactRenderer from '@ibm/akora-renderer-react';

// @ts-ignore
const { AkoraStateProvider } = getReactRenderer(React, ReactDOM).components;
const wrapWithAkoraProvider = (mockApp: any, mockState: any, component: any) => {
  return (
    <AkoraStateProvider value={{app: mockApp, state: mockState}}>
      {component}
    </AkoraStateProvider>
  );
}

describe('TopN', () => {
  it('should match sample snapshot', () => {
    const props = {
      data: mockAlerts.data,
      groups,
      refetch: () => {},
      getStatusGroupCounts: () => ({ somegroup: { total: 12 } }),
    };
    render(
      wrapWithAkoraProvider(
        {
          replaceRoute: () => {},
          resolvePathExpression: (p: string) => p,
          getStateForPath: () => ({ title: 'Top 10' })
        },
        {
          clientConfiguration: {
            publicurl: 'https://someurl.com'
          },
          fullPath: '/somepath',
          path: '/somepath'
        },
        <TopN { ...props } />
      )
    );

    expect(screen.getByText('Top 10')).toBeInTheDocument();
    expect(screen.getAllByTitle('By resource').length).toBeGreaterThan(0);
  });
});
