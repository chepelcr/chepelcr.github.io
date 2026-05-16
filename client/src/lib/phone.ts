// Single source of truth for phone formatting.
// Input is the raw E.164-ish digits with leading +, e.g. "+50664839625".

export function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('506') && digits.length === 11) {
    return `+506 ${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  return raw;
}

export function formatPhoneHref(raw: string): string {
  return `tel:${raw.replace(/[^\d+]/g, '')}`;
}
