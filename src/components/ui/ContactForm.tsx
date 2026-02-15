import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import { validateContactForm } from '@/utils/validation';
import { useAchievementStore } from '@/store/achievementStore';
import { useUIStore } from '@/store/uiStore';
import type { ContactFormProps, ContactFormData } from '@/types/ui';

const inputBase =
  'w-full rounded-lg border bg-transparent px-4 py-3 text-sm text-surface-100 placeholder:text-surface-500 outline-none transition-colors';
const inputIdle = 'border-white/[0.08] focus:border-primary-500/50';
const inputError = 'border-red-400/50 focus:border-red-500/60';

export function ContactForm({ onSubmit }: ContactFormProps) {
  const trackContactSubmit = useAchievementStore((s) => s.trackContactSubmit);
  const isReducedMotion = useUIStore((s) => s.isReducedMotion);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = validateContactForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      setTouched({ name: true, email: true, message: true });
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    try {
      await onSubmit(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
      trackContactSubmit();
    } catch {
      setErrors({ form: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        data-testid="success-message"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10"
      >
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-500/15">
          <Check className="w-7 h-7 text-success-400" strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-semibold text-surface-50 mb-2">Message sent</h3>
        <p className="text-sm text-surface-400 mb-6">Thanks for reaching out. I'll get back to you soon.</p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  const messageLength = formData.message.length;
  const maxLength = 1000;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block text-sm text-surface-400 mb-1.5">Name</label>
        <input
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          className={`${inputBase} ${touched.name && errors.name ? inputError : inputIdle}`}
        />
        <FieldError id="name-error" testId="name-error" message={touched.name ? errors.name : undefined} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block text-sm text-surface-400 mb-1.5">Email</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`${inputBase} ${touched.email && errors.email ? inputError : inputIdle}`}
        />
        <FieldError id="email-error" testId="email-error" message={touched.email ? errors.email : undefined} />
      </div>

      {/* Message */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="contact-message" className="text-sm text-surface-400">Message</label>
          <span className={`text-xs ${messageLength > maxLength * 0.8 ? 'text-warning-400' : 'text-surface-500'}`}>
            {messageLength}/{maxLength}
          </span>
        </div>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell me about your project..."
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
          className={`${inputBase} resize-none ${touched.message && errors.message ? inputError : inputIdle}`}
        />
        <FieldError id="message-error" testId="message-error" message={touched.message ? errors.message : undefined} />
      </div>

      {/* Form error */}
      <AnimatePresence>
        {errors.form && (
          <motion.div
            data-testid="form-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 rounded-lg border border-red-400/20 bg-red-500/5 px-4 py-3 text-sm text-red-400"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.form}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/25 hover:bg-primary-600 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
        whileHover={isReducedMotion || isSubmitting ? {} : { scale: 1.02, y: -1 }}
        whileTap={isReducedMotion || isSubmitting ? {} : { scale: 0.98 }}
      >
        {isSubmitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> Sending…
          </span>
        ) : (
          'Send Message'
        )}
      </motion.button>
    </form>
  );
}

function FieldError({ id, testId, message }: { id: string; testId: string; message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          id={id}
          data-testid={testId}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-1.5 text-xs text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
