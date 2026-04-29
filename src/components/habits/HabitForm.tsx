'use client'

import type { SubmitEventHandler } from 'react'
import { useEffect, useState } from 'react'

import { validateHabitName } from '@/lib/validators'
import type { Habit } from '@/types/habit'

type HabitFormValues = {
  name: string
  description: string
  frequency: 'daily'
}

type HabitFormProps = {
  habit?: Habit | null
  onCancel?: () => void
  onSubmit: (values: HabitFormValues) => void
}

export default function HabitForm({
  habit,
  onCancel,
  onSubmit,
}: HabitFormProps) {
  const [name, setName] = useState(habit?.name ?? '')
  const [description, setDescription] = useState(habit?.description ?? '')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setName(habit?.name ?? '')
    setDescription(habit?.description ?? '')
    setError(null)
  }, [habit])

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const validation = validateHabitName(name)

    if (!validation.valid) {
      setError(validation.error)
      return
    }

    setError(null)

    onSubmit({
      name: validation.value,
      description: description.trim(),
      frequency: 'daily',
    })
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      className="space-y-6 bg-surface rounded-md p-6 sm:p-8"
    >
      <div className="space-y-2 border-b border-border pb-4">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">
          {habit ? 'Edit habit' : 'New habit'}
        </p>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {habit ? 'Update details' : 'Add a new rhythm'}
        </h3>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="habit-name"
          className="text-sm font-semibold text-foreground"
        >
          Habit name
        </label>
        <input
          id="habit-name"
          data-testid="habit-name-input"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-0"
          placeholder="Drink Water"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="habit-description"
          className="text-sm font-semibold text-foreground"
        >
          Description
        </label>
        <textarea
          id="habit-description"
          data-testid="habit-description-input"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-0"
          placeholder="Add a short note for this habit"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="habit-frequency"
          className="text-sm font-semibold text-foreground"
        >
          Frequency
        </label>
        <select
          id="habit-frequency"
          data-testid="habit-frequency-select"
          value="daily"
          onChange={() => undefined}
          className="w-full rounded-md border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-0"
        >
          <option value="daily">Daily</option>
        </select>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-md border-l-4 border-red-500 bg-red-50 p-4 text-sm font-medium text-red-800"
        >
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 pt-4 sm:flex-row-reverse sm:justify-start">
        <button
          type="submit"
          data-testid="habit-save-button"
          className="cursor-pointer inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-primary/90 focus:outline-none focus:ring-0 active:scale-[0.98] w-full sm:w-auto"
        >
          {habit ? 'Save changes' : 'Save habit'}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer inline-flex items-center justify-center rounded-md border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 ease-in-out hover:bg-surface-muted active:scale-[0.98] w-full sm:w-auto"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  )
}
