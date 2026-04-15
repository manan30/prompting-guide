import { useEffect, useState } from 'react';

interface Technique {
  id: string;
  name: string;
  description: string;
  example: string;
}

interface SavedPrompt {
  id: string;
  text: string;
  category: string;
  notes: string;
  createdAt: number;
}

const isSavedPrompt = (value: unknown): value is SavedPrompt => {
  if (!value || typeof value !== 'object') return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    typeof item.category === 'string' &&
    typeof item.notes === 'string' &&
    typeof item.createdAt === 'number'
  );
};

const readPromptLibrary = (): SavedPrompt[] => {
  try {
    const raw = localStorage.getItem('myPrompts');
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(isSavedPrompt);
  } catch (error) {
    console.error('Failed to read saved prompts:', error);
    return [];
  }
};

const techniques: Technique[] = [
  {
    id: 'zeroshot',
    name: 'Zero-Shot',
    description: 'Direct instruction without examples',
    example: 'Summarize this article in 3 bullet points.'
  },
  {
    id: 'fewshot',
    name: 'Few-Shot',
    description: 'With examples to show format',
    example: `Example 1: "Great product!" → positive
Example 2: "Terrible experience." → negative

Now classify: "Could be better"`
  },
  {
    id: 'cot',
    name: 'Chain-of-Thought',
    description: 'Step-by-step reasoning',
    example: 'Solve this: 15 + 27. Think step by step.'
  },
  {
    id: 'role',
    name: 'Role-Based',
    description: 'Assign a persona',
    example: 'You are a senior software engineer. Review this code.'
  },
  {
    id: 'xml',
    name: 'XML Tags',
    description: 'Structured delimiters',
    example: `<instruction>Summarize</instruction>
<content>Your text here</content>`
  }
];

export default function PromptBuilder() {
  const [selectedTechnique, setSelectedTechnique] = useState(techniques[0]);
  const [prompt, setPrompt] = useState(techniques[0].example);
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!statusMessage) return;

    const timeout = window.setTimeout(() => {
      setStatusMessage('');
    }, 2400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [statusMessage]);

  const handleTechniqueChange = (tech: Technique) => {
    setSelectedTechnique(tech);
    setPrompt(tech.example);
    setOutput('');
  };

  const simulateResponse = () => {
    setIsLoading(true);
    setOutput('');

    setTimeout(() => {
      const responses: Record<string, string> = {
        zeroshot: `• Key point from the article
• Another important finding
• Main conclusion or takeaway`,
        fewshot: `negative`,
        cot: `Step 1: 15 + 20 = 35
Step 2: 35 + 7 = 42
Answer: 42`,
        role: `Code Review Summary:

Issues Found:
• Memory leak in line 45
• Missing error handling
• Consider using const instead of let

Suggestions:
• Add unit tests
• Improve variable naming
• Add JSDoc comments`,
        xml: `<summary>
  <bullet_points>
    <point>Key finding 1</point>
    <point>Key finding 2</point>
  </bullet_points>
</summary>`
      };

      setOutput(responses[selectedTechnique.id] || 'Response would appear here...');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-5">
        <div>
          <p className="block text-sm text-stone-500 mb-3">
            Technique
          </p>
          <div className="flex flex-wrap gap-2">
            {techniques.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => handleTechniqueChange(tech)}
                className={`px-3 py-2 rounded text-sm transition-colors ${
                  selectedTechnique.id === tech.id
                    ? 'bg-stone-200 text-stone-900'
                    : 'bg-stone-900 text-stone-500 hover:text-stone-300'
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>
          <p className="text-stone-600 text-sm mt-3">
            {selectedTechnique.description}
          </p>
        </div>

        <div>
          <label htmlFor="prompt-input" className="block text-sm text-stone-500 mb-2">
            Your Prompt
          </label>
          <textarea
            id="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8}
            className="w-full bg-stone-950 border border-stone-800 rounded-lg p-4 text-stone-300 font-mono text-sm focus:outline-none focus:border-stone-700"
            placeholder="Enter your prompt here..."
          />
        </div>

        <button
          type="button"
          onClick={simulateResponse}
          disabled={isLoading || !prompt.trim()}
          className="w-full py-3 rounded-full bg-stone-100 text-stone-900 text-base hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            'Generate Response'
          )}
        </button>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(prompt);
                setStatusMessage('Prompt copied to clipboard.');
              } catch (error) {
                console.error('Failed to copy prompt:', error);
                setStatusMessage('Could not copy prompt.');
              }
            }}
            className="flex-1 py-2.5 rounded-lg border border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          <button
            type="button"
            onClick={() => {
              if (!prompt.trim()) {
                setStatusMessage('Write a prompt before saving.');
                return;
              }

              const existingPrompts = readPromptLibrary();

              const promptToSave: SavedPrompt = {
                id: Date.now().toString(),
                text: prompt.trim(),
                category: selectedTechnique.name,
                notes: `Saved from playground using ${selectedTechnique.name}`,
                createdAt: Date.now()
              };

              localStorage.setItem('myPrompts', JSON.stringify([promptToSave, ...existingPrompts]));
              localStorage.removeItem('savedPrompt');
              setStatusMessage('Prompt saved to My Notes.');
            }}
            className="flex-1 py-2.5 rounded-lg border border-stone-800 text-stone-500 hover:text-stone-300 hover:border-stone-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save
          </button>
        </div>

        <p aria-live="polite" className="min-h-5 text-sm text-stone-500">
          {statusMessage}
        </p>
      </div>

      <div>
        <p className="block text-sm text-stone-500 mb-2">
          AI Response
        </p>
        <div className="bg-stone-950 border border-stone-800 rounded-lg min-h-[320px] p-5">
          {output ? (
            <div className="text-stone-300 whitespace-pre-wrap text-base leading-relaxed">{output}</div>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-600">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">Response will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
