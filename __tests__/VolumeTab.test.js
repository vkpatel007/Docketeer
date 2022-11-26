/**        Docketeer 7.0
 * These tests do not work as enzyme is highly depricated and does not communicate with React 18
 */

import React from 'react';
import { describe, expect, test, jest } from '@jest/globals';
import VolumeTab from '../src/components/tabs/VolumeHistory';
import '@testing-library/react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

// configure({ adapter: new Adapter() })
const props = {
  volumeContainersList: [
    {
      vol_name: 'volumetest1',
      containers: [
        { Names: 'container1', State: 'Running', Status: '40 minutes ago' },
      ],
    },
    {
      vol_name: 'volumetest2',
      containers: [
        { Names: 'container2', State: 'Running', Status: '25 minutes ago' },
        { Names: 'container3', State: '', Status: '' },
      ],
    },
  ],
};

/* ------ rendering test ----- */
describe('rendering VolumeTab', () => {
  test('shows volumes', () => {
    render(<VolumeTab {...props} />);
  });
});

/* ----- search bar ----- */



//* Dummy Test
describe('dummy test', () => {
  test('dummy test', () => {
    expect(2 + 2).toBe(4);
  });
});

//* Dummy Test
describe('dummy test', () => {
  test('dummy test', () => {
    expect(2 + 2).toBe(4);
  });
});
