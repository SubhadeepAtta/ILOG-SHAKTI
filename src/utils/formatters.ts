export function formatWeightKg(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} Tonnes`;
  }
  return `${kg.toLocaleString()} kg`;
}

export function formatMilitaryDate(date: Date = new Date()): string {
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const day = String(date.getUTCDate()).padStart(2, '0');
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day}-${month}-${year}`;
}

export function formatZuluTime(date: Date = new Date()): string {
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${hours}${minutes}Z`;
}

export function formatISTTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }) + ' IST';
}

export function getDosStatusBadge(days: number): {
  label: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
} {
  if (days <= 7) {
    return {
      label: 'CRITICAL DEPLETION',
      bgClass: 'bg-red-950/70',
      textClass: 'text-red-300',
      borderClass: 'border-red-700/60'
    };
  }
  if (days <= 14) {
    return {
      label: 'WARNING: LOW DOS',
      bgClass: 'bg-amber-950/60',
      textClass: 'text-amber-300',
      borderClass: 'border-amber-700/50'
    };
  }
  return {
    label: 'SUFFICIENT RESERVE',
    bgClass: 'bg-drab-900/80',
    textClass: 'text-drab-300',
    borderClass: 'border-drab-700/40'
  };
}
