import { calculateCurrentStreak } from "@/lib/streaks";

describe('calculateCurrentStreak', () => {
    // first test - 0 when completions is empty
    it ('returns 0 when completions is empty', () => {
      const result = calculateCurrentStreak([]);
      expect(result).toBe(0);
    });

    // second test - 0 when today !completed
    it ('returns 0 when today is not completed', () => {
       const result = calculateCurrentStreak(["2026-04-26"], "2026-04-27")
       expect(result).toBe(0)
    });

    // third test - returns streak for consecutive completed days 
    it ('returns the correct streak for consecutive completed days', () => {
        const result = calculateCurrentStreak(["2026-04-25", "2026-04-26", "2026-04-27"], "2026-04-27")
        expect(result).toBe(3)
    });

    // fourth test - ignores duplicate completions dates 
    it ('ignores duplicate completion dates', () => {
        const result = calculateCurrentStreak(["2026-04-26", "2026-04-26", "2026-04-27"], "2026-04-27")
        expect(result).toBe(2)
    });

    // five test - breaks streaks 
    it ('breaks the streak when a calendar day is missing', () => {
        const result = calculateCurrentStreak(["2026-04-25"], "2026-04-27")
        expect(result).toBe(0)
    });
});