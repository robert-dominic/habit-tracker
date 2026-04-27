import { toggleHabitCompletion } from "@/lib/habits";

import type { Habit } from "@/types/habit";

// Mock Habit object 
const mockHabit: Habit = {
    id: '1',
    userId: 'user1',
    name: 'Drink Water',
    description: 'Stay Hydrated',
    frequency: 'daily',
    createdAt: '2026-04-01',
    completions: [],
}

// Habit with completion date
const habitWithDate: Habit = {
    ...mockHabit,
    completions: ['2026-04-27', '']
}

// Habit with Duplcate dates
const habitWithDuplicate: Habit = {
  ...mockHabit,
  completions: ['2026-04-27', '2026-04-27']
}

describe('toggleHabitCompletion', () => {
    // first test - add completion date when empty
    it('adds a completion date when the date is not present', () => {
      const result = toggleHabitCompletion(mockHabit, '2026-04-27')
      expect(result.completions).toContain('2026-04-27')
    });

    // second test - remove date when it already exists
    it('removes a completion date when the date already exists', () => {
      const result = toggleHabitCompletion(habitWithDate, '2026-04-27')
      expect(result.completions).not.toContain('2026-04-27')
    });

    // third test - does not mutate original object
    it('does not mutate the original habit object', () => {
      toggleHabitCompletion(mockHabit, '2026-04-27')
      expect(mockHabit.completions).toHaveLength(0)
    });

    // fourth test - does not duplicate completions dates
    it('does not return duplicate completion dates', () => {
      const result = toggleHabitCompletion(habitWithDuplicate, '2026-04-26')
      expect(result.completions).toHaveLength(2)
    });
});