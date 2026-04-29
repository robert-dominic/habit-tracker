'use client'

import { calculateCurrentStreak } from '@/lib/streaks'
import { getHabitSlug } from '@/lib/slug'
import type { Habit } from '@/types/habit'
import { Check, Edit2, Trash2, CircleDashed, Flame } from 'lucide-react'

type HabitCardProps = {
  habit: Habit
  isConfirmingDelete: boolean
  today: string
  onDeleteClick: (habitId: string) => void
  onDeleteConfirm: (habitId: string) => void
  onEdit: (habit: Habit) => void
  onToggleCompletion: (habit: Habit) => void
}

export default function HabitCard({
  habit,
  today,
  onDeleteClick,
  onEdit,
  onToggleCompletion,
}: HabitCardProps) {
  const slug = getHabitSlug(habit.name)
  const currentStreak = calculateCurrentStreak(habit.completions, today)
  const isCompletedToday = habit.completions.includes(today)

  return (
    <article
      data-testid={`habit-card-${slug}`}
      className="border border-border bg-surface rounded-md px-5 py-6 sm:px-8 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-2 border-b border-border pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {habit.name}
                </h3>
                {isCompletedToday ? (
                  <span className="inline-flex rounded-md bg-green-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Done
                  </span>
                ) : (
                  <span className="inline-flex rounded-md bg-gray-100 text-gray-500 border border-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Pending
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-muted">
                {habit.description || 'No description added yet.'}
              </p>
            </div>

            <span
              data-testid={`habit-streak-${slug}`}
              className="inline-flex shrink-0 items-center rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-primary"
            >
              {currentStreak >= 1 && <Flame className="w-3.5 h-3.5 mr-1.5 text-orange-500 fill-orange-500/80" />}
              {currentStreak} day{currentStreak === 1 ? '' : 's'} streak
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            data-testid={`habit-complete-${slug}`}
            onClick={() => onToggleCompletion(habit)}
            className={`cursor-pointer inline-flex items-center justify-center p-3 sm:px-4 sm:py-2 text-sm font-semibold transition-all duration-200 ease-in-out active:scale-95 focus:outline-none rounded-md w-12 sm:w-auto h-12 sm:h-auto ${isCompletedToday
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'border border-primary text-primary hover:bg-primary/10'
              }`}
          >
            {isCompletedToday ? <Check className="w-5 h-5 sm:mr-2" /> : <CircleDashed className="w-5 h-5 sm:mr-2" />}
            <span className="hidden sm:inline">{isCompletedToday ? 'Done' : 'Mark as read'}</span>
          </button>

          <button
            type="button"
            data-testid={`habit-edit-${slug}`}
            onClick={() => onEdit(habit)}
            className="cursor-pointer inline-flex items-center justify-center border border-border bg-surface p-3 sm:px-4 sm:py-2 text-sm font-semibold text-foreground transition-all duration-200 ease-in-out active:scale-95 hover:bg-surface-muted focus:outline-none rounded-md w-12 sm:w-auto h-12 sm:h-auto"
          >
            <Edit2 className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            type="button"
            data-testid={`habit-delete-${slug}`}
            onClick={() => onDeleteClick(habit.id)}
            className="cursor-pointer inline-flex items-center justify-center border border-red-200 bg-red-50 p-3 sm:px-4 sm:py-2 text-sm font-semibold text-red-600 transition-all duration-200 ease-in-out active:scale-95 hover:bg-red-100 focus:outline-none rounded-md ml-auto sm:ml-0 w-12 sm:w-auto h-12 sm:h-auto"
          >
            <Trash2 className="w-5 h-5 sm:mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </article>
  )
}
