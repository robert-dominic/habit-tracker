import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

const USERS_KEY = 'habit-tracker-users'
const SESSION_KEY = 'habit-tracker-session'
const HABITS_KEY = 'habit-tracker-habits'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

async function seedStorage(
  page: Page,
  values: {
    users?: unknown[]
    session?: unknown
    habits?: unknown[]
  },
) {
  await page.addInitScript(
    ({ usersKey, sessionKey, habitsKey, users, session, habits }) => {
      window.localStorage.clear()

      if (users) {
        window.localStorage.setItem(usersKey, JSON.stringify(users))
      }

      if (session) {
        window.localStorage.setItem(sessionKey, JSON.stringify(session))
      }

      if (habits) {
        window.localStorage.setItem(habitsKey, JSON.stringify(habits))
      }
    },
    {
      usersKey: USERS_KEY,
      sessionKey: SESSION_KEY,
      habitsKey: HABITS_KEY,
      users: values.users,
      session: values.session,
      habits: values.habits,
    },
  )
}

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({
    page,
  }) => {
    await page.goto('/')

    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('redirects authenticated users from / to /dashboard', async ({ page }) => {
    await seedStorage(page, {
      session: {
        userId: 'user-1',
        email: 'user@example.com',
      },
    })

    await page.goto('/')

    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard$/)
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL(/\/login$/)
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup')

    await page.getByTestId('auth-signup-email').fill('user@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    await seedStorage(page, {
      users: [
        {
          id: 'user-1',
          email: 'user@example.com',
          password: 'password123',
          createdAt: '2026-04-28T00:00:00.000Z',
        },
      ],
      habits: [
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'Drink Water',
          description: '',
          frequency: 'daily',
          createdAt: '2026-04-28T00:00:00.000Z',
          completions: [],
        },
        {
          id: 'habit-2',
          userId: 'user-2',
          name: 'Read Books',
          description: '',
          frequency: 'daily',
          createdAt: '2026-04-28T00:00:00.000Z',
          completions: [],
        },
      ],
    })

    await page.goto('/login')
    await page.getByTestId('auth-login-email').fill('user@example.com')
    await page.getByTestId('auth-login-password').fill('password123')
    await page.getByTestId('auth-login-submit').click()

    await expect(page).toHaveURL(/\/dashboard$/)
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
    await expect(page.getByTestId('habit-card-read-books')).toHaveCount(0)
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    await seedStorage(page, {
      session: {
        userId: 'user-1',
        email: 'user@example.com',
      },
    })

    await page.goto('/dashboard')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page
      .getByTestId('habit-description-input')
      .fill('Finish a bottle before noon')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({ page }) => {
    await seedStorage(page, {
      session: {
        userId: 'user-1',
        email: 'user@example.com',
      },
      habits: [
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'Drink Water',
          description: '',
          frequency: 'daily',
          createdAt: '2026-04-28T00:00:00.000Z',
          completions: [],
        },
      ],
    })

    await page.goto('/dashboard')
    await page.getByTestId('habit-complete-drink-water').click()

    await expect(page.getByTestId('habit-streak-drink-water')).toHaveText(
      '1 day streak',
    )
  })

  test('persists session and habits after page reload', async ({ page }) => {
    await seedStorage(page, {
      session: {
        userId: 'user-1',
        email: 'user@example.com',
      },
    })

    await page.goto('/dashboard')
    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-save-button').click()
    await page.reload()

    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await seedStorage(page, {
      session: {
        userId: 'user-1',
        email: 'user@example.com',
      },
    })

    await page.goto('/dashboard')
    await page.getByTestId('auth-logout-button').click()

    await expect(page).toHaveURL(/\/login$/)
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({
    page,
  }) => {
    const today = getToday()

    await seedStorage(page, {
      session: {
        userId: 'user-1',
        email: 'user@example.com',
      },
      habits: [
        {
          id: 'habit-1',
          userId: 'user-1',
          name: 'Drink Water',
          description: '',
          frequency: 'daily',
          createdAt: '2026-04-28T00:00:00.000Z',
          completions: [today],
        },
      ],
    })

    await page.goto('/dashboard')
    await expect(page.getByTestId('dashboard-page')).toBeVisible()

    await page.context().setOffline(true)
    await page.goto('/dashboard')

    await expect(page.getByTestId('dashboard-page')).toBeVisible()
  })
})
