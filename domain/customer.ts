import { isRecord } from './cart';

export interface CustomerDetails {
  name: string;
  email: string;
  country: string;
  consent: boolean;
}
export type CustomerErrors = Partial<Record<keyof CustomerDetails, string>>;
export const customerCountries = [
  'Belgium',
  'France',
  'Germany',
  'Italy',
  'Netherlands',
  'Portugal',
  'Spain',
] as const;

export const createCustomer = (): CustomerDetails => ({
  name: '',
  email: '',
  country: '',
  consent: false,
});

// This is a supported unquoted address format, not a DNS or mailbox check.
function validEmail(raw: unknown): boolean {
  if (typeof raw !== 'string' || raw.length > 254) return false;
  const parts = raw.trim().split('@');
  if (parts.length !== 2) return false;
  const [local = '', domain = ''] = parts;
  if (
    local.length > 64 ||
    !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(
      local,
    )
  )
    return false;
  const labels = domain.split('.');
  return (
    labels.length >= 2 &&
    labels.every((label) =>
      /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label),
    ) &&
    /^[A-Za-z](?:[A-Za-z0-9-]*[A-Za-z0-9])$/.test(labels.at(-1) ?? '')
  );
}

export function validateCustomer(details: CustomerDetails): CustomerErrors {
  const value: Record<string, unknown> = isRecord(details) ? details : {};
  const name = typeof value.name === 'string' ? value.name.trim() : '';
  const country = typeof value.country === 'string' ? value.country.trim() : '';
  const errors: CustomerErrors = {};
  if (name.length < 2 || name.length > 100) {
    errors.name = 'Enter your name using 2 to 100 characters.';
  }
  if (!validEmail(value.email)) {
    errors.email = 'Enter an email such as alex@example.com.';
  }
  if (!customerCountries.some((option) => option === country)) {
    errors.country = 'Choose a country from the list.';
  }
  if (value.consent !== true) {
    errors.consent = 'Confirm that you understand this is a demo order.';
  }
  return errors;
}
