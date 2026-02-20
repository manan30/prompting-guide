import { useState, useEffect } from 'react';

interface SavedPrompt {
  id: string;
  text: string;
  category: string;
  notes: string;
  createdAt: number;
}

const defaultCategories = ['General', 'Code', 'Writing', 'Analysis', 'Creative'];

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ text: '', category: 'General', notes: '' });

  useEffect(() => {
    const saved = localStorage.getItem('myPrompts');
    if (saved) {
      setPrompts(JSON.parse(saved));
    }
  }, []);

  const savePrompts = (newPrompts: SavedPrompt[]) => {
    setPrompts(newPrompts);
    localStorage.setItem('myPrompts', JSON.stringify(newPrompts));
  };

  const addPrompt = () => {
    if (!newPrompt.text.trim()) return;
    
    const prompt: SavedPrompt = {
      id: Date.now().toString(),
      text: newPrompt.text,
      category: newPrompt.category,
      notes: newPrompt.notes,
      createdAt: Date.now()
    };
    
    savePrompts([prompt, ...prompts]);
    setNewPrompt({ text: '', category: 'General', notes: '' });
    setShowAddModal(false);
  };

  const deletePrompt = (id: string) => {
    savePrompts(prompts.filter(p => p.id !== id));
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const categories = ['All', ...defaultCategories];
  const filteredPrompts = selectedCategory === 'All' 
    ? prompts 
    : prompts.filter(p => p.category === selectedCategory);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="w-full py-4 rounded-xl border-2 border-dashed border-slate-700 text-slate-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-all flex items-center justify-center gap-2 mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Prompt
      </button>

      {/* Prompts List */}
      {filteredPrompts.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <span className="text-slate-500 text-xs">
                      {new Date(prompt.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <pre className="text-slate-200 font-mono text-sm whitespace-pre-wrap mb-2">
                    {prompt.text}
                  </pre>
                  {prompt.notes && (
                    <p className="text-slate-500 text-sm">{prompt.notes}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyPrompt(prompt.text)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Copy"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deletePrompt(prompt.id)}
                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Prompt</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Prompt Text</label>
                <textarea
                  value={newPrompt.text}
                  onChange={(e) => setNewPrompt({ ...newPrompt, text: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                  placeholder="Enter your prompt..."
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Category</label>
                <select
                  value={newPrompt.category}
                  onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  {defaultCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={newPrompt.notes}
                  onChange={(e) => setNewPrompt({ ...newPrompt, notes: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="When to use this prompt..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addPrompt}
                className="flex-1 py-3 rounded-xl bg-emerald-500 text-slate-900 font-semibold hover:bg-emerald-400 transition-colors"
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
