import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EducationPage from '@/pages/EducationPage';
import { useUIStore } from '@/store/uiStore';
import { getEducation } from '@/utils/content';

function renderPage() {
  return render(
    <MemoryRouter>
      <EducationPage />
    </MemoryRouter>,
  );
}

describe('EducationPage', () => {
  beforeEach(() => {
    useUIStore.setState({ isReducedMotion: true });
  });

  it('renders the Education heading', () => {
    renderPage();
    expect(
      screen.getByRole('heading', { level: 1, name: /education/i }),
    ).toBeInTheDocument();
  });

  it('renders all education entries', () => {
    renderPage();
    const education = getEducation();
    for (const entry of education) {
      expect(
        screen.getByTestId(`education-entry-${entry.id}`),
      ).toBeInTheDocument();
    }
  });

  it('displays institution for each entry', () => {
    renderPage();
    const education = getEducation();
    for (const entry of education) {
      const card = screen.getByTestId(`education-entry-${entry.id}`);
      const institution = within(card).getByTestId('education-institution');
      expect(institution).toHaveTextContent(entry.institution);
    }
  });

  it('displays degree for each entry', () => {
    renderPage();
    const education = getEducation();
    for (const entry of education) {
      const card = screen.getByTestId(`education-entry-${entry.id}`);
      const degree = within(card).getByTestId('education-degree');
      expect(degree).toHaveTextContent(entry.degree);
    }
  });

  it('displays field for each entry', () => {
    renderPage();
    const education = getEducation();
    for (const entry of education) {
      const card = screen.getByTestId(`education-entry-${entry.id}`);
      const field = within(card).getByTestId('education-field');
      expect(field).toHaveTextContent(entry.field);
    }
  });

  it('displays dates for each entry', () => {
    renderPage();
    const education = getEducation();
    for (const entry of education) {
      const card = screen.getByTestId(`education-entry-${entry.id}`);
      const dates = within(card).getByTestId('education-dates');
      expect(dates.textContent).toBeTruthy();
    }
  });

  it('displays highlights for entries that have them', () => {
    renderPage();
    const education = getEducation();
    const withHighlights = education.filter((e) => e.highlights.length > 0);
    for (const entry of withHighlights) {
      const card = screen.getByTestId(`education-entry-${entry.id}`);
      const highlights = within(card).getByTestId('education-highlights');
      const items = within(highlights).getAllByRole('listitem');
      expect(items).toHaveLength(entry.highlights.length);
      for (const highlight of entry.highlights) {
        expect(highlights).toHaveTextContent(highlight);
      }
    }
  });

  it('sorts entries chronologically with most recent first', () => {
    renderPage();
    const entries = screen.getAllByTestId(/^education-entry-/);
    const education = getEducation();

    // The first rendered entry should have the latest endDate
    const sorted = [...education].sort((a, b) => {
      if (a.endDate !== b.endDate) return b.endDate.localeCompare(a.endDate);
      return b.startDate.localeCompare(a.startDate);
    });

    entries.forEach((el, i) => {
      expect(el).toHaveAttribute(
        'data-testid',
        `education-entry-${sorted[i].id}`,
      );
    });
  });
});
