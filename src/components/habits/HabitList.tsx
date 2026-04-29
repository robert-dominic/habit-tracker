'use client'

import HabitCard from '@/components/habits/HabitCard'
import type { Habit } from '@/types/habit'

type HabitListProps = {
  habits: Habit[]
  pendingDeleteId: string | null
  today: string
  onDeleteClick: (habitId: string) => void
  onDeleteConfirm: (habitId: string) => void
  onEdit: (habit: Habit) => void
  onToggleCompletion: (habit: Habit) => void
}

export default function HabitList({
  habits,
  pendingDeleteId,
  today,
  onDeleteClick,
  onDeleteConfirm,
  onEdit,
  onToggleCompletion,
}: HabitListProps) {
  return (
    <div className="grid gap-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          isConfirmingDelete={pendingDeleteId === habit.id}
          today={today}
          onDeleteClick={onDeleteClick}
          onDeleteConfirm={onDeleteConfirm}
          onEdit={onEdit}
          onToggleCompletion={onToggleCompletion}
        />
      ))}
    </div>
  )
}
