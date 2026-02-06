export function isValidTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 100;
}

export function isValidDuration(duration: number): boolean {
  return duration > 0 && duration <= 3600; // Max 1 hour
}

export function isValidFileSize(size: number): boolean {
  return size > 0 && size <= 50 * 1024 * 1024; // Max 50MB
}

export function sanitizeFilename(filename: string): string {
  return filename
    .trim()
    .replace(/[^a-z0-9\s\-_]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}
