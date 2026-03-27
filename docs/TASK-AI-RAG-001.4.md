# Sub-Task: AI/RAG Integration - Phase 4 Semantic Search Metadata

**Task ID:** `TASK-AI-RAG-001.4`  
**Parent Task:** `TASK-AI-RAG-001`  
**Status:** 🟡 Blocked  
**Priority:** High  
**Estimated Effort:** 2.5 hours  
**Assignee:** Development Team

---

## 📋 Overview

Create semantic metadata and chunking structure for vector-based search and future embeddings integration with OpenAI or HuggingFace models.

---

## 🎯 Objectives

### Primary Goals
- Extract keywords from JSDoc and code
- Generate vector-optimized text for embeddings
- Create semantic metadata JSON
- Generate chunks for vector search
- Implement pseudo-embedding generation (placeholder for real embeddings)

---

## 📁 Deliverables

### Script 1: `generate-metadata.ts`

**Location:** `artifacts/platforms/ai/semantic/scripts/generate-metadata.ts`

**Features:**
- Keyword extraction using `natural` and `compromise`
- Vector text generation
- Related module detection
- Metadata JSON output

### Script 2: `create-embeddings.ts`

**Location:** `artifacts/platforms/ai/semantic/scripts/create-embeddings.ts`

**Features:**
- Pseudo-vector generation (for testing)
- Ready for OpenAI/HuggingFace integration
- Embedding JSON output

### Output 1: `metadata.json`

**Location:** `artifacts/platforms/ai/semantic/metadata.json`

**Schema:**
```typescript
interface SemanticMetadata {
  id: string;              // Module name (e.g., "001-hello-world")
  title: string;           // Human-readable title
  description: string;     // JSDoc description
  keywords: string[];      // Extracted keywords (10-20)
  category: string;        // Category tag
  difficulty: string;      // beginner/intermediate/advanced
  code_snippet: string;    // Code example
  related_ids: string[];   // Related module IDs
  vector_text: string;     // Text optimized for embeddings
}
```

### Output 2: `chunks.json`

**Location:** `artifacts/platforms/ai/semantic/chunks/chunks.json`

**Schema:**
```typescript
interface Chunk {
  id: string;              // Unique chunk ID
  text: string;            // Text for embedding
  metadata: {
    title: string;
    category: string;
    keywords: string[];
    source_file: string;
  };
}
```

---

## ✅ Implementation Steps

### Step 1: Keyword Extraction
```typescript
import natural from 'natural';
import compromise from 'compromise';

function extractKeywords(text: string, code: string): string[] {
  // Extract from description
  const descWords = text
    .toLowerCase()
    .match(/\b[a-z]{4,}\b/g) || [];
  
  // Extract from code (function names, types)
  const codeWords = code
    .replace(/\/\/.*$/gm, '')  // Remove comments
    .match(/\b[a-zA-Z]{4,}\b/g) || [];
  
  // Use natural for stemming and relevance
  const stemmer = natural.PorterStemmer;
  const stemmed = [...descWords, ...codeWords]
    .map(w => stemmer.stem(w));
  
  // Use compromise for entity extraction
  const doc = compromise(text);
  const entities = doc.terms().out('array');
  
  // Combine and deduplicate
  const all = [...new Set([...stemmed, ...entities])];
  
  // Filter to top 20 most relevant
  return all
    .filter(w => w.length > 3)
    .slice(0, 20);
}
```

### Step 2: Vector Text Generation
```typescript
function generateVectorText(example: any): string {
  return `
${example.title}

${example.description}

Category: ${example.category}
Difficulty: ${example.difficulty}
Tags: ${example.tags.join(', ')}

Example code uses: ${extractFunctions(example.code).join(', ')}

When to use: ${generateWhenToUse(example.category)}

Related to: ${example.related.join(', ')}

Key concepts: ${example.keywords.join(', ')}
`.trim();
}

function extractFunctions(code: string): string[] {
  const regex = /\b(Ok|Err|match|map|mapErr|andThen|orElse|unwrap|unwrapOr|expect|tap|inspect)\b/g;
  return [...new Set(code.match(regex) || [])];
}

function generateWhenToUse(category: string): string {
  const templates: Record<string, string> = {
    'constructors': 'When creating new Result values',
    'guards': 'When checking Result type at runtime',
    'methods': 'When transforming or chaining Result operations',
    'patterns': 'When implementing common error handling patterns',
    'async': 'When working with async operations and promises'
  };
  return templates[category] || 'When working with Result types';
}
```

### Step 3: Related Module Detection
```typescript
function findRelated(current: any, allExamples: any[]): string[] {
  const currentKeywords = new Set(current.keywords);
  
  return allExamples
    .filter(ex => ex.id !== current.id)
    .map(ex => ({
      id: ex.id,
      similarity: calculateSimilarity(currentKeywords, new Set(ex.keywords))
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5)  // Top 5 related
    .map(r => r.id);
}

function calculateSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...set1, ...set2]).size;
  return intersection / union;  // Jaccard similarity
}
```

### Step 4: Pseudo-Embedding Generation
```typescript
function generatePseudoVector(text: string): number[] {
  // Create a simple hash-based pseudo-vector
  // In production, replace with OpenAI/HuggingFace embeddings
  const hash = text.split('').reduce((a, b) => {
    const h = a * 31 + b.charCodeAt(0);
    return Math.imul(h, h);
  }, 0x811c9dc5);
  
  // Generate 1536-dimensional vector (OpenAI compatible)
  return Array(1536).fill(0).map((_, i) => 
    Math.sin(hash * (i + 1)) * Math.cos(hash * (i + 1))
  );
}

async function createEmbeddings(chunks: Chunk[]): Promise<Embedding[]> {
  const embeddings: Embedding[] = [];
  
  for (const chunk of chunks) {
    // For now, generate pseudo-vector
    // Later: const response = await openai.embeddings.create({...})
    const vector = generatePseudoVector(chunk.text);
    
    embeddings.push({
      id: chunk.id,
      vector,
      metadata: chunk.metadata
    });
  }
  
  return embeddings;
}
```

### Step 5: File Output
```typescript
// Generate metadata
const metadata = examples.map(ex => ({
  id: ex.module,
  title: ex.title,
  description: ex.description,
  keywords: extractKeywords(ex.description, ex.code),
  category: ex.category,
  difficulty: ex.difficulty,
  code_snippet: ex.code,
  related_ids: findRelated(ex, allExamples),
  vector_text: generateVectorText(ex)
}));

writeFileSync('./metadata.json', JSON.stringify(metadata, null, 2));

// Generate chunks
const chunks = metadata.map(m => ({
  id: m.id,
  text: m.vector_text,
  metadata: {
    title: m.title,
    category: m.category,
    keywords: m.keywords,
    source_file: `packages/core/fp/result/__examples__/${m.id}/example.ts`
  }
}));

writeFileSync('./chunks/chunks.json', JSON.stringify(chunks, null, 2));

// Generate embeddings
const embeddings = await createEmbeddings(chunks);
writeFileSync('./embeddings/embeddings.json', JSON.stringify(embeddings, null, 2));

console.log(`✅ Generated ${metadata.length} metadata entries`);
console.log(`✅ Generated ${chunks.length} chunks`);
console.log(`✅ Generated ${embeddings.length} embeddings`);
```

---

## 📊 Metrics

| Metric | Target | Status |
|--------|--------|--------|
| Metadata entries | 51+ | ⏳ Pending |
| Chunks | 100K+ tokens | ⏳ Pending |
| Embeddings | 51 vectors (1536-dim) | ⏳ Pending |
| Avg keywords/entry | 15 | ⏳ Pending |
| Related links/entry | 5 | ⏳ Pending |

---

## ✅ Acceptance Criteria

- [ ] `metadata.json` with 51+ entries
- [ ] `chunks/chunks.json` with proper structure
- [ ] `embeddings/embeddings.json` with 1536-dim vectors
- [ ] Keywords extracted (15+ per entry)
- [ ] Related modules detected (5 per entry)
- [ ] Vector text optimized for embeddings

---

## 🔗 Dependencies

- **Blocks:** `TASK-AI-RAG-001.6` (Testing)
- **Blocked by:** `TASK-AI-RAG-001.1` (Setup)
- **Related:** `TASK-AI-RAG-001.3` (NotebookLM Generator)

---

## 📝 Notes

- Use `natural` for NLP (stemming, tokenization)
- Use `compromise` for entity extraction
- Pseudo-vectors are placeholders for real embeddings
- Ready for OpenAI `text-embedding-3-small` integration
- Metadata schema compatible with vector databases (Pinecone, Weaviate)

---

**Created:** 2026-03-27  
**Status:** 🟡 Blocked (waiting for Phase 1)  
**Parent Task:** `TASK-AI-RAG-001`
