import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ContactForm } from '@/components/ui/ContactForm';
import { useAchievementStore } from '@/store/achievementStore';

function fillField(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function submitForm() {
  fireEvent.click(screen.getByRole('button', { name: /send message/i }));
}

describe('ContactForm', () => {
  const onSubmit = vi.fn<(data: { name: string; email: string; message: string }) => Promise<void>>();

  beforeEach(() => {
    onSubmit.mockReset().mockResolvedValue(undefined);
    useAchievementStore.setState({
      unlockedAchievements: [],
      viewedProjects: [],
      expandedExperiences: [],
      proofLinksClicked: 0,
      contactFormSubmitted: false,
    });
  });

  it('renders name, email, and message fields with labels', () => {
    render(<ContactForm onSubmit={onSubmit} />);
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Message')).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    render(<ContactForm onSubmit={onSubmit} />);
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('shows validation error when name is empty on submit', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    submitForm();
    expect(await screen.findByTestId('name-error')).toHaveTextContent('Name is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when email is empty on submit', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    fillField('Name', 'Jane');
    submitForm();
    expect(await screen.findByTestId('email-error')).toHaveTextContent('Email is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email format', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    fillField('Name', 'Jane');
    fillField('Email', 'not-an-email');
    submitForm();
    expect(await screen.findByTestId('email-error')).toHaveTextContent('Please enter a valid email address');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when message is empty on submit', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    fillField('Name', 'Jane');
    fillField('Email', 'jane@example.com');
    submitForm();
    expect(await screen.findByTestId('message-error')).toHaveTextContent('Message is required');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when message is too short', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    fillField('Name', 'Jane');
    fillField('Email', 'jane@example.com');
    fillField('Message', 'Hi');
    submitForm();
    expect(await screen.findByTestId('message-error')).toHaveTextContent('Message must be at least 10 characters');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data and shows success message', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    fillField('Name', 'Jane Doe');
    fillField('Email', 'jane@example.com');
    fillField('Message', 'Hello, I have an opportunity for you!');
    submitForm();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'Jane Doe',
        email: 'jane@example.com',
        message: 'Hello, I have an opportunity for you!',
      });
    });

    expect(await screen.findByTestId('success-message')).toBeInTheDocument();
    expect(screen.getByText('Message sent')).toBeInTheDocument();
  });

  it('shows loading state during submission', async () => {
    let resolveSubmit!: () => void;
    const slowSubmit = vi.fn(
      () => new Promise<void>((resolve) => { resolveSubmit = resolve; }),
    );
    render(<ContactForm onSubmit={slowSubmit} />);
    fillField('Name', 'Jane Doe');
    fillField('Email', 'jane@example.com');
    fillField('Message', 'Hello, I have an opportunity for you!');
    submitForm();

    expect(await screen.findByText('Sending…')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    await act(async () => { resolveSubmit(); });
    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });
  });

  it('shows form error when submission fails', async () => {
    const failSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<ContactForm onSubmit={failSubmit} />);
    fillField('Name', 'Jane Doe');
    fillField('Email', 'jane@example.com');
    fillField('Message', 'Hello, I have an opportunity for you!');
    submitForm();

    expect(await screen.findByTestId('form-error')).toHaveTextContent(
      'Failed to send message. Please try again.',
    );
  });

  it('clears field error when user starts typing', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    submitForm();
    expect(await screen.findByTestId('name-error')).toBeInTheDocument();

    fillField('Name', 'J');
    await waitFor(() => {
      const errorEl = screen.queryByTestId('name-error');
      // Error should either be removed or hidden (exit animation)
      expect(errorEl === null || errorEl.style.opacity === '0').toBe(true);
    });
  });

  it('allows sending another message after success', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    fillField('Name', 'Jane Doe');
    fillField('Email', 'jane@example.com');
    fillField('Message', 'Hello, I have an opportunity for you!');
    submitForm();

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Send another message'));
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('sets aria-invalid on fields with errors', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    submitForm();

    await waitFor(() => {
      expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByLabelText('Message')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  it('tracks contact submission for achievements on success', async () => {
    render(<ContactForm onSubmit={onSubmit} />);
    fillField('Name', 'Jane Doe');
    fillField('Email', 'jane@example.com');
    fillField('Message', 'Hello, I have an opportunity for you!');
    submitForm();

    await waitFor(() => {
      expect(screen.getByTestId('success-message')).toBeInTheDocument();
    });

    const state = useAchievementStore.getState();
    expect(state.contactFormSubmitted).toBe(true);
  });

  it('does not track contact submission when submission fails', async () => {
    const failSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    render(<ContactForm onSubmit={failSubmit} />);
    fillField('Name', 'Jane Doe');
    fillField('Email', 'jane@example.com');
    fillField('Message', 'Hello, I have an opportunity for you!');
    submitForm();

    await waitFor(() => {
      expect(screen.getByTestId('form-error')).toBeInTheDocument();
    });

    const state = useAchievementStore.getState();
    expect(state.contactFormSubmitted).toBe(false);
  });
});
