import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainWindow from '../app/components/MainWindow';
import { act } from '@testing-library/react';
import { OfflineContext } from '../app/context/OfflineProvider';

// Mock context values
const mockContextValue = {
  isOnline: true,
  serverUp: true
};

jest.mock('../app/components/YearChart', () => () => <div data-testid="YearChart" />);
jest.mock('../app/components/RatingChart', () => () => <div data-testid="RatingChart" />);
jest.mock('../app/components/CategoryChart', () => () => <div data-testid="CategoryChart" />);

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock the OfflineProvider context
jest.mock('../app/context/OfflineProvider', () => ({
  ...jest.requireActual('../app/context/OfflineProvider'),
  useOfflineContext: () => mockContextValue,
}));

const dummyGames = [
  {
    id: 1,
    name: 'Factorio',
    description: 'An automation game',
    publisher: 'Wube Software',
    datePublished: '2020-02-01',
    rating: 9,
    category: 'Simulation',
  },
  {
    id: 2,
    name: 'Terraria',
    description: 'A 2D adventure game',
    publisher: 'Re-Logic',
    datePublished: '2011-05-16',
    rating: 8,
    category: 'Adventure',
  },
  {
    id: 3,
    name: "Baldur's Gate 3",
    description: "A D&D inspired RPG",
    publisher: 'Larian Studios',
    datePublished: '2023-08-03',
    rating: 9.5,
    category: 'RPG',
  },
  {
    id: 4,
    name: 'Minecraft',
    description: 'Block building and survival',
    publisher: 'Mojang',
    datePublished: '2009-05-17',
    rating: 8,
    category: 'Sandbox',
  },
  {
    id: 5,
    name: 'League of Legends',
    description: 'A MOBA game',
    publisher: 'Riot Games',
    datePublished: '2009-10-27',
    rating: 7,
    category: 'MOBA',
  },
  {
    id: 6,
    name: 'Stellaris',
    description: 'A grand strategy game',
    publisher: 'Paradox Interactive',
    datePublished: '2016-05-09',
    rating: 8,
    category: 'Strategy',
  },
];


beforeEach(() => {
  global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
    observe: jest.fn((element) => {
      // Immediately trigger callback for testing
      callback([{ isIntersecting: true, target: element }]);
    }),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  jest.clearAllMocks();
});

function renderMainWindow(overrides = {}) {
  return render(
    <OfflineContext.Provider value={mockContextValue}>
      <MainWindow
        games={dummyGames}
        allGames={dummyGames}
        totalGames={dummyGames.length}
        hasMore={false}
        isLoading={false}
        onLoadMore={jest.fn()}
        onNewEntry={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        searchTerm=""
        sortOption="name-asc"
        onSearchChange={jest.fn()}
        onSortChange={jest.fn()}
        {...overrides}
      />
    </OfflineContext.Provider>
  );
}

describe('Display all functionality', () => {
  test('Display all game entries.', async () => {
    await act(async () => {
      renderMainWindow();
    });
    
    expect(screen.getByText('Factorio')).toBeInTheDocument();
    expect(screen.getByText('Terraria')).toBeInTheDocument();
    expect(screen.getByText("Baldur's Gate 3")).toBeInTheDocument();
    expect(screen.getByText('Minecraft')).toBeInTheDocument();
    expect(screen.getByText('League of Legends')).toBeInTheDocument();
    expect(screen.getByText('Stellaris')).toBeInTheDocument();
  });
});

describe('Delete functionality', () => {
  test('calls onDelete callback for "Factorio" entry when delete button is clicked', async () => {
    const handleDelete = jest.fn();
    
    await act(async () => {
      renderMainWindow({ onDelete: handleDelete });
    });
    
    const gameEntry = screen.getByText('Factorio').closest('.game-entry');
    const deleteButton = within(gameEntry).getByRole('button', { name: /delete/i });
    
    act(() => {
      fireEvent.click(deleteButton);
    });
    
    expect(handleDelete).toHaveBeenCalledWith(dummyGames[0]);
  });
});

describe('Add functionality', () => {
  test('calls onNewEntry callback when New Entry button is clicked', async () => {
    const handleNewEntry = jest.fn();
    
    await act(async () => {
      renderMainWindow({ onNewEntry: handleNewEntry });
    });
    
    const newEntryButton = screen.getByRole('button', { name: /NewEntry/i });
    act(() => {
      fireEvent.click(newEntryButton);
    });
    
    expect(handleNewEntry).toHaveBeenCalled();
  });
});

describe('Update functionality', () => {
  test('calls onEdit callback when Edit button is clicked for an entry', async () => {
    const handleEdit = jest.fn();
    
    await act(async () => {
      renderMainWindow({ onEdit: handleEdit });
    });
    
    const gameEntry = screen.getByText('Factorio').closest('.game-entry');
    const editButton = within(gameEntry).getByRole('button', { name: /edit/i });
    
    act(() => {
      fireEvent.click(editButton);
    });

    expect(handleEdit).toHaveBeenCalledWith(dummyGames[0]);
  });
});