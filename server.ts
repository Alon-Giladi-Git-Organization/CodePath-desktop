import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  try {
    genAI = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

/**
 * Real-time AI Exercise / Quiz / Architecture Generator Endpoint
 * Generates interactive coding exercises with code snippets and 3 options (A, B, C)
 * with the correct answer placed randomly at index 0, 1, or 2.
 */
app.post('/api/generate-ai-exercise', async (req, res) => {
  try {
    const { 
      topic = 'Python loops and conditions', 
      language = 'python', 
      difficulty = 'Beginner', 
      category = 'coding', // 'coding' | 'architecture' | 'quiz'
      appLanguage = 'en'
    } = req.body;

    const isHe = appLanguage === 'he';

    if (genAI) {
      const prompt = `You are a senior software engineering instructor for CosePath.
Generate an interactive ${category} practice question for a student learning ${topic} in ${language}.
The target level is ${difficulty}.

REQUIREMENTS:
1. Provide a clean, realistic, focused code snippet (5-15 lines) in ${language}. Code must be in English.
2. Formulate a clear concept explanation and question in ${isHe ? 'Hebrew (עברית with professional coding terms)' : 'English'}.
3. Create EXACTLY 3 answer options (A, B, C).
4. Exactly ONE option must be correct (isCorrect: true), and TWO options must be incorrect (isCorrect: false).
5. RANDOMLY place the correct answer among options (it can be option 1, 2, or 3 with equal probability).
6. Each option must include a short helpful explanation of why it is right or wrong in ${isHe ? 'Hebrew' : 'English'}.

Respond in JSON with the exact schema:
{
  "id": "ai-${Date.now()}",
  "title": "string",
  "concept": "string",
  "codeSnippet": "string",
  "language": "${language}",
  "question": "string",
  "options": [
    { "id": "opt-1", "text": "string", "isCorrect": boolean, "explanation": "string" },
    { "id": "opt-2", "text": "string", "isCorrect": boolean, "explanation": "string" },
    { "id": "opt-3", "text": "string", "isCorrect": boolean, "explanation": "string" }
  ],
  "xpReward": 25,
  "difficulty": "${difficulty}",
  "tip": "string"
}
Return ONLY valid JSON.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        // Ensure options are properly formatted and exactly 3 options
        if (parsed.options && Array.isArray(parsed.options) && parsed.options.length >= 3) {
          return res.json(parsed);
        }
      } catch (e) {
        console.warn('AI JSON parsing error, using fallback:', e);
      }
    }

    // High quality deterministic fallbacks with randomized answer position
    const fallbackTemplates = [
      {
        id: `ai-gen-${Date.now()}-1`,
        title: isHe ? 'חיתוך רשימות ואינדקסים' : 'List Slicing & Indices',
        concept: isHe ? 'בפייתון, חיתוך רשימה [start:stop:step] אינו כולל את האינדקס העליון (stop).' : 'In Python, slice notation [start:stop:step] is non-inclusive of the stop index.',
        codeSnippet: `fruits = ["apple", "banana", "cherry", "date", "elderberry"]
selected = fruits[1:4:2]
print(selected)`,
        language: 'python',
        question: isHe ? 'מה יודפס למסך לאחר הרצת הקוד?' : 'What will be printed to the console after executing this code?',
        options: [
          { id: 'opt-1', text: isHe ? '[\'apple\', \'cherry\']' : "['apple', 'cherry']", isCorrect: false, explanation: isHe ? 'אינדקס 1 מתחיל מ-banana, לא מ-apple.' : 'Index 1 starts at banana, not apple.' },
          { id: 'opt-2', text: isHe ? '[\'banana\', \'date\']' : "['banana', 'date']", isCorrect: true, explanation: isHe ? 'נכון מאוד! מתחיל באינדקס 1 (banana), קופץ 2 מדרגות ומגיע לאינדקס 3 (date).' : 'Correct! Starts at index 1 (banana), steps by 2 to index 3 (date).' },
          { id: 'opt-3', text: isHe ? '[\'banana\', \'cherry\', \'date\']' : "['banana', 'cherry', 'date']", isCorrect: false, explanation: isHe ? 'הפרמטר step הוא 2, לכן יש דילוג על cherry.' : 'The step argument is 2, so cherry is skipped.' }
        ],
        xpReward: 25,
        difficulty: 'Beginner',
        tip: isHe ? 'זכור: אינדקסים בפייתון מתחילים מ-0, והגבול העליון אינו נכלל.' : 'Remember: 0-indexed and upper boundary is exclusive.'
      },
      {
        id: `ai-gen-${Date.now()}-2`,
        title: isHe ? 'פונקציות חץ וטווח לקסיקלי ב-JS' : 'Arrow Functions & Lexical Scope',
        concept: isHe ? 'פונקציות חץ ב-JavaScript אינן מקבלות ערך this משלהן אלא יורשות אותו מההקשר החיצוני.' : 'Arrow functions in JS do not bind their own "this", inheriting it lexically from surrounding scope.',
        codeSnippet: `const calculator = {
  factor: 3,
  multiply: (arr) => arr.map(n => n * this.factor)
};
console.log(calculator.multiply([1, 2]));`,
        language: 'javascript',
        question: isHe ? 'מדוע התוצאה אינה [3, 6] בסביבת דפדפן רגילה?' : 'Why does this not return [3, 6] in a standard browser environment?',
        options: [
          { id: 'opt-1', text: isHe ? 'כי פונקציית חץ משתמשת ב-this לקסיקלי שאינו מצביע לאובייקט calculator אלא ל-window' : 'Because arrow functions inherit lexical "this", which is window/undefined instead of calculator', isCorrect: true, explanation: isHe ? 'מדויק! מתודות אובייקט צריכות להיכתב כפונקציה רגילה (multiply(arr)) כדי ש-this יצביע לאובייקט.' : 'Spot on! Object methods should use standard syntax so "this" binds to the instance.' },
          { id: 'opt-2', text: isHe ? 'כי map אינה תומכת בהכפלת מספרים' : 'Because Array.prototype.map cannot multiply integers', isCorrect: false, explanation: isHe ? 'map תומכת בכל פעולה חשבונית.' : 'map supports any mathematical transform.' },
          { id: 'opt-3', text: isHe ? 'כי חובה להשתמש בלולאת for' : 'Because for loops are mandatory in object methods', isCorrect: false, explanation: isHe ? 'map היא פונקציה מובנית תקנית.' : 'map is standard JS.' }
        ],
        xpReward: 30,
        difficulty: 'Intermediate',
        tip: isHe ? 'השתמש בפונקציות רגילות כשאתה מגדיר מתודות של אובייקטים.' : 'Use standard function syntax for object methods.'
      },
      {
        id: `ai-gen-${Date.now()}-3`,
        title: isHe ? 'דליפת זיכרון בסגירים (Closures)' : 'Memory Leaks in Closures',
        concept: isHe ? 'החזקת הפניות ישירות לאובייקטים כבדים בתוך קולבק מונעת מ-Garbage Collector לפנות זיכרון.' : 'Retaining outer scope references inside event listener closures prevents Garbage Collection.',
        codeSnippet: `function setupListener() {
  const hugeData = new Array(1000000).fill("heavy payload");
  window.addEventListener('resize', () => {
    console.log("Window resized!", hugeData.length);
  });
}`,
        language: 'typescript',
        question: isHe ? 'איזו בעיית ארכיטקטורה קיימת בקוד זה?' : 'What architectural defect exists in this code?',
        options: [
          { id: 'opt-1', text: isHe ? 'שגיאת תחביר בהקצאת המערך' : 'Syntax error in Array allocation', isCorrect: false, explanation: isHe ? 'התחביר תקין לחלוטין.' : 'Syntax is valid.' },
          { id: 'opt-2', text: isHe ? 'דליפת זיכרון (Memory Leak) כיוון ש-hugeData נשאר תקוע בזיכרון כל עוד ה-listener קיים' : 'Memory Leak because hugeData is retained in the listener closure forever', isCorrect: true, explanation: isHe ? 'נכון מאוד! המאזין גלובלי (window) ולכן המערך הענק לעולם לא ינוקה מה-RAM.' : 'Correct! Global listener retains the huge array in memory indefinitely.' },
          { id: 'opt-3', text: isHe ? 'הדפדפן יקרוס מיד בהרצת השורה הראשונה' : 'The browser will instantly throw a stack overflow', isCorrect: false, explanation: isHe ? 'הקצאת מערך של מיליון איברים אינה גורמת ל-stack overflow.' : 'Not a stack overflow.' }
        ],
        xpReward: 35,
        difficulty: 'Advanced',
        tip: isHe ? 'נקה תמיד Event Listeners כשאין בהם צורך.' : 'Always clean up event listeners when unmounting.'
      }
    ];

    // Pick a random template and shuffle its options
    const selected = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
    const shuffledOptions = [...selected.options].sort(() => Math.random() - 0.5);

    return res.json({
      ...selected,
      id: `ai-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      options: shuffledOptions,
    });
  } catch (error) {
    console.error('AI Exercise generation error:', error);
    return res.status(500).json({ error: 'Failed to generate exercise' });
  }
});

/**
 * AI Memory Performance Analysis & Feedback Endpoint
 */
app.post('/api/ai-feedback', async (req, res) => {
  try {
    const { 
      exerciseType, 
      palaceTitle, 
      accuracy, 
      score, 
      durationSeconds, 
      itemsAttempted, 
      itemsCorrect, 
      lociResults, 
      language 
    } = req.body;

    const isHe = language === 'he';

    if (genAI) {
      const prompt = `You are a world-class cognitive memory coach and Grandmaster of Memory (fluent in English and Hebrew).
Analyze this user's memory training session and generate constructive, encouraging, and actionable feedback on their technique.

Session Data:
- Exercise Type: ${exerciseType}
- Palace / Journey: ${palaceTitle || 'General Practice'}
- Accuracy: ${accuracy}% (${itemsCorrect}/${itemsAttempted} items recalled)
- Time Taken: ${durationSeconds} seconds
- Loci / Items Breakdown: ${JSON.stringify(lociResults || [])}
- Target Language: ${isHe ? 'Hebrew (עברית)' : 'English'}

Provide your response in JSON with the exact following schema:
{
  "overallAssessment": "string (warm, motivating 2-3 sentences evaluating the session)",
  "techniqueRating": "Novice" | "Practitioner" | "Adept" | "Grandmaster",
  "strengths": ["string", "string"],
  "weaknesses": ["string", "string"],
  "actionableTips": ["string (concrete technique like visual exaggeration, sensory tagging, or route pacing)", "string"],
  "recommendedDrills": ["string", "string"],
  "lociAnalysis": [
    {
      "locusName": "string",
      "status": "solid" | "shaky" | "missed",
      "diagnostic": "string"
    }
  ]
}

Ensure all text values are written in ${isHe ? 'Hebrew (עברית with natural technical terminology)' : 'English'}. Return ONLY pure JSON.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      try {
        const parsed = JSON.parse(responseText);
        return res.json(parsed);
      } catch {
        // Fallback to text inside structure
      }
    }

    // High-quality deterministic fallback if API key is not configured or fails
    const fallbackReport = {
      overallAssessment: isHe
        ? `ביצוע מרשים של ${accuracy}% בדיוק הזכירה! שיטת הארמון המרחבית מייצרת אצלך עוגנים קוגניטיביים יציבים, במיוחד בשלבים הראשונים של המסלול.`
        : `Impressive recall performance of ${accuracy}% accuracy! Your spatial palace anchors are establishing durable neural pathways, especially across the initial loci.`,
      techniqueRating: accuracy >= 90 ? 'Grandmaster' : accuracy >= 75 ? 'Adept' : accuracy >= 50 ? 'Practitioner' : 'Novice',
      strengths: isHe
        ? [
            'שליפה מדויקת של מושגי יסוד ומשתנים',
            'קצב שיטוט עקבי לאורך מסלול החדרים',
            'חיבור ויזואלי ברור בין העצם למיקום המרחבי',
          ]
        : [
            'High retention on foundational programming concepts and variables',
            'Steady spatial pacing through sequential rooms without skipping',
            'Strong visual encoding between objects and physical loci',
          ],
      weaknesses: isHe
        ? [
            'האטה מסוימת במעבר מחדרים פנימיים למרחבים פתוחים',
            'שמירת פרטים עדינים בתחביר מורכב דורשת חידוד תחושתי',
          ]
        : [
            'Slight latency drop when transitioning from interior rooms to outdoor loci',
            'Subtle syntax details require more exaggerated multisensory exaggeration',
          ],
      actionableTips: isHe
        ? [
            'השתמש בהגזמה חושית: דמיין צבעים בוהקים, תנועה חדה או צליל דרמטי בכל עוגן זיכרון.',
            'תרגל שינון הפוך: נסה ללכת בארמון מהסוף להתחלה כדי לבחון שליפה דו-כיוונית.',
            'חבר רגש: קשר כל מושג תכנותי לתחושת הצלחה או הפתעה משעשעת.',
          ]
        : [
            'Apply Multisensory Exaggeration: Amplify size, neon colors, and physical sounds at each locus.',
            'Reverse Walk Drill: Traverse your palace backward to prove bidirectional associative recall.',
            'Action Anchoring: Ensure items interact actively with the furniture rather than resting passively.',
          ],
      recommendedDrills: isHe
        ? [
            'אימון שליפה מהיר תחת לחץ זמנים (Sprint Recall)',
            'שינון רצפי קוד וארכיטקטורה בארמון הייטק',
          ]
        : [
            'Timed Sprint Recall (under 45 seconds)',
            'High-Density Loci Stacking in the Tech Loft',
          ],
      lociAnalysis: (lociResults || []).map((locus: { name?: string; nameHe?: string; correct?: boolean }) => ({
        locusName: isHe ? (locus.nameHe || locus.name || 'עוגן') : (locus.name || 'Locus'),
        status: locus.correct ? 'solid' : 'shaky',
        diagnostic: locus.correct
          ? (isHe ? 'עוגן מרחבי מוצק ושליפה מיידית' : 'Solid sensory imprint with immediate recall')
          : (isHe ? 'נדרשת הגזמה חזותית חדה יותר בעוגן זה' : 'Needs sharper visual contrast and animated interaction'),
      })),
    };

    return res.json(fallbackReport);
  } catch (error) {
    console.error('AI Feedback endpoint error:', error);
    return res.status(500).json({ error: 'Failed to generate AI memory feedback' });
  }
});

/**
 * Mount Vite in dev mode, or serve static dist in production
 */
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
