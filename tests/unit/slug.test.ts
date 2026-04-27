import { getHabitSlug } from "@/lib/slug";

describe('getHabitSlug', () => {
  // first test - hyphenated slug
  it('returns lowercase hyphenated slug for a basic habit name', () => {
    const result = getHabitSlug('Drink Water')
    expect(result).toBe('drink-water')
  });
  
  // second test - trimmed slug
  it('trims outer spaces and collapses repeated internal spaces', () => {
    const result = getHabitSlug(' Finish my  tasks')
    expect(result).toBe('finish-my-tasks')
  });

  // third test - remove non-alphanumeric chars except hyphens
  it('removes non alphanumeric characters except hyphens', () => {
    const result = getHabitSlug('$Do forty push-ups @')
    expect(result).toBe('do-forty-push-ups')
  });
});