import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

import { validateContactForm, validateEmail } from '@/utils/validation';

/**
 * Property 4: Contact Form Validation Rejects Invalid Input
 *
 * For any contact form submission where email is empty, malformed, or message
 * is empty, the validation function SHALL return isValid: false with appropriate
 * error messages, and the form SHALL NOT be submitted.
 *
 * **Validates: Requirements 7.3**
 */

const NUM_RUNS = 100;

/* ------------------------------------------------------------------ */
/*  Arbitraries                                                       */
/* ------------------------------------------------------------------ */

/** Generates whitespace-only or empty strings. */
const blankStringArb = fc.constantFrom('', ' ', '  ', '\t', '\n', '  \t\n  ');

/** Generates non-empty strings (after trim). */
const nonEmptyStringArb = fc
  .string({ minLength: 1, maxLength: 80 })
  .filter((s) => s.trim().length > 0);

/** Generates a valid email address. */
const validEmailArb = fc
  .tuple(
    fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,9}$/),
    fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9]{0,5}$/),
    fc.stringMatching(/^[a-zA-Z]{2,4}$/),
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

/** Generates a malformed email (missing @, missing domain, spaces, etc.). */
const malformedEmailArb = fc.oneof(
  // No @ sign
  fc.stringMatching(/^[a-zA-Z0-9]{1,10}$/).map((s) => s),
  // Missing domain part
  fc.stringMatching(/^[a-zA-Z0-9]{1,10}$/).map((s) => `${s}@`),
  // Missing local part
  fc.stringMatching(/^[a-zA-Z0-9]{1,10}\.[a-zA-Z]{2,4}$/).map((s) => `@${s}`),
  // Contains spaces
  fc.stringMatching(/^[a-zA-Z]{1,5}$/).map((s) => `${s} @example.com`),
  // Missing TLD
  fc.stringMatching(/^[a-zA-Z0-9]{1,10}$/).map((s) => `${s}@domain`),
);

/** Generates a valid message (≥ 10 chars after trim). */
const validMessageArb = fc
  .string({ minLength: 10, maxLength: 200 })
  .filter((s) => s.trim().length >= 10);

/** Generates a short message (1-9 chars after trim). */
const shortMessageArb = fc
  .stringMatching(/^[a-zA-Z]{1,9}$/)
  .filter((s) => s.trim().length > 0 && s.trim().length < 10);

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('Property 4: Contact Form Validation Rejects Invalid Input', () => {
  it('rejects empty or whitespace-only name', () => {
    fc.assert(
      fc.property(
        blankStringArb,
        validEmailArb,
        validMessageArb,
        (name, email, message) => {
          const result = validateContactForm({ name, email, message });
          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('name');
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it('rejects empty or whitespace-only email', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        blankStringArb,
        validMessageArb,
        (name, email, message) => {
          const result = validateContactForm({ name, email, message });
          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('email');
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it('rejects malformed email addresses', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        malformedEmailArb,
        validMessageArb,
        (name, email, message) => {
          const result = validateContactForm({ name, email, message });
          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('email');
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it('rejects empty or whitespace-only message', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        validEmailArb,
        blankStringArb,
        (name, email, message) => {
          const result = validateContactForm({ name, email, message });
          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('message');
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it('rejects message shorter than 10 characters', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        validEmailArb,
        shortMessageArb,
        (name, email, message) => {
          const result = validateContactForm({ name, email, message });
          expect(result.isValid).toBe(false);
          expect(result.errors).toHaveProperty('message');
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it('accepts valid inputs with no errors', () => {
    fc.assert(
      fc.property(
        nonEmptyStringArb,
        validEmailArb,
        validMessageArb,
        (name, email, message) => {
          const result = validateContactForm({ name, email, message });
          expect(result.isValid).toBe(true);
          expect(Object.keys(result.errors)).toHaveLength(0);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it('validateEmail rejects all malformed emails', () => {
    fc.assert(
      fc.property(malformedEmailArb, (email) => {
        expect(validateEmail(email)).toBe(false);
      }),
      { numRuns: NUM_RUNS },
    );
  });

  it('validateEmail accepts all well-formed emails', () => {
    fc.assert(
      fc.property(validEmailArb, (email) => {
        expect(validateEmail(email)).toBe(true);
      }),
      { numRuns: NUM_RUNS },
    );
  });
});
