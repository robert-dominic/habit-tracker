import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import DashboardPage from '@/app/dashboard/page'
import { HABITS_KEY, SESSION_KEY } from '@/lib/constants'
import type { Habit } from '@/types/habit'

const push = vi.fn()
const replace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    replace,
  }),
}))

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function seedSession() {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      userId: 'user-1',
      email: 'user@example.com',
    }),
  )
}

function seedHabits(habits: Habit[]) {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits))
}

async function renderDashboard() {
  render(<DashboardPage />)
  await screen.findByTestId('dashboard-page')
}

describe('habit form', () => {
  beforeEach(() => {
    localStorage.clear()
    push.mockReset()
    replace.mockReset()
    seedSession()
  })

  it('shows a validation error when habit name is empty', async () => {
    const user = userEvent.setup()

    await renderDashboard()

    await user.click(screen.getByTestId('create-habit-button'))
    await user.click(screen.getByTestId('habit-save-button'))

    expect(screen.getByRole('alert')).toHaveTextContent('Habit name is required')
  })

  it('creates a new habit and renders it in the list', async () => {
    const user = userEvent.setup()

    await renderDashboard()

    await user.click(screen.getByTestId('create-habit-button'))
    await user.type(screen.getByTestId('habit-name-input'), 'Drink Water')
    await user.type(
      screen.getByTestId('habit-description-input'),
      'Finish a bottle before noon',
    )
    await user.click(screen.getByTestId('habit-save-button'))

    expect(await screen.findByTestId('habit-card-drink-water')).toBeInTheDocument()

    const habits = JSON.parse(localStorage.getItem(HABITS_KEY) ?? '[]')
    expect(habits).toHaveLength(1)
    expect(habits[0]).toMatchObject({
      userId: 'user-1',
      name: 'Drink Water',
      description: 'Finish a bottle before noon',
      frequency: 'daily',
    })
  })

  it('edits an existing habit and preserves immutable fields', async () => {
    const user = userEvent.setup()
    const existingHabit: Habit = {
      id: 'habit-1',
      userId: 'user-1',
      name: 'Drink Water',
      description: 'Old description',
      frequency: 'daily',
      createdAt: '2026-04-28T00:00:00.000Z',
      completions: ['2026-04-27'],
    }

    seedHabits([existingHabit])

    await renderDashboard()

    await user.click(screen.getByTestId('habit-edit-drink-water'))
    await user.clear(screen.getByTestId('habit-name-input'))
    await user.type(screen.getByTestId('habit-name-input'), 'Read Books')
    await user.clear(screen.getByTestId('habit-description-input'))
    await user.type(
      screen.getByTestId('habit-description-input'),
      'Read ten pages',
    )
    await user.click(screen.getByTestId('habit-save-button'))

    expect(await screen.findByTestId('habit-card-read-books')).toBeInTheDocument()

    const habits = JSON.parse(localStorage.getItem(HABITS_KEY) ?? '[]')
    expect(habits[0]).toMatchObject({
      id: 'habit-1',
      userId: 'user-1',
      name: 'Read Books',
      description: 'Read ten pages',
      frequency: 'daily',
      createdAt: '2026-04-28T00:00:00.000Z',
      completions: ['2026-04-27'],
    })
  })

  it('deletes a habit only after explicit confirmation', async () => {
    const user = userEvent.setup()
    const existingHabit: Habit = {
      id: 'habit-1',
      userId: 'user-1',
      name: 'Drink Water',
      description: '',
      frequency: 'daily',
      createdAt: '2026-04-28T00:00:00.000Z',
      completions: [],
    }

    seedHabits([existingHabit])

    await renderDashboard()

    await user.click(screen.getByTestId('habit-delete-drink-water'))

    expect(screen.getByTestId('confirm-delete-button')).toBeInTheDocument()
    expect(screen.getByTestId('habit-card-drink-water')).toBeInTheDocument()

    let habits = JSON.parse(localStorage.getItem(HABITS_KEY) ?? '[]')
    expect(habits).toHaveLength(1)

    await user.click(screen.getByTestId('confirm-delete-button'))

    await waitFor(() => {
      expect(screen.queryByTestId('habit-card-drink-water')).not.toBeInTheDocument()
    })

    habits = JSON.parse(localStorage.getItem(HABITS_KEY) ?? '[]')
    expect(habits).toHaveLength(0)
  })

  it('toggles completion and updates the streak display', async () => {
    const user = userEvent.setup()
    const today = getToday()
    const existingHabit: Habit = {
      id: 'habit-1',
      userId: 'user-1',
      name: 'Drink Water',
      description: '',
      frequency: 'daily',
      createdAt: '2026-04-28T00:00:00.000Z',
      completions: [],
    }

    seedHabits([existingHabit])

    await renderDashboard()

    expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent(
      '0 days streak',
    )

    await user.click(screen.getByTestId('habit-complete-drink-water'))

    await waitFor(() => {
      expect(screen.getByTestId('habit-streak-drink-water')).toHaveTextContent(
        '1 day streak',
      )
    })

    const habits = JSON.parse(localStorage.getItem(HABITS_KEY) ?? '[]')
    expect(habits[0].completions).toEqual([today])
  })
})
