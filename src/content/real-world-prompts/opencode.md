---
title: Opencode
summary: OpenCode ships multiple system prompt flavors tuned for different model families and execution styles.
sourceProject: anomalyco/opencode
sourceUrl: https://github.com/anomalyco/opencode/tree/dev/packages/opencode/src/session/prompt
sourcePath: packages/opencode/src/session/prompt/
sourceLicense: MIT
modelFocus: Multi-flavor system prompts
tags:
  - system-prompts
  - model-flavors
  - coding-agent
verifiedAt: '2026-04-15'
flavors:
  - name: default.txt
    sourceUrl: https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/opencode/src/session/prompt/default.txt
    sourcePath: packages/opencode/src/session/prompt/default.txt
    focus: Baseline CLI behavior, concise output rules, and safety defaults.
    excerpt: |-
      You are opencode, an interactive CLI tool that helps users with software engineering tasks.

      IMPORTANT: Keep your responses short... fewer than 4 lines.

      # Doing tasks
      - Use available search tools to understand the codebase and query.
      - Verify with lint/typecheck commands when available.
  - name: gpt.txt
    sourceUrl: https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/opencode/src/session/prompt/gpt.txt
    sourcePath: packages/opencode/src/session/prompt/gpt.txt
    focus: GPT-family flavor with stronger autonomy and parallel tool usage guidance.
    excerpt: |-
      You are OpenCode, You and the user share the same workspace.

      - Prefer using Glob and Grep tools.
      - Parallelize tool calls whenever possible with multi_tool_use.parallel.

      Unless the user asks for a plan, assume they want code changes or tools run.
  - name: codex.txt
    sourceUrl: https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/opencode/src/session/prompt/codex.txt
    sourcePath: packages/opencode/src/session/prompt/codex.txt
    focus: Codex-style guardrails for editing constraints, git hygiene, and response format.
    excerpt: |-
      You are OpenCode, the best coding agent on the planet.

      ## Editing constraints
      - Default to ASCII when editing or creating files.
      - Try to use apply_patch for single file edits.

      ## Git and workspace hygiene
      - NEVER revert existing changes you did not make unless explicitly requested.
  - name: anthropic.txt
    sourceUrl: https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/opencode/src/session/prompt/anthropic.txt
    sourcePath: packages/opencode/src/session/prompt/anthropic.txt
    focus: Anthropic-oriented policy emphasizing docs-first feature answers and task tracking.
    excerpt: |-
      You are OpenCode, the best coding agent on the planet.

      IMPORTANT: For OpenCode feature questions, use WebFetch with opencode.ai/docs.

      # Task Management
      Use TodoWrite tools very frequently to track and plan tasks.
  - name: gemini.txt
    sourceUrl: https://raw.githubusercontent.com/anomalyco/opencode/dev/packages/opencode/src/session/prompt/gemini.txt
    sourcePath: packages/opencode/src/session/prompt/gemini.txt
    focus: Gemini-oriented workflow with explicit Understand -> Plan -> Implement -> Verify loop.
    excerpt: |-
      You are opencode, an interactive CLI agent specializing in software engineering tasks.

      # Core Mandates
      - Rigorously adhere to existing project conventions.
      - NEVER assume a library/framework is available.

      Workflow: Understand -> Plan -> Implement -> Verify.
---
