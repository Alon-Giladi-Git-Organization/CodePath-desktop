import { ArchitectureChallenge } from '../types';

export const ARCHITECTURE_CHALLENGES: ArchitectureChallenge[] = [
  {
    id: 'arch-n-plus-one',
    title: 'The Database Loop Storm (N+1 Query Pattern)',
    titleHe: 'סופת שאילתות בלולאה (דפוס N+1)',
    category: 'scalability',
    difficulty: 'Intermediate',
    scenarioDescription: 'An e-commerce API endpoint retrieves the latest 500 customer orders and enriches each order with customer profile information.',
    scenarioDescriptionHe: 'נקודת קצה (API) בחנות מקוונת שולפת את 500 ההזמנות האחרונות ומעשירה כל הזמנה בפרטי הפרופיל של הלקוח.',
    language: 'typescript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'N+1 Query Storm & Connection Pool Exhaustion',
    antiPatternNameHe: 'צוואר בקבוק N+1 ומיצוי מאגר חיבורי המסד (Pool Exhaustion)',
    architecturalPrinciple: 'Batch Data Fetching & Eager Loading',
    architecturalPrincipleHe: 'שליפת נתונים מרוכזת (Batching) וטעינה ישירה (Eager Loading)',
    codeSnippet: `// GET /api/admin/recent-orders
export async function getRecentOrders(req: Request, res: Response) {
  // 1. Fetch 500 recent orders (Query #1)
  const orders = await db.query('SELECT id, user_id, total, status FROM orders LIMIT 500');

  const enrichedOrders = [];
  
  // 💥 DANGER: Querying inside a loop! Generates 500 additional database roundtrips!
  for (const order of orders) {
    const user = await db.query(
      'SELECT id, name, email, tier FROM users WHERE id = ?', 
      [order.user_id]
    );
    enrichedOrders.push({
      ...order,
      customer: user[0] || null
    });
  }

  return res.json({ orders: enrichedOrders });
}`,
    diagnosticQuestion: 'Why is this architectural design dangerous for production scale?',
    diagnosticQuestionHe: 'מדוע תכנון ארכיטקטוני זה מסוכן ביותר בסביבת פרודקשן עם משתמשים אמיתיים?',
    diagnosticOptions: [
      {
        id: 'diag-1-wrong-1',
        text: 'The orders array should use Array.map instead of a for...of loop for faster asynchronous execution.',
        isCorrect: false,
        explanation: 'Array.map with Promise.all still fires 500 individual queries simultaneously, worsening database connection saturation.'
      },
      {
        id: 'diag-1-correct',
        text: 'It triggers 501 distinct database round-trips for a single HTTP request, exhausting the connection pool and causing massive latency spikes.',
        isCorrect: true,
        explanation: 'Correct! 1 query for orders + 500 individual queries for users = 501 network roundtrips. Under multiple concurrent requests, database connections are instantly exhausted.'
      },
      {
        id: 'diag-1-wrong-2',
        text: 'The code should use MongoDB instead of SQL to solve loop queries.',
        isCorrect: false,
        explanation: 'The N+1 pattern is an architectural data access anti-pattern that affects SQL and NoSQL equally when queries are executed inside iterative loops.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-1-wrong-1',
        text: 'הבעיה היא שלא השתמשו ב-Array.map במקום לולאת for...of.',
        isCorrect: false,
        explanation: 'שימוש ב-map עם Promise.all עדיין ישגר 500 שאילתות נפרדות במקביל ויציף את מסד הנתונים בעוצמה גבוהה אף יותר.'
      },
      {
        id: 'diag-1-correct',
        text: 'הקוד מייצר 501 קריאות רשת נפרדות למסד עבור בקשת HTTP בודדת, מה שחונק את מאגר החיבורים (Connection Pool) ומקפיץ את זמני התגובה.',
        isCorrect: true,
        explanation: 'מדויק! שאילתה אחת עבור ההזמנות + 500 שאילתות נפרדות עבור הלקוחות = 501 קריאות רשת. בעומס של משתמשים מרובים, מאגר החיבורים קורס מיד.'
      },
      {
        id: 'diag-1-wrong-2',
        text: 'הבעיה נובעת משימוש ב-SQL במקום במסד NoSQL.',
        isCorrect: false,
        explanation: 'תבנית N+1 היא בעיית ארכיטקטורה של גישה לנתונים שפוגעת בכל מסד נתונים כאשר שולפים נתונים בתוך לולאה.'
      }
    ],
    productionImpactQuestion: 'What will happen when 100 concurrent administrators access this endpoint?',
    productionImpactQuestionHe: 'מה יקרה בפרודקשן כאשר 100 מנהלים ייגשו לעמוד זה בו-זמנית?',
    productionImpactOptions: [
      {
        id: 'prod-1-wrong-1',
        text: 'The browser client will run out of CSS styles and render raw HTML.',
        isCorrect: false,
        explanation: 'CSS rendering is unrelated to backend database connection exhaustion.'
      },
      {
        id: 'prod-1-wrong-2',
        text: 'Orders will be duplicated in the database.',
        isCorrect: false,
        explanation: 'SELECT queries do not write or duplicate data, but they exhaust server memory and socket descriptors.'
      },
      {
        id: 'prod-1-correct',
        text: '50,100 database queries flood the server, crashing the DB connection pool with HTTP 504 Gateway Timeout errors.',
        isCorrect: true,
        explanation: 'Exactly! 100 requests × 501 queries = 50,100 queries. Latency jumps from 15ms to over 5,000ms and the app crashes.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-1-wrong-1',
        text: 'הדפדפן יאבד את קובצי העיצוב (CSS).',
        isCorrect: false,
        explanation: 'קובצי עיצוב אינם קשורים לקריסת מאגר החיבורים בשרת הנתונים.'
      },
      {
        id: 'prod-1-wrong-2',
        text: 'ההזמנות ישוכפלו במסד הנתונים.',
        isCorrect: false,
        explanation: 'שאילתות SELECT אינן משכפלות נתונים, אך הן תוקעות את המערכת.'
      },
      {
        id: 'prod-1-correct',
        text: '50,100 שאילתות יציפו את מסד הנתונים, ימצו את מאגר החיבורים ויגרמו לקריסת HTTP 504 Gateway Timeout.',
        isCorrect: true,
        explanation: 'בדיוק! 100 בקשות כפול 501 שאילתות = 50,100 שאילתות. זמני התגובה יזנקו משבריר שנייה ל-5 שניות והשרת ייפול.'
      }
    ],
    simulatedMetrics: {
      loadRps: 100,
      bad: {
        cpuPercent: 96,
        memoryMb: 612,
        latencyMs: 4850,
        errorRatePercent: 68,
        crashReason: 'ConnectionPoolTimeout: 50,000 queries queued. DB connection pool max (20) exceeded.',
        crashReasonHe: 'שגיאת תפוסת מאגר: מעל 50,000 שאילתות בתור. חריגה מקיבולת החיבורים למסד הנתונים.'
      },
      good: {
        cpuPercent: 14,
        memoryMb: 86,
        latencyMs: 18,
        errorRatePercent: 0
      }
    },
    badCodeExplanation: 'The code executes an independent database query inside an iteration block for every single order. This architectural defect is known as the N+1 Query Problem.',
    badCodeExplanationHe: 'הקוד מבצע שאילתה נפרדת למסד הנתונים בתוך לולאה עבור כל הזמנה בודדת. פגם ארכיטקטוני זה מכונה בעיית N+1.',
    goodCodeSnippet: `// GET /api/admin/recent-orders (SCALABLE & EFFICIENT)
export async function getRecentOrders(req: Request, res: Response) {
  // 1. Fetch orders
  const orders = await db.query('SELECT id, user_id, total, status FROM orders LIMIT 500');
  if (orders.length === 0) return res.json({ orders: [] });

  // 2. Collect unique user IDs into an indexed set
  const userIds = [...new Set(orders.map(o => o.user_id))];

  // 3. Single batch query with SQL IN operator (1 round-trip instead of 500!)
  const users = await db.query(
    'SELECT id, name, email, tier FROM users WHERE id IN (?)',
    [userIds]
  );
  
  // 4. O(1) hash map lookup for lightning-fast in-memory stitching
  const userMap = new Map(users.map(u => [u.id, u]));

  const enrichedOrders = orders.map(order => ({
    ...order,
    customer: userMap.get(order.user_id) || null
  }));

  return res.json({ orders: enrichedOrders });
}`,
    goodCodeExplanation: 'By collecting all IDs and performing a single batched query using the SQL IN clause, the network overhead is cut from 501 trips down to 2 trips. Total response time drops from 4,850ms to 18ms.',
    goodCodeExplanationHe: 'על ידי איסוף כל המזהים וביצוע שאילתת Batch אחת מרוכזת עם סעיף IN, מספר קריאות הרשת צונח מ-501 ל-2 בלבד! זמן התגובה יורד מ-4.8 שניות ל-18 מילישניות בלבד.',
    keyTakeaways: [
      'Never execute database queries, HTTP requests, or heavy disk I/O inside iterative loops.',
      'Batch IDs using SQL IN operators or JOIN clauses.',
      'Use fast O(1) in-memory HashMaps to link relations together.'
    ],
    keyTakeawaysHe: [
      'לעולם אל תריץ שאילתות למסד נתונים או קריאות רשת בתוך לולאות.',
      'רכז מזהים ובצע שאילתה יחידה בעזרת IN או JOIN.',
      'השתמש ב-HashMaps בזיכרון (O(1)) לחיבור ישיר ומהיר בין הישויות.'
    ],
    xpReward: 45
  },
  {
    id: 'arch-memory-leak-frontend',
    title: 'The Ghost Listener Memory Leak (Frontend Lifecycle)',
    titleHe: 'דליפת זיכרון ממאזינים נטושים (Lifecycle בפרונטאנד)',
    category: 'frontend',
    difficulty: 'Intermediate',
    scenarioDescription: 'A live crypto tracking component listens to global window scroll/resize events and polls live market tickers.',
    scenarioDescriptionHe: 'רכיב מעקב מחירי קריפטו בזמן אמת מאזין לאירועי גלילה ושינוי גודל חלון ודוגם נתוני מסחר.',
    language: 'typescript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'Uncleaned Event Listener & Detached DOM Memory Leak',
    antiPatternNameHe: 'דליפת זיכרון של מאזיני אירועים ללא שחרור (Memory Leak)',
    architecturalPrinciple: 'Deterministic Resource Cleanup & Garbage Collection Friendliness',
    architecturalPrincipleHe: 'שחרור משאבים דטרמיניסטי ותאימות ל-Garbage Collector',
    codeSnippet: `// LiveTickerChart.tsx
import React, { useEffect, useState } from 'react';

export const LiveTickerChart: React.FC = () => {
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    // 💥 DANGER: Adding high-frequency listener without cleanup!
    window.addEventListener('resize', () => {
      recalculateChartDimensions();
    });

    // 💥 DANGER: Uncleaned interval continues running even after unmount!
    setInterval(async () => {
      const res = await fetch('/api/live-rates');
      const data = await res.json();
      setTickerData(data); // State update on unmounted component!
    }, 1000);

    // MISSING: return () => { cleanup(); }
  }, []);

  return <div className="chart-container">Chart Live Data</div>;
};`,
    diagnosticQuestion: 'What catastrophic issue occurs as users navigate back and forth between pages in this app?',
    diagnosticQuestionHe: 'מה יקרה כאשר המשתמש ינווט הלוך ושוב בין עמודים באפליקציה זו?',
    diagnosticOptions: [
      {
        id: 'diag-2-correct',
        text: 'Every visit creates orphaned intervals and window listeners that can never be garbage collected, causing runaway RAM growth and browser tab crashes.',
        isCorrect: true,
        explanation: 'Correct! Because the component never detaches its listeners or cancels its timer, old closures remain permanently pinned in browser RAM.'
      },
      {
        id: 'diag-2-wrong-1',
        text: 'React will automatically clean up all window event listeners upon component destruction.',
        isCorrect: false,
        explanation: 'Incorrect! The browser window object is global; React cannot automatically unbind manual window listeners.'
      },
      {
        id: 'diag-2-wrong-2',
        text: 'The chart will display inverted colors.',
        isCorrect: false,
        explanation: 'Memory leaks cause memory exhaustion and browser tab death, not visual color inversion.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-2-correct',
        text: 'כל כניסה לעמוד מייצרת טיימרים ומאזינים יתומים שמונעים שחרור זיכרון, מה שמוביל לגידול בלתי פוסק בצריכת ה-RAM ולקריסת לשונית הדפדפן.',
        isCorrect: true,
        explanation: 'מדויק! מאחר שהרכיב אינו מנקה את המאזין או הטיימר, אובייקט ה-window הגלובלי מחזיק אותם בזיכרון לנצח.'
      },
      {
        id: 'diag-2-wrong-1',
        text: 'ריאקט מנקה באופן אוטומטי את כל המאזינים של window בהריסת הרכיב.',
        isCorrect: false,
        explanation: 'לא נכון! אובייקט window הוא גלובלי לדפדפן; ריאקט לא יכולה לנחש או להסיר מאזינים שהוגדרו ידנית.'
      },
      {
        id: 'diag-2-wrong-2',
        text: 'הגרף יוצג בצבעים הפוכים.',
        isCorrect: false,
        explanation: 'דליפת זיכרון גורמת לאיטיות ולנפילת הלשונית, ולא להשפעה על צבעי הגרף.'
      }
    ],
    productionImpactQuestion: 'How does this bug manifest in user sessions after 15 minutes of app usage?',
    productionImpactQuestionHe: 'כיצד תקלה זו תבוא לידי ביטוי במחשבי המשתמשים לאחר 15 דקות שימוש?',
    productionImpactOptions: [
      {
        id: 'prod-2-wrong-1',
        text: 'The server shuts down due to database deadlock.',
        isCorrect: false,
        explanation: 'This is a client-side frontend browser lifecycle bug, not a database transaction deadlock.'
      },
      {
        id: 'prod-2-correct',
        text: 'The browser tab climbs from 40 MB to over 1.5 GB of RAM, UI lags to single-digit FPS, and the browser crashes with "Aw, Snap! Out of Memory".',
        isCorrect: true,
        explanation: 'Spot on! Hundreds of redundant timers firing every second consume all CPU cores and blow past memory caps.'
      },
      {
        id: 'prod-2-wrong-2',
        text: 'The user will be logged out of their operating system.',
        isCorrect: false,
        explanation: 'Browsers are sandboxed; only the tab or browser process is affected.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-2-wrong-1',
        text: 'השרת המרכזי ייכבה עקב נעילת מסד נתונים.',
        isCorrect: false,
        explanation: 'מדובר בבאג צד-לקוח בדפדפן ולא בנעילת טרנזקציות במסד נתונים.'
      },
      {
        id: 'prod-2-correct',
        text: 'צריכת הזיכרון של הלשונית מזנקת מ-40MB למעל 1.5GB, ממשק המשתמש מתחיל לגמגם, ולבסוף הדפדפן קורס עם הודעת Out of Memory.',
        isCorrect: true,
        explanation: 'בול! עשרות טיימרים שממשיכים לרוץ ברקע חונקים את ה-CPU ומציפים את הזיכרון עד לקריסה.'
      },
      {
        id: 'prod-2-wrong-2',
        text: 'המשתמש ינותק ממערכת ההפעלה שלו.',
        isCorrect: false,
        explanation: 'הדפדפן רץ בארגז חול (Sandbox), לכן רק הלשונית הספציפית תקרוס.'
      }
    ],
    simulatedMetrics: {
      loadRps: 1,
      bad: {
        cpuPercent: 88,
        memoryMb: 1420,
        latencyMs: 950,
        errorRatePercent: 100,
        crashReason: 'Browser OutOfMemory: DOM detached nodes = 4,210. Uncaught (in promise) on unmounted component.',
        crashReasonHe: 'קריסת זיכרון דפדפן (OOM): מעל 4,200 צמתי DOM מנותקים שמורים בזיכרון.'
      },
      good: {
        cpuPercent: 3,
        memoryMb: 38,
        latencyMs: 12,
        errorRatePercent: 0
      }
    },
    badCodeExplanation: 'Missing teardown logic inside useEffect leaves global handlers and timers permanently attached to the window object, retaining all component closures in memory.',
    badCodeExplanationHe: 'היעדר פונקציית ניקוי (cleanup) ב-useEffect משאיר מאזינים וטיימרים מחוברים לנצח לחלון הגלובלי, מה שמונע שחרור זיכרון.',
    goodCodeSnippet: `// LiveTickerChart.tsx (CLEAN, SAFE & LEAK-FREE)
import React, { useEffect, useState } from 'react';

export const LiveTickerChart: React.FC = () => {
  const [tickerData, setTickerData] = useState([]);

  useEffect(() => {
    // 1. AbortController to cancel inflight fetch requests on unmount
    const abortController = new AbortController();

    const handleResize = () => {
      recalculateChartDimensions();
    };

    window.addEventListener('resize', handleResize);

    const intervalId = window.setInterval(async () => {
      try {
        const res = await fetch('/api/live-rates', { signal: abortController.signal });
        const data = await res.json();
        setTickerData(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
        }
      }
    }, 1000);

    // ✨ CLEAN ARCHITECTURE: Deterministic teardown on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearInterval(intervalId);
      abortController.abort(); // Cancel any pending network stream!
    };
  }, []);

  return <div className="chart-container">Chart Live Data</div>;
};`,
    goodCodeExplanation: 'The return function cleans up listeners and intervals when the component unmounts. An AbortController ensures no state is set on dead components.',
    goodCodeExplanationHe: 'פונקציית ה-cleanup מסירה את המאזין ומנקה את האינטרוול בהריסת הרכיב. בנוסף, AbortController מבטל קריאות רשת תלויות ומגן על תקינות המערכת.',
    keyTakeaways: [
      'Always return a cleanup function from useEffect when subscribing to external resources.',
      'Use AbortController to cancel pending HTTP fetches when components unmount.',
      'Clear window intervals and event listeners to prevent garbage collector leaks.'
    ],
    keyTakeawaysHe: [
      'החזר תמיד פונקציית ניקוי (cleanup) מתוך useEffect בעת הרשמה למשאבים חיצוניים.',
      'השתמש ב-AbortController לביטול קריאות רשת בעת פירוק הרכיב.',
      'בטל טיימרים (clearInterval) ומאזיני אירועים כדי לאפשר פינוי זיכרון תקין.'
    ],
    xpReward: 45
  },
  {
    id: 'arch-unindexed-db-scan',
    title: 'The Full Table Scan Apocalypse (Missing Database Index)',
    titleHe: 'שריפת מעבד המסד עקב היעדר אינדקס (Full Table Scan)',
    category: 'scalability',
    difficulty: 'Intermediate',
    scenarioDescription: 'A multi-tenant SaaS application queries users by email address or workspace tenant identifier during authentication.',
    scenarioDescriptionHe: 'אפליקציית ענן שולפת משתמשים לפי כתובת דוא"ל או מזהה ארגון בכל פעולת התחברות של עובד.',
    language: 'typescript',
    expectedQuality: 'bad_crashing',
    antiPatternName: 'O(N) Full Table Scan on High-Volume Table',
    antiPatternNameHe: 'סריקת טבלה מלאה O(N) על טבלה בעלת מיליוני רשומות',
    architecturalPrinciple: 'B-Tree Indexing & Deterministic Query Execution Plans',
    architecturalPrincipleHe: 'אינדוקס B-Tree יעיל ותוכניות ביצוע שאילתות (Execution Plan)',
    codeSnippet: `// authRepository.ts
export async function findUserByEmail(email: string) {
  // 💥 TABLE SCHEMA:
  // CREATE TABLE users (
  //   id BIGINT PRIMARY KEY AUTO_INCREMENT,
  //   email VARCHAR(255), -- 💥 NO INDEX ON EMAIL!
  //   password_hash VARCHAR(255),
  //   created_at TIMESTAMP
  // );

  // At 10,000,000 rows, this query reads 10M rows from disk for every login attempt!
  const [user] = await db.query(
    'SELECT id, password_hash FROM users WHERE email = ?',
    [email.toLowerCase()]
  );
  return user;
}`,
    diagnosticQuestion: 'What occurs inside the database engine when querying an unindexed column on a 10M row table?',
    diagnosticQuestionHe: 'מה מתרחש בתוך מנוע מסד הנתונים בעת שאילתה על עמודה ללא אינדקס בטבלה של 10 מיליון שורות?',
    diagnosticOptions: [
      {
        id: 'diag-3-wrong-1',
        text: 'The database server immediately compiles the JavaScript to WebAssembly.',
        isCorrect: false,
        explanation: 'SQL query engines do not compile JavaScript.'
      },
      {
        id: 'diag-3-correct',
        text: 'The database must scan all 10,000,000 disk pages sequentially (O(N) Full Table Scan), spiking disk I/O and locking CPU cores at 100%.',
        isCorrect: true,
        explanation: 'Without a B-Tree index, the database has no choice but to read every single row in physical storage from start to finish.'
      },
      {
        id: 'diag-3-wrong-2',
        text: 'The query will return wrong password hashes for valid users.',
        isCorrect: false,
        explanation: 'The result is still accurate, but it takes 15 seconds instead of 1 millisecond.'
      }
    ],
    diagnosticOptionsHe: [
      {
        id: 'diag-3-wrong-1',
        text: 'מסד הנתונים מקמפל את הקוד ל-WebAssembly.',
        isCorrect: false,
        explanation: 'מנוע מסד נתונים אינו מקמפל ג\'אווהסקריפט.'
      },
      {
        id: 'diag-3-correct',
        text: 'המסד נאלץ לקרוא ברצף 10,000,000 שורות מהדיסק (Full Table Scan), מה שמקפיץ את ה-Disk I/O וחונק את ה-CPU ב-100%.',
        isCorrect: true,
        explanation: 'ללא אינדקס B-Tree, מנוע המסד מחויב לבדוק כל שורה בטבלה מהראשונה ועד האחרונה.'
      },
      {
        id: 'diag-3-wrong-2',
        text: 'השאילתה תחזיר סיסמאות שגויות למשתמשים תקינים.',
        isCorrect: false,
        explanation: 'התוצאה תהיה נכונה, אך היא תארך 15 שניות במקום מילישנייה אחת.'
      }
    ],
    productionImpactQuestion: 'What happens during Monday morning peak login hours (500 logins/sec)?',
    productionImpactQuestionHe: 'מה יתרחש ביום שני בבוקר כאשר אלפי עובדים מתחברים למערכת בו-זמנית?',
    productionImpactOptions: [
      {
        id: 'prod-4-correct',
        text: 'Database disk I/O queues blow up, query latency skyrockets from 2ms to 25,000ms, and all APIs freeze across the entire platform.',
        isCorrect: true,
        explanation: '500 logins/sec × 10M rows = 5 billion row inspections per second. The storage subsystem locks up completely.'
      },
      {
        id: 'prod-4-wrong-1',
        text: 'The frontend CSS resets to default black-and-white theme.',
        isCorrect: false,
        explanation: 'CSS stylesheets are client-side assets cached in browser memory.'
      },
      {
        id: 'prod-4-wrong-2',
        text: 'User email addresses are deleted from the database.',
        isCorrect: false,
        explanation: 'SELECT statements are read-only and do not delete rows.'
      }
    ],
    productionImpactOptionsHe: [
      {
        id: 'prod-4-correct',
        text: 'תורי ה-I/O של הדיסק קורסים, זמני התגובה מזנקים מ-2 מילישניות ל-25 שניות, וכל שירותי הפלטפורמה נתקעים לחלוטין.',
        isCorrect: true,
        explanation: '500 התחברויות בשנייה כפול 10 מיליון שורות = 5 מיליארד סריקות בשנייה. שרת הנתונים קופא לחלוטין.'
      },
      {
        id: 'prod-4-wrong-1',
        text: 'קובצי ה-CSS של הפרונטאנד יימחקו.',
        isCorrect: false,
        explanation: 'עיצוב הדפדפן אינו מושפע מביצועי מסד הנתונים.'
      },
      {
        id: 'prod-4-wrong-2',
        text: 'כתובות הדוא"ל של המשתמשים יימחקו.',
        isCorrect: false,
        explanation: 'שאילתות קריאה אינן מוחקות מידע.'
      }
    ],
    simulatedMetrics: {
      loadRps: 200,
      bad: {
        cpuPercent: 99,
        memoryMb: 1980,
        latencyMs: 14200,
        errorRatePercent: 82,
        crashReason: 'Deadlock & IOPS Maxout: 850 table scans running concurrently. Disk queue = 1,420 IOPS saturated.',
        crashReasonHe: 'מיצוי IOPS מוחלט: 850 סריקות טבלה רצות במקביל. תור הדיסק נחנק לחלוטין.',
      },
      good: {
        cpuPercent: 8,
        memoryMb: 120,
        latencyMs: 3,
        errorRatePercent: 0,
      }
    },
    badCodeExplanation: 'Without a B-Tree index on the email column, every single lookup requires scanning the entire disk file from start to finish.',
    badCodeExplanationHe: 'ללא אינדקס B-Tree על עמודת האימייל, כל שאילתה דורשת סריקה של כל קובץ הנתונים מהתחלה ועד הסוף.',
    goodCodeSnippet: `// Migration: Add unique B-Tree index
// ALTER TABLE users ADD UNIQUE INDEX idx_users_email (email);

export async function findUserByEmail(email: string) {
  // ✨ O(log N) indexed B-tree lookup: Inspects only 3 disk blocks instead of 10,000,000!
  const [user] = await db.query(
    'SELECT id, password_hash FROM users WHERE email = ?',
    [email.toLowerCase()]
  );
  return user;
}`,
    goodCodeExplanation: 'A B-tree index reduces search complexity from O(N) sequential scans down to O(log N) tree traversal. Query time drops from 14,000ms to 3ms.',
    goodCodeExplanationHe: 'אינדקס B-Tree מפחית את סיבוכיות החיפוש מ-O(N) ל-O(log N). זמני השאילתה צונחים מ-14 שניות ל-3 מילישניות בלבד.',
    keyTakeaways: [
      'Index every column used frequently in WHERE clauses, JOIN conditions, or ORDER BY statements.',
      'Monitor SQL execution plans (EXPLAIN) in CI/CD pipelines to catch full table scans before deployment.',
      'Remember that excessive indexes slow down writes; index thoughtfully based on read-to-write ratios.'
    ],
    keyTakeawaysHe: [
      'הוסף תמיד אינדקס על עמודות המשמשות לסינון (WHERE), חיבור (JOIN) או מיון.',
      'השתמש ב-EXPLAIN לניתוח תוכנית הביצוע של שאילתות כדי לתפוס Full Table Scans לפני הפרודקשן.',
      'שים לב שאינדקסים מרובים מאטים פעולות כתיבה (INSERT/UPDATE), לכן אינדקס בצורה שקולה.'
    ],
    xpReward: 50
  }
];
