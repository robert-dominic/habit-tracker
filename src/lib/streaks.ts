export function calculateCurrentStreak(completions: string[], today?: string): number{
    const todayDate = today ?? new Date().toISOString().split('T')[0];
    const unique = [...new Set(completions)].sort();
    const completed = unique.includes(todayDate)

    if (!completed) {
      return 0;
    }

    let streak = 0;
    let current = new Date(todayDate);

    while (unique.includes(current.toISOString().split('T')[0])) {
        streak++;
        current.setDate(current.getDate() - 1);
    }

    return streak;
}