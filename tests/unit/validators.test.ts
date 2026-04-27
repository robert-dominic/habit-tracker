import { validateHabitName } from "@/lib/validators";

describe('validateHabitName', () => {
   // first test - error if empty
   it('returns an error when habit name is empty', () => {
     const result = validateHabitName('')
     expect(result).toEqual({ valid: false, value: '', error: 'Habit name is required' })
   });

   // second test - exceeds 60 Characters 
   it ('returns an error when habit name exceeds 60 characters', () => {
     const result = validateHabitName('a'.repeat(61))
     expect(result).toEqual({ valid: false, value: '', error: 'Habit name must be 60 characters or fewer' })
   });

   // third test - returns trimmed value if valid
   it ('returns a trimmed value when habit name is valid', () => {
     const result = validateHabitName('  Drink Water  ')
     expect(result).toEqual({valid: true, value: 'Drink Water', error: null })
   });
});