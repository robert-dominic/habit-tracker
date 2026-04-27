export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  //trim incoming value
  const trimmed = name.trim()

  // Empty input
  if (trimmed === '') {
    return { valid: false, value: '', error: 'Habit name is required' };
  }

  // input longer the 60 characters
  if (trimmed.length > 60) {
    return { valid: false, value: '', error: 'Habit name must be 60 characters or fewer' };
  }

  return {valid: true, value: trimmed, error: null };
}