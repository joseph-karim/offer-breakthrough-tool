import { OpenAIService } from './openai';
import { Pain } from '../types/workshop';

export interface PainParsingResult {
  buyerSegmentPains: {
    [buyerSegment: string]: Pain[];
  };
  overlappingPains: Pain[];
  rawResponse: string;
}

export class PainParsingService {
  private openai: OpenAIService;
  private model: string;

  constructor(openaiService: OpenAIService, model: string = 'gpt-4.1-2025-04-14') {
    this.openai = openaiService;
    this.model = model;
  }

  /**
   * Parse a long text response to extract pains for different buyer segments
   */
  async parsePainstormingText(
    text: string,
    jobStatement: string,
    buyerSegments: string[]
  ): Promise<PainParsingResult> {
    try {
      const systemPrompt = `You are an expert text analysis and data extraction AI. Your task is to parse a block of unstructured text, which is a painstorming analysis, and transform it into a structured JSON object. The text describes pains for different buyer segments and overlapping pains.

# Task Description
Parse the provided text to extract:
1.  Distinct buyer segments.
2.  For each buyer segment:
    a.  A list of pain descriptions.
    b.  The type of each pain (Functional, Emotional, Social, or Perceived/Anticipated Risk).
    c.  An indication if the pain is a "FIRE" problem.
3.  A separate list of "Overlapping FIRE Problems" or "Overlapping Problems" descriptions, their types, and FIRE status.

# Input Text
The user will provide a multi-line string that typically follows this structure:

---
## 🎯 Target Buyer Segment 1: [Segment Name 1]
### Functional Problems
- [Pain Description 1.1]
- [Pain Description 1.2]
### Emotional Problems
- [Pain Description 1.3]
### 🔥 FIRE Problems
- [Pain Description 1.1 (repeated if it's FIRE)]
- [Pain Description 1.X]
---
## 🎯 Target Buyer Segment 2: [Segment Name 2]
... (similar structure)
---
## 🔁 Overlapping FIRE Problems Across All Segments (or similar heading)
1. 🔥 "[Overlapping Pain Description 1]"
   * Pain Type: [Type1] + [Type2]
   * Why it's painful: ...
   * Why it's expensive: ...
2. 🔥 "[Overlapping Pain Description 2]"
   * Pain Type: [Type]
...
---

# JSON Output Structure Required
Your entire output MUST be a single, valid JSON object matching this structure precisely:
{
  "buyerSegmentPains": {
    // Key is the exact Buyer Segment Name as found in the text
    "[Segment Name 1]": [
      {
        "description": "Full pain description.",
        "type": "functional" | "emotional" | "social" | "anticipated" | "unknown", // Infer from subheading or content. Default to 'unknown' if not clear.
        "isFire": true | false // Determine if it's listed under a 'FIRE Problems' subheading for that segment OR if the overlapping problem is marked with 🔥.
      },
      // ... more pains for this segment
    ],
    "[Segment Name 2]": [ /* ...pains... */ ]
  },
  "overlappingPains": [
    {
      "description": "Full overlapping pain description (just the part in quotes).",
      "type": "functional" | "emotional" | "social" | "anticipated" | "unknown", // Infer from "Pain Type:" line, take the primary one or combine if simple. Default to 'unknown'.
      "isFire": true | false // Should generally be true if under 'Overlapping FIRE Problems' or marked with 🔥.
    }
    // ... more overlapping pains
  ]
}

# Parsing Guidelines & Methodology
-   **Segment Names:** Extract segment names accurately from headings like "🎯 Target Buyer Segment X: [Segment Name]".
-   **Pain Descriptions:** Capture the full text of each pain point listed under Functional, Emotional, Social, Perceived Problems/Risks, and FIRE Problems subheadings.
-   **Pain Types:**
    -   Infer the \`type\` from the subheading (Functional Problems, Emotional Problems, Social Problems, Perceived Problems/Risks). If "Perceived Problems (Risks)", use "anticipated".
    -   For overlapping pains, look for a "Pain Type:" line. If multiple are listed (e.g., "Functional + Emotional"), choose the first one or a sensible primary one (e.g., "functional" if both are present, or try to map to your allowed enum). If no type specified, use "unknown".
-   **isFire Status:**
    -   For pains listed under a segment's "🔥 FIRE Problems" subheading, set \`isFire: true\`.
    -   For pains *not* explicitly under a segment's "FIRE Problems" subheading, check if the same description *also* appears under that segment's "FIRE Problems" list. If so, mark \`isFire: true\` for its primary listing. Otherwise, \`isFire: false\`.
    -   For the main "Overlapping FIRE Problems" list, all items are generally considered \`isFire: true\`.
-   **Handling Duplicates:** If a pain is listed under "Functional Problems" and then *again* under "FIRE Problems" for the same segment, it's one pain entity that *is* FIRE. Only include it once in the output for that segment, with \`isFire: true\`.
-   **Robustness:** The input text format might vary slightly. Try to be flexible with headings (e.g., "Perceived Problems" vs "Perceived Problems (Risks)").
-   **Completeness:** Extract all pains listed under each category for each segment and all overlapping pains.`;

      const userPrompt = `Please parse the following painstorming analysis text and extract all pain points, organizing them by buyer segment and identifying FIRE problems.

Job Statement: "${jobStatement}"

Buyer Segments:
${buyerSegments.map((segment, index) => `${index + 1}. ${segment}`).join('\n')}

# Input Text to Parse:
${text}`;

      // Generate the structured output from OpenAI
      const response = await this.openai.generateStructuredOutput<{
        buyerSegmentPains: {
          [buyerSegment: string]: Array<{
            description: string;
            type: 'functional' | 'emotional' | 'social' | 'anticipated' | 'unknown';
            isFire: boolean;
          }>;
        };
        overlappingPains: Array<{
          description: string;
          type: 'functional' | 'emotional' | 'social' | 'anticipated' | 'unknown';
          isFire: boolean;
        }>;
      }>(
        systemPrompt,
        userPrompt,
        0.3, // Lower temperature for more deterministic results
        this.model
      );

      // Process the response to ensure it has the correct structure
      const result: PainParsingResult = {
        buyerSegmentPains: {},
        overlappingPains: [],
        rawResponse: JSON.stringify(response, null, 2)
      };

      // Add IDs and source to each pain
      Object.keys(response.buyerSegmentPains || {}).forEach(segment => {
        result.buyerSegmentPains[segment] = (response.buyerSegmentPains[segment] || []).map((pain, index) => ({
          id: `parsed_${segment.replace(/\s+/g, '_').toLowerCase()}_${index}_${Date.now()}`,
          description: pain.description,
          type: pain.type === 'unknown' ? 'functional' : pain.type, // Default to functional if unknown
          isFire: pain.isFire,
          buyerSegment: segment,
          source: 'assistant'
        }));
      });

      // Add IDs and source to overlapping pains
      result.overlappingPains = (response.overlappingPains || []).map((pain, index) => ({
        id: `parsed_overlapping_${index}_${Date.now()}`,
        description: pain.description,
        type: pain.type === 'unknown' ? 'functional' : pain.type, // Default to functional if unknown
        isFire: pain.isFire,
        buyerSegment: 'Overlapping',
        source: 'assistant'
      }));

      return result;
    } catch (error) {
      console.error('Error parsing painstorming text:', error);
      throw new Error('Failed to parse painstorming text');
    }
  }
}
