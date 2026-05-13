const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const COMMON_DOMAIN_TYPOS = {
  'gamil.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotnail.com': 'hotmail.com',
  'iclod.com': 'icloud.com',
  'icloud.co': 'icloud.com',
  'icloud.con': 'icloud.com',
  'outllok.com': 'outlook.com',
  'outlok.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.con': 'yahoo.com',
};

export function validateEmailAddress(email) {
  const trimmedEmail = email.trim();
  const normalizedEmail = trimmedEmail.toLowerCase();

  if (!trimmedEmail) {
    return { isValid: false, reason: 'required' };
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return { isValid: false, reason: 'format' };
  }

  const [localPart, domain = ''] = normalizedEmail.split('@');

  if (
    !localPart ||
    !domain ||
    normalizedEmail.includes('..') ||
    domain.startsWith('.') ||
    domain.endsWith('.')
  ) {
    return { isValid: false, reason: 'format' };
  }

  const suggestedDomain = COMMON_DOMAIN_TYPOS[domain];

  if (suggestedDomain) {
    return {
      isValid: false,
      reason: 'typo',
      suggestion: `${localPart}@${suggestedDomain}`,
    };
  }

  return { isValid: true, normalizedEmail: trimmedEmail };
}
