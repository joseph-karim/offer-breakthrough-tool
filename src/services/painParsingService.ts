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
   * Preprocess the text to identify buyer segments and structure the text better
   */
  private preprocessText(text: string, buyerSegments: string[]): string {
    // If the text is empty, return it as is
    if (!text.trim()) {
      return text;
    }

    // Check if the text already has clear buyer segment headers
    const hasSegmentHeaders = buyerSegments.some(segment =>
      text.includes(`Target Buyer Segment: ${segment}`) ||
      text.includes(`Target Buyer: ${segment}`) ||
      text.includes(`Buyer Segment: ${segment}`) ||
      text.includes(`## ${segment}`) ||
      text.includes(`# ${segment}`)
    );

    // If the text already has clear segment headers, return it as is
    if (hasSegmentHeaders) {
      return text;
    }

    // Try to identify sections that might correspond to buyer segments
    let processedText = text;

    // Look for the first buyer segment in the text
    const firstSegmentMatch = text.match(/🎯\s*Target\s*Buyer\s*Segment\s*\d*\s*:\s*(.*?)(?=\n|$)/i);
    const firstSegment = firstSegmentMatch ? firstSegmentMatch[1].trim() : null;

    // If we found a segment that's not in our list, it might be a formatting issue
    if (firstSegment && !buyerSegments.includes(firstSegment)) {
      // Try to match this segment with one from our list
      const closestSegment = this.findClosestMatch(firstSegment, buyerSegments);
      if (closestSegment) {
        // Replace all occurrences of this segment with the closest match
        processedText = processedText.replace(new RegExp(firstSegment, 'g'), closestSegment);
      }
    }

    // Check if we have a section that looks like a buyer segment but isn't labeled as such
    for (const segment of buyerSegments) {
      // Look for patterns that might indicate a section for this segment
      const segmentRegex = new RegExp(`(?:^|\\n)\\s*(${this.escapeRegExp(segment)})\\s*(?:\\n|$)`, 'i');
      const match = processedText.match(segmentRegex);

      if (match) {
        // Add a proper header for this segment if it's not already there
        const headerRegex = new RegExp(`(?:Target\\s*Buyer\\s*Segment|Buyer\\s*Segment)\\s*:\\s*${this.escapeRegExp(segment)}`, 'i');
        if (!processedText.match(headerRegex)) {
          processedText = processedText.replace(
            match[0],
            `\n## 🎯 Target Buyer Segment: ${segment}\n`
          );
        }
      }
    }

    // If we still don't have clear segment headers, try to identify sections by problem types
    if (!hasSegmentHeaders && !processedText.includes('Target Buyer Segment:')) {
      // Look for functional/emotional/social problem sections
      const problemTypeMatches = processedText.match(/(?:^|\n)(?:#{1,3}\s*)?(\w+)\s*Problems(?:\s*:)?/gi);

      if (problemTypeMatches && problemTypeMatches.length > 0) {
        // If we have problem type headers but no segment headers, try to infer segments
        // by looking at the context around these headers

        // Split the text into sections based on problem type headers
        const sections = processedText.split(/(?:^|\n)(?:#{1,3}\s*)?(\w+)\s*Problems(?:\s*:)?/i);

        // If we have multiple sections and multiple buyer segments, try to match them
        if (sections.length > 2 && buyerSegments.length > 0) {
          let structuredText = '';
          let currentSegmentIndex = 0;

          // Add a header for the first buyer segment
          structuredText += `\n## 🎯 Target Buyer Segment: ${buyerSegments[currentSegmentIndex]}\n\n`;

          // Process each section
          for (let i = 1; i < sections.length; i += 2) {
            const problemType = sections[i];
            const problemContent = sections[i + 1] || '';

            // Add the problem type header
            structuredText += `### ${problemType} Problems\n`;

            // Add the problem content
            structuredText += problemContent;

            // If this is the last problem type for this segment, move to the next segment
            if (i + 2 < sections.length && currentSegmentIndex < buyerSegments.length - 1) {
              currentSegmentIndex++;
              structuredText += `\n## 🎯 Target Buyer Segment: ${buyerSegments[currentSegmentIndex]}\n\n`;
            }
          }

          // If we have an overlapping section, add it
          if (processedText.includes('Overlapping') || processedText.includes('FIRE Problems')) {
            const overlappingMatch = processedText.match(/(?:^|\n)(?:#{1,3}\s*)?(?:Overlapping|FIRE)\s*(?:FIRE\s*)?Problems(?:\s*:)?.*?(?=\n#{1,3}|$)/is);
            if (overlappingMatch) {
              structuredText += `\n## 🔁 Overlapping FIRE Problems\n${overlappingMatch[0]}\n`;
            }
          }

          processedText = structuredText;
        }
      }
    }

    // If we still don't have clear segment headers, add them based on the provided buyer segments
    if (!processedText.includes('Target Buyer Segment:') && !processedText.includes('## 🎯')) {
      // This is a last resort - we'll just add segment headers at the beginning
      let structuredText = '';

      for (const segment of buyerSegments) {
        structuredText += `\n## 🎯 Target Buyer Segment: ${segment}\n\n`;

        // Add the original text under the first segment
        if (segment === buyerSegments[0]) {
          structuredText += processedText;
        }
      }

      processedText = structuredText;
    }

    return processedText;
  }

  /**
   * Find the closest match for a string in an array of strings
   */
  private findClosestMatch(str: string, options: string[]): string | null {
    if (!str || options.length === 0) return null;

    // If there's an exact match, return it
    const exactMatch = options.find(option =>
      option.toLowerCase() === str.toLowerCase()
    );
    if (exactMatch) return exactMatch;

    // Check if the string contains any of the options
    for (const option of options) {
      if (str.toLowerCase().includes(option.toLowerCase())) {
        return option;
      }
      if (option.toLowerCase().includes(str.toLowerCase())) {
        return option;
      }
    }

    // Check if any of the options are similar to the string
    for (const option of options) {
      // Split into words and check for word overlap
      const strWords = str.toLowerCase().split(/\s+/);
      const optionWords = option.toLowerCase().split(/\s+/);

      const commonWords = strWords.filter(word =>
        optionWords.some(optionWord =>
          optionWord.includes(word) || word.includes(optionWord)
        )
      );

      if (commonWords.length > 0) {
        return option;
      }
    }

    // If no match is found, return the first option as a fallback
    return options[0];
  }

  /**
   * Escape special characters in a string for use in a regular expression
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Calculate the similarity between two strings (0-1)
   * Uses Levenshtein distance and word overlap
   */
  private calculateSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;

    // Normalize strings
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    // If strings are identical, return 1
    if (s1 === s2) return 1;

    // Calculate word overlap
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);

    // Count common words
    const commonWords = words1.filter(word =>
      words2.some(w => w === word || w.includes(word) || word.includes(w))
    );

    // Calculate word overlap score
    const wordOverlapScore = commonWords.length / Math.max(words1.length, words2.length);

    // Calculate Levenshtein distance
    const levenshteinDistance = this.levenshteinDistance(s1, s2);
    const maxLength = Math.max(s1.length, s2.length);
    const levenshteinScore = maxLength > 0 ? 1 - levenshteinDistance / maxLength : 0;

    // Combine scores (giving more weight to word overlap)
    return 0.7 * wordOverlapScore + 0.3 * levenshteinScore;
  }

  /**
   * Calculate the Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;

    // Create a matrix of size (m+1) x (n+1)
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // Initialize the first row and column
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
    }

    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
    }

    // Fill the matrix
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,      // deletion
          dp[i][j - 1] + 1,      // insertion
          dp[i - 1][j - 1] + cost // substitution
        );
      }
    }

    return dp[m][n];
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
      // First, let's do some preprocessing to identify buyer segments in the text
      const preprocessedText = this.preprocessText(text, buyerSegments);

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
The user will provide a multi-line string that may follow various formats. Here are some examples:

Format 1:
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

Format 2:
---
## [Segment Name 1]
### Functional Problems:
* "[Pain Description 1.1]"
* "[Pain Description 1.2]"
---

Format 3:
---
🎯 Target Buyer Segment: [Segment Name 1]
### Functional Problems
- [Pain Description 1.1]
- [Pain Description 1.2]
---

Format 4 (minimal formatting):
---
[Segment Name 1]
Functional Problems:
- [Pain Description 1.1]
- [Pain Description 1.2]
---

# Overlapping Problems Section
The text may also include a section for overlapping problems, which could be formatted in various ways:
- "Overlapping FIRE Problems"
- "Overlapping Problems"
- "FIRE Problems"
- "Overlapping:"

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
-   **Segment Names:**
    -   Extract segment names from headings like "🎯 Target Buyer Segment X: [Segment Name]" or simply "[Segment Name]".
    -   If a segment name is not explicitly mentioned but the text has sections that appear to be for different segments, use the provided buyer segments list as a reference.
    -   The buyer segments list provided by the user should be considered the source of truth. If you find text that seems to be about one of these segments, associate it with that segment.

-   **Pain Descriptions:**
    -   Capture the full text of each pain point listed under any problem type heading.
    -   Clean up the descriptions by removing bullet points, numbers, or other formatting characters.
    -   If a description is in quotes, remove the quotes for consistency.

-   **Pain Types:**
    -   Infer the \`type\` from the subheading (Functional Problems, Emotional Problems, Social Problems, Perceived Problems/Risks).
    -   If the type is "Perceived Problems" or "Perceived Risks" or similar, use "anticipated".
    -   For overlapping pains, look for a "Pain Type:" line. If multiple are listed (e.g., "Functional + Emotional"), choose the first one.
    -   If no type is specified, default to "functional".

-   **isFire Status:**
    -   For pains listed under a "FIRE Problems" subheading, set \`isFire: true\`.
    -   For pains that have a 🔥 emoji or the word "FIRE" in their description, set \`isFire: true\`.
    -   For pains in the "Overlapping FIRE Problems" section, set \`isFire: true\`.
    -   If a pain appears in both a regular section and a FIRE section, only include it once with \`isFire: true\`.

-   **Handling Duplicates:**
    -   If the same pain description appears multiple times, only include it once in the output.
    -   If a pain appears in both a segment-specific section and the overlapping section, include it in both places.

-   **Robustness:**
    -   Be flexible with headings and formatting.
    -   If the text doesn't follow a clear structure, do your best to extract meaningful pain points and associate them with the appropriate segments.
    -   If you can't determine which segment a pain belongs to, place it in the overlapping pains section.

-   **Completeness:**
    -   Extract all pains listed in the text, even if they don't fit neatly into the expected format.
    -   If the text mentions a pain type that doesn't match one of the allowed types, map it to the closest match.`;

      const userPrompt = `Please parse the following painstorming analysis text and extract all pain points, organizing them by buyer segment and identifying FIRE problems.

Job Statement: "${jobStatement}"

Buyer Segments (IMPORTANT - these are the exact buyer segments to use):
${buyerSegments.map((segment, index) => `${index + 1}. ${segment}`).join('\n')}

IMPORTANT: The buyer segments listed above are the source of truth. Make sure to associate pains with these exact buyer segments, even if the text uses slightly different names or formatting. If you can't determine which segment a pain belongs to, place it in the overlapping pains section.

# Input Text to Parse:
${preprocessedText}`;

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

      // Create a map of normalized segment names to actual segment names
      const segmentMap = new Map<string, string>();
      buyerSegments.forEach(segment => {
        segmentMap.set(segment.toLowerCase().trim(), segment);
      });

      // Add IDs and source to each pain, ensuring we use the correct buyer segment names
      Object.keys(response.buyerSegmentPains || {}).forEach(segment => {
        // Find the matching buyer segment from our list
        let matchedSegment = segment;

        // If the segment doesn't exactly match one of our buyer segments, try to find the closest match
        // or create a new segment if no good match is found
        if (!buyerSegments.includes(segment)) {
          const normalizedSegment = segment.toLowerCase().trim();

          // Check if we have an exact match after normalization
          if (segmentMap.has(normalizedSegment)) {
            matchedSegment = segmentMap.get(normalizedSegment)!;
          } else if (segment.toLowerCase().includes('overlap') || segment === 'All segments') {
            // If it's an overlapping segment, set it to 'Overlapping'
            matchedSegment = 'Overlapping';
          } else {
            // Try to find the closest match
            const closestMatch = this.findClosestMatch(segment, buyerSegments);

            // If we found a close match, use it
            // Otherwise, keep the original segment name to create a new buyer segment
            if (closestMatch && this.calculateSimilarity(segment, closestMatch) > 0.5) {
              matchedSegment = closestMatch;
            } else {
              // Keep the original segment name, but clean it up a bit
              matchedSegment = segment.trim();

              // Capitalize the first letter of each word
              matchedSegment = matchedSegment
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');

              // Remove any special characters or emojis from the beginning
              matchedSegment = matchedSegment.replace(/^[^\w\s]+/, '').trim();
            }
          }
        }

        // Initialize the array for this segment if it doesn't exist
        if (!result.buyerSegmentPains[matchedSegment]) {
          result.buyerSegmentPains[matchedSegment] = [];
        }

        // Add the pains for this segment
        const pains = (response.buyerSegmentPains[segment] || []).map((pain, index) => ({
          id: `parsed_${matchedSegment.replace(/\s+/g, '_').toLowerCase()}_${index}_${Date.now()}`,
          description: pain.description,
          type: pain.type === 'unknown' ? 'functional' : pain.type, // Default to functional if unknown
          isFire: pain.isFire,
          buyerSegment: matchedSegment,
          source: 'assistant' as 'assistant' // Type assertion to fix TypeScript error
        }));

        // Add the pains to the result
        result.buyerSegmentPains[matchedSegment] = [
          ...(result.buyerSegmentPains[matchedSegment] || []),
          ...pains
        ];
      });

      // Add IDs and source to overlapping pains
      result.overlappingPains = (response.overlappingPains || []).map((pain, index) => ({
        id: `parsed_overlapping_${index}_${Date.now()}`,
        description: pain.description,
        type: pain.type === 'unknown' ? 'functional' : pain.type, // Default to functional if unknown
        isFire: pain.isFire,
        buyerSegment: 'Overlapping',
        source: 'assistant' as 'assistant' // Type assertion to fix TypeScript error
      }));

      return result;
    } catch (error) {
      console.error('Error parsing painstorming text:', error);
      throw new Error('Failed to parse painstorming text');
    }
  }
}
