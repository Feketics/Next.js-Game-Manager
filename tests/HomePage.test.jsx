import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import HomePage from '../app/page';
import { act } from '@testing-library/react';

jest.mock('../app/components/YearChart', () => () => <div data-testid="year-chart" />);
jest.mock('../app/components/RatingChart', () => () => <div data-testid="rating-chart" />);
jest.mock('../app/components/CategoryChart', () => () => <div data-testid="category-chart" />);


describe('Display all functionality', () => {
  test('Display all game entries.', async () => {
    await act( async () => render(<HomePage />));
    
    expect(screen.getByText('Factorio')).toBeInTheDocument();
    expect(screen.getByText('Terraria')).toBeInTheDocument();
    expect(screen.getByText("Baldur's Gate 3")).toBeInTheDocument();
    expect(screen.getByText('Minecraft')).toBeInTheDocument();
    expect(screen.getByText('League of Legends')).toBeInTheDocument();
    expect(screen.getByText('Stellaris')).toBeInTheDocument();
  });
});

describe('Delete functionality', () => {
  test('removes the "Factorio" entry after confirming deletion', async () => {
    await act( async () => render(<HomePage />));
    
    const gameEntry = screen.getByText('Factorio').closest('.game-entry');
    expect(gameEntry).toBeInTheDocument();
    
    const deleteButton = within(gameEntry).getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    
    act(() => {
      fireEvent.click(deleteButton);
    });
    
    const yesButton = screen.getByRole('button', { name: /yes/i });
    act(() => {
      fireEvent.click(yesButton);
    });
    
    expect(screen.queryByText('Factorio')).not.toBeInTheDocument();
  });
});

describe('Add functionality', () => {
  test('adds a new game entry.', async () => {
    await act( async () => render(<HomePage />));
    
    expect(screen.queryByText('New Game Title')).not.toBeInTheDocument();

    const newEntryButton = screen.getByRole('button', { name: /newentry/i });
    act(() => {
      fireEvent.click(newEntryButton);
    });
    
    const nameInput = screen.getByLabelText(/game name/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const publisherInput = screen.getByLabelText(/publisher/i);
    const dateInput = screen.getByLabelText(/date published/i);
    const ratingInput = screen.getByLabelText(/rating/i);
    const categoryInput = screen.getByLabelText(/category/i);
    
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'New Game Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'asd' } });
      fireEvent.change(publisherInput, { target: { value: 'asd' } });
      fireEvent.change(dateInput, { target: { value: '2022-01-01' } });
      fireEvent.change(ratingInput, { target: { value: '8' } });
      fireEvent.change(categoryInput, { target: { value: 'asd' } });
    });
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    act(() => {
      fireEvent.click(doneButton);
    });
    
    expect(screen.getByText('New Game Title')).toBeInTheDocument();
  });
});

describe('Update functionality', () => {
  test('Updates a game entry.', async () => {
    await act( async () => render(<HomePage />));
    
    const gameEntry = screen.getByText('Factorio').closest('.game-entry');

    expect(screen.getByText('Factorio')).toBeInTheDocument();
    expect(screen.queryByText('Factorio2')).not.toBeInTheDocument();

    const editButton = within(gameEntry).getByRole('button', { name: /edit/i });
    expect(editButton).toBeInTheDocument();
    act(() => {
      fireEvent.click(editButton);
    });
    
    const nameInput = screen.getByLabelText(/game name/i);
    
    act(() => {
      fireEvent.change(nameInput, { target: { value: 'Factorio2' } });
    });
    
    const doneButton = screen.getByRole('button', { name: /done/i });
    act(() => {
      fireEvent.click(doneButton);
    });
    
    expect(screen.getByText('Factorio2')).toBeInTheDocument();
    expect(screen.queryByText('Factorio')).not.toBeInTheDocument();
  });
});