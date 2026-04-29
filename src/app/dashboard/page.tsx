'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Plus, Book, Flame, Calendar } from 'lucide-react'

import HabitForm from '@/components/habits/HabitForm'
import HabitList from '@/components/habits/HabitList'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import { getCurrentSession, logout } from '@/lib/auth'
import { toggleHabitCompletion } from '@/lib/habits'
import { getHabits, saveHabits } from '@/lib/storage'
import type { Session } from '@/types/auth'
import type { Habit } from '@/types/habit'

type HabitFormValues = {
  name: string
  description: string
  frequency: 'daily'
}

const TODAY = new Date().toISOString().split('T')[0]

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [allHabits, setAllHabits] = useState<Habit[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isFormClosing, setIsFormClosing] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [isDeleteClosing, setIsDeleteClosing] = useState(false)

  useEffect(() => {
    const currentSession = getCurrentSession()

    if (!currentSession) {
      return
    }

    setSession(currentSession)
    setAllHabits(getHabits())
  }, [])

  const userHabits = session
    ? allHabits.filter((habit) => habit.userId === session.userId)
    : []
  const completedTodayCount = userHabits.filter((habit) =>
    habit.completions.includes(TODAY),
  ).length
  const activeDeleteHabit =
    pendingDeleteId === null
      ? null
      : userHabits.find((habit) => habit.id === pendingDeleteId) ?? null

  function persistHabits(updatedHabits: Habit[]) {
    setAllHabits(updatedHabits)
    saveHabits(updatedHabits)
  }

  function handleCreateHabitClick() {
    setEditingHabit(null)
    setPendingDeleteId(null)
    setIsFormClosing(false)
    setIsFormOpen(true)
  }

  function handleEditHabit(habit: Habit) {
    setEditingHabit(habit)
    setPendingDeleteId(null)
    setIsFormClosing(false)
    setIsFormOpen(true)
  }

  function closeFormModal() {
    setIsFormClosing(true)
    setTimeout(() => {
      setIsFormOpen(false)
      setIsFormClosing(false)
      setEditingHabit(null)
    }, 200)
  }

  function handleFormCancel() {
    closeFormModal()
  }

  function closeDeleteModal() {
    setIsDeleteClosing(true)
    setTimeout(() => {
      setPendingDeleteId(null)
      setIsDeleteClosing(false)
    }, 200)
  }

  function handleDeleteModalClose() {
    closeDeleteModal()
  }

  function handleFormSubmit(values: HabitFormValues) {
    if (!session) {
      return
    }

    if (editingHabit) {
      const updatedHabits = allHabits.map((habit) =>
        habit.id === editingHabit.id
          ? {
            ...habit,
            name: values.name,
            description: values.description,
            frequency: values.frequency,
          }
          : habit,
      )

      persistHabits(updatedHabits)
      closeFormModal()
      return
    }

    const newHabit: Habit = {
      id: crypto.randomUUID(),
      userId: session.userId,
      name: values.name,
      description: values.description,
      frequency: 'daily',
      createdAt: new Date().toISOString(),
      completions: [],
    }

    persistHabits([...allHabits, newHabit])
    closeFormModal()
  }

  function handleDeleteClick(habitId: string) {
    if (pendingDeleteId === habitId) {
      closeDeleteModal()
    } else {
      setIsDeleteClosing(false)
      setPendingDeleteId(habitId)
    }
  }

  function handleDeleteConfirm(habitId: string) {
    const updatedHabits = allHabits.filter((habit) => habit.id !== habitId)
    persistHabits(updatedHabits)

    setIsDeleteClosing(true)
    setTimeout(() => {
      setPendingDeleteId(null)
      setIsDeleteClosing(false)

      if (editingHabit?.id === habitId) {
        setIsFormOpen(false)
        setEditingHabit(null)
        setIsFormClosing(false)
      }
    }, 200)
  }

  function handleToggleCompletion(habit: Habit) {
    const updatedHabits = allHabits.map((currentHabit) =>
      currentHabit.id === habit.id
        ? toggleHabitCompletion(currentHabit, TODAY)
        : currentHabit,
    )

    persistHabits(updatedHabits)
  }

  function handleLogout() {
    logout()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <main
        data-testid="dashboard-page"
        className="min-h-screen bg-background"
      >
        <header className="border-b border-border bg-surface px-4 py-4 sm:px-8">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="cursor-pointer flex h-11 w-11 overflow-hidden rounded-lg items-center justify-center bg-surface border border-border p-1"
                onClick={() => window.location.reload()}
              >
                <img src="/icons/icon-192.png" alt="App Icon" className="h-full w-full object-contain" />
              </button>
              <div>
                <h1 className="text-sm md:text-base font-bold text-foreground">Habit Tracker</h1>
              </div>
            </div>
            <button
              type="button"
              data-testid="auth-logout-button"
              onClick={handleLogout}
              className="cursor-pointer flex h-10 items-center justify-center gap-2 px-3 sm:px-4 text-sm font-bold border border-border text-muted hover:text-foreground hover:bg-surface-muted rounded-md transition-all duration-200 ease-in-out active:scale-95 focus:outline-none"
            >
              <LogOut className="w-5 h-5 sm:mr-1" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </header>

        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8 pb-32 sm:pb-24">
          <section>
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Overview
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-muted">A quick look at how you are doing today.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-border bg-surface px-6 py-8 rounded-md">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-primary" />
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">Total habits</p>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-foreground">{userHabits.length}</p>
                </div>
              </div>
              <div className="border border-border bg-surface px-6 py-8 rounded-md">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500/80" />
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">Completed today</p>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl sm:text-4xl font-bold text-foreground">{completedTodayCount}</p>
                </div>
              </div>
              <div className="border border-border bg-surface px-6 py-8 text-right rounded-md">
                <div className="flex items-center justify-end gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary">Today is</p>
                </div>
                <div className="mt-4">
                  <p className="text-lg sm:text-xl font-bold text-foreground">
                    {new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date())}
                  </p>
                  <p className="text-xs sm:text-sm text-muted">
                    {new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date())}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-end justify-between gap-4 border-b border-border pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                Daily list
              </h2>

              <button
                type="button"
                data-testid="create-habit-button"
                onClick={handleCreateHabitClick}
                className="cursor-pointer hidden sm:inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-primary/90 active:scale-[0.98] focus:outline-none"
              >
                Create habit
              </button>
            </div>

            <div className="mt-5">
              {userHabits.length === 0 ? (
                <div
                  data-testid="empty-state"
                  className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-surface-muted py-16 text-center"
                >
                  <p className="text-xl font-bold text-foreground">No habits yet</p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
                    Your tracker is waiting. Add your first habit to begin building a positive daily rhythm.
                  </p>
                  <button
                    type="button"
                    onClick={handleCreateHabitClick}
                    className="cursor-pointer mt-6 inline-flex items-center justify-center rounded-md border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-200 ease-in-out hover:bg-primary/10 active:scale-[0.98]"
                  >
                    Create first habit
                  </button>
                </div>
              ) : (
                <HabitList
                  habits={userHabits}
                  pendingDeleteId={pendingDeleteId}
                  today={TODAY}
                  onDeleteClick={handleDeleteClick}
                  onDeleteConfirm={handleDeleteConfirm}
                  onEdit={handleEditHabit}
                  onToggleCompletion={handleToggleCompletion}
                />
              )}
            </div>
          </section>
        </div>

        <div className="fixed bottom-6 right-6 z-20 flex w-full justify-end sm:hidden transition-transform duration-300">
          <button
            type="button"
            onClick={handleCreateHabitClick}
            className="cursor-pointer flex h-14 w-14 items-center justify-center rounded-md bg-primary text-white shadow-lg transition-all duration-200 ease-in-out hover:bg-primary/90 active:scale-90 focus:outline-none"
            aria-label="Create habit"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        {isFormOpen ? (
          <div className={`fixed inset-0 z-30 flex items-center justify-center bg-foreground/60 p-4 sm:p-6 ${isFormClosing ? 'animate-overlay-out' : 'animate-overlay-in'}`}>
            <div className={`w-full max-w-lg shadow-xl ${isFormClosing ? 'animate-modal-out' : 'animate-modal-in'}`}>
              <HabitForm
                habit={editingHabit}
                onCancel={handleFormCancel}
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>
        ) : null}

        {activeDeleteHabit ? (
          <div className={`fixed inset-0 z-30 flex items-center justify-center bg-foreground/60 p-4 sm:p-6 ${isDeleteClosing ? 'animate-overlay-out' : 'animate-overlay-in'}`}>
            <div className={`w-full max-w-md bg-white p-8 shadow-xl rounded-md border border-border ${isDeleteClosing ? 'animate-modal-out' : 'animate-modal-in'}`}>
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-red-500">
                Warning
              </p>
              <h3 className="mt-2 text-xl sm:text-2xl font-bold text-foreground">
                Remove {activeDeleteHabit.name}?
              </h3>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-muted">
                This habit and its entire history will disappear from your tracker immediately. This action cannot be undone.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse sm:justify-start">
                <button
                  type="button"
                  data-testid="confirm-delete-button"
                  onClick={() => handleDeleteConfirm(activeDeleteHabit.id)}
                  className="cursor-pointer inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-red-700 active:scale-[0.98] focus:outline-none focus:ring-0"
                >
                  Confirm delete
                </button>
                <button
                  type="button"
                  onClick={handleDeleteModalClose}
                  className="cursor-pointer inline-flex w-full sm:w-auto items-center justify-center rounded-md border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition-all duration-200 ease-in-out hover:bg-surface-muted active:scale-[0.98] focus:outline-none focus:ring-0"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </ProtectedRoute>
  )
}
