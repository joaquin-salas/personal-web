---
title: "How I built a subagent that teaches me to write in English"
description: "Building a Claude Code subagent that reviews my English writing and reports errors and improvements"
pubDate: 2026-10-28
tags: ["claude code", "subagent"]
draft: true
---

One of the reasons that encouraged me to build this website was to be able to practise some English. I could have made it in Spanish, but I want to take the C1 Advanced exam from Cambridge, so there isn't a better place to practise than this.

That's a beautiful reason, but if I start writing these articles and projects with my broken English, how am I going to improve? Recently, I've been doing the [Claude Academy](https://academy.claude.com/) courses about what Claude Code is and how to make the most of it (context window, MCPs, hooks, SKILLs, etc) and there is a concept that fits this purpose perfectly: **subagents**.

## Why a subagent?

You might think that a subagent is not necessary, you could just use the main Claude Code conversation, writing the prompt directly like "Review the index.md file I just wrote and tell me if something is wrong". That is going to work but it's a very poor, vague explanation for something you will be doing repeatedly and with a different output every time you prompt it.

So the main reason for building a subagent instead is that it starts fresh with one goal and predefined rules of how to approach the problem. It doesn't carry the main context window, doesn't make assumptions from the conversation and doesn't fill the main context window.

## Designing the subagent

For planning this, I'm going to use Claude Code itself (as the [Claude Academy course](https://academy.claude.com/courses/introduction-to-subagents/creating-a-subagent) recommends).

### General rules

I want this website to be handwritten by me. I don't want the AI to write the content; I want to express my point of view in my own words even if I'm wrong.

So the first rule is that **it can't change the content or the sentences' meaning**. It's important to clarify that its purpose is not to always find errors: if there is no error, it doesn't need to report anything. Without this rule it could tell me that I used "start" instead of "begin", two irrelevant synonyms. In summary, the rules are these:

```md
## Hard rules

- **Never change the content.** You have no editing tools and you must not produce a rewritten
  version of the text. Each correction changes only the words that need to change.
- **Never change the meaning.** If a fix would alter what he is saying, describe the problem and let
  him choose the wording.
- **Language only.** Don't comment on technical accuracy, the article's structure, what to add or
  cut, tone of voice, titles' marketing appeal or SEO.
- **No fake problems.** Report something only if it is wrong (`error`) or clearly below C1 level or
  unnatural to a native speaker (`improvement`). Don't report personal style preferences or equally
  valid alternatives (synonym swaps, optional commas, "begin" vs "start"). If a section, or the whole
  text, is correct, say so plainly. A short report is a good result, not a lazy one.
```

For this reason it will only have **read-only tools** available:

```md
tools: Read, Grep, Glob
```

### Grammar & structure

**Another thing to check is the grammar and structure**: whether the sentence structure is incorrect or I've used the present perfect in the wrong way for example. Because my goal is to take the C1 exam the subagent also needs to check if the text sounds natural: correct adverb collocations, phrasal verbs or natural expressions.

```md
## What to check

1. **Grammar**: tenses (present perfect vs past simple, continuous vs simple), articles (a / the /
   none), prepositions, subject–verb agreement, countable vs uncountable nouns, relative clauses,
   conditionals, gerund vs infinitive.
2. **Sentence structure**: run-on sentences, comma splices, fragments, dangling modifiers, broken
   parallelism, word order (adverb position, adjective order, question word order in indirect
   questions).
3. **Spanish interference** (pay special attention to these):
   - missing subject ("Is important to…", "Allows you to…" at the start of a sentence)
   - "the" before nouns used in a general sense ("The Kubernetes", "the companies use…")
   - false friends (actually / actualmente, eventually / eventualmente, assist / asistir, sensible /
     sensible, library / librería, realise / realizar, carpet / carpeta)
   - make vs do, since vs for, say vs tell, explain + object ("explain me")
   - adjectives with plural endings or placed after the noun
   - very long sentences chained with commas where English needs a full stop or a linking word
4. **Natural phrasing**: wrong collocations ("do a decision", "make a research"), literal
   translations that are grammatical but sound foreign.
5. **Cohesion**: linking words (however, whereas, therefore, as a result), how sentences and
   paragraphs connect, repeated words where a pronoun or reference would be natural.
6. **Punctuation and consistency**: commas, apostrophes, hyphenation of compound modifiers
   ("open-source project" vs "it is open source"), capitalisation, one spelling convention throughout.
```

### Output format

To finish, one of the most important things is to define the **output**. What should the result be? It could give me the correct solution and that's it, but then, how am I supposed to learn?

I want the subagent to point out the line and mark it as an `error` (completely wrong) or an `improvement` (correct but not at C1 level) and explain to me why.

````md
```
Line 42 · error · articles
"It is used by the most companies"
→ "It is used by most companies"
Rule: "most" + plural noun means "the majority" and takes no article.
```

- `Line`: the line number in the file.
- Severity: `error` (wrong) or `improvement` (correct but below C1 level or unnatural).
- Category: one or two words (tense, articles, word order, false friend, collocation, punctuation,
  spelling, cohesion, …).
- Quote only the fragment that matters, then the minimal correction. If several valid fixes exist,
  give the most natural one; mention a second only if it matters for the exam.
- `Rule`: one or two sentences in English explaining why. Add a short Spanish note only when it
  genuinely helps, e.g. for false friends ("_actually_ = en realidad, not _actualmente_").
````

And last but not least, I want a **summary**: the number of errors and improvements and common errors I keep repeating. In this way I'm aware of what I need to practise more.

```md
Finish with:

- **Summary**: the number of errors and improvements, and a one-sentence verdict on the overall
  level of the text.
- **Patterns to work on**: up to three recurring habits worth practising, each with a short example
  from the text. Skip this section if nothing recurs.
```

## Testing the subagent

This subagent operates at project level inside `.claude/agents/english-reviewer.md` and to use it I only need to give Claude Code a prompt like this:

```
Review my English here @path/to/index.md and use the english-reviewer subagent
```

I've written the article up to this point and I've just run the subagent... Well... It found **30 errors** and **12 improvements**!

Here are some **errors** it detected:

| Line | Original                                   | Correction                                 | Why                                                   |
| ---- | ------------------------------------------ | ------------------------------------------ | ----------------------------------------------------- |
| 9    | "encouraged me **for building**"           | "encouraged me **to build**"               | "encourage someone" + to-infinitive.                  |
| 9    | "C1 **Advance**"                           | "C1 **Advanced**"                          | That's the exam's official name.                      |
| 9    | "a better place **for practicing**"        | "a better place **to practise**"           | "a place to do something".                            |
| 11   | "about what **is Claude Code**"            | "about what **Claude Code is**"            | Indirect questions don't invert the subject and verb. |
| 15   | "neccesary"                                | "necessary"                                | Spelling.                                             |
| 21   | "use **the same** Claude Code"             | "use **Claude Code itself**"               | Spanish interference: _el mismo_ here means _itself_. |
| 25   | "**with** my own words"                    | "**in** my own words"                      | Fixed expression.                                     |
| 103  | "aware **on** what I need to **practice**" | "aware **of** what I need to **practise**" | Wrong preposition, and British spelling of the verb.  |

As you can see, it focuses on sentence structure, typos, wrong prepositions, Spanish interference, etc. But it doesn't change the content, just as I wanted.

The other output is the **improvements**. Here are some:

- **L11** "fits perfectly for this purpose" → "fits this purpose perfectly"
- **L15** "One can think… you could use" → "You might think… you could use": a more natural modal, and it uses the same pronoun throughout.
- **L25** "even if I'm incorrect" → "even if I'm wrong" (for people, wrong is the natural word)

So that's it. I think I need to keep writing. 👋
