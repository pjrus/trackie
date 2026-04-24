export function daysUntilDeadline(dateString) {
  if (!dateString) return null;
  const deadline = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadline.setHours(0, 0, 0, 0);
  const diff = deadline - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(dateString) {
  const days = daysUntilDeadline(dateString);
  return days !== null && days < 0;
}

export function dueThisWeek(dateString) {
  const days = daysUntilDeadline(dateString);
  return days !== null && days >= 0 && days <= 7;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDaysRemainingText(dateString) {
  const days = daysUntilDeadline(dateString);
  if (days === null) return '';
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days`;
}
