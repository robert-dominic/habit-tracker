export function getHabitSlug(name: string): string {
  const slug = name.toLowerCase()
              .trim()
              .replace(/\s+/g, '-')
              .replace(/[^a-z0-9-]/g, '')
              .replace(/^-+|-+$/g, '')
  return slug;
}