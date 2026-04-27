import type { Habit } from "@/types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
    const completions = habit.completions;
    const dateExist = completions.includes(date);

    let updatedCompletions: string[];

    if (dateExist) {
        // remove date
         updatedCompletions = completions.filter(d => d !== date);
    } else {
        // add date
         updatedCompletions = [...completions, date];
    }
    
    return { ...habit, completions: updatedCompletions };
}