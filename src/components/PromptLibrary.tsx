import { useEffect, useRef, useState } from 'react';
import { trackEvent } from '../lib/posthog';

interface SavedPrompt {
  id: string;
  text: string;
  category: string;
  notes: string;
  createdAt: number;
}

const defaultCategories = ['General', 'Code', 'Writing', 'Analysis', 'Creative'];

const isSavedPrompt = (value: unknown): value is SavedPrompt => {
  if (!value || typeof value !== 'object') return false;

  const prompt = value as Record<string, unknown>;
  return (
    typeof prompt.id === 'string' &&
    typeof prompt.text === 'string' &&
    typeof prompt.category === 'string' &&
    typeof prompt.notes === 'string' &&
    typeof prompt.createdAt === 'number'
  );
};

const parseSavedPrompts = (rawValue: string | null): SavedPrompt[] => {
  if (!rawValue) return [];

  try {
    const parsed: unknown = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isSavedPrompt);
  } catch (error) {
    console.error('Failed to parse saved prompts:', error);
    return [];
  }
};

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ text: '', category: 'General', notes: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedPrompts = parseSavedPrompts(localStorage.getItem('myPrompts'));

    if (savedPrompts.length > 0) {
      setPrompts(savedPrompts);
      return;
    }

    const legacyPrompt = localStorage.getItem('savedPrompt');
    if (!legacyPrompt?.trim()) return;

    const migratedPrompt: SavedPrompt = {
      id: Date.now().toString(),
      text: legacyPrompt,
      category: 'General',
      notes: 'Migrated from older playground save format',
      createdAt: Date.now()
    };

    const nextPrompts = [migratedPrompt];
    setPrompts(nextPrompts);
    localStorage.setItem('myPrompts', JSON.stringify(nextPrompts));
    localStorage.removeItem('savedPrompt');
  }, []);

  useEffect(() => {
    if (!statusMessage) return;

    const timeout = window.setTimeout(() => {
      setStatusMessage('');
    }, 2400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [statusMessage]);

  useEffect(() => {
    if (!showAddModal) return;

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const frame = window.requestAnimationFrame(() => {
      promptInputRef.current?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setShowAddModal(false);
        return;
      }

      if (event.key !== 'Tab' || !modalRef.current) return;

      const focusableElements = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute('disabled'));

      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus();
    };
  }, [showAddModal]);

  const savePrompts = (newPrompts: SavedPrompt[]) => {
    try {
      setPrompts(newPrompts);
      localStorage.setItem('myPrompts', JSON.stringify(newPrompts));
    } catch (error) {
      console.error('Failed to save prompts:', error);
      setStatusMessage('Could not save prompts.');
    }
  };

  const addPrompt = () => {
    const normalizedText = newPrompt.text.trim();
    if (!normalizedText) return;
    
    const prompt: SavedPrompt = {
      id: Date.now().toString(),
      text: normalizedText,
      category: newPrompt.category,
      notes: newPrompt.notes.trim(),
      createdAt: Date.now()
    };
    
    savePrompts([prompt, ...prompts]);
    trackEvent('library_prompt_added', {
      category: prompt.category,
      promptLength: prompt.text.length,
      hasNotes: Boolean(prompt.notes)
    });
    setNewPrompt({ text: '', category: 'General', notes: '' });
    setShowAddModal(false);
    setStatusMessage('Prompt added to your notes.');
  };

  const deletePrompt = (id: string) => {
    const target = prompts.find((prompt) => prompt.id === id);
    savePrompts(prompts.filter(p => p.id !== id));
    if (target) {
      trackEvent('library_prompt_deleted', {
        category: target.category,
        promptLength: target.text.length
      });
    }
    setStatusMessage('Prompt deleted.');
  };

  const copyPrompt = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      trackEvent('library_prompt_copied', {
        promptLength: text.length
      });
      setStatusMessage('Prompt copied to clipboard.');
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      setStatusMessage('Could not copy prompt.');
    }
  };

  const categories = ['All', ...new Set([...defaultCategories, ...prompts.map((prompt) => prompt.category)])];
  const filteredPrompts = selectedCategory === 'All' 
    ? prompts 
    : prompts.filter(p => p.category === selectedCategory);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            type="button"
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-stone-900 border border-stone-800 text-stone-500 hover:text-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowAddModal(true)}
        className="w-full py-4 rounded-xl border-2 border-dashed border-stone-800 text-stone-500 hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center gap-2 mb-4"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Prompt
      </button>

      <p aria-live="polite" className="min-h-5 text-sm text-stone-500 mb-2">
        {statusMessage}
      </p>

      {filteredPrompts.length === 0 ? (
        <div className="text-center py-12 text-stone-500">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>No prompts saved yet</p>
          <p className="text-sm mt-1">Save prompts from the playground to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPrompts.map(prompt => (
            <div key={prompt.id} className="card-gradient rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      {prompt.category}
                    </span>
                    <span className="text-stone-500 text-xs">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <pre className="text-stone-200 font-mono text-sm whitespace-pre-wrap mb-2">
                    {prompt.text}
                  </pre>
                  {prompt.notes && (
                    <p className="text-stone-500 text-sm">{prompt.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => copyPrompt(prompt.text)}
                    className="p-2 rounded-lg bg-stone-900 text-stone-500 hover:text-stone-200 transition-colors"
                    title="Copy"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePrompt(prompt.id)}
                    className="p-2 rounded-lg bg-stone-900 text-stone-500 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-prompt-title"
            aria-describedby="add-prompt-description"
            className="bg-stone-900 border border-stone-700 rounded-2xl p-6 w-full max-w-lg"
          >
            <h3 id="add-prompt-title" className="text-xl font-semibold mb-1 text-stone-100">Add New Prompt</h3>
            <p id="add-prompt-description" className="text-sm text-stone-500 mb-4">
              Add a prompt, assign a category, and include optional usage notes.
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="new-prompt-text" className="block text-sm text-stone-400 mb-1">Prompt Text</label>
                <textarea
                  id="new-prompt-text"
                  ref={promptInputRef}
                  value={newPrompt.text}
                  onChange={(e) => setNewPrompt({ ...newPrompt, text: e.target.value })}
                  rows={4}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 text-stone-100 font-mono text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Enter your prompt..."
                />
              </div>
              <div>
                <label htmlFor="new-prompt-category" className="block text-sm text-stone-400 mb-1">Category</label>
                <select
                  id="new-prompt-category"
                  value={newPrompt.category}
                  onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-emerald-500"
                >
                  {defaultCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="new-prompt-notes" className="block text-sm text-stone-400 mb-1">Notes (optional)</label>
                <input
                  id="new-prompt-notes"
                  type="text"
                  value={newPrompt.notes}
                  onChange={(e) => setNewPrompt({ ...newPrompt, notes: e.target.value })}
                  className="w-full bg-stone-800 border border-stone-700 rounded-lg p-3 text-stone-100 focus:outline-none focus:border-emerald-500"
                  placeholder="When to use this prompt..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl bg-stone-800 text-stone-300 hover:bg-stone-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addPrompt}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-stone-900 font-semibold hover:bg-emerald-400 transition-colors"
              >
                Save Prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
