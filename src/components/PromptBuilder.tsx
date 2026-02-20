import { useState } from 'react';

interface Technique {
  id: string;
  name: string;
  description: string;
  example: string;
}

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

  const handleTechniqueChange = (tech: Technique) => {
    setSelectedTechnique(tech);
    setPrompt(tech.example);
    setOutput('');
  };

  const simulateResponse = () => {
    setIsLoading(true);
    setOutput('');
    
    // Simulate AI response delay
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
      {/* Left: Input */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Technique
          </label>
          <div className="flex flex-wrap gap-2">
            {techniques.map((tech) => (
              <button
                key={tech.id}
                onClick={() => handleTechniqueChange(tech)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  selectedTechnique.id === tech.id
                    ? 'bg-stone-700 text-stone-100'
                    : 'bg-stone-800/50 text-stone-400 hover:text-stone-200'
                }`}
              >
                {tech.name}
              </button>
            ))}
          </div>
          <p className="text-slate-500 text-sm mt-2">
            {selectedTechnique.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Your Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8}
            className="w-full bg-stone-900/50 border border-stone-700 rounded-lg p-3 text-stone-200 font-mono text-sm focus:outline-none focus:border-stone-600"
            placeholder="Enter your prompt here..."
          />
        </div>

        <button
          onClick={simulateResponse}
          disabled={isLoading || !prompt.trim()}
          className="w-full py-3 rounded-lg bg-stone-100 text-stone-900 font-medium text-sm hover:bg-stone-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Response
            </>
          )}
        </button>

        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(prompt);
            }}
            className="flex-1 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-600 transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy
          </button>
          <button
            onClick={() => {
              localStorage.setItem('savedPrompt', prompt);
              alert('Prompt saved! Go to My Notes to see it.');
            }}
            className="flex-1 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-400 hover:text-stone-200 hover:border-stone-600 transition-colors flex items-center justify-center gap-2 text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Save
          </button>
        </div>
      </div>

      {/* Right: Output */}
      <div>
        <label className="block text-sm font-medium text-stone-300 mb-2">
          AI Response
        </label>
        <div className="bg-stone-900/30 border border-stone-700 rounded-lg min-h-[300px] p-4">
          {output ? (
            <div className="text-stone-200 whitespace-pre-wrap text-sm">{output}</div>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-500">
              <div className="text-center">
                <svg className="w-10 h-10 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
