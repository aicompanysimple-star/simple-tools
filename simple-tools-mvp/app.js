const STORAGE_KEYS = {
  tools: "simpleTools.tools.v2",
  prompts: "simpleTools.prompts.v1",
  promptPresetVersion: "simpleTools.prompts.presetVersion.v1",
  textCleaner: "simpleTools.textCleaner.v1",
  pomodoro: "simpleTools.pomodoro.v1",
  calculator: "simpleTools.calculator.v1",
  timezones: "simpleTools.timezones.v1",
  subscriptions: "simpleTools.subscriptions.v1",
  bookmarks: "simpleTools.bookmarks.v1",
  bookmarkFolders: "simpleTools.bookmarkFolders.v1",
  videoFinderApiKey: "simpleTools.videoFinder.apiKey.v1",
  videoFinderLastSearch: "simpleTools.videoFinder.lastSearch.v1",
  memos: "simpleTools.superMemo.notes.v1",
  activeView: "simpleTools.activeView.v1",
  memoAutoSaveEnabled: "simpleTools.superMemo.autoSaveEnabled.v1",
  theme: "simpleTools.theme.v1",
  sidebarCollapsed: "simpleTools.sidebarCollapsed.v1"
};

const WORD_IMAGE_MAX_WIDTH_PT = 451;
const MEMO_AUTO_SAVE_DB = "simpleTools.superMemo.autoSave.v1";
const MEMO_AUTO_SAVE_STORE = "handles";
const MEMO_AUTO_SAVE_HANDLE_KEY = "memoFile";
const GRAPH_ZOOM_MIN = 0.42;
const GRAPH_ZOOM_MAX = 3.4;
const GRAPH_SELECT_SCALE = 1.18;
const GRAPH_PAN_FRICTION = 0.0025;
const GRAPH_WHEEL_PAN_SPEED = 1.15;
const PROMPT_PRESET_VERSION = 1;
const TIMER_MODES = {
  focus: { label: "Focus", minutes: 25 },
  short: { label: "Break", minutes: 5 },
  long: { label: "Long", minutes: 15 }
};
const FEEDBACK_EMAIL = "aicompany.simple@gmail.com";
const VIDEO_API_ORDER = {
  relevance: "relevance",
  date: "date",
  oldest: "date",
  viewCount: "viewCount",
  title: "title",
  subscriberCount: "relevance"
};
let pomodoroFrame = null;
let timezoneClockFrame = null;

const timezoneCatalog = [
  { id: "tokyo", label: "Tokyo", zone: "Asia/Tokyo" },
  { id: "seoul", label: "Seoul", zone: "Asia/Seoul" },
  { id: "singapore", label: "Singapore", zone: "Asia/Singapore" },
  { id: "delhi", label: "Delhi", zone: "Asia/Kolkata" },
  { id: "dubai", label: "Dubai", zone: "Asia/Dubai" },
  { id: "london", label: "London", zone: "Europe/London" },
  { id: "berlin", label: "Berlin", zone: "Europe/Berlin" },
  { id: "new-york", label: "New York", zone: "America/New_York" },
  { id: "los-angeles", label: "Los Angeles", zone: "America/Los_Angeles" },
  { id: "san-francisco", label: "San Francisco", zone: "America/Los_Angeles" },
  { id: "sydney", label: "Sydney", zone: "Australia/Sydney" }
];

const defaultTimezoneIds = ["tokyo", "singapore", "london", "new-york", "los-angeles"];

const subscriptionTemplates = [
  { id: "netflix", name: "Netflix", icon: "N", logoSlug: "netflix", color: "#e50914" },
  { id: "amazon-prime", name: "Amazon Prime", icon: "P", logoSlug: "amazonprime", color: "#00a8e1" },
  { id: "youtube-premium", name: "YouTube Premium", icon: "YT", logoSlug: "youtube", color: "#ff0033" },
  { id: "spotify", name: "Spotify", icon: "S", logoSlug: "spotify", color: "#1db954" },
  { id: "apple-music", name: "Apple Music", icon: "AM", logoSlug: "applemusic", color: "#fa2d48" },
  { id: "disney-plus", name: "Disney+", icon: "D+", logoSlug: "disneyplus", color: "#5a7cff" },
  { id: "u-next", name: "U-NEXT", icon: "U", color: "#00d4ff" },
  { id: "hulu", name: "Hulu", icon: "H", logoSlug: "hulu", color: "#1ce783" },
  { id: "dazn", name: "DAZN", icon: "D", logoSlug: "dazn", color: "#f8ff00" },
  { id: "abema", name: "ABEMAプレミアム", icon: "A", color: "#00c7b7" },
  { id: "d-anime", name: "dアニメストア", icon: "d", color: "#ff8a00" },
  { id: "kindle-unlimited", name: "Kindle Unlimited", icon: "K", logoSlug: "amazonkindle", color: "#ff9900" },
  { id: "audible", name: "Audible", icon: "Au", logoSlug: "audible", color: "#f7991c" },
  { id: "microsoft-365", name: "Microsoft 365", icon: "M", logoSlug: "microsoft365", color: "#7fba00" },
  { id: "adobe-cc", name: "Adobe Creative Cloud", icon: "A", logoSlug: "adobecreativecloud", color: "#ff0000" },
  { id: "canva-pro", name: "Canva Pro", icon: "C", logoSlug: "canva", color: "#00c4cc" },
  { id: "icloud", name: "iCloud+", icon: "iC", logoSlug: "icloud", color: "#75b8ff" },
  { id: "google-one", name: "Google One", icon: "G", logoSlug: "googleone", color: "#4285f4" },
  { id: "dropbox", name: "Dropbox", icon: "Db", logoSlug: "dropbox", color: "#0061ff" },
  { id: "notion", name: "Notion", icon: "N", logoSlug: "notion", color: "#111111" }
];

const toolCatalog = [
  {
    id: "superMemo",
    name: "Super Memo",
    description: "リンク、プロパティ、グラフ",
    available: true,
    view: "superMemo",
    featured: true
  },
  {
    id: "promptPad",
    name: "プロンプトパッド",
    description: "保存、検索、コピー",
    available: true,
    view: "promptPad"
  },
  {
    id: "textCleaner",
    name: "メモ整形",
    description: "会議、アイデア、TODO",
    available: true,
    view: "textCleaner"
  },
  {
    id: "pomodoro",
    name: "ポモドーロ",
    description: "静かな集中タイマー",
    available: true,
    view: "pomodoro"
  },
  {
    id: "timezones",
    name: "世界時計",
    description: "複数拠点の現在時刻",
    available: true,
    view: "timezones"
  },
  {
    id: "subscriptions",
    name: "サブスク管理",
    description: "登録日、更新日、料金",
    available: true,
    view: "subscriptions"
  },
  {
    id: "bookmarks",
    name: "ブックマーク",
    description: "リンクのダッシュボード",
    available: true,
    view: "bookmarks"
  },
  {
    id: "videoFinder",
    name: "動画検索",
    description: "YouTube候補の一致度確認",
    available: true,
    view: "videoFinder"
  },
  {
    id: "calculator",
    name: "電卓",
    description: "シンプルな計算と履歴",
    available: true,
    view: "calculator"
  },
  {
    id: "timeboxPlanner",
    name: "タイムボックス",
    description: "準備中",
    available: false,
    view: null
  }
];

const defaultTools = {
  superMemo: true,
  promptPad: true,
  textCleaner: true,
  pomodoro: true,
  timezones: true,
  subscriptions: true,
  bookmarks: true,
  videoFinder: true,
  calculator: true,
  timeboxPlanner: false
};

const templateBodies = {
  Meeting: [
    "## 要約",
    "",
    "## メモ",
    "",
    "## 決定事項",
    "",
    "## 次のアクション",
    "",
    "## 関連",
    ""
  ].join("\n"),
  Idea: [
    "## 思いつき",
    "",
    "## なぜ重要か",
    "",
    "## 関連",
    "",
    "## 次の一手",
    ""
  ].join("\n"),
  Blank: ""
};

const practicalMemoTemplates = [
  {
    id: "weekly-review",
    name: "週次レビュー",
    template: "Idea",
    displayTitle: "週次レビュー",
    categories: ["振り返り"],
    topics: ["週次レビュー", "改善"],
    tags: ["review", "weekly"],
    importance: 2,
    body: [
      "## 今週の要約",
      "",
      "## 進んだこと",
      "- ",
      "",
      "## 詰まったこと",
      "- ",
      "",
      "## 学び",
      "- ",
      "",
      "## 来週の重点",
      "- ",
      "",
      "## 関連メモ",
      ""
    ].join("\n")
  },
  {
    id: "project-kickoff",
    name: "プロジェクト立ち上げ",
    template: "Meeting",
    displayTitle: "プロジェクト立ち上げ",
    categories: ["会議", "プロジェクト"],
    topics: ["目的", "スコープ", "リスク"],
    tags: ["project", "kickoff"],
    importance: 3,
    body: [
      "## 目的",
      "",
      "## 成功条件",
      "- ",
      "",
      "## スコープ",
      "- やること:",
      "- やらないこと:",
      "",
      "## 体制",
      "- ",
      "",
      "## リスク",
      "- ",
      "",
      "## 次のアクション",
      "- "
    ].join("\n")
  },
  {
    id: "customer-interview",
    name: "顧客ヒアリング",
    template: "Meeting",
    displayTitle: "顧客ヒアリング",
    categories: ["会議", "リサーチ"],
    topics: ["顧客課題", "ニーズ"],
    tags: ["interview", "research"],
    importance: 3,
    body: [
      "## 相手",
      "",
      "## 背景",
      "",
      "## 困っていること",
      "- ",
      "",
      "## 現在の代替手段",
      "- ",
      "",
      "## 刺さった言葉",
      "- ",
      "",
      "## 仮説への影響",
      "- ",
      "",
      "## 次のアクション",
      "- "
    ].join("\n")
  },
  {
    id: "product-idea",
    name: "プロダクトアイデア",
    template: "Idea",
    displayTitle: "プロダクトアイデア",
    categories: ["アイデア", "プロダクト"],
    topics: ["課題", "MVP", "収益化"],
    tags: ["idea", "product"],
    importance: 2,
    body: [
      "## アイデア",
      "",
      "## 誰の課題か",
      "",
      "## 何が楽になるか",
      "",
      "## MVP",
      "- ",
      "",
      "## 収益化の仮説",
      "- ",
      "",
      "## 検証方法",
      "- ",
      "",
      "## 関連メモ",
      ""
    ].join("\n")
  },
  {
    id: "research-note",
    name: "調査メモ",
    template: "Idea",
    displayTitle: "調査メモ",
    categories: ["リサーチ"],
    topics: ["調査", "比較"],
    tags: ["research", "source"],
    importance: 2,
    body: [
      "## 調査テーマ",
      "",
      "## 結論",
      "",
      "## 根拠",
      "- ",
      "",
      "## 参考URL",
      "- ",
      "",
      "## 未確認事項",
      "- ",
      "",
      "## 次に調べること",
      "- "
    ].join("\n")
  },
  {
    id: "video-research",
    name: "動画リサーチ",
    template: "Idea",
    displayTitle: "動画リサーチ",
    categories: ["リサーチ", "動画"],
    topics: ["YouTube", "動画候補"],
    tags: ["video", "research"],
    importance: 2,
    body: [
      "## 検索キーワード",
      "",
      "## 候補動画",
      "- タイトル:",
      "- URL:",
      "- 一致理由:",
      "",
      "## 使えそうな観点",
      "- ",
      "",
      "## 除外した理由",
      "- ",
      "",
      "## 記事/企画への反映",
      "- "
    ].join("\n")
  },
  {
    id: "meeting-decision-log",
    name: "決定事項ログ",
    template: "Meeting",
    displayTitle: "決定事項ログ",
    categories: ["会議", "意思決定"],
    topics: ["決定事項", "判断理由"],
    tags: ["decision", "log"],
    importance: 3,
    body: [
      "## 決定したこと",
      "- ",
      "",
      "## 決定理由",
      "- ",
      "",
      "## 却下した案",
      "- ",
      "",
      "## 影響範囲",
      "- ",
      "",
      "## 担当者",
      "- ",
      "",
      "## 期限",
      "- "
    ].join("\n")
  },
  {
    id: "learning-log",
    name: "学習ログ",
    template: "Idea",
    displayTitle: "学習ログ",
    categories: ["学習"],
    topics: ["学び", "復習"],
    tags: ["learning", "log"],
    importance: 1,
    body: [
      "## 学んだこと",
      "",
      "## 自分の言葉で説明",
      "",
      "## 使える場面",
      "- ",
      "",
      "## まだ曖昧な点",
      "- ",
      "",
      "## 復習アクション",
      "- ",
      "",
      "## 関連メモ",
      ""
    ].join("\n")
  },
  {
    id: "task-breakdown",
    name: "タスク分解",
    template: "Idea",
    displayTitle: "タスク分解",
    categories: ["タスク"],
    topics: ["実装", "作業分解"],
    tags: ["task", "plan"],
    importance: 2,
    body: [
      "## ゴール",
      "",
      "## 完了条件",
      "- ",
      "",
      "## 作業分解",
      "- [ ] ",
      "- [ ] ",
      "- [ ] ",
      "",
      "## リスク",
      "- ",
      "",
      "## 最初の一手",
      "- "
    ].join("\n")
  },
  {
    id: "bug-fix-note",
    name: "不具合修正メモ",
    template: "Idea",
    displayTitle: "不具合修正メモ",
    categories: ["開発", "不具合"],
    topics: ["原因", "修正", "検証"],
    tags: ["bug", "fix"],
    importance: 2,
    body: [
      "## 症状",
      "",
      "## 再現手順",
      "1. ",
      "2. ",
      "3. ",
      "",
      "## 原因",
      "",
      "## 修正内容",
      "- ",
      "",
      "## 検証",
      "- ",
      "",
      "## 再発防止",
      "- "
    ].join("\n")
  }
];

const promptPresets = [
  {
    id: "preset-supermemo-meeting-format",
    title: "Super Memo会議メモ整形",
    tags: ["Super Memo", "会議メモ", "整形"],
    body: [
      "あなたはSuper Memo用の会議メモ編集者です。",
      "以下の会議ログ、箇条書き、文字起こし、または雑多なメモを、Super MemoのMeetingテンプレートに貼りやすい形へ整理してください。",
      "",
      "出力形式:",
      "タイトル: 30文字以内の検索しやすいタイトル",
      "表示タイトル: 人が見て分かりやすい自然なタイトル",
      "種別: Meeting",
      "日付: YYYY-MM-DD",
      "categories: 会議, 必要ならプロジェクト名",
      "people: 登場人物や担当者をカンマ区切り",
      "topics: 議題や論点をカンマ区切り",
      "tags: 後で探すためのタグをカンマ区切り",
      "importance: 1から3で重要度",
      "",
      "本文:",
      "## 要約",
      "- 会議全体を3行以内で要約",
      "",
      "## メモ",
      "- 議論内容、背景、補足を整理",
      "",
      "## 決定事項",
      "- 決まったことだけを書く",
      "",
      "## 次のアクション",
      "- [ ] 担当者 / 期限 / やること の順で書く",
      "",
      "## 関連",
      "- 関連しそうな既存メモ名や概念があれば [[メモ名]] 形式で書く",
      "",
      "ルール:",
      "- 原文にない決定事項や期限は作らない",
      "- 不明な担当者や期限は「未定」と書く",
      "- 重複表現をまとめ、短く実務で使える文にする",
      "- 重要な発言や数値は落とさない",
      "",
      "入力:",
      "```",
      "ここに会議ログやメモを貼る",
      "```"
    ].join("\n")
  },
  {
    id: "preset-supermemo-idea-format",
    title: "Super Memoアイデアメモ整形",
    tags: ["Super Memo", "アイデアメモ", "整形"],
    body: [
      "あなたはSuper Memo用のアイデアメモ編集者です。",
      "以下の思いつき、構想、課題メモ、プロダクト案を、Super MemoのIdeaテンプレートに貼りやすい形へ整理してください。",
      "",
      "出力形式:",
      "タイトル: 30文字以内の検索しやすいタイトル",
      "表示タイトル: アイデアの価値が伝わる自然なタイトル",
      "種別: Idea",
      "日付: YYYY-MM-DD",
      "categories: アイデア, 必要なら領域名",
      "people: 関係者や想定ユーザーをカンマ区切り",
      "topics: 課題、機能、仮説をカンマ区切り",
      "tags: 後で探すためのタグをカンマ区切り",
      "importance: 1から3で重要度",
      "",
      "本文:",
      "## 思いつき",
      "- アイデアの核を短く書く",
      "",
      "## なぜ重要か",
      "- 誰のどんな課題を解くのか",
      "- 収益化や継続利用につながる理由があれば書く",
      "",
      "## 関連",
      "- 関連しそうな既存メモ名、概念、プロジェクトを [[メモ名]] 形式で書く",
      "",
      "## 次の一手",
      "- [ ] 15分から60分で試せる最小アクションを書く",
      "",
      "ルール:",
      "- アイデアを大きくしすぎず、MVPで試せる範囲に絞る",
      "- 根拠、リスク、検証方法を分けて書く",
      "- 不明点は仮説として明示する",
      "- すぐ作れる小さなアプリや機能に落とし込む",
      "",
      "入力:",
      "```",
      "ここにアイデアや雑メモを貼る",
      "```"
    ].join("\n")
  }
];

const secretGameAssets = {
  player: loadGameAsset("assets/secret-lumen-skiff-gpt-image2.png"),
  enemy: loadGameAsset("assets/secret-noise-prism-gpt-image2.png")
};

let state = {
  tools: readJson(STORAGE_KEYS.tools, defaultTools),
  prompts: readJson(STORAGE_KEYS.prompts, []),
  textCleaner: readJson(STORAGE_KEYS.textCleaner, { input: "", output: "" }),
  pomodoro: readJson(STORAGE_KEYS.pomodoro, createDefaultPomodoroState()),
  calculator: readJson(STORAGE_KEYS.calculator, { expression: "", result: "0", history: [] }),
  timezones: readJson(STORAGE_KEYS.timezones, defaultTimezoneIds),
  subscriptions: readJson(STORAGE_KEYS.subscriptions, []),
  bookmarks: readJson(STORAGE_KEYS.bookmarks, []),
  bookmarkFolders: readJson(STORAGE_KEYS.bookmarkFolders, []),
  videoFinderApiKey: localStorage.getItem(STORAGE_KEYS.videoFinderApiKey) || "",
  videoFinderLastSearch: readJson(STORAGE_KEYS.videoFinderLastSearch, null),
  videoFinderResults: [],
  memos: readJson(STORAGE_KEYS.memos, []),
  theme: "dark",
  sidebarCollapsed: localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "true",
  selectedPromptId: null,
  selectedMemoId: null,
  selectedMemoIds: new Set(),
  includeArchivedInGraph: false,
  graphMode: "nearby",
  graphClusterBy: "topics",
  graphFocusOpen: false,
  memoBodyFocusOpen: false,
  graphViews: {
    normal: { x: 0, y: 0, scale: 1 },
    focus: { x: 0, y: 0, scale: 1 }
  },
  graphAnimations: { normal: null, focus: null },
  graphLayoutAnimations: { normal: null, focus: null },
  graphNodePositions: { normal: {}, focus: {} },
  graphManualPositions: { normal: {}, focus: {} },
  graphViewportFrames: { normal: null, focus: null },
  graphLastRenderAt: { normal: 0, focus: 0 },
  graphDetailRefreshTimer: null,
  graphClickTimer: null,
  secretToolClickCount: 0,
  secretToolClickAt: 0,
  secretGame: null,
  memoLinkQuery: "",
  memoArchiveOpen: false,
  idCommand: {
    active: false,
    query: "",
    selectedIndex: 0
  },
  memoBodyHistory: {
    undo: [],
    redo: [],
    last: ""
  },
  currentMemoImages: {},
  memoAutoSaveEnabled: localStorage.getItem(STORAGE_KEYS.memoAutoSaveEnabled) === "true",
  memoAutoSaveHandle: null,
  memoAutoSaveTimer: null,
  memoAutoSaveBusy: false,
  memoAutoSavePending: false,
  query: "",
  memoQuery: "",
  memoSearchMode: "fullText",
  bookmarkQuery: "",
  bookmarkFolder: "",
  bookmarkDeleteMode: false,
  editingBookmarkId: null,
  selectedBookmarkIds: new Set(),
  fullscreenView: null,
  memoDetailSearchOpen: false,
  memoFilters: {
    people: "",
    topics: "",
    tags: "",
    dateFrom: "",
    dateTo: ""
  }
};

const elements = {
  views: document.querySelectorAll(".view"),
  navItems: document.querySelectorAll("[data-view]"),
  sidebarNavItems: document.querySelectorAll(".nav-item[data-view]"),
  sidebarToggleButton: document.querySelector("#sidebar-toggle-button"),
  enabledTools: document.querySelector("#enabled-tools"),
  toolSettings: document.querySelector("#tool-settings"),
  settingsTitle: document.querySelector("#settings-title"),
  secretGameLayer: document.querySelector("#secret-game-layer"),
  secretGameCanvas: document.querySelector("#secret-game-canvas"),
  secretGameCloseButton: document.querySelector("#secret-game-close-button"),
  secretGameRestartButton: document.querySelector("#secret-game-restart-button"),
  copyFeedbackRequestButton: document.querySelector("#copy-feedback-request-button"),
  copyTemplateRequestButton: document.querySelector("#copy-template-request-button"),
  feedbackKind: document.querySelector("#feedback-kind-field"),
  feedbackMessage: document.querySelector("#feedback-message-field"),
  sendFeedbackMailButton: document.querySelector("#send-feedback-mail-button"),
  feedbackStatus: document.querySelector("#feedback-status"),

  memoList: document.querySelector("#memo-list"),
  memoSearch: document.querySelector("#memo-search"),
  memoSearchButton: document.querySelector("#memo-search-button"),
  memoDetailSearchToggle: document.querySelector("#memo-detail-search-toggle"),
  memoDetailSearchPanel: document.querySelector("#memo-detail-search-panel"),
  memoSearchMode: document.querySelector("#memo-search-mode"),
  memoFilterPeople: document.querySelector("#memo-filter-people"),
  memoFilterTopics: document.querySelector("#memo-filter-topics"),
  memoFilterTags: document.querySelector("#memo-filter-tags"),
  memoFilterSuggestions: document.querySelector("#memo-filter-suggestions"),
  memoFilterDateFrom: document.querySelector("#memo-filter-date-from"),
  memoFilterDateTo: document.querySelector("#memo-filter-date-to"),
  newMeetingNoteButton: document.querySelector("#new-meeting-note-button"),
  newIdeaNoteButton: document.querySelector("#new-idea-note-button"),
  newBlankNoteButton: document.querySelector("#new-blank-note-button"),
  memoForm: document.querySelector("#memo-form"),
  memoId: document.querySelector("#memo-id"),
  memoTitle: document.querySelector("#memo-title-field"),
  memoDisplayTitle: document.querySelector("#memo-display-title-field"),
  memoImportance: document.querySelector("#memo-importance-field"),
  memoTemplate: document.querySelector("#memo-template-field"),
  memoPracticalTemplate: document.querySelector("#memo-practical-template-field"),
  memoDate: document.querySelector("#memo-date-field"),
  memoCategories: document.querySelector("#memo-categories-field"),
  memoPeople: document.querySelector("#memo-people-field"),
  memoTopics: document.querySelector("#memo-topics-field"),
  memoTags: document.querySelector("#memo-tags-field"),
  memoPeopleOptions: document.querySelector("#memo-people-options"),
  memoTopicsOptions: document.querySelector("#memo-topics-options"),
  memoBody: document.querySelector("#memo-body-field"),
  memoBodyEditorHost: document.querySelector("#memo-body-editor-host"),
  memoBodyPreview: document.querySelector("#memo-body-preview"),
  memoIdCommandPopover: document.querySelector("#memo-id-command-popover"),
  memoBodyFocusLayer: document.querySelector("#memo-body-focus-layer"),
  memoBodyFocusEditorHost: document.querySelector("#memo-body-focus-editor-host"),
  focusMemoBodyButton: document.querySelector("#focus-memo-body-button"),
  copyMemoBodyButton: document.querySelector("#copy-memo-body-button"),
  closeMemoBodyFocusButton: document.querySelector("#close-memo-body-focus-button"),
  memoLinkSearch: document.querySelector("#memo-link-search"),
  memoLinkTarget: document.querySelector("#memo-link-target"),
  insertMemoLinkButton: document.querySelector("#insert-memo-link-button"),
  memoRelatedLinks: document.querySelector("#memo-related-links"),
  memoBacklinks: document.querySelector("#memo-backlinks"),
  memoLinkSuggestions: document.querySelector("#memo-link-suggestions"),
  memoUnconnectedList: document.querySelector("#memo-unconnected-list"),
  starMemoButton: document.querySelector("#star-memo-button"),
  pinMemoButton: document.querySelector("#pin-memo-button"),
  splitMemoButton: document.querySelector("#split-memo-button"),
  mergeMemosButton: document.querySelector("#merge-memos-button"),
  copyMemoButton: document.querySelector("#copy-memo-button"),
  archiveMemoButton: document.querySelector("#archive-memo-button"),
  deleteMemoButton: document.querySelector("#delete-memo-button"),
  memoStatusLine: document.querySelector("#memo-status-line"),
  memoGraph: document.querySelector("#memo-graph"),
  memoGraphFocus: document.querySelector("#memo-graph-focus"),
  memoGraphFocusLayer: document.querySelector("#memo-graph-focus-layer"),
  memoGraphMode: document.querySelector("#memo-graph-mode"),
  memoGraphFocusMode: document.querySelector("#memo-graph-focus-mode"),
  memoGraphClusterBy: document.querySelector("#memo-graph-cluster-by"),
  memoGraphFocusClusterBy: document.querySelector("#memo-graph-focus-cluster-by"),
  memoGraphIncludeArchived: document.querySelector("#memo-graph-include-archived"),
  focusMemoGraphButton: document.querySelector("#focus-memo-graph-button"),
  closeMemoGraphFocusButton: document.querySelector("#close-memo-graph-focus-button"),
  fitMemoGraphButton: document.querySelector("#fit-memo-graph-button"),
  memoAutoSaveEnabled: document.querySelector("#memo-auto-save-enabled"),
  setAutoSaveFileButton: document.querySelector("#set-auto-save-file-button"),
  memoExportFormat: document.querySelector("#memo-export-format"),
  exportMemosButton: document.querySelector("#export-memos-button"),
  importMemosField: document.querySelector("#import-memos-field"),
  memoDropZone: document.querySelector("#memo-drop-zone"),
  memoSelectionCount: document.querySelector("#memo-selection-count"),
  selectAllMemoSelectionButton: document.querySelector("#select-all-memo-selection-button"),
  clearMemoSelectionButton: document.querySelector("#clear-memo-selection-button"),
  toggleArchiveBoxButton: document.querySelector("#toggle-archive-box-button"),
  memoArchiveBox: document.querySelector("#memo-archive-box"),
  memoArchiveList: document.querySelector("#memo-archive-list"),
  memoArchiveCount: document.querySelector("#memo-archive-count"),
  memoStatNotes: document.querySelector("#memo-stat-notes"),
  memoStatLinks: document.querySelector("#memo-stat-links"),
  memoStatPeople: document.querySelector("#memo-stat-people"),
  memoStatTopics: document.querySelector("#memo-stat-topics"),

  promptList: document.querySelector("#prompt-list"),
  promptSearch: document.querySelector("#prompt-search"),
  promptForm: document.querySelector("#prompt-form"),
  promptId: document.querySelector("#prompt-id"),
  promptTitle: document.querySelector("#prompt-title-field"),
  promptTags: document.querySelector("#prompt-tags-field"),
  tagPicker: document.querySelector("#tag-picker"),
  promptBody: document.querySelector("#prompt-body-field"),
  newPromptButton: document.querySelector("#new-prompt-button"),
  copyPromptButton: document.querySelector("#copy-prompt-button"),
  deletePromptButton: document.querySelector("#delete-prompt-button"),
  statusLine: document.querySelector("#status-line"),

  cleanerInput: document.querySelector("#text-cleaner-input"),
  cleanerOutput: document.querySelector("#text-cleaner-output"),
  cleanerActions: document.querySelectorAll("[data-cleaner-action]"),
  copyCleanerOutputButton: document.querySelector("#copy-cleaner-output-button"),
  clearTextButton: document.querySelector("#clear-text-button"),
  textStatChars: document.querySelector("#text-stat-chars"),
  textStatLines: document.querySelector("#text-stat-lines"),
  textCleanerStatus: document.querySelector("#text-cleaner-status"),
  pomodoroTime: document.querySelector("#pomodoro-time"),
  pomodoroStatus: document.querySelector("#pomodoro-status"),
  pomodoroToggleButton: document.querySelector("#pomodoro-toggle-button"),
  pomodoroLoopButton: document.querySelector("#pomodoro-loop-button"),
  pomodoroResetButton: document.querySelector("#pomodoro-reset-button"),
  pomodoroModeButtons: document.querySelectorAll("[data-timer-mode]"),
  pomodoroProgress: document.querySelector("#pomodoro-progress"),
  pomodoroFocusMinutes: document.querySelector("#pomodoro-focus-minutes"),
  pomodoroShortMinutes: document.querySelector("#pomodoro-short-minutes"),
  pomodoroLongMinutes: document.querySelector("#pomodoro-long-minutes"),
  timezoneList: document.querySelector("#timezone-list"),
  timezoneSelect: document.querySelector("#timezone-select"),
  timezoneAddButton: document.querySelector("#timezone-add-button"),
  subscriptionForm: document.querySelector("#subscription-form"),
  subscriptionTemplate: document.querySelector("#subscription-template"),
  subscriptionName: document.querySelector("#subscription-name"),
  subscriptionPrice: document.querySelector("#subscription-price"),
  subscriptionBillingCycle: document.querySelector("#subscription-billing-cycle"),
  subscriptionRegisteredAt: document.querySelector("#subscription-registered-at"),
  subscriptionDebitDay: document.querySelector("#subscription-debit-day"),
  subscriptionList: document.querySelector("#subscription-list"),
  subscriptionMonthlyTotal: document.querySelector("#subscription-monthly-total"),
  subscriptionYearlyTotal: document.querySelector("#subscription-yearly-total"),
  subscriptionStatus: document.querySelector("#subscription-status"),
  bookmarkImportFile: document.querySelector("#bookmark-import-file"),
  bookmarkDeleteModeButton: document.querySelector("#bookmark-delete-mode-button"),
  bookmarkDeleteSelectedButton: document.querySelector("#bookmark-delete-selected-button"),
  bookmarkSearch: document.querySelector("#bookmark-search"),
  bookmarkFolderFilter: document.querySelector("#bookmark-folder-filter"),
  bookmarkFolderForm: document.querySelector("#bookmark-folder-form"),
  bookmarkFolderName: document.querySelector("#bookmark-folder-name-field"),
  bookmarkFolderColor: document.querySelector("#bookmark-folder-color-field"),
  bookmarkFolderList: document.querySelector("#bookmark-folder-list"),
  bookmarkForm: document.querySelector("#bookmark-form"),
  bookmarkTitle: document.querySelector("#bookmark-title-field"),
  bookmarkUrl: document.querySelector("#bookmark-url-field"),
  bookmarkFolderField: document.querySelector("#bookmark-folder-field"),
  bookmarkEditModal: document.querySelector("#bookmark-edit-modal"),
  bookmarkEditForm: document.querySelector("#bookmark-edit-form"),
  bookmarkEditTitle: document.querySelector("#bookmark-edit-title-field"),
  bookmarkEditUrl: document.querySelector("#bookmark-edit-url-field"),
  bookmarkEditFolder: document.querySelector("#bookmark-edit-folder-field"),
  bookmarkEditCloseButton: document.querySelector("#bookmark-edit-close-button"),
  bookmarkEditCancelButton: document.querySelector("#bookmark-edit-cancel-button"),
  bookmarkStatus: document.querySelector("#bookmark-status"),
  bookmarkList: document.querySelector("#bookmark-list"),
  videoApiKey: document.querySelector("#video-api-key"),
  videoSaveApiKeyButton: document.querySelector("#video-save-api-key-button"),
  videoClearApiKeyButton: document.querySelector("#video-clear-api-key-button"),
  videoSearchForm: document.querySelector("#video-search-form"),
  videoQuery: document.querySelector("#video-query"),
  videoOrder: document.querySelector("#video-order"),
  videoMaxResults: document.querySelector("#video-max-results"),
  videoRegionCode: document.querySelector("#video-region-code"),
  videoLanguage: document.querySelector("#video-language"),
  videoTitleOnly: document.querySelector("#video-title-only"),
  videoHideLoose: document.querySelector("#video-hide-loose"),
  videoClearResultsButton: document.querySelector("#video-clear-results-button"),
  videoYoutubeSearchLink: document.querySelector("#video-youtube-search-link"),
  videoStatusLine: document.querySelector("#video-status-line"),
  videoResults: document.querySelector("#video-results"),
  calculatorExpression: document.querySelector("#calculator-expression"),
  calculatorDisplay: document.querySelector("#calculator-display"),
  calculatorButtons: document.querySelectorAll("[data-calc-value], [data-calc-action]"),
  calculatorCopyButton: document.querySelector("#calculator-copy-button"),
  calculatorClearHistoryButton: document.querySelector("#calculator-clear-history-button"),
  calculatorHistory: document.querySelector("#calculator-history"),
  calculatorStatus: document.querySelector("#calculator-status")
};

init();

function init() {
  applyTheme();
  applySidebarState();
  migrateTools();
  migrateMemos();
  installPromptPresets();
  renderPracticalMemoTemplateOptions();
  renderHome();
  renderSettings();
  renderNavigation();
  renderMemo();
  renderPromptList();
  renderTextCleaner();
  renderPomodoroTimer();
  renderTimezoneTool();
  renderSubscriptionTool();
  renderBookmarkTool();
  renderVideoFinder();
  renderCalculator();
  installFullscreenButtons();
  bindEvents();
  renderMemoAutoSaveState();
  loadMemoAutoSaveHandle();
  resetPromptEditor();
  bindButtonTooltips();
  applyButtonTooltips();

  if (state.memos.length === 0) {
    resetMemoEditor("Meeting");
  } else {
    selectMemo(state.memos[0].id);
  }

  const savedView = localStorage.getItem(STORAGE_KEYS.activeView);
  const startView = savedView && !isViewEnabled(savedView)
    ? "home"
    : savedView || "home";
  showView(startView);
}

function installPromptPresets() {
  const installedVersion = Number(localStorage.getItem(STORAGE_KEYS.promptPresetVersion) || "0");
  if (installedVersion >= PROMPT_PRESET_VERSION) {
    return;
  }

  const existingIds = new Set(state.prompts.map((prompt) => prompt.id));
  const now = new Date().toISOString();
  const missingPresets = promptPresets
    .filter((preset) => !existingIds.has(preset.id))
    .map((preset) => ({
      ...preset,
      createdAt: now,
      updatedAt: now
    }));

  if (missingPresets.length > 0) {
    state.prompts = [...missingPresets, ...state.prompts];
    persistPrompts();
  }
  localStorage.setItem(STORAGE_KEYS.promptPresetVersion, String(PROMPT_PRESET_VERSION));
}

function bindButtonTooltips() {
  document.addEventListener("mouseover", (event) => {
    const target = event.target?.closest?.("button, .file-button");
    if (!target) {
      return;
    }
    applyButtonTooltip(target);
  }, true);
}

function applyButtonTooltips(root = document) {
  root.querySelectorAll("button, .file-button").forEach(applyButtonTooltip);
}

function applyButtonTooltip(button) {
  if (button.title) {
    return;
  }

  const tooltip = getButtonTooltip(button);
  if (tooltip) {
    button.title = tooltip;
  }
}

function getButtonTooltip(button) {
  const idTooltips = {
    "new-meeting-note-button": "会議用テンプレートで新しいメモを作成します。",
    "new-idea-note-button": "アイデア用テンプレートで新しいメモを作成します。",
    "new-blank-note-button": "空の新しいメモを作成します。",
    "memo-search-button": "入力した条件でメモを検索します。",
    "memo-detail-search-toggle": "タグ、日付、添付などの詳細検索条件を開閉します。",
    "select-all-memo-selection-button": "表示中のメモをすべて選択します。",
    "clear-memo-selection-button": "メモ一覧の選択をすべて解除します。",
    "toggle-archive-box-button": "アーカイブ済みメモのボックスを開閉します。",
    "star-memo-button": "現在のメモにスターを付ける、または外します。",
    "focus-memo-body-button": "本文を広いフォーカスモードで編集します。",
    "copy-memo-body-button": "本文だけをクリップボードへコピーします。",
    "insert-memo-link-button": "選択したメモのIDリンクを本文へ挿入します。",
    "pin-memo-button": "現在のメモを一覧上部に固定、または解除します。",
    "split-memo-button": "本文で選択した範囲を新しいメモとして分割します。",
    "merge-memos-button": "チェックした複数メモを新しい統合メモとしてまとめます。",
    "copy-memo-button": "現在のメモをMarkdown形式でクリップボードへコピーします。",
    "archive-memo-button": "現在のメモをアーカイブ、または解除します。",
    "delete-memo-button": "現在のメモを削除します。実行前に確認します。",
    "focus-memo-graph-button": "グラフを全画面に近いフォーカスモードで表示します。",
    "fit-memo-graph-button": "現在の条件でグラフを再描画します。",
    "close-memo-graph-focus-button": "グラフフォーカスモードを閉じます。",
    "close-memo-body-focus-button": "本文フォーカスモードを閉じます。",
    "set-auto-save-file-button": "JSONの自動保存先ファイルを設定します。",
    "export-memos-button": "選択した形式でメモをエクスポートします。",
    "new-prompt-button": "新しいプロンプトを作成します。",
    "copy-prompt-button": "選択中のプロンプト本文をコピーします。",
    "delete-prompt-button": "選択中のプロンプトを削除します。",
    "copy-cleaner-output-button": "整形結果をクリップボードへコピーします。",
    "clear-text-button": "テキスト整形の入力と出力を消去します。"
  };

  if (button.id && idTooltips[button.id]) {
    return idTooltips[button.id];
  }

  if (button.classList?.contains("file-button")) {
    return "JSONファイルを選択してメモをインポートします。";
  }
  if (button.classList?.contains("memo-row")) {
    return "このメモを開いて編集します。";
  }
  if (button.classList?.contains("link-chip")) {
    return button.dataset.heat
      ? "関連メモを開きます。リンク候補はCtrl+クリックで本文へIDリンク挿入できます。"
      : "関連メモを開きます。";
  }
  if (button.classList?.contains("local-path-copy")) {
    return "フォルダパスをクリップボードへコピーします。";
  }
  if (button.classList?.contains("tool-tile")) {
    return "このサブツールを開きます。";
  }
  if (button.classList?.contains("fullscreen-toggle-button")) {
    return "表示中のメニューを全画面モードで開閉します。";
  }
  if (button.classList?.contains("nav-item")) {
    return `${getButtonText(button)}画面を開きます。`;
  }
  if (button.dataset?.view) {
    return "Super Memoまたは指定したツール画面を開きます。";
  }
  if (button.dataset?.cleanerAction) {
    return "入力テキストを選択したルールで整形します。";
  }

  const text = getButtonText(button);
  return text ? `${text}を実行します。` : "この操作を実行します。";
}

function getButtonText(button) {
  return (button.getAttribute("aria-label") || button.textContent || "").replace(/\s+/g, " ").trim();
}

function migrateTools() {
  state.tools = { ...defaultTools, ...state.tools };
  persistTools();
}

function migrateMemos() {
  state.memos = state.memos.map(normalizeMemo).filter(Boolean);
  persistMemos();
}

function bindEvents() {
  elements.navItems.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      if (!isViewEnabled(view)) {
        showPromptStatus("このツールは設定で無効になっています。", true);
        showView("settings");
        return;
      }
      showView(view);
    });
  });
  elements.sidebarToggleButton.addEventListener("click", toggleSidebar);
  elements.settingsTitle.addEventListener("click", handleSettingsTitleSecretClick);
  elements.secretGameCloseButton.addEventListener("click", closeSecretGame);
  elements.secretGameRestartButton.addEventListener("click", () => startSecretGame());
  elements.secretGameCanvas.addEventListener("keydown", handleSecretGameKeydown);
  elements.secretGameCanvas.addEventListener("keyup", handleSecretGameKeyup);
  elements.copyFeedbackRequestButton.addEventListener("click", () => copyFeedbackDraft("feedback"));
  elements.copyTemplateRequestButton.addEventListener("click", () => copyFeedbackDraft("template"));
  elements.sendFeedbackMailButton.addEventListener("click", sendFeedbackMail);
  document.addEventListener("click", (event) => {
    const button = event.target instanceof Element
      ? event.target.closest("[data-fullscreen-toggle]")
      : null;
    if (button) {
      toggleViewFullscreen(button.closest(".view"));
    }
  });

  elements.newMeetingNoteButton.addEventListener("click", () => resetMemoEditor("Meeting"));
  elements.newIdeaNoteButton.addEventListener("click", () => resetMemoEditor("Idea"));
  elements.newBlankNoteButton.addEventListener("click", () => resetMemoEditor("Blank"));
  elements.memoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveMemo();
  });
  elements.memoSearch.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyMemoSearch();
    }
  });
  elements.memoSearchButton.addEventListener("click", applyMemoSearch);
  elements.memoDetailSearchToggle.addEventListener("click", toggleMemoDetailSearch);
  elements.memoSearchMode.addEventListener("change", () => {
    if (elements.memoSearchMode.value === "fullText") {
      elements.memoSearch.placeholder = "全文検索";
    } else {
      elements.memoSearch.placeholder = "詳細条件内でさらに絞り込み";
    }
  });
  elements.memoFilterPeople.addEventListener("input", () => {
    updateMemoFilter("people", elements.memoFilterPeople.value);
    renderMemoFilterSuggestions("people");
  });
  elements.memoFilterTopics.addEventListener("input", () => {
    updateMemoFilter("topics", elements.memoFilterTopics.value);
    renderMemoFilterSuggestions("topics");
  });
  elements.memoFilterTags.addEventListener("input", () => {
    updateMemoFilter("tags", elements.memoFilterTags.value);
    renderMemoFilterSuggestions("tags");
  });
  bindMemoFilterSuggestionField(elements.memoFilterPeople, "people");
  bindMemoFilterSuggestionField(elements.memoFilterTopics, "topics");
  bindMemoFilterSuggestionField(elements.memoFilterTags, "tags");
  elements.memoFilterDateFrom.addEventListener("change", () => updateMemoFilter("dateFrom", elements.memoFilterDateFrom.value));
  elements.memoFilterDateTo.addEventListener("change", () => updateMemoFilter("dateTo", elements.memoFilterDateTo.value));
  elements.memoTemplate.addEventListener("change", applyTemplateDefaults);
  elements.memoPracticalTemplate.addEventListener("change", applyPracticalMemoTemplate);
  elements.memoImportance.addEventListener("change", updateCurrentMemoImportance);
  elements.memoBodyPreview.addEventListener("input", handleMemoBodyInput);
  elements.memoBodyPreview.addEventListener("keydown", handleMemoBodyKeydown);
  elements.memoBodyPreview.addEventListener("paste", handleMemoBodyPaste);
  elements.memoBodyPreview.addEventListener("mousedown", handleMemoBodyMouseDown);
  elements.memoBodyPreview.addEventListener("click", handleMemoBodyClick);
  elements.memoBodyPreview.addEventListener("dblclick", handleMemoBodyDoubleClick);
  elements.focusMemoBodyButton.addEventListener("click", openMemoBodyFocus);
  elements.copyMemoBodyButton.addEventListener("click", copyMemoBodyOnly);
  elements.closeMemoBodyFocusButton.addEventListener("click", closeMemoBodyFocus);
  elements.memoLinkSearch.addEventListener("input", () => {
    state.memoLinkQuery = elements.memoLinkSearch.value.trim().toLowerCase();
    renderMemoOptions();
  });
  elements.insertMemoLinkButton.addEventListener("click", insertMemoLink);
  elements.starMemoButton.addEventListener("click", toggleCurrentMemoStar);
  elements.pinMemoButton.addEventListener("click", toggleCurrentMemoPin);
  elements.splitMemoButton.addEventListener("click", splitSelectedMemoText);
  elements.mergeMemosButton.addEventListener("click", mergeSelectedMemos);
  elements.copyMemoButton.addEventListener("click", copyCurrentMemo);
  elements.archiveMemoButton.addEventListener("click", toggleCurrentMemoArchive);
  elements.deleteMemoButton.addEventListener("click", deleteCurrentMemo);
  elements.toggleArchiveBoxButton.addEventListener("click", toggleArchiveBox);
  elements.memoGraphMode.addEventListener("change", () => {
    state.graphMode = elements.memoGraphMode.value;
    elements.memoGraphFocusMode.value = state.graphMode;
    renderMemoGraph();
  });
  elements.memoGraphFocusMode.addEventListener("change", () => {
    state.graphMode = elements.memoGraphFocusMode.value;
    elements.memoGraphMode.value = state.graphMode;
    renderMemoGraph();
  });
  elements.memoGraphClusterBy.addEventListener("change", () => {
    state.graphClusterBy = elements.memoGraphClusterBy.value;
    elements.memoGraphFocusClusterBy.value = state.graphClusterBy;
    renderMemoGraph();
  });
  elements.memoGraphFocusClusterBy.addEventListener("change", () => {
    state.graphClusterBy = elements.memoGraphFocusClusterBy.value;
    elements.memoGraphClusterBy.value = state.graphClusterBy;
    renderMemoGraph();
  });
  elements.memoGraphIncludeArchived.addEventListener("change", () => {
    state.includeArchivedInGraph = elements.memoGraphIncludeArchived.checked;
    renderMemoGraph();
  });
  elements.focusMemoGraphButton.addEventListener("click", openMemoGraphFocus);
  elements.closeMemoGraphFocusButton.addEventListener("click", closeMemoGraphFocus);
  elements.fitMemoGraphButton.addEventListener("click", fitMemoGraphView);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.fullscreenView) {
      exitViewFullscreen();
      return;
    }
    if (event.key === "Escape" && state.memoBodyFocusOpen) {
      closeMemoBodyFocus();
      return;
    }
    if (event.key === "Escape" && state.secretGame?.open) {
      closeSecretGame();
      return;
    }
    if (event.key === "Escape" && state.graphFocusOpen) {
      closeMemoGraphFocus();
      return;
    }
    if (event.key === "Escape" && !elements.bookmarkEditModal.hidden) {
      cancelBookmarkEdit();
    }
  });
  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && state.fullscreenView) {
      exitViewFullscreen({ skipBrowser: true });
    }
  });
  elements.memoAutoSaveEnabled.addEventListener("change", toggleMemoAutoSave);
  elements.setAutoSaveFileButton.addEventListener("click", setMemoAutoSaveFile);
  elements.exportMemosButton.addEventListener("click", handleMemoExport);
  elements.importMemosField.addEventListener("change", importMemos);
  elements.selectAllMemoSelectionButton.addEventListener("click", selectAllVisibleMemos);
  elements.clearMemoSelectionButton.addEventListener("click", clearMemoSelection);
  bindMemoDropZone();

  elements.promptSearch.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderPromptList();
  });
  elements.promptTags.addEventListener("input", renderTagPicker);
  elements.newPromptButton.addEventListener("click", () => {
    resetPromptEditor();
    showView("promptPad");
    elements.promptTitle.focus();
  });
  elements.promptForm.addEventListener("submit", (event) => {
    event.preventDefault();
    savePrompt();
  });
  elements.copyPromptButton.addEventListener("click", copyCurrentPrompt);
  elements.deletePromptButton.addEventListener("click", deleteCurrentPrompt);

  elements.cleanerInput.addEventListener("input", () => {
    state.textCleaner.input = elements.cleanerInput.value;
    persistTextCleaner();
    renderTextStats();
  });
  elements.cleanerOutput.addEventListener("input", () => {
    state.textCleaner.output = elements.cleanerOutput.value;
    persistTextCleaner();
    renderTextStats();
  });
  elements.cleanerActions.forEach((button) => {
    button.addEventListener("click", () => runCleanerAction(button.dataset.cleanerAction));
  });
  elements.copyCleanerOutputButton.addEventListener("click", copyCleanerOutput);
  elements.clearTextButton.addEventListener("click", clearTextCleaner);
  elements.pomodoroToggleButton.addEventListener("click", togglePomodoroTimer);
  elements.pomodoroLoopButton.addEventListener("click", togglePomodoroLoop);
  elements.pomodoroResetButton.addEventListener("click", resetPomodoroTimer);
  elements.pomodoroModeButtons.forEach((button) => {
    button.addEventListener("click", () => setPomodoroMode(button.dataset.timerMode));
  });
  [
    ["focus", elements.pomodoroFocusMinutes],
    ["short", elements.pomodoroShortMinutes],
    ["long", elements.pomodoroLongMinutes]
  ].forEach(([mode, input]) => {
    input.addEventListener("change", () => updatePomodoroDuration(mode, input.value));
  });
  elements.timezoneAddButton.addEventListener("click", addSelectedTimezone);
  elements.subscriptionTemplate.addEventListener("change", applySubscriptionTemplate);
  elements.subscriptionForm.addEventListener("submit", addSubscription);
  elements.bookmarkImportFile.addEventListener("change", importBookmarkFile);
  elements.bookmarkDeleteModeButton.addEventListener("click", toggleBookmarkDeleteMode);
  elements.bookmarkDeleteSelectedButton.addEventListener("click", deleteSelectedBookmarks);
  elements.bookmarkSearch.addEventListener("input", () => {
    state.bookmarkQuery = elements.bookmarkSearch.value.trim().toLowerCase();
    renderBookmarkList();
  });
  elements.bookmarkFolderFilter.addEventListener("change", () => {
    state.bookmarkFolder = elements.bookmarkFolderFilter.value;
    renderBookmarkList();
  });
  elements.bookmarkFolderForm.addEventListener("submit", addBookmarkFolder);
  elements.bookmarkForm.addEventListener("submit", addBookmark);
  elements.bookmarkEditForm.addEventListener("submit", saveBookmarkEdit);
  elements.bookmarkEditCloseButton.addEventListener("click", cancelBookmarkEdit);
  elements.bookmarkEditCancelButton.addEventListener("click", cancelBookmarkEdit);
  elements.bookmarkEditModal.addEventListener("click", (event) => {
    if (event.target === elements.bookmarkEditModal) {
      cancelBookmarkEdit();
    }
  });
  elements.videoSaveApiKeyButton.addEventListener("click", saveVideoApiKey);
  elements.videoClearApiKeyButton.addEventListener("click", clearVideoApiKey);
  elements.videoSearchForm.addEventListener("submit", handleVideoSearch);
  elements.videoClearResultsButton.addEventListener("click", clearVideoResults);
  elements.videoQuery.addEventListener("input", updateVideoYoutubeSearchLink);
  elements.calculatorButtons.forEach((button) => {
    button.addEventListener("click", () => handleCalculatorButton(button));
  });
  elements.calculatorCopyButton.addEventListener("click", copyCalculatorResult);
  elements.calculatorClearHistoryButton.addEventListener("click", clearCalculatorHistory);
  document.addEventListener("keydown", handleCalculatorKeydown);
}

function applyMemoSearch() {
  if (elements.memoDetailSearchPanel.classList.contains("is-collapsed")) {
    state.memoSearchMode = "fullText";
    state.memoDetailSearchOpen = false;
    elements.memoSearchMode.value = "fullText";
  } else {
    state.memoDetailSearchOpen = true;
    state.memoSearchMode = elements.memoSearchMode.value;
  }
  state.memoQuery = elements.memoSearch.value.trim().toLowerCase();
  renderMemoList();
}

function toggleMemoDetailSearch() {
  const isCollapsed = elements.memoDetailSearchPanel.classList.toggle("is-collapsed");
  elements.memoDetailSearchToggle.setAttribute("aria-expanded", String(!isCollapsed));
  elements.memoDetailSearchToggle.textContent = isCollapsed ? "詳細検索" : "詳細検索を閉じる";
  state.memoDetailSearchOpen = !isCollapsed;
  if (isCollapsed) {
    state.memoSearchMode = "fullText";
    elements.memoSearchMode.value = "fullText";
  }
  renderMemoList();
}

async function copyFeedbackDraft(type) {
  const draft = createFeedbackDraft(type);
  elements.feedbackKind.value = type === "template" ? "template" : "feedback";
  elements.feedbackMessage.value = draft;

  try {
    await navigator.clipboard.writeText(draft);
    showFeedbackStatus(type === "template" ? "テンプレート要望の下書きをコピーしました。" : "フィードバックの下書きをコピーしました。");
  } catch (error) {
    showFeedbackStatus("コピーに失敗しました。", true);
  }
}

function createFeedbackDraft(type) {
  return type === "template"
    ? [
      "Super Memoのテンプレート要望",
      "",
      "使いたい場面:",
      "- ",
      "",
      "欲しいテンプレート:",
      "- ",
      "",
      "出力してほしい形式:",
      "- 会議メモ / アイデアメモ / 調査メモ / 動画リサーチ / その他",
      "",
      "あると有料でも使いたい機能:",
      "- "
    ].join("\n")
    : [
      "Super Memo / Simple Tools フィードバック",
      "",
      "主な使い道:",
      "- ",
      "",
      "便利だった点:",
      "- ",
      "",
      "分かりにくかった点:",
      "- ",
      "",
      "今後ほしい機能:",
      "- ",
      "",
      "有料版に入っていたら検討する機能:",
      "- "
    ].join("\n");
}

function sendFeedbackMail() {
  const kind = elements.feedbackKind.value === "template" ? "template" : "feedback";
  const body = elements.feedbackMessage.value.trim();
  if (!body) {
    showFeedbackStatus("送信したい内容を入力してください。", true);
    elements.feedbackMessage.focus();
    return;
  }

  const subject = kind === "template"
    ? "Super Memo テンプレート要望"
    : "Super Memo フィードバック";
  const mailtoUrl = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
  showFeedbackStatus("メール下書きを開きました。内容を確認して送信してください。");
}

function showFeedbackStatus(message, isError = false) {
  elements.feedbackStatus.textContent = message;
  elements.feedbackStatus.classList.toggle("is-error", isError);
}

function showView(viewName) {
  const safeView = document.querySelector(`#view-${viewName}`) ? viewName : "home";
  if (state.fullscreenView && state.fullscreenView !== `view-${safeView}`) {
    exitViewFullscreen();
  }

  elements.views.forEach((view) => {
    view.classList.toggle("is-visible", view.id === `view-${safeView}`);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === safeView);
  });

  if (safeView === "superMemo") {
    renderMemoGraph();
  }
  if (safeView === "pomodoro") {
    renderPomodoroTimer();
  }
  if (safeView === "timezones") {
    renderTimezoneTool();
  }
  if (safeView === "subscriptions") {
    renderSubscriptionTool();
  }
  if (safeView === "bookmarks") {
    renderBookmarkTool();
  }
  if (safeView === "videoFinder") {
    renderVideoFinder();
  }
  if (safeView === "calculator") {
    renderCalculator();
  }

  localStorage.setItem(STORAGE_KEYS.activeView, safeView);
  updateFullscreenButtons();
}

function installFullscreenButtons() {
  elements.views.forEach((view) => {
    if (view.querySelector("[data-fullscreen-toggle]")) {
      return;
    }
    const host = getFullscreenButtonHost(view);
    if (!host) {
      return;
    }
    const button = document.createElement("button");
    button.className = "secondary-button compact-button icon-only-button fullscreen-toggle-button";
    button.type = "button";
    button.dataset.fullscreenToggle = "true";
    button.setAttribute("aria-label", "全画面表示");
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = '<svg><use href="#icon-focus"></use></svg>';
    host.append(button);
  });
}

function getFullscreenButtonHost(view) {
  return view.querySelector(".page-head .page-actions")
    || view.querySelector(".pomodoro-head-actions")
    || view.querySelector(".timezone-add")
    || view.querySelector(".subscription-summary")
    || view.querySelector(".bookmark-import")
    || view.querySelector(".video-finder-head .page-actions")
    || view.querySelector(".calculator-head .page-actions")
    || view.querySelector(".page-head");
}

function toggleViewFullscreen(view) {
  if (!view) {
    return;
  }
  if (state.fullscreenView === view.id) {
    exitViewFullscreen();
    return;
  }
  enterViewFullscreen(view);
}

function enterViewFullscreen(view) {
  if (!view) {
    return;
  }
  if (state.fullscreenView) {
    exitViewFullscreen({ skipBrowser: true });
  }
  state.fullscreenView = view.id;
  document.body.classList.add("view-fullscreen-open");
  elements.views.forEach((item) => {
    item.classList.toggle("is-fullscreen-mode", item === view);
  });
  updateFullscreenButtons();
  if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function exitViewFullscreen(options = {}) {
  const viewId = state.fullscreenView;
  state.fullscreenView = null;
  document.body.classList.remove("view-fullscreen-open");
  elements.views.forEach((view) => {
    view.classList.remove("is-fullscreen-mode");
  });
  updateFullscreenButtons();
  if (!options.skipBrowser && document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen().catch(() => {});
  }
  if (viewId === "view-superMemo") {
    renderMemoGraph();
  }
}

function updateFullscreenButtons() {
  document.querySelectorAll("[data-fullscreen-toggle]").forEach((button) => {
    const view = button.closest(".view");
    const active = Boolean(view && state.fullscreenView === view.id);
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "全画面を終了" : "全画面表示");
  });
}

function renderNavigation() {
  elements.sidebarNavItems.forEach((item) => {
    item.hidden = !isViewEnabled(item.dataset.view);
  });
}

function toggleSidebar() {
  state.sidebarCollapsed = !state.sidebarCollapsed;
  localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(state.sidebarCollapsed));
  applySidebarState();
}

function applySidebarState() {
  document.body.classList.toggle("sidebar-collapsed", state.sidebarCollapsed);
  elements.sidebarToggleButton.setAttribute("aria-pressed", String(state.sidebarCollapsed));
  elements.sidebarToggleButton.setAttribute(
    "aria-label",
    state.sidebarCollapsed ? "サイドバーを展開する" : "サイドバーを折り畳む"
  );
  elements.sidebarToggleButton.textContent = state.sidebarCollapsed ? "›" : "‹";
}

function isViewEnabled(viewName) {
  if (viewName === "home" || viewName === "settings") {
    return true;
  }

  const tool = toolCatalog.find((item) => item.view === viewName);
  return Boolean(tool && tool.available && state.tools[tool.id]);
}

function renderHome() {
  elements.enabledTools.replaceChildren();
  const enabled = toolCatalog.filter((tool) => state.tools[tool.id] && tool.available && !tool.featured);

  if (enabled.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "サブツールは設定で有効化できます。";
    elements.enabledTools.append(empty);
    return;
  }

  enabled.forEach((tool) => {
    const button = document.createElement("button");
    button.className = "tool-tile";
    button.type = "button";
    button.addEventListener("click", () => showView(tool.view));

    const title = document.createElement("h3");
    title.textContent = tool.name;

    const description = document.createElement("p");
    description.textContent = tool.description;

    button.append(title, description);
    elements.enabledTools.append(button);
  });
  applyButtonTooltips();
}

function renderSettings() {
  elements.toolSettings.replaceChildren();

  toolCatalog.forEach((tool) => {
    const item = document.createElement("section");
    item.className = "settings-item";

    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = tool.name;
    const description = document.createElement("p");
    description.textContent = tool.featured ? `${tool.description} / メイン機能` : tool.description;
    copy.append(title, description);

    const label = document.createElement("label");
    label.className = "toggle";
    label.title = tool.available ? `${tool.name}を切り替える` : `${tool.name}は準備中です`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(state.tools[tool.id]);
    input.disabled = !tool.available || tool.featured;
    input.setAttribute("aria-label", `${tool.name}を切り替える`);
    input.addEventListener("change", () => {
      state.tools[tool.id] = input.checked;
      persistTools();
      renderHome();
      renderNavigation();
      const visibleView = document.querySelector(".view.is-visible");
      const activeView = visibleView ? visibleView.id.replace("view-", "") : "home";
      if (!isViewEnabled(activeView)) {
        showView("home");
      }
      showPromptStatus(`${tool.name}を${input.checked ? "有効" : "無効"}にしました。`);
    });

    const track = document.createElement("span");
    track.className = "toggle-track";
    label.append(input, track);

    item.append(copy, label);
    elements.toolSettings.append(item);
  });
  applyButtonTooltips();
}

function renderPracticalMemoTemplateOptions() {
  elements.memoPracticalTemplate.replaceChildren();
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "選択すると本文とプロパティへ反映";
  elements.memoPracticalTemplate.append(defaultOption);

  practicalMemoTemplates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.name;
    elements.memoPracticalTemplate.append(option);
  });
}

function applyTheme() {
  state.theme = "dark";
  localStorage.setItem(STORAGE_KEYS.theme, "dark");
  document.body.dataset.theme = "dark";
}

function renderMemo() {
  renderMemoStats();
  renderMemoList();
  renderMemoOptions();
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
  renderMemoGraph();
  renderMemoSelectionCount();
  applyButtonTooltips();
}

function resetMemoEditor(template = "Meeting") {
  const now = new Date();
  const id = createUniqueTimestampId(now);
  state.selectedMemoId = null;
  elements.memoId.value = "";
  elements.memoTitle.value = id;
  elements.memoDisplayTitle.value = "";
  elements.memoImportance.value = "0";
  elements.memoTemplate.value = template;
  elements.memoPracticalTemplate.value = "";
  updateNewMemoTemplateButtons(template);
  elements.memoDate.value = toDateValue(now);
  elements.memoCategories.value = template === "Meeting" ? "会議" : template === "Idea" ? "アイデア" : "";
  elements.memoPeople.value = "";
  elements.memoTopics.value = "";
  elements.memoTags.value = "";
  updateStarButton(false);
  elements.pinMemoButton.setAttribute("aria-label", "ピン留め");
  elements.pinMemoButton.classList.remove("is-active");
  elements.memoBody.value = templateBodies[template] || "";
  state.currentMemoImages = {};
  resetMemoBodyHistory(elements.memoBody.value);
  elements.archiveMemoButton.setAttribute("aria-label", "アーカイブ");
  elements.archiveMemoButton.classList.remove("is-active");
  renderMemoList();
  renderMemoOptions();
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
  showMemoStatus("");
  showView("superMemo");
  elements.memoBodyPreview.focus();
}

function clearMemoSelection() {
  state.selectedMemoIds.clear();
  renderMemoList();
  renderMemoSelectionCount();
}

function selectAllVisibleMemos() {
  filteredMemos({ includeArchived: false }).forEach((memo) => {
    state.selectedMemoIds.add(memo.id);
  });
  renderMemoList();
  renderMemoSelectionCount();
}

function toggleArchiveBox() {
  state.memoArchiveOpen = !state.memoArchiveOpen;
  renderArchiveBox();
}

function applyTemplateDefaults() {
  const template = elements.memoTemplate.value;
  updateNewMemoTemplateButtons(template);
  const isEmptyBody = !elements.memoBody.value.trim() || Object.values(templateBodies).includes(elements.memoBody.value);

  if (template === "Meeting" && !elements.memoCategories.value.trim()) {
    elements.memoCategories.value = "会議";
  }
  if (template === "Idea" && !elements.memoCategories.value.trim()) {
    elements.memoCategories.value = "アイデア";
  }
  if (isEmptyBody) {
    elements.memoBody.value = templateBodies[template] || "";
    resetMemoBodyHistory(elements.memoBody.value);
  }
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
}

function applyPracticalMemoTemplate() {
  const preset = practicalMemoTemplates.find((template) => template.id === elements.memoPracticalTemplate.value);
  if (!preset) {
    return;
  }

  elements.memoTemplate.value = preset.template;
  elements.memoDisplayTitle.value = preset.displayTitle;
  elements.memoImportance.value = String(preset.importance || 0);
  elements.memoCategories.value = preset.categories.join(", ");
  elements.memoTopics.value = preset.topics.join(", ");
  elements.memoTags.value = preset.tags.join(", ");
  if (!elements.memoDate.value) {
    elements.memoDate.value = toDateValue(new Date());
  }
  elements.memoBody.value = preset.body;
  state.currentMemoImages = {};
  resetMemoBodyHistory(elements.memoBody.value);
  updateNewMemoTemplateButtons(preset.template);
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
  showMemoStatus(`${preset.name}テンプレートを反映しました。`);
}

function saveMemo() {
  syncMemoEditorToSource();
  const now = new Date().toISOString();
  const title = elements.memoTitle.value.trim() || createTimestampId(new Date());
  const displayTitle = elements.memoDisplayTitle.value.trim();
  const existingId = elements.memoId.value;
  const note = {
    id: existingId || title,
    title,
    displayTitle,
    template: elements.memoTemplate.value,
    properties: {
      created: existingId
        ? getExistingMemo(existingId)?.properties?.created || now
        : now,
      date: elements.memoDate.value || toDateValue(new Date()),
      categories: parseList(elements.memoCategories.value),
      people: parseList(elements.memoPeople.value),
      topics: parseList(elements.memoTopics.value),
      tags: parseList(elements.memoTags.value)
    },
    body: elements.memoBody.value.trim(),
    links: extractLinks(elements.memoBody.value),
    images: Object.values(state.currentMemoImages),
    archived: existingId ? Boolean(getExistingMemo(existingId)?.archived) : false,
    pinned: existingId ? Boolean(getExistingMemo(existingId)?.pinned) : false,
    starred: existingId ? Boolean(getExistingMemo(existingId)?.starred) : false,
    importance: clampImportance(elements.memoImportance.value),
    openCount: existingId ? Number(getExistingMemo(existingId)?.openCount || 0) : 0,
    lastViewedAt: existingId ? getExistingMemo(existingId)?.lastViewedAt || "" : "",
    createdAt: existingId ? getExistingMemo(existingId)?.createdAt || now : now,
    updatedAt: now
  };

  if (!note.body && note.properties.people.length === 0 && note.properties.topics.length === 0) {
    showMemoStatus("本文、people、topicsのいずれかを入力してください。", true);
    return;
  }

  if (existingId) {
    state.memos = state.memos.map((memo) => memo.id === existingId ? note : memo);
  } else {
    state.memos = [note, ...state.memos];
  }

  state.selectedMemoId = note.id;
  elements.memoId.value = note.id;
  persistMemos();
  renderMemo();
  showMemoStatus("保存しました。");
}

function selectMemo(id) {
  const memo = getExistingMemo(id);
  if (!memo) {
    return;
  }

  state.selectedMemoId = id;
  const viewedAt = new Date().toISOString();
  memo.openCount = Number(memo.openCount || 0) + 1;
  memo.lastViewedAt = viewedAt;
  persistMemos();
  elements.memoId.value = memo.id;
  elements.memoTitle.value = memo.title || memo.id;
  elements.memoDisplayTitle.value = memo.displayTitle || "";
  elements.memoImportance.value = String(clampImportance(memo.importance));
  elements.memoTemplate.value = memo.template || "Blank";
  elements.memoPracticalTemplate.value = "";
  updateNewMemoTemplateButtons(elements.memoTemplate.value);
  elements.memoDate.value = memo.properties?.date || "";
  elements.memoCategories.value = asArray(memo.properties?.categories).join(", ");
  elements.memoPeople.value = asArray(memo.properties?.people).join(", ");
  elements.memoTopics.value = asArray(memo.properties?.topics).join(", ");
  elements.memoTags.value = asArray(memo.properties?.tags).join(", ");
  elements.memoBody.value = memo.body || "";
  state.currentMemoImages = imagesToMap(memo.images);
  resetMemoBodyHistory(elements.memoBody.value);
  elements.pinMemoButton.setAttribute("aria-label", memo.pinned ? "ピン解除" : "ピン留め");
  elements.pinMemoButton.classList.toggle("is-active", Boolean(memo.pinned));
  updateStarButton(Boolean(memo.starred));
  elements.archiveMemoButton.setAttribute("aria-label", memo.archived ? "アーカイブ解除" : "アーカイブ");
  elements.archiveMemoButton.classList.toggle("is-active", Boolean(memo.archived));
  renderMemoList();
  renderMemoOptions();
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
  renderMemoGraph();
  showMemoStatus("");
}

function updateNewMemoTemplateButtons(template) {
  const buttons = [
    [elements.newMeetingNoteButton, "Meeting"],
    [elements.newIdeaNoteButton, "Idea"],
    [elements.newBlankNoteButton, "Blank"]
  ];
  buttons.forEach(([button, value]) => {
    const active = template === value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function deleteCurrentMemo() {
  const id = elements.memoId.value;
  if (!id) {
    resetMemoEditor();
    return;
  }

  const memo = getExistingMemo(id);
  const title = memo?.title || id;
  if (!window.confirm(`「${title}」を本当に削除しますか？この操作は元に戻せません。`)) {
    showMemoStatus("削除をキャンセルしました。");
    return;
  }

  state.memos = state.memos.filter((memo) => memo.id !== id);
  state.selectedMemoIds.delete(id);
  persistMemos();
  if (state.memos.length > 0) {
    const nextMemo = state.memos.find((memo) => !memo.archived) || state.memos[0];
    selectMemo(nextMemo.id);
  } else {
    resetMemoEditor("Meeting");
  }
  renderMemo();
  showMemoStatus("削除しました。");
}

function toggleCurrentMemoArchive() {
  const id = elements.memoId.value;
  if (!id) {
    showMemoStatus("アーカイブするメモを選択してください。", true);
    return;
  }

  let archived = false;
  state.memos = state.memos.map((memo) => {
    if (memo.id !== id) {
      return memo;
    }
    archived = !memo.archived;
    return {
      ...memo,
      archived,
      updatedAt: new Date().toISOString()
    };
  });

  persistMemos();
  selectMemo(id);
  renderMemoStats();
  renderMemoGraph();
  renderArchiveBox();
  showMemoStatus(archived ? "アーカイブしました。" : "アーカイブを解除しました。");
}

function toggleCurrentMemoPin() {
  const id = elements.memoId.value;
  if (!id) {
    showMemoStatus("ピン留めするメモを選択してください。", true);
    return;
  }

  let pinned = false;
  state.memos = state.memos.map((memo) => {
    if (memo.id !== id) {
      return memo;
    }
    pinned = !memo.pinned;
    return {
      ...memo,
      pinned,
      updatedAt: new Date().toISOString()
    };
  });

  persistMemos();
  selectMemo(id);
  showMemoStatus(pinned ? "ピン留めしました。" : "ピン留めを解除しました。");
}

function toggleCurrentMemoStar() {
  const id = elements.memoId.value;
  if (!id) {
    showMemoStatus("スターを付けるメモを選択してください。", true);
    return;
  }

  let starred = false;
  state.memos = state.memos.map((memo) => {
    if (memo.id !== id) {
      return memo;
    }
    starred = !memo.starred;
    return {
      ...memo,
      starred,
      updatedAt: new Date().toISOString()
    };
  });

  persistMemos();
  selectMemo(id);
  showMemoStatus(starred ? "スターを付けました。" : "スターを外しました。");
}

function updateStarButton(starred) {
  elements.starMemoButton.textContent = starred ? "★" : "☆";
  elements.starMemoButton.title = starred ? "スターを外す" : "スターを付ける";
  elements.starMemoButton.setAttribute("aria-label", starred ? "スターを外す" : "スターを付ける");
  elements.starMemoButton.classList.toggle("is-active", starred);
}

function splitSelectedMemoText() {
  const selectedText = getSelectedMemoText();
  if (!selectedText) {
    showMemoStatus("本文内で分割したい範囲を選択してください。", true);
    return;
  }

  const sourceId = elements.memoId.value;
  const sourceTitle = elements.memoDisplayTitle.value.trim() || elements.memoTitle.value;
  const now = new Date();
  const id = createUniqueTimestampId(now);
  const memo = {
    id,
    title: id,
    displayTitle: `${sourceTitle} から分割`,
    template: "Blank",
    properties: {
      created: now.toISOString(),
      date: toDateValue(now),
      categories: parseList(elements.memoCategories.value),
      people: parseList(elements.memoPeople.value),
      topics: parseList(elements.memoTopics.value),
      tags: [...new Set([...parseList(elements.memoTags.value), "分割"])]
    },
    body: `${selectedText}\n\n## 分割元\n[[${sourceId || elements.memoTitle.value}]]`,
    links: [sourceId || elements.memoTitle.value].filter(Boolean),
    images: [],
    archived: false,
    pinned: false,
    starred: false,
    importance: 0,
    openCount: 0,
    lastViewedAt: "",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  state.memos = [memo, ...state.memos];
  persistMemos();
  selectMemo(memo.id);
  showMemoStatus("選択範囲を新しいメモとして分割しました。");
}

function mergeSelectedMemos() {
  syncMemoEditorToSource();
  const selected = state.memos.filter((memo) => state.selectedMemoIds.has(memo.id));
  const current = buildCurrentMemoSnapshot();
  const memos = selected.length > 0
    ? selected
    : current ? [current] : [];

  if (memos.length < 2) {
    showMemoStatus("統合するメモを2件以上選択してください。", true);
    return;
  }

  const now = new Date();
  const id = createUniqueTimestampId(now);
  const mergedProperties = mergeMemoProperties(memos);
  const body = memos.map((memo) => {
    return [
      `## ${getMemoDisplayName(memo)}`,
      `ID: [[${memo.id}]]`,
      "",
      memo.body || ""
    ].join("\n");
  }).join("\n\n---\n\n");
  const links = [...new Set([...memos.map((memo) => memo.id), ...memos.flatMap((memo) => asArray(memo.links))])].filter((link) => link !== id);
  const images = memos.flatMap((memo) => asArray(memo.images));
  const mergedMemo = {
    id,
    title: id,
    displayTitle: `統合メモ ${toDateValue(now)}`,
    template: "Blank",
    properties: {
      ...mergedProperties,
      created: now.toISOString(),
      date: toDateValue(now)
    },
    body,
    links,
    images,
    archived: false,
    pinned: false,
    starred: memos.some((memo) => memo.starred),
    importance: Math.max(0, ...memos.map((memo) => clampImportance(memo.importance))),
    openCount: 0,
    lastViewedAt: "",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  };

  state.memos = [mergedMemo, ...state.memos];
  state.selectedMemoIds.clear();
  persistMemos();
  selectMemo(mergedMemo.id);
  showMemoStatus(`${memos.length}件のメモを統合しました。元メモは残しています。`);
}

function mergeMemoProperties(memos) {
  const merged = {
    categories: new Set(),
    people: new Set(),
    topics: new Set(),
    tags: new Set()
  };
  memos.forEach((memo) => {
    const properties = memo.properties || {};
    asArray(properties.categories).forEach((value) => merged.categories.add(value));
    asArray(properties.people).forEach((value) => merged.people.add(value));
    asArray(properties.topics).forEach((value) => merged.topics.add(value));
    asArray(properties.tags).forEach((value) => merged.tags.add(value));
  });
  return {
    categories: [...merged.categories],
    people: [...merged.people],
    topics: [...merged.topics],
    tags: [...merged.tags]
  };
}

function updateCurrentMemoImportance() {
  const id = elements.memoId.value;
  if (!id) {
    return;
  }
  const importance = clampImportance(elements.memoImportance.value);
  state.memos = state.memos.map((memo) => {
    if (memo.id !== id) {
      return memo;
    }
    return {
      ...memo,
      importance,
      updatedAt: new Date().toISOString()
    };
  });
  persistMemos();
  renderMemoList();
  renderMemoGraph();
  showMemoStatus(importance > 0 ? `重要度を${getImportanceLabel(importance)}にしました。` : "重要度を解除しました。");
}

async function copyCurrentMemo() {
  const content = buildMemoMarkdown();
  if (!content.trim()) {
    showMemoStatus("コピーする内容がありません。", true);
    return;
  }

  try {
    await copyText(content);
    showMemoStatus("コピーしました。");
  } catch {
    showMemoStatus("コピーに失敗しました。", true);
  }
}

async function copyMemoBodyOnly() {
  syncMemoEditorToSource();
  const body = elements.memoBody.value;
  if (!body.trim()) {
    showMemoStatus("コピーする本文がありません。", true);
    return;
  }

  try {
    await copyText(body);
    showMemoStatus("本文をコピーしました。");
  } catch {
    showMemoStatus("本文のコピーに失敗しました。", true);
  }
}

function buildMemoMarkdown() {
  syncMemoEditorToSource();
  const properties = [
    `title: ${elements.memoDisplayTitle.value || ""}`,
    `created: ${elements.memoDate.value || ""}`,
    `categories: ${elements.memoCategories.value}`,
    `people: ${elements.memoPeople.value}`,
    `topics: ${elements.memoTopics.value}`,
    `tags: ${elements.memoTags.value}`
  ].join("\n");

  const heading = elements.memoDisplayTitle.value.trim() || elements.memoTitle.value;
  return `# ${heading}\n\nID: ${elements.memoTitle.value}\n\n---\n${properties}\n---\n\n${elements.memoBody.value}`;
}

function renderMemoList() {
  elements.memoList.replaceChildren();
  const memos = filteredMemos({ includeArchived: false });

  if (memos.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    const hasActiveMemos = state.memos.some((memo) => !memo.archived);
    empty.textContent = state.memos.length === 0
      ? "保存済みノートはありません。"
      : hasActiveMemos ? "該当するノートはありません。" : "通常一覧に表示できるノートはありません。";
    elements.memoList.append(empty);
    renderArchiveBox();
    return;
  }

  memos.forEach((memo) => {
    elements.memoList.append(createMemoListItem(memo, { selectable: true }));
  });

  renderMemoSelectionCount();
  renderArchiveBox();
  applyButtonTooltips(elements.memoList);
}

function createMemoListItem(memo, options = {}) {
  const item = document.createElement("div");
  item.className = "memo-list-item";
  item.classList.toggle("is-active", memo.id === state.selectedMemoId);
  item.classList.toggle("is-archived", Boolean(memo.archived));
  item.dataset.heat = getMemoHeatLevel(memo);

  if (options.selectable) {
    const selector = document.createElement("label");
    selector.className = "memo-select";
    selector.title = "Word出力に含める";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selectedMemoIds.has(memo.id);
    checkbox.setAttribute("aria-label", `${memo.title || memo.id}を選択`);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.selectedMemoIds.add(memo.id);
      } else {
        state.selectedMemoIds.delete(memo.id);
      }
      renderMemoSelectionCount();
    });
    selector.append(checkbox);
    item.append(selector);
  }

  const row = document.createElement("button");
  row.className = "memo-row";
  row.type = "button";
  row.classList.toggle("is-active", memo.id === state.selectedMemoId);
  row.addEventListener("click", () => selectMemo(memo.id));

  const title = document.createElement("strong");
  const markers = [
    memo.starred ? "★" : "",
    memo.importance ? `重要度${getImportanceLabel(memo.importance)}` : ""
  ].filter(Boolean);
  title.textContent = markers.length > 0
    ? `${markers.join(" ")} ${getMemoDisplayName(memo)}`
    : getMemoDisplayName(memo);

  const meta = document.createElement("span");
  const bits = [
    getMemoHeatLabel(memo),
    memo.pinned ? "ピン留め" : "",
    memo.starred ? "スター" : "",
    memo.importance ? `重要度${getImportanceLabel(memo.importance)}` : "",
    memo.title || memo.id,
    getTemplateLabel(memo.template),
    memo.archived ? "アーカイブ" : "",
    memo.openCount ? `${memo.openCount}回` : "",
    ...asArray(memo.properties?.people).slice(0, 2),
    ...asArray(memo.properties?.topics).slice(0, 2)
  ];
  meta.textContent = bits.filter(Boolean).join(" / ") || "プロパティなし";

  row.append(title, meta);
  item.append(row);
  return item;
}

function renderArchiveBox() {
  const archived = state.memos
    .filter((memo) => memo.archived)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  elements.memoArchiveCount.textContent = `${archived.length}件`;
  elements.memoArchiveBox.hidden = !state.memoArchiveOpen;
  elements.toggleArchiveBoxButton.classList.toggle("is-active", state.memoArchiveOpen);
  elements.toggleArchiveBoxButton.setAttribute("aria-expanded", String(state.memoArchiveOpen));

  if (!state.memoArchiveOpen) {
    return;
  }

  elements.memoArchiveList.replaceChildren();
  if (archived.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "アーカイブ済みメモはありません。";
    elements.memoArchiveList.append(empty);
    return;
  }

  archived.forEach((memo) => {
    elements.memoArchiveList.append(createMemoListItem(memo, { selectable: false }));
  });
}

function filteredMemos(options = {}) {
  const includeArchived = Boolean(options.includeArchived);
  const memos = sortMemosForSearch([...state.memos]);

  return memos.filter((memo) => {
    if (!includeArchived && memo.archived) {
      return false;
    }
    const properties = memo.properties || {};
    const queryMatched = memoMatchesSearchMode(memo);
    const peopleMatched = !state.memoDetailSearchOpen || propertyMatches(properties.people, state.memoFilters.people);
    const topicsMatched = !state.memoDetailSearchOpen || propertyMatches(properties.topics, state.memoFilters.topics);
    const tagsMatched = !state.memoDetailSearchOpen || propertyMatches(properties.tags, state.memoFilters.tags);
    const dateMatched = !state.memoDetailSearchOpen || memoDateMatches(memo);
    return queryMatched && peopleMatched && topicsMatched && tagsMatched && dateMatched;
  });
}

function sortMemosForSearch(memos) {
  if (state.memoSearchMode === "recent") {
    return memos.sort((a, b) => {
      return new Date(b.lastViewedAt || b.updatedAt || b.createdAt).getTime()
        - new Date(a.lastViewedAt || a.updatedAt || a.createdAt).getTime();
    });
  }
  if (state.memoSearchMode === "frequent") {
    return memos.sort((a, b) => {
      const countDiff = Number(b.openCount || 0) - Number(a.openCount || 0);
      if (countDiff !== 0) {
        return countDiff;
      }
      return new Date(b.lastViewedAt || b.updatedAt || b.createdAt).getTime()
        - new Date(a.lastViewedAt || a.updatedAt || a.createdAt).getTime();
    });
  }
  return memos.sort((a, b) => {
    return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
  });
}

function memoMatchesSearchMode(memo) {
  const query = state.memoQuery;
  if (state.memoSearchMode === "attachments") {
    return hasMemoAttachment(memo) && memoMatchesFullText(memo, query);
  }
  if (state.memoSearchMode === "checkboxes") {
    return hasMemoCheckbox(memo) && memoMatchesFullText(memo, query);
  }
  if (state.memoSearchMode === "pinned") {
    return Boolean(memo.pinned) && memoMatchesFullText(memo, query);
  }
  if (state.memoSearchMode === "tags") {
    return propertyMatches(memo.properties?.tags, query);
  }
  if (state.memoSearchMode === "date") {
    const date = memo.properties?.date || "";
    return !query || date.includes(query);
  }
  if (state.memoSearchMode === "recent" || state.memoSearchMode === "frequent") {
    return memoMatchesFullText(memo, query);
  }
  return memoMatchesFullText(memo, query);
}

function memoMatchesFullText(memo, query) {
  if (!query) {
    return true;
  }
  const properties = memo.properties || {};
  const haystack = [
    memo.id,
    memo.title,
    memo.displayTitle,
    memo.template,
    memo.body,
    asArray(properties.categories).join(" "),
    asArray(properties.people).join(" "),
    asArray(properties.topics).join(" "),
    asArray(properties.tags).join(" ")
  ].join(" ").toLowerCase();
  return haystack.includes(query);
}

function memoDateMatches(memo) {
  const from = state.memoFilters.dateFrom;
  const to = state.memoFilters.dateTo;
  if (!from && !to) {
    return true;
  }
  const date = memo.properties?.date || toDateValue(new Date(memo.createdAt || memo.updatedAt || Date.now()));
  if (from && date < from) {
    return false;
  }
  if (to && date > to) {
    return false;
  }
  return true;
}

function hasMemoAttachment(memo) {
  return asArray(memo.images).length > 0 || /!\[[^\]]*]\([^)]+\)/.test(memo.body || "");
}

function hasMemoCheckbox(memo) {
  return /(^|\n)\s*[-*]\s+\[[ xX]\]\s+/.test(memo.body || "");
}

function propertyMatches(values, query) {
  if (!query) {
    return true;
  }
  return asArray(values).join(" ").toLowerCase().includes(query.trim().toLowerCase());
}

function updateMemoFilter(key, value) {
  state.memoFilters[key] = value.trim().toLowerCase();
  renderMemoList();
}

function bindMemoFilterSuggestionField(input, key) {
  input.addEventListener("focus", () => renderMemoFilterSuggestions(key));
  input.addEventListener("click", () => renderMemoFilterSuggestions(key));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideMemoFilterSuggestions();
    }
  });
  input.addEventListener("blur", () => {
    window.setTimeout(hideMemoFilterSuggestions, 140);
  });
}

function renderMemoFilterSuggestions(key) {
  if (!elements.memoFilterSuggestions) {
    return;
  }
  const input = getMemoFilterInput(key);
  if (!input || document.activeElement !== input) {
    return;
  }
  const fragment = getMemoFilterActiveFragment(input.value);
  const suggestions = collectProperty(key)
    .filter((value) => !fragment || value.toLowerCase().includes(fragment.toLowerCase()))
    .slice(0, 18);

  elements.memoFilterSuggestions.replaceChildren();
  elements.memoFilterSuggestions.hidden = suggestions.length === 0;
  if (suggestions.length === 0) {
    return;
  }

  suggestions.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "memo-filter-suggestion";
    button.textContent = value;
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      applyMemoFilterSuggestion(key, value);
    });
    elements.memoFilterSuggestions.append(button);
  });
}

function applyMemoFilterSuggestion(key, value) {
  const input = getMemoFilterInput(key);
  if (!input) {
    return;
  }
  input.value = replaceMemoFilterActiveFragment(input.value, value);
  updateMemoFilter(key, input.value);
  renderMemoFilterSuggestions(key);
  input.focus();
}

function hideMemoFilterSuggestions() {
  if (!elements.memoFilterSuggestions) {
    return;
  }
  elements.memoFilterSuggestions.hidden = true;
}

function getMemoFilterInput(key) {
  return {
    people: elements.memoFilterPeople,
    topics: elements.memoFilterTopics,
    tags: elements.memoFilterTags
  }[key] || null;
}

function getMemoFilterActiveFragment(value) {
  const parts = String(value || "").split(",");
  return parts[parts.length - 1].trim();
}

function replaceMemoFilterActiveFragment(currentValue, nextValue) {
  const parts = String(currentValue || "").split(",");
  parts[parts.length - 1] = ` ${nextValue}`;
  return parts.map((part) => part.trim()).filter(Boolean).join(", ");
}

function renderMemoSelectionCount() {
  const count = state.selectedMemoIds.size;
  const visibleCount = filteredMemos().length;
  elements.memoSelectionCount.textContent = count > 0 ? `${count}件選択` : "表示中メモ";
  elements.selectAllMemoSelectionButton.disabled = visibleCount === 0;
  elements.clearMemoSelectionButton.disabled = count === 0;
}

function renderMemoStats() {
  const people = new Set();
  const topics = new Set();
  let linkCount = 0;

  state.memos.forEach((memo) => {
    asArray(memo.properties?.people).forEach((item) => people.add(item));
    asArray(memo.properties?.topics).forEach((item) => topics.add(item));
    linkCount += asArray(memo.links).length;
  });

  elements.memoStatNotes.textContent = String(state.memos.length);
  elements.memoStatLinks.textContent = String(linkCount);
  elements.memoStatPeople.textContent = String(people.size);
  elements.memoStatTopics.textContent = String(topics.size);
}

function renderMemoOptions() {
  renderDatalist(elements.memoPeopleOptions, collectProperty("people"));
  renderDatalist(elements.memoTopicsOptions, collectProperty("topics"));

  elements.memoLinkTarget.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "リンク先を選択";
  elements.memoLinkTarget.append(placeholder);

  getMemoLinkCandidates().forEach((memo) => {
    if (memo.id === elements.memoId.value) {
      return;
    }
    const option = document.createElement("option");
    option.value = memo.id;
    option.textContent = `${getMemoDisplayName(memo)} / ${memo.id}`;
    elements.memoLinkTarget.append(option);
  });
}

function getMemoLinkCandidates() {
  const query = state.memoLinkQuery;
  if (!query) {
    return state.memos;
  }

  return state.memos.filter((memo) => {
    const properties = memo.properties || {};
    const haystack = [
      memo.id,
      memo.title,
      memo.displayTitle,
      memo.body,
      asArray(properties.people).join(" "),
      asArray(properties.topics).join(" "),
      asArray(properties.tags).join(" ")
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  });
}

function renderDatalist(element, values) {
  element.replaceChildren();
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    element.append(option);
  });
}

function collectProperty(key) {
  const values = new Set();
  state.memos.forEach((memo) => {
    asArray(memo.properties?.[key]).forEach((value) => values.add(value));
  });
  return [...values].sort((a, b) => a.localeCompare(b, "ja"));
}

function insertMemoLink() {
  const target = elements.memoLinkTarget.value;
  if (!target) {
    showMemoStatus("リンク先ノートを選んでください。", true);
    return;
  }

  const insertion = `[[${target}]]`;
  insertTextIntoMemoBody(insertion);
  showMemoStatus("IDリンクを挿入しました。");
}

function getSelectedMemoText() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !elements.memoBodyPreview.contains(selection.anchorNode)) {
    return "";
  }
  return selection.toString().trim();
}

function handleMemoBodyInput() {
  elements.memoBody.value = editorToMarkdown();
  recordMemoBodyState(elements.memoBody.value);
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  updateIdCommandFromSelection();
}

function handleMemoBodyKeydown(event) {
  if (state.idCommand.active && handleIdCommandKeydown(event)) {
    return;
  }
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && key === "k") {
    event.preventDefault();
    applyHyperlinkToSelectedMemoText();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && key === "z" && !event.shiftKey) {
    event.preventDefault();
    undoMemoBody();
  }
  if ((event.ctrlKey || event.metaKey) && (key === "y" || (key === "z" && event.shiftKey))) {
    event.preventDefault();
    redoMemoBody();
  }
}

function handleIdCommandKeydown(event) {
  const key = event.key;
  if (key === "Escape") {
    event.preventDefault();
    closeIdCommand();
    return true;
  }

  const options = getIdCommandOptions();
  if (key === "ArrowDown" || key === "ArrowUp") {
    event.preventDefault();
    const direction = key === "ArrowDown" ? 1 : -1;
    state.idCommand.selectedIndex = (state.idCommand.selectedIndex + direction + options.length) % Math.max(options.length, 1);
    renderIdCommandPopover(options);
    return true;
  }

  if (key === "Enter" || key === "Tab") {
    event.preventDefault();
    if (options.length > 0) {
      insertIdCommandSelection(options[state.idCommand.selectedIndex] || options[0]);
    } else {
      closeIdCommand();
    }
    return true;
  }

  return false;
}

function updateIdCommandFromSelection() {
  const command = getIdCommandAtCursor();
  if (!command) {
    closeIdCommand();
    return;
  }

  state.idCommand.active = true;
  state.idCommand.query = command.query.toLowerCase();
  state.idCommand.range = command.range;
  const options = getIdCommandOptions();
  if (state.idCommand.selectedIndex >= options.length) {
    state.idCommand.selectedIndex = 0;
  }
  renderIdCommandPopover(options);
}

function getIdCommandAtCursor() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !elements.memoBodyPreview.contains(selection.anchorNode)) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!range.collapsed || range.startContainer.nodeType !== Node.TEXT_NODE) {
    return null;
  }

  const text = range.startContainer.textContent || "";
  const beforeCursor = text.slice(0, range.startOffset);
  const match = beforeCursor.match(/\/id([^\s\[\]]*)$/i);
  if (!match) {
    return null;
  }

  const commandRange = document.createRange();
  commandRange.setStart(range.startContainer, range.startOffset - match[0].length);
  commandRange.setEnd(range.startContainer, range.startOffset);
  return {
    query: match[1] || "",
    range: commandRange
  };
}

function getIdCommandOptions() {
  const query = state.idCommand.query;
  return state.memos
    .filter((memo) => !memo.archived)
    .filter((memo) => {
      if (!query) {
        return true;
      }
      const haystack = [
        memo.id,
        memo.title,
        memo.displayTitle,
        ...asArray(memo.properties?.people),
        ...asArray(memo.properties?.topics)
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    })
    .sort((a, b) => {
      const aActive = a.id === state.selectedMemoId ? 1 : 0;
      const bActive = b.id === state.selectedMemoId ? 1 : 0;
      if (aActive !== bActive) {
        return aActive - bActive;
      }
      return new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime();
    })
    .slice(0, 8);
}

function renderIdCommandPopover(options) {
  elements.memoIdCommandPopover.replaceChildren();
  elements.memoIdCommandPopover.hidden = false;
  if (options.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "一致するIDはありません。";
    elements.memoIdCommandPopover.append(empty);
    return;
  }

  options.forEach((memo, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "id-command-option";
    button.classList.toggle("is-active", index === state.idCommand.selectedIndex);
    button.setAttribute("role", "option");
    button.setAttribute("aria-selected", String(index === state.idCommand.selectedIndex));
    const title = document.createElement("strong");
    title.textContent = getMemoDisplayName(memo);
    const meta = document.createElement("span");
    meta.textContent = memo.id;
    button.append(title, meta);
    button.addEventListener("mousedown", (event) => {
      event.preventDefault();
      insertIdCommandSelection(memo);
    });
    elements.memoIdCommandPopover.append(button);
  });
}

function insertIdCommandSelection(memo) {
  const range = state.idCommand.range;
  if (!range || !memo) {
    closeIdCommand();
    return;
  }

  pushMemoBodyUndoState(elements.memoBody.value);
  const selection = window.getSelection();
  range.deleteContents();
  const node = document.createTextNode(`[[${memo.id}]]`);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  elements.memoBody.value = editorToMarkdown();
  state.memoBodyHistory.last = elements.memoBody.value;
  state.memoBodyHistory.redo = [];
  closeIdCommand();
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
  showMemoStatus("IDリンクを挿入しました。");
}

function closeIdCommand() {
  state.idCommand.active = false;
  state.idCommand.query = "";
  state.idCommand.selectedIndex = 0;
  state.idCommand.range = null;
  elements.memoIdCommandPopover.hidden = true;
  elements.memoIdCommandPopover.replaceChildren();
}

function applyHyperlinkToSelectedMemoText() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !elements.memoBodyPreview.contains(selection.anchorNode)) {
    showMemoStatus("本文の文字を選択してからCtrl+Kを押してください。", true);
    return;
  }

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString().trim();
  if (!selectedText) {
    showMemoStatus("リンクにする文字を選択してください。", true);
    return;
  }

  const label = window.prompt("リンクとして表示する文字", selectedText);
  if (label === null) {
    return;
  }
  const displayText = label.trim() || selectedText;
  const rawTarget = window.prompt("URLまたはフォルダパス", "");
  if (rawTarget === null) {
    return;
  }
  const target = rawTarget.trim();
  if (!target) {
    showMemoStatus("URLまたはフォルダパスを入力してください。", true);
    return;
  }
  if (!isSafeHyperlinkTarget(target)) {
    showMemoStatus("http、https、mailto、file、またはWindowsフォルダパスを入力してください。", true);
    return;
  }

  const link = document.createElement("a");
  const href = normalizeHyperlinkHref(target);
  link.href = href;
  link.textContent = displayText;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.title = isLocalFileHref(href) ? "Ctrl+クリックでパスをコピー" : "Ctrl+クリックで開く";
  if (isLocalFileHref(href)) {
    link.dataset.linkKind = "local-file";
  }

  range.deleteContents();
  range.insertNode(link);
  range.setStartAfter(link);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  handleMemoBodyInput();
  renderMemoEditor();
  showMemoStatus("リンクを設定しました。");
}

function handleMemoBodyMouseDown(event) {
  const link = getMemoEventLink(event);
  if (!link || !elements.memoBodyPreview.contains(link)) {
    return;
  }

  if ((event.ctrlKey || event.metaKey) && isLocalFileHref(link.getAttribute("href"))) {
    event.preventDefault();
    handleLocalFileLink(link.getAttribute("href"));
  }
}

function handleMemoBodyClick(event) {
  const copyButton = getMemoEventCopyButton(event);
  if (copyButton) {
    event.preventDefault();
    copyLocalPath(copyButton.dataset.path || "");
    return;
  }

  const link = getMemoEventLink(event);
  if (!link || !elements.memoBodyPreview.contains(link)) {
    return;
  }

  if (link.dataset.linkKind === "memo-id") {
    event.preventDefault();
    if (!event.ctrlKey && !event.metaKey) {
      showMemoStatus("IDリンクはCtrl+クリックまたはダブルクリックで開けます。");
      return;
    }
    openMemoIdLink(link);
    return;
  }

  if (isLocalFileHref(link.getAttribute("href"))) {
    event.preventDefault();
    showMemoStatus("フォルダパスはCtrl+クリックでコピーできます。");
    return;
  }

  if (!event.ctrlKey && !event.metaKey) {
    showMemoStatus("リンクはCtrl+クリックで開けます。");
    return;
  }

  event.preventDefault();
  const href = link.getAttribute("href");
  if (!href || !isSafeHyperlinkTarget(href)) {
    showMemoStatus("開けないリンクです。", true);
    return;
  }

  if (isLocalFileHref(href)) {
    handleLocalFileLink(href);
    return;
  }

  const opened = window.open(href, "_blank", "noopener,noreferrer");
  if (!opened) {
    showMemoStatus("ブラウザ設定によりリンクを開けませんでした。", true);
    return;
  }
  showMemoStatus("リンクを開きました。");
}

function handleMemoBodyDoubleClick(event) {
  const link = getMemoEventLink(event);
  if (!link || !elements.memoBodyPreview.contains(link) || link.dataset.linkKind !== "memo-id") {
    return;
  }
  event.preventDefault();
  openMemoIdLink(link);
}

function openMemoIdLink(link) {
  const target = getExistingMemo(link.dataset.memoId || "");
  if (!target) {
    showMemoStatus("リンク先メモが見つかりません。", true);
    return;
  }
  closeMemoBodyFocus();
  selectMemo(target.id);
  showMemoStatus("IDリンク先を開きました。");
}

async function handleLocalFileLink(href) {
  await copyLocalPath(fileHrefToWindowsPath(href));
}

async function copyLocalPath(explorerPath) {
  if (!explorerPath) {
    showMemoStatus("コピーするフォルダパスがありません。", true);
    return;
  }
  try {
    await copyText(explorerPath);
    showMemoStatus("コピーしました。エクスプローラーのアドレスバーに貼り付けてください。");
  } catch {
    showMemoStatus(`ブラウザ制限でフォルダは直接開けません。手動でコピーしてください: ${explorerPath}`, true);
  }
}

function getMemoEventLink(event) {
  const target = event.target;
  if (!target || target === elements.memoBodyPreview) {
    return null;
  }
  const element = target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement;
  return element?.closest("a") || null;
}

function getMemoEventCopyButton(event) {
  const target = event.target;
  if (!target || target === elements.memoBodyPreview) {
    return null;
  }
  const element = target.nodeType === Node.ELEMENT_NODE ? target : target.parentElement;
  return element?.closest(".local-path-copy") || null;
}

function handleMemoBodyPaste(event) {
  const items = Array.from(event.clipboardData?.items || []);
  const imageItem = items.find((item) => item.type.startsWith("image/"));
  if (!imageItem) {
    const text = event.clipboardData?.getData("text/plain") || "";
    const linkedText = autoLinkPastedText(text);
    if (linkedText && linkedText !== text) {
      event.preventDefault();
      insertTextIntoMemoBody(linkedText);
      showMemoStatus("リンクとして貼り付けました。");
    }
    return;
  }

  const file = imageItem.getAsFile();
  if (!file) {
    return;
  }

  event.preventDefault();
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const dataUrl = String(reader.result || "");
    if (!dataUrl) {
      showMemoStatus("画像の貼り付けに失敗しました。", true);
      return;
    }
    const imageId = createImageId();
    state.currentMemoImages[imageId] = {
      id: imageId,
      src: dataUrl,
      alt: "貼り付け画像",
      width: 480
    };
    insertMemoImageIntoEditor(imageId);
    showMemoStatus("画像を本文に貼り付けました。");
  });
  reader.readAsDataURL(file);
}

function insertTextIntoMemoBody(text) {
  pushMemoBodyUndoState(elements.memoBody.value);
  insertTextAtMemoCursor(text);
  elements.memoBody.value = editorToMarkdown();
  state.memoBodyHistory.last = elements.memoBody.value;
  state.memoBodyHistory.redo = [];
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
  elements.memoBodyPreview.focus();
}

function insertMemoImageIntoEditor(imageId) {
  pushMemoBodyUndoState(elements.memoBody.value);
  const image = state.currentMemoImages[imageId];
  const figure = createPreviewImageFigure(image);
  insertBlockAtMemoCursor(figure);
  elements.memoBody.value = editorToMarkdown();
  state.memoBodyHistory.last = elements.memoBody.value;
  state.memoBodyHistory.redo = [];
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
  elements.memoBodyPreview.focus();
}

function insertTextAtMemoCursor(text) {
  elements.memoBodyPreview.focus();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !elements.memoBodyPreview.contains(selection.anchorNode)) {
    elements.memoBodyPreview.append(document.createTextNode(text));
    return;
  }

  const range = selection.getRangeAt(0);
  range.deleteContents();
  const node = document.createTextNode(text);
  range.insertNode(node);
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

function insertBlockAtMemoCursor(block) {
  elements.memoBodyPreview.focus();
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || !elements.memoBodyPreview.contains(selection.anchorNode)) {
    elements.memoBodyPreview.append(block);
    return;
  }

  const range = selection.getRangeAt(0);
  const blockTarget = getMemoEditorBlock(range);
  if (blockTarget) {
    blockTarget.after(block);
  } else {
    range.deleteContents();
    range.insertNode(block);
  }
}

function getMemoEditorBlock(range) {
  let node = range.commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) {
    node = node.parentElement;
  }

  while (node && node.parentElement !== elements.memoBodyPreview) {
    node = node.parentElement;
  }

  return node && node !== elements.memoBodyPreview ? node : null;
}

function createPreviewImageFigure(image) {
  const figure = document.createElement("figure");
  figure.className = "preview-image";
  figure.dataset.imageId = image.id;
  figure.dataset.width = String(image.width || 480);

  const img = document.createElement("img");
  img.src = image.src;
  img.alt = image.alt || "貼り付け画像";
  img.style.width = `${image.width || 480}px`;
  img.style.maxWidth = "100%";
  img.style.height = "auto";

  const handle = document.createElement("span");
  handle.className = "image-resize-handle";
  handle.setAttribute("aria-hidden", "true");

  figure.append(img, handle);
  return figure;
}

function resetMemoBodyHistory(value) {
  state.memoBodyHistory = {
    undo: [],
    redo: [],
    last: value || ""
  };
}

function recordMemoBodyState(value) {
  if (value === state.memoBodyHistory.last) {
    return;
  }
  pushMemoBodyUndoState(state.memoBodyHistory.last);
  state.memoBodyHistory.last = value;
  state.memoBodyHistory.redo = [];
}

function pushMemoBodyUndoState(value) {
  const undo = state.memoBodyHistory.undo;
  if (undo[undo.length - 1] !== value) {
    undo.push(value);
  }
  if (undo.length > 80) {
    undo.shift();
  }
}

function undoMemoBody() {
  const previous = state.memoBodyHistory.undo.pop();
  if (typeof previous !== "string") {
    showMemoStatus("戻せる操作はありません。", true);
    return;
  }
  state.memoBodyHistory.redo.push(elements.memoBody.value);
  setMemoBodyFromHistory(previous);
}

function redoMemoBody() {
  const next = state.memoBodyHistory.redo.pop();
  if (typeof next !== "string") {
    showMemoStatus("やり直せる操作はありません。", true);
    return;
  }
  state.memoBodyHistory.undo.push(elements.memoBody.value);
  setMemoBodyFromHistory(next);
}

function setMemoBodyFromHistory(value) {
  elements.memoBody.value = value;
  state.memoBodyHistory.last = value;
  renderMemoRelatedLinks();
  renderMemoDiscovery();
  renderMemoEditor();
  elements.memoBodyPreview.focus();
}

function renderMemoRelatedLinks() {
  elements.memoRelatedLinks.replaceChildren();
  const links = extractLinks(elements.memoBody.value);

  if (links.length === 0) {
    const empty = document.createElement("span");
    empty.className = "tag-empty";
    empty.textContent = "本文に [[内部リンク]] を入れるとここに表示されます";
    elements.memoRelatedLinks.append(empty);
    return;
  }

  links.forEach((link) => {
    const target = state.memos.find((memo) => memo.title === link || memo.id === link || memo.displayTitle === link);
    const button = document.createElement("button");
    button.type = "button";
    button.className = target ? "link-chip" : "link-chip is-missing";
    button.textContent = target ? link : `${link} / 未作成`;
    button.addEventListener("click", () => {
      if (target) {
        selectMemo(target.id);
      }
    });
    elements.memoRelatedLinks.append(button);
  });
}

function renderMemoDiscovery() {
  renderMemoBacklinks();
  renderMemoLinkSuggestions();
  renderUnconnectedMemos();
}

function renderMemoBacklinks() {
  elements.memoBacklinks.replaceChildren();
  const current = buildCurrentMemoSnapshot();
  if (!current) {
    appendMemoChipEmpty(elements.memoBacklinks, "保存済みメモを開くと表示されます");
    return;
  }

  const backlinks = getBacklinksForMemo(current);
  if (backlinks.length === 0) {
    appendMemoChipEmpty(elements.memoBacklinks, "このメモを参照しているメモはまだありません");
    return;
  }

  backlinks.forEach((memo) => {
    elements.memoBacklinks.append(createMemoJumpChip(memo, "参照元"));
  });
}

function renderMemoLinkSuggestions() {
  elements.memoLinkSuggestions.replaceChildren();
  const current = buildCurrentMemoSnapshot();
  if (!current) {
    appendMemoChipEmpty(elements.memoLinkSuggestions, "保存済みメモを開くと表示されます");
    return;
  }

  const suggestions = getSuggestedLinks(current).slice(0, 8);
  if (suggestions.length === 0) {
    appendMemoChipEmpty(elements.memoLinkSuggestions, "候補はまだありません");
    return;
  }

  suggestions.forEach(({ memo, score }) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "link-chip";
    button.dataset.heat = getMemoHeatLevel(memo);
    button.textContent = `${score}点 / ${getMemoDisplayName(memo)}`;
    button.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey) {
        insertTextIntoMemoBody(`[[${memo.id}]]`);
        showMemoStatus("候補をIDリンクとして挿入しました。");
        return;
      }
      selectMemo(memo.id);
    });
    button.title = "クリックで開く / Ctrl+クリックでIDリンク挿入";
    elements.memoLinkSuggestions.append(button);
  });
}

function renderUnconnectedMemos() {
  elements.memoUnconnectedList.replaceChildren();
  const unconnected = getUnconnectedMemos().slice(0, 8);
  if (unconnected.length === 0) {
    appendMemoChipEmpty(elements.memoUnconnectedList, "未接続メモはありません");
    return;
  }

  unconnected.forEach((memo) => {
    elements.memoUnconnectedList.append(createMemoJumpChip(memo, "孤立"));
  });
}

function appendMemoChipEmpty(parent, text) {
  const empty = document.createElement("span");
  empty.className = "tag-empty";
  empty.textContent = text;
  parent.append(empty);
}

function createMemoJumpChip(memo, prefix = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "link-chip";
  button.dataset.heat = getMemoHeatLevel(memo);
  button.textContent = prefix ? `${prefix} / ${getMemoDisplayName(memo)}` : getMemoDisplayName(memo);
  button.addEventListener("click", () => selectMemo(memo.id));
  return button;
}

function renderMemoEditor() {
  const html = markdownToHtml(elements.memoBody.value || "", state.currentMemoImages, { interactiveImages: true });
  elements.memoBodyPreview.innerHTML = html || '<p><br></p>';
  bindPreviewImageResize();
}

function syncMemoEditorToSource() {
  if (!elements.memoBodyPreview.isConnected) {
    return;
  }
  elements.memoBody.value = editorToMarkdown();
  state.memoBodyHistory.last = elements.memoBody.value;
}

function editorToMarkdown() {
  const lines = [];
  elements.memoBodyPreview.childNodes.forEach((node) => {
    const markdown = editorNodeToMarkdown(node);
    if (markdown !== null) {
      lines.push(markdown);
    }
  });
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function editorNodeToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.trim();
  }
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return null;
  }

  const element = node;
  if (element.classList.contains("preview-image")) {
    const id = element.dataset.imageId;
    const width = element.dataset.width || state.currentMemoImages[id]?.width || 480;
    const alt = state.currentMemoImages[id]?.alt || "貼り付け画像";
    return `![${alt}](memo-image:${id}#${width})`;
  }
  if (element.tagName === "H2") {
    return `## ${inlineNodesToMarkdown(element).trim()}`;
  }
  if (element.tagName === "UL") {
    return Array.from(element.querySelectorAll("li"))
      .map((item) => `- ${inlineNodesToMarkdown(item).trim()}`)
      .join("\n");
  }
  if (element.tagName === "BR") {
    return "";
  }

  return inlineNodesToMarkdown(element).trim();
}

function inlineNodesToMarkdown(element) {
  return Array.from(element.childNodes).map((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return "";
    }

    if (node.tagName === "A" && node.dataset?.linkKind === "memo-id") {
      return `[[${node.dataset.memoId || node.textContent.trim()}]]`;
    }
    if (node.tagName === "A") {
      const label = node.textContent.trim();
      const href = node.getAttribute("href") || "";
      return href ? `[${label || href}](${href})` : label;
    }
    if (node.classList?.contains("local-path-copy")) {
      return "";
    }
    if (node.tagName === "BR") {
      return "\n";
    }
    return inlineNodesToMarkdown(node);
  }).join("");
}

function renderMemoGraph() {
  renderMemoGraphInto(elements.memoGraph, { focus: false });
  if (state.graphFocusOpen) {
    renderMemoGraphInto(elements.memoGraphFocus, { focus: true });
  }
}

function fitMemoGraphView() {
  renderMemoGraph();
  animateGraphViewTo(elements.memoGraph, false, { x: 0, y: 0, scale: 1 }, 260);
  if (state.graphFocusOpen) {
    animateGraphViewTo(elements.memoGraphFocus, true, { x: 0, y: 0, scale: 1 }, 260);
  }
}

function renderMemoGraphInto(svg, options = {}) {
  svg.replaceChildren();
  const graphKey = getGraphViewKey(Boolean(options.focus));
  state.graphLastRenderAt[graphKey] = performance.now();
  const width = Math.max(svg.clientWidth || (options.focus ? 960 : 520), 320);
  const height = Math.max(svg.clientHeight || (options.focus ? 620 : 360), 260);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.classList.toggle("has-selected-memo", Boolean(state.selectedMemoId));
  appendGraphEffects(svg);
  bindGraphViewport(svg, options);
  elements.memoGraphMode.value = state.graphMode;
  elements.memoGraphFocusMode.value = state.graphMode;
  elements.memoGraphClusterBy.value = state.graphClusterBy;
  elements.memoGraphFocusClusterBy.value = state.graphClusterBy;
  elements.memoGraphIncludeArchived.checked = state.includeArchivedInGraph;
  const graphMemos = getGraphMemos(options.focus);

  if (graphMemos.length === 0) {
    state.graphNodePositions[graphKey] = {};
    const text = createSvgElement("text", {
      x: width / 2,
      y: height / 2,
      "text-anchor": "middle",
      class: "graph-empty"
    });
    text.textContent = state.memos.length === 0
      ? "ノートを保存するとグラフが育ちます"
      : "表示対象のノートがありません";
    svg.append(text);
    return;
  }

  const viewport = createSvgElement("g", {
    class: "graph-viewport",
    transform: getGraphTransform(options.focus)
  });
  svg.append(viewport);
  appendGraphSphereDepth(viewport, width, height, options.focus);

  const limit = options.focus ? 90 : state.graphMode === "nearby" ? 18 : 32;
  const memos = graphMemos.slice(0, limit);
  const graphLayout = getGraphLayout(memos, width, height, options.focus);
  const positionsById = graphLayout.positions;
  const graphEdges = getGraphEdges(memos, positionsById);
  relaxGraphLayout(positionsById, graphEdges, width, height, options.focus);
  applyManualGraphPositions(graphKey, positionsById, width, height, options.focus);
  applyGraphSphereProjection(positionsById, width, height, options.focus);
  const graphMetrics = getGraphMetrics(memos, graphEdges, positionsById);
  const previousPositions = state.graphNodePositions[graphKey] || {};
  const nextPositions = {};
  const animatedNodes = [];
  const animatedLinks = [];
  const graphNodeElements = new Map();
  const graphLineItems = [];
  graphEdges.forEach((edge) => {
    const sourceFrom = getGraphNodeStartPosition(edge.source.memo.id, edge.source, previousPositions);
    const targetFrom = getGraphNodeStartPosition(edge.target.memo.id, edge.target, previousPositions);
    const line = createSvgElement("line", {
      x1: sourceFrom.x,
      y1: sourceFrom.y,
      x2: targetFrom.x,
      y2: targetFrom.y,
      class: `graph-link${isGraphEdgeConnectedToMemo(edge, state.selectedMemoId) ? " is-selected-link" : ""}`,
      "data-source-id": edge.source.memo.id,
      "data-target-id": edge.target.memo.id
    });
    viewport.append(line);
    animatedLinks.push({ line, edge, sourceFrom, sourceTo: edge.source, targetFrom, targetTo: edge.target });
    graphLineItems.push({ line, edge });
  });

  graphLayout.clusters.forEach((cluster) => {
    const labelLevel = getGraphClusterLabelLevel(cluster, options.focus);
    if (!labelLevel) {
      return;
    }
    const group = createSvgElement("g", { class: `graph-cluster ${labelLevel}` });
    const label = createSvgElement("text", {
      x: cluster.x,
      y: cluster.y,
      "text-anchor": "middle",
      class: "graph-cluster-label"
    });
    label.textContent = shorten(cluster.name, getGraphClusterLabelLength(labelLevel));
    const count = createSvgElement("text", {
      x: cluster.x,
      y: cluster.y + (labelLevel === "is-active" ? 18 : 15),
      "text-anchor": "middle",
      class: "graph-cluster-count"
    });
    count.textContent = `${cluster.count}件`;
    group.append(label, count);
    viewport.append(group);
  });

  let nodeIndex = 0;
  const graphNodeItems = [...positionsById.values()]
    .map((position) => ({
      ...position,
      depth: getGraphNodeDepthLevel(position.x, position.y, width, height, options.focus, position.z)
    }))
    .sort((a, b) => a.depth.order - b.depth.order);

  graphNodeItems.forEach(({ x, y, memo, cluster, depth }) => {
    const isSelected = memo.id === state.selectedMemoId;
    const isNeighbor = !isSelected && isMemoConnectedToSelected(memo);
    const from = getGraphNodeStartPosition(memo.id, { x, y }, previousPositions);
    const to = { x, y };
    nextPositions[memo.id] = to;
    const colorIndex = graphMetrics.clusterColorByName.get(cluster) || 0;
    const group = createSvgElement("g", {
      class: `graph-node graph-depth-${depth.level} graph-color-${colorIndex}${isSelected ? " is-selected" : ""}${isNeighbor ? " is-neighbor" : ""}`,
      tabindex: "0",
      "data-memo-id": memo.id,
      "data-neighbor-ids": [...(graphMetrics.neighborIdsByMemoId.get(memo.id) || [])].join(" "),
      transform: getGraphNodeTransform(from)
    });
    group.style.animationDelay = `${Math.min(520, nodeIndex * 28)}ms`;
    nodeIndex += 1;
    group.addEventListener("click", () => {
      if (group.dataset.dragMoved === "true") {
        group.dataset.dragMoved = "false";
        return;
      }
      clearTimeout(state.graphClickTimer);
      animateGraphNodeIntoFocus(svg, options.focus, x, y, isSelected ? null : GRAPH_SELECT_SCALE);
      state.graphClickTimer = setTimeout(() => {
        selectMemo(memo.id);
      }, 180);
    });
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        animateGraphNodeIntoFocus(svg, options.focus, x, y, GRAPH_SELECT_SCALE);
        selectMemo(memo.id);
        if (options.focus) {
          renderMemoGraph();
        }
      }
    });
    group.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      clearTimeout(state.graphClickTimer);
      animateGraphNodeIntoFocus(svg, options.focus, x, y, GRAPH_SELECT_SCALE);
      selectMemo(memo.id);
      if (options.focus) {
        closeMemoGraphFocus();
      }
    });
    group.addEventListener("mouseenter", () => applyGraphHighlight(svg, memo.id));
    group.addEventListener("focus", () => applyGraphHighlight(svg, memo.id));
    group.addEventListener("mouseleave", () => clearGraphHighlight(svg));
    group.addEventListener("blur", () => clearGraphHighlight(svg));

    const body = createSvgElement("g", { class: "graph-node-body" });
    const core = createSvgElement("g", { class: "graph-node-core" });
    const radius = getGraphNodeRadius(memo, isSelected, graphMetrics, options.focus) * depth.scale;
    group.addEventListener("pointerdown", (event) => {
      startGraphNodeDrag(event, svg, options.focus, memo.id, graphNodeElements, graphLineItems, nextPositions, graphMetrics, width, height);
    });
    if (isSelected) {
      const halo = createSvgElement("circle", {
        cx: 0,
        cy: 0,
        r: radius + 11,
        class: "graph-halo"
      });
      core.append(halo);
    }

    const circle = createSvgElement("circle", {
      cx: 0,
      cy: 0,
      r: radius,
      class: `graph-circle ${memo.template === "Idea" ? "idea" : memo.template === "Meeting" ? "meeting" : "blank"} heat-${getMemoHeatLevel(memo)} importance-${clampImportance(memo.importance)}${memo.archived ? " archived" : ""}${memo.starred ? " starred" : ""}`
    });
    core.append(circle);
    const spark = createSvgElement("circle", {
      cx: -radius * 0.18,
      cy: -radius * 0.22,
      r: Math.max(0.9, radius * 0.28),
      class: "graph-star-core"
    });
    core.append(spark);
    const title = createSvgElement("title", {});
    title.textContent = getMemoDisplayName(memo);
    core.append(title);
    body.append(core);
    const labelLevel = getGraphLabelLevel(memo, options.focus);
    const label = createSvgElement("text", {
      x: 0,
      y: isSelected ? radius + 22 : radius + 17,
      "text-anchor": "middle",
      class: `graph-label ${labelLevel}`
    });
    label.textContent = shorten(getMemoDisplayName(memo), getGraphLabelLength(labelLevel, options.focus));
    body.append(label);
    group.append(body);
    viewport.append(group);
    graphNodeElements.set(memo.id, { group, memo, radius });
    animatedNodes.push({ group, from, to });
  });

  state.graphNodePositions[graphKey] = nextPositions;
  animateGraphLayout(graphKey, animatedNodes, animatedLinks, graphNodeElements);
}

function appendGraphEffects(svg) {
  const defs = createSvgElement("defs", {});
  const sphereGradient = createSvgElement("radialGradient", {
    id: "graph-sphere-gradient",
    cx: "42%",
    cy: "38%",
    r: "62%"
  });
  [
    ["0%", "rgba(205, 240, 255, 0.18)"],
    ["42%", "rgba(106, 168, 214, 0.075)"],
    ["72%", "rgba(63, 72, 143, 0.04)"],
    ["100%", "rgba(5, 8, 14, 0)"]
  ].forEach(([offset, color]) => {
    sphereGradient.append(createSvgElement("stop", { offset, "stop-color": color }));
  });
  const nodeGlow = createSvgElement("filter", {
    id: "graph-node-glow",
    x: "-130%",
    y: "-130%",
    width: "360%",
    height: "360%"
  });
  nodeGlow.innerHTML = [
    '<feGaussianBlur stdDeviation="1.6" result="softGlow"></feGaussianBlur>',
    '<feGaussianBlur stdDeviation="4.2" result="wideGlow"></feGaussianBlur>',
    "<feMerge>",
    '<feMergeNode in="wideGlow"></feMergeNode>',
    '<feMergeNode in="softGlow"></feMergeNode>',
    '<feMergeNode in="SourceGraphic"></feMergeNode>',
    "</feMerge>"
  ].join("");
  const nodeHotGlow = createSvgElement("filter", {
    id: "graph-node-hot-glow",
    x: "-170%",
    y: "-170%",
    width: "440%",
    height: "440%"
  });
  nodeHotGlow.innerHTML = [
    '<feGaussianBlur stdDeviation="2.5" result="softGlow"></feGaussianBlur>',
    '<feGaussianBlur stdDeviation="7.2" result="wideGlow"></feGaussianBlur>',
    "<feMerge>",
    '<feMergeNode in="wideGlow"></feMergeNode>',
    '<feMergeNode in="softGlow"></feMergeNode>',
    '<feMergeNode in="SourceGraphic"></feMergeNode>',
    "</feMerge>"
  ].join("");
  const linkGlow = createSvgElement("filter", {
    id: "graph-link-glow",
    x: "-80%",
    y: "-80%",
    width: "260%",
    height: "260%"
  });
  linkGlow.innerHTML = [
    '<feGaussianBlur stdDeviation="0.75" result="softGlow"></feGaussianBlur>',
    "<feMerge>",
    '<feMergeNode in="softGlow"></feMergeNode>',
    '<feMergeNode in="SourceGraphic"></feMergeNode>',
    "</feMerge>"
  ].join("");
  defs.append(sphereGradient, nodeGlow, nodeHotGlow, linkGlow);
  svg.append(defs);
}

function appendGraphSphereDepth(viewport, width, height, isFocus) {
  const radius = Math.min(width, height) * (isFocus ? 0.44 : 0.48);
  const group = createSvgElement("g", { class: "graph-depth-sphere" });
  const shell = createSvgElement("circle", {
    cx: width / 2,
    cy: height / 2,
    r: radius,
    class: "graph-sphere-shell"
  });
  const meridian = createSvgElement("ellipse", {
    cx: width / 2,
    cy: height / 2,
    rx: radius * 0.98,
    ry: radius * 0.34,
    class: "graph-sphere-orbit"
  });
  meridian.setAttribute("transform", `rotate(-18 ${width / 2} ${height / 2})`);
  const equator = createSvgElement("ellipse", {
    cx: width / 2,
    cy: height / 2,
    rx: radius * 0.82,
    ry: radius * 0.22,
    class: "graph-sphere-orbit is-soft"
  });
  equator.setAttribute("transform", `rotate(32 ${width / 2} ${height / 2})`);
  group.append(shell, meridian, equator);
  viewport.append(group);
}

function applyManualGraphPositions(graphKey, positionsById, width, height, isFocus) {
  const manualPositions = state.graphManualPositions[graphKey] || {};
  const padding = isFocus ? 34 : 22;
  Object.entries(manualPositions).forEach(([memoId, position]) => {
    const target = positionsById.get(memoId);
    if (!target || !Number.isFinite(position.x) || !Number.isFinite(position.y)) {
      return;
    }
    target.x = clamp(position.x, padding, width - padding);
    target.y = clamp(position.y, padding, height - padding);
  });
}

function startGraphNodeDrag(event, svg, isFocus, memoId, graphNodeElements, graphLineItems, basePositions, graphMetrics, width, height) {
  if (event.button !== 0) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  const graphKey = getGraphViewKey(isFocus);
  const dragged = graphNodeElements.get(memoId);
  if (!dragged) {
    return;
  }
  cancelGraphAnimation(isFocus);
  if (state.graphLayoutAnimations[graphKey]) {
    cancelAnimationFrame(state.graphLayoutAnimations[graphKey]);
    state.graphLayoutAnimations[graphKey] = null;
  }

  const displayPositions = new Map();
  graphNodeElements.forEach((entry, id) => {
    const position = getGraphPositionFromTransform(entry.group)
      || state.graphManualPositions[graphKey]?.[id]
      || basePositions[id];
    displayPositions.set(id, { x: position.x, y: position.y });
  });
  syncGraphLineEndpoints(graphLineItems, displayPositions, graphNodeElements);

  const startPoint = getGraphPointerPoint(svg, isFocus, event);
  const startPosition = displayPositions.get(memoId) || { x: startPoint.x, y: startPoint.y };
  const pointerOffset = { x: startPoint.x - startPosition.x, y: startPoint.y - startPosition.y };
  const padding = isFocus ? 34 : 22;
  let moved = false;
  let frame = null;
  svg.classList.add("is-node-dragging");
  dragged.group.classList.add("is-dragging");
  dragged.group.setPointerCapture?.(event.pointerId);

  const renderDraggedGraph = () => {
    frame = null;
    graphNodeElements.forEach((entry, id) => {
      const position = displayPositions.get(id);
      if (!position) {
        return;
      }
      entry.group.setAttribute("transform", getGraphNodeTransform(position));
    });
    syncGraphLineEndpoints(graphLineItems, displayPositions);
  };

  const scheduleRender = () => {
    if (!frame) {
      frame = requestAnimationFrame(renderDraggedGraph);
    }
  };

  const move = (moveEvent) => {
    moveEvent.preventDefault();
    moveEvent.stopPropagation();
    moved = true;
    dragged.group.dataset.dragMoved = "true";
    const point = getGraphPointerPoint(svg, isFocus, moveEvent);
    const nextDragged = {
      x: clamp(point.x - pointerOffset.x, padding, width - padding),
      y: clamp(point.y - pointerOffset.y, padding, height - padding)
    };
    displayPositions.set(memoId, nextDragged);
    applyGraphDragAvoidance(memoId, displayPositions, graphNodeElements, graphMetrics, isFocus, width, height);
    scheduleRender();
  };

  const end = (endEvent) => {
    endEvent.preventDefault();
    endEvent.stopPropagation();
    dragged.group.releasePointerCapture?.(endEvent.pointerId);
    dragged.group.removeEventListener("pointermove", move);
    dragged.group.removeEventListener("pointerup", end);
    dragged.group.removeEventListener("pointercancel", end);
    svg.classList.remove("is-node-dragging");
    dragged.group.classList.remove("is-dragging");
    if (frame) {
      cancelAnimationFrame(frame);
      renderDraggedGraph();
    }
    if (moved) {
      const manualPositions = { ...(state.graphManualPositions[graphKey] || {}) };
      const draggedPosition = displayPositions.get(memoId);
      if (draggedPosition) {
        manualPositions[memoId] = { x: draggedPosition.x, y: draggedPosition.y };
      }
      state.graphManualPositions[graphKey] = manualPositions;
      settleGraphAfterNodeDrag(svg, graphKey, memoId, displayPositions, graphNodeElements, graphLineItems, basePositions, width, height, isFocus);
      window.setTimeout(() => {
        dragged.group.dataset.dragMoved = "false";
      }, 220);
    }
  };

  dragged.group.addEventListener("pointermove", move);
  dragged.group.addEventListener("pointerup", end);
  dragged.group.addEventListener("pointercancel", end);
}

function settleGraphAfterNodeDrag(svg, graphKey, draggedId, currentPositions, graphNodeElements, graphLineItems, basePositions, width, height, isFocus) {
  const targetPositions = new Map();
  const draggedPosition = currentPositions.get(draggedId);
  graphNodeElements.forEach((entry, id) => {
    const base = id === draggedId
      ? draggedPosition
      : basePositions[id] || currentPositions.get(id);
    if (!base) {
      return;
    }
    targetPositions.set(id, { x: base.x, y: base.y });
  });
  relaxGraphSettledTargets(targetPositions, graphNodeElements, width, height, isFocus, draggedId);

  const startPositions = new Map();
  currentPositions.forEach((position, id) => {
    startPositions.set(id, { x: position.x, y: position.y });
  });

  const duration = isFocus ? 780 : 620;
  const startedAt = performance.now();
  const animate = (now) => {
    const progress = clamp((now - startedAt) / duration, 0, 1);
    const eased = easeOutCubic(progress);
    const displayPositions = new Map();
    graphNodeElements.forEach((entry, id) => {
      const from = startPositions.get(id);
      const to = targetPositions.get(id);
      if (!from || !to) {
        return;
      }
      const next = {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased
      };
      displayPositions.set(id, next);
      entry.group.setAttribute("transform", getGraphNodeTransform(next));
    });
    syncGraphLineEndpoints(graphLineItems, displayPositions);
    if (progress < 1) {
      state.graphLayoutAnimations[graphKey] = requestAnimationFrame(animate);
      return;
    }
    state.graphLayoutAnimations[graphKey] = null;
    state.graphNodePositions[graphKey] = Object.fromEntries(targetPositions);
    targetPositions.forEach((position, id) => {
      basePositions[id] = { x: position.x, y: position.y };
    });
    syncGraphLineEndpoints(graphLineItems, targetPositions);
  };
  if (state.graphLayoutAnimations[graphKey]) {
    cancelAnimationFrame(state.graphLayoutAnimations[graphKey]);
  }
  state.graphLayoutAnimations[graphKey] = requestAnimationFrame(animate);
}

function syncGraphLineEndpoints(graphLineItems, positions, graphNodeElements = null) {
  graphLineItems.forEach(({ line, edge }) => {
    const source = getGraphLineEndpointPosition(edge.source.memo.id, positions, graphNodeElements, edge.source);
    const target = getGraphLineEndpointPosition(edge.target.memo.id, positions, graphNodeElements, edge.target);
    setGraphLineEndpoints(line, source, target);
  });
}

function getGraphLineEndpointPosition(memoId, positions, graphNodeElements, fallback) {
  const mappedPosition = getGraphMappedPosition(positions, memoId);
  if (mappedPosition) {
    return mappedPosition;
  }
  const nodePosition = graphNodeElements
    ? getGraphPositionFromTransform(graphNodeElements.get(memoId)?.group)
    : null;
  return nodePosition || fallback;
}

function getGraphMappedPosition(positions, memoId) {
  if (!positions) {
    return null;
  }
  const position = positions instanceof Map
    ? positions.get(memoId)
    : positions[memoId];
  if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) {
    return null;
  }
  return position;
}

function relaxGraphSettledTargets(targetPositions, graphNodeElements, width, height, isFocus, fixedId = null) {
  const nodes = [];
  graphNodeElements.forEach((entry, id) => {
    const position = targetPositions.get(id);
    if (!position) {
      return;
    }
    nodes.push({ id, radius: entry.radius, x: position.x, y: position.y, vx: 0, vy: 0 });
  });
  const padding = isFocus ? 34 : 22;
  const ticks = isFocus ? 38 : 28;
  for (let tick = 0; tick < ticks; tick += 1) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let distance = Math.hypot(dx, dy);
        if (distance === 0) {
          dx = 0.01 * (j + 1);
          dy = 0.01 * (i + 1);
          distance = Math.hypot(dx, dy);
        }
        const minDistance = a.radius + b.radius + (isFocus ? 16 : 12);
        if (distance >= minDistance) {
          continue;
        }
        const push = ((minDistance - distance) / minDistance) * (isFocus ? 8 : 6);
        const fx = (dx / distance) * push;
        const fy = (dy / distance) * push;
        if (a.id !== fixedId) {
          a.vx -= fx;
          a.vy -= fy;
        }
        if (b.id !== fixedId) {
          b.vx += fx;
          b.vy += fy;
        }
      }
    }
    nodes.forEach((node) => {
      node.vx *= 0.62;
      node.vy *= 0.62;
      node.x = clamp(node.x + node.vx, padding, width - padding);
      node.y = clamp(node.y + node.vy, padding, height - padding);
    });
  }
  nodes.forEach((node) => {
    targetPositions.set(node.id, { x: node.x, y: node.y });
  });
}

function applyGraphDragAvoidance(draggedId, displayPositions, graphNodeElements, graphMetrics, isFocus, width, height) {
  const draggedPosition = displayPositions.get(draggedId);
  const draggedEntry = graphNodeElements.get(draggedId);
  if (!draggedPosition || !draggedEntry) {
    return;
  }
  const padding = isFocus ? 34 : 22;
  const pushRange = isFocus ? 118 : 84;
  graphNodeElements.forEach((entry, id) => {
    if (id === draggedId) {
      return;
    }
    const position = displayPositions.get(id);
    if (!position) {
      return;
    }
    const dx = position.x - draggedPosition.x;
    const dy = position.y - draggedPosition.y;
    const distance = Math.max(Math.hypot(dx, dy), 0.01);
    const minDistance = draggedEntry.radius + entry.radius + pushRange;
    if (distance >= minDistance) {
      return;
    }
    const degree = graphMetrics.degreeByMemoId.get(id) || 0;
    const pressure = ((minDistance - distance) / minDistance) * (isFocus ? 28 : 20) * (degree >= 3 ? 0.82 : 1);
    const eased = {
      x: position.x + (dx / distance) * pressure,
      y: position.y + (dy / distance) * pressure
    };
    displayPositions.set(id, {
      x: clamp(eased.x, padding, width - padding),
      y: clamp(eased.y, padding, height - padding)
    });
  });
}

function getGraphPointerPoint(svg, isFocus, event) {
  const rect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const view = getGraphView(isFocus);
  const svgX = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * viewBox.width;
  const svgY = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * viewBox.height;
  return {
    x: (svgX - view.x) / view.scale,
    y: (svgY - view.y) / view.scale
  };
}

function getGraphPositionFromTransform(group) {
  const transform = group.getAttribute("transform") || "";
  const match = transform.match(/translate\(([-\d.]+)[,\s]+([-\d.]+)\)/);
  if (!match) {
    return null;
  }
  return { x: Number(match[1]), y: Number(match[2]) };
}

function getGraphEdges(memos, positionsById) {
  const linkTargets = new Map();
  memos.forEach((memo) => {
    const position = positionsById.get(memo.id);
    if (!position) {
      return;
    }
    linkTargets.set(memo.title || memo.id, position);
    if (memo.displayTitle) {
      linkTargets.set(memo.displayTitle, position);
    }
    linkTargets.set(memo.id, position);
  });

  const edges = [];
  const seen = new Set();
  memos.forEach((memo) => {
    const source = positionsById.get(memo.id);
    if (!source) {
      return;
    }
    asArray(memo.links).forEach((link) => {
      const target = linkTargets.get(link);
      if (!target || target.memo.id === memo.id) {
        return;
      }
      const key = [source.memo.id, target.memo.id].sort().join("->");
      if (seen.has(key)) {
        return;
      }
      seen.add(key);
      edges.push({ source, target });
    });
  });
  return edges;
}

function getGraphMetrics(memos, edges, positionsById) {
  const degreeByMemoId = new Map(memos.map((memo) => [memo.id, 0]));
  const neighborIdsByMemoId = new Map(memos.map((memo) => [memo.id, new Set()]));
  edges.forEach((edge) => {
    const sourceId = edge.source.memo.id;
    const targetId = edge.target.memo.id;
    degreeByMemoId.set(sourceId, (degreeByMemoId.get(sourceId) || 0) + 1);
    degreeByMemoId.set(targetId, (degreeByMemoId.get(targetId) || 0) + 1);
    neighborIdsByMemoId.get(sourceId)?.add(targetId);
    neighborIdsByMemoId.get(targetId)?.add(sourceId);
  });

  const clusterNames = [...new Set([...positionsById.values()].map((position) => position.cluster))].sort((a, b) => a.localeCompare(b, "ja"));
  const clusterColorByName = new Map(clusterNames.map((name, index) => [name, index % 8]));
  return {
    degreeByMemoId,
    neighborIdsByMemoId,
    clusterColorByName,
    maxDegree: Math.max(1, ...degreeByMemoId.values())
  };
}

function isGraphEdgeConnectedToMemo(edge, memoId) {
  if (!memoId) {
    return false;
  }
  return edge.source.memo.id === memoId || edge.target.memo.id === memoId;
}

function getGraphNodeRadius(memo, isSelected, metrics, isFocus) {
  const degree = metrics.degreeByMemoId.get(memo.id) || 0;
  const normalized = Math.sqrt(degree + 1) / Math.sqrt(metrics.maxDegree + 1);
  if (isSelected) {
    const selectedBase = isFocus ? 10 : 8.8;
    const selectedRange = isFocus ? 5.8 : 4.4;
    const selectedImportance = clampImportance(memo.importance) * 0.58;
    return Math.round((selectedBase + normalized * selectedRange + selectedImportance + (memo.starred ? 0.8 : 0)) * 10) / 10;
  }
  const base = isFocus ? 2.2 : 1.8;
  const range = isFocus ? 4.6 : 3.4;
  const importanceBonus = clampImportance(memo.importance) * 0.24;
  const starBonus = memo.starred ? 0.46 : 0;
  return Math.round((base + normalized * range + importanceBonus + starBonus) * 10) / 10;
}

function applyGraphSphereProjection(positionsById, width, height, isFocus) {
  const centerX = width / 2;
  const centerY = height / 2;
  const sphereRadius = Math.min(width, height) * (isFocus ? 0.43 : 0.46);
  const verticalRatio = isFocus ? 0.88 : 0.84;
  positionsById.forEach((position) => {
    const rawX = (position.x - centerX) / Math.max(sphereRadius, 1);
    const rawY = (position.y - centerY) / Math.max(sphereRadius * verticalRatio, 1);
    const planarDistance = Math.hypot(rawX, rawY);
    const clampRatio = planarDistance > 0.96 ? 0.96 / planarDistance : 1;
    const nx = rawX * clampRatio;
    const ny = rawY * clampRatio;
    const surfaceLift = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    const seed = getStableGraphSeed(position.memo.id);
    const side = seed % 11 < 4 ? -1 : 1;
    const depthVariation = 0.72 + ((seed % 29) / 100);
    const selectedBias = position.memo.id === state.selectedMemoId ? 1 : side;
    const z = clamp(surfaceLift * depthVariation * selectedBias, -0.92, 0.98);
    const perspective = 0.88 + z * 0.12;
    position.x = centerX + nx * sphereRadius * perspective;
    position.y = centerY + ny * sphereRadius * verticalRatio * perspective;
    position.z = z;
  });
}

function getStableGraphSeed(value) {
  return String(value || "").split("").reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) >>> 0;
  }, 2166136261);
}

function getGraphNodeDepthLevel(x, y, width, height, isFocus, zValue = null) {
  if (Number.isFinite(zValue)) {
    if (zValue >= 0.48) {
      return { level: "near", order: 2, scale: isFocus ? 1.18 : 1.14 };
    }
    if (zValue <= -0.28) {
      return { level: "far", order: 0, scale: isFocus ? 0.74 : 0.78 };
    }
    return { level: "mid", order: 1, scale: 0.96 };
  }
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.max(1, Math.min(width, height) * (isFocus ? 0.48 : 0.5));
  const dx = (x - centerX) / radius;
  const dy = (y - centerY) / radius;
  const distance = Math.min(1, Math.hypot(dx, dy));
  const sphereLift = Math.sqrt(Math.max(0, 1 - distance * distance));
  const lightBias = ((x / Math.max(width, 1)) * 0.18) + ((1 - y / Math.max(height, 1)) * 0.18);
  const score = sphereLift + lightBias;
  if (score >= 0.92) {
    return { level: "near", order: 2, scale: isFocus ? 1.18 : 1.14 };
  }
  if (score <= 0.5 || distance > 0.88) {
    return { level: "far", order: 0, scale: isFocus ? 0.74 : 0.78 };
  }
  return { level: "mid", order: 1, scale: 0.96 };
}

function relaxGraphLayout(positionsById, edges, width, height, isFocus) {
  const nodes = [...positionsById.values()].map((position) => ({
    ...position,
    vx: 0,
    vy: 0
  }));
  if (nodes.length <= 1) {
    return;
  }

  const nodeById = new Map(nodes.map((node) => [node.memo.id, node]));
  const centerX = width / 2;
  const centerY = height / 2;
  const density = clamp(nodes.length / (isFocus ? 90 : 32), 0.45, 1.4);
  const repulsion = (isFocus ? 8800 : 5200) * density;
  const linkDistance = (isFocus ? 146 : 104) + Math.min(nodes.length, 80) * (isFocus ? 0.38 : 0.28);
  const linkStrength = isFocus ? 0.021 : 0.026;
  const clusterStrength = isFocus ? 0.0095 : 0.011;
  const centerStrength = isFocus ? 0.0048 : 0.0058;
  const collisionDistance = isFocus ? 24 : 19;
  const padding = isFocus ? 48 : 34;
  const ticks = isFocus ? 104 : 78;

  for (let tick = 0; tick < ticks; tick += 1) {
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = a.x - b.x;
        let dy = a.y - b.y;
        let distanceSq = dx * dx + dy * dy;
        if (distanceSq < 1) {
          dx = 0.01 * (i + 1);
          dy = 0.01 * (j + 1);
          distanceSq = dx * dx + dy * dy;
        }
        const distance = Math.sqrt(distanceSq);
        const force = repulsion / Math.max(distanceSq, 80);
        const collisionBoost = distance < collisionDistance ? (collisionDistance - distance) * 0.36 : 0;
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        a.vx += fx + (dx / distance) * collisionBoost;
        a.vy += fy + (dy / distance) * collisionBoost;
        b.vx -= fx + (dx / distance) * collisionBoost;
        b.vy -= fy + (dy / distance) * collisionBoost;
      }
    }

    edges.forEach((edge) => {
      const source = nodeById.get(edge.source.memo.id);
      const target = nodeById.get(edge.target.memo.id);
      if (!source || !target) {
        return;
      }
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const force = (distance - linkDistance) * linkStrength;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      source.vx += fx;
      source.vy += fy;
      target.vx -= fx;
      target.vy -= fy;
    });

    nodes.forEach((node) => {
      node.vx += (node.clusterX - node.x) * clusterStrength;
      node.vy += (node.clusterY - node.y) * clusterStrength;
      node.vx += (centerX - node.x) * centerStrength;
      node.vy += (centerY - node.y) * centerStrength;
      node.vx *= 0.68;
      node.vy *= 0.68;
      node.x = clamp(node.x + node.vx, padding, width - padding);
      node.y = clamp(node.y + node.vy, padding, height - padding);
    });
  }

  nodes.forEach((node) => {
    const position = positionsById.get(node.memo.id);
    if (position) {
      position.x = node.x;
      position.y = node.y;
    }
  });
}

function applyGraphHighlight(svg, memoId) {
  const node = svg.querySelector(`.graph-node[data-memo-id="${cssEscape(memoId)}"]`);
  const neighborIds = new Set((node?.dataset.neighborIds || "").split(/\s+/).filter(Boolean));
  const activeIds = new Set([memoId, ...neighborIds]);
  svg.classList.add("has-graph-highlight");
  svg.querySelectorAll(".graph-node").forEach((item) => {
    const active = activeIds.has(item.dataset.memoId);
    item.classList.toggle("is-highlighted", active);
    item.classList.toggle("is-dimmed", !active);
  });
  svg.querySelectorAll(".graph-link").forEach((line) => {
    const active = line.dataset.sourceId === memoId || line.dataset.targetId === memoId;
    line.classList.toggle("is-highlighted", active);
    line.classList.toggle("is-dimmed", !active);
  });
}

function clearGraphHighlight(svg) {
  svg.classList.remove("has-graph-highlight");
  svg.querySelectorAll(".is-highlighted, .is-dimmed").forEach((item) => {
    item.classList.remove("is-highlighted", "is-dimmed");
  });
}

function cssEscape(value) {
  if (window.CSS?.escape) {
    return window.CSS.escape(value);
  }
  return String(value).replace(/["\\]/g, "\\$&");
}

function getGraphNodeStartPosition(id, target, previousPositions) {
  const previous = previousPositions[id];
  if (previous && Number.isFinite(previous.x) && Number.isFinite(previous.y)) {
    return previous;
  }
  return { x: target.x, y: target.y };
}

function getGraphNodeTransform(position) {
  return `translate(${position.x} ${position.y})`;
}

function animateGraphLayout(graphKey, nodes, links, graphNodeElements = null) {
  if (state.graphLayoutAnimations[graphKey]) {
    cancelAnimationFrame(state.graphLayoutAnimations[graphKey]);
    state.graphLayoutAnimations[graphKey] = null;
  }
  if (prefersReducedMotion() || nodes.length === 0) {
    nodes.forEach(({ group, to }) => {
      group.setAttribute("transform", getGraphNodeTransform(to));
    });
    syncGraphLineEndpoints(links, new Map(nodes.map(({ to, group }) => [group.dataset.memoId, to])), graphNodeElements);
    return;
  }

  const duration = 640;
  const startedAt = performance.now();
  const tick = (now) => {
    const progress = clamp((now - startedAt) / duration, 0, 1);
    const eased = easeOutCubic(progress);
    nodes.forEach(({ group, from, to }) => {
      group.setAttribute("transform", getGraphNodeTransform({
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased
      }));
    });
    const displayPositions = new Map();
    nodes.forEach(({ group, from, to }) => {
      displayPositions.set(group.dataset.memoId, {
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased
      });
    });
    syncGraphLineEndpoints(links, displayPositions, graphNodeElements);
    if (progress < 1) {
      state.graphLayoutAnimations[graphKey] = requestAnimationFrame(tick);
    } else {
      state.graphLayoutAnimations[graphKey] = null;
    }
  };
  state.graphLayoutAnimations[graphKey] = requestAnimationFrame(tick);
}

function setGraphLineEndpoints(line, source, target) {
  line.setAttribute("x1", source.x);
  line.setAttribute("y1", source.y);
  line.setAttribute("x2", target.x);
  line.setAttribute("y2", target.y);
}

function getGraphLayout(memos, width, height, isFocus) {
  const positions = new Map();
  if (memos.length === 0) {
    return { positions, clusters: [] };
  }
  const centerX = width / 2;
  const centerY = height / 2;
  const clusters = groupMemosForGraph(memos);
  const clusterCount = clusters.length;
  const baseSize = Math.min(width, height);
  const areaRadius = Math.max(isFocus ? 180 : 126, baseSize / 2 - (isFocus ? 118 : 78));
  const clusterSummaries = [];

  clusters.forEach((cluster, clusterIndex) => {
    const clusterAngle = (Math.PI * 2 * clusterIndex) / clusterCount - Math.PI / 2;
    const isSingleCluster = clusterCount === 1;
    const clusterCenter = {
      x: isSingleCluster ? centerX : centerX + Math.cos(clusterAngle) * areaRadius * 0.76,
      y: isSingleCluster ? centerY : centerY + Math.sin(clusterAngle) * areaRadius * 0.76
    };
    const items = cluster.memos;
    clusterSummaries.push({
      name: cluster.name,
      count: items.length,
      x: clusterCenter.x,
      y: clusterCenter.y,
      isSelected: items.some((memo) => memo.id === state.selectedMemoId)
    });
    const localRadius = Math.max(
      isFocus ? 68 : 48,
      Math.min(isFocus ? 238 : 142, 42 + Math.sqrt(items.length) * (isFocus ? 31 : 24))
    );
    items.forEach((memo, index) => {
      const localAngle = (Math.PI * 2 * index) / items.length - Math.PI / 2;
      const isSingle = items.length === 1;
      positions.set(memo.id, {
        x: isSingle ? clusterCenter.x : clusterCenter.x + Math.cos(localAngle) * localRadius,
        y: isSingle ? clusterCenter.y : clusterCenter.y + Math.sin(localAngle) * localRadius,
        memo,
        cluster: cluster.name,
        clusterX: clusterCenter.x,
        clusterY: clusterCenter.y
      });
    });
  });

  return { positions, clusters: clusterSummaries };
}

function groupMemosForGraph(memos) {
  const groups = new Map();
  memos.forEach((memo) => {
    const key = getMemoGraphClusterKey(memo);
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(memo);
  });
  return Array.from(groups.entries())
    .map(([name, groupMemos]) => ({ name, memos: groupMemos }))
    .sort((a, b) => {
      if (a.name === "未設定") {
        return 1;
      }
      if (b.name === "未設定") {
        return -1;
      }
      return a.name.localeCompare(b.name, "ja");
    });
}

function getMemoGraphClusterKey(memo) {
  const values = asArray(memo.properties?.[state.graphClusterBy]).filter(Boolean);
  return values[0] || "未設定";
}

function getGraphClusterLabelLevel(cluster, isFocus) {
  const view = getGraphView(isFocus);
  if (view.scale > 1.25) {
    return "";
  }
  if (cluster.isSelected) {
    return "is-active";
  }
  return view.scale <= 0.95 ? "is-overview" : "is-muted";
}

function getGraphClusterLabelLength(labelLevel) {
  if (labelLevel === "is-active") {
    return 26;
  }
  if (labelLevel === "is-overview") {
    return 22;
  }
  return 16;
}

function getGraphLabelLevel(memo, isFocus) {
  const view = getGraphView(isFocus);
  if (memo.id === state.selectedMemoId) {
    return "is-active";
  }
  if (isMemoConnectedToSelected(memo)) {
    return view.scale >= 1.18 || (isFocus && view.scale >= 1.05) ? "is-nearby" : "is-hidden";
  }
  return view.scale >= (isFocus ? 1.95 : 2.15) ? "is-distant" : "is-hidden";
}

function getGraphLabelLength(labelLevel, isFocus) {
  const view = getGraphView(isFocus);
  if (labelLevel === "is-active") {
    return view.scale >= 1.25 ? 30 : 22;
  }
  if (labelLevel === "is-nearby") {
    return view.scale >= 1.45 ? 22 : 16;
  }
  if (labelLevel === "is-hidden") {
    return 18;
  }
  return view.scale >= 2.2 ? 18 : 12;
}

function isMemoConnectedToSelected(memo) {
  const selected = getExistingMemo(state.selectedMemoId);
  if (!selected) {
    return false;
  }
  const selectedNames = [selected.id, selected.title, selected.displayTitle].filter(Boolean);
  const memoNames = [memo.id, memo.title, memo.displayTitle].filter(Boolean);
  return asArray(memo.links).some((link) => selectedNames.includes(link))
    || asArray(selected.links).some((link) => memoNames.includes(link));
}

function getGraphView(isFocus) {
  return isFocus ? state.graphViews.focus : state.graphViews.normal;
}

function getGraphViewKey(isFocus) {
  return isFocus ? "focus" : "normal";
}

function getGraphTransform(isFocus) {
  const view = getGraphView(isFocus);
  return `translate(${view.x} ${view.y}) scale(${view.scale})`;
}

function updateGraphViewport(svg, isFocus) {
  const viewport = svg.querySelector(".graph-viewport");
  if (viewport) {
    viewport.setAttribute("transform", getGraphTransform(isFocus));
  }
}

function scheduleGraphViewportUpdate(svg, isFocus) {
  const key = getGraphViewKey(isFocus);
  if (state.graphViewportFrames[key]) {
    return;
  }
  state.graphViewportFrames[key] = requestAnimationFrame(() => {
    state.graphViewportFrames[key] = null;
    updateGraphViewport(svg, isFocus);
  });
}

function cancelGraphAnimation(isFocus) {
  const key = getGraphViewKey(isFocus);
  if (state.graphAnimations[key]) {
    cancelAnimationFrame(state.graphAnimations[key]);
    state.graphAnimations[key] = null;
  }
}

function animateGraphViewTo(svg, isFocus, target, duration = 130) {
  cancelGraphAnimation(isFocus);
  const key = getGraphViewKey(isFocus);
  const view = getGraphView(isFocus);
  const start = { x: view.x, y: view.y, scale: view.scale };
  const startedAt = performance.now();

  const tick = (now) => {
    const progress = clamp((now - startedAt) / duration, 0, 1);
    const eased = easeOutCubic(progress);
    view.x = start.x + (target.x - start.x) * eased;
    view.y = start.y + (target.y - start.y) * eased;
    view.scale = start.scale + (clamp(target.scale, GRAPH_ZOOM_MIN, GRAPH_ZOOM_MAX) - start.scale) * eased;
    updateGraphViewport(svg, isFocus);
    if (progress < 1) {
      state.graphAnimations[key] = requestAnimationFrame(tick);
    } else {
      state.graphAnimations[key] = null;
    }
  };

  state.graphAnimations[key] = requestAnimationFrame(tick);
}

function panGraphViewBy(svg, isFocus, deltaX, deltaY, duration = 120) {
  const view = getGraphView(isFocus);
  animateGraphViewTo(svg, isFocus, {
    x: view.x - deltaX,
    y: view.y - deltaY,
    scale: view.scale
  }, duration);
}

function animateGraphNodeIntoFocus(svg, isFocus, nodeX, nodeY, targetScale = null) {
  const rect = svg.getBoundingClientRect();
  const viewBox = svg.viewBox.baseVal;
  const centerX = viewBox.width / 2;
  const centerY = viewBox.height / 2;
  const current = getGraphView(isFocus);
  const scale = targetScale ? Math.max(current.scale, targetScale) : current.scale;
  animateGraphViewTo(svg, isFocus, {
    x: centerX - nodeX * scale,
    y: centerY - nodeY * scale,
    scale
  }, rect.width > 720 ? 260 : 210);
}

function easeOutExpo(progress) {
  return progress >= 1 ? 1 : 1 - Math.pow(2, -10 * progress);
}

function easeOutCubic(progress) {
  return 1 - Math.pow(1 - progress, 3);
}

function easeOutBack(progress) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
}

function startGraphInertia(svg, isFocus, velocity) {
  const speed = Math.hypot(velocity.x, velocity.y);
  if (speed < 0.08) {
    return;
  }
  cancelGraphAnimation(isFocus);
  const key = getGraphViewKey(isFocus);
  const view = getGraphView(isFocus);
  let lastTime = performance.now();
  let currentVelocity = { ...velocity };

  const tick = (now) => {
    const elapsed = Math.min(now - lastTime, 32);
    lastTime = now;
    view.x += currentVelocity.x * elapsed;
    view.y += currentVelocity.y * elapsed;
    const decay = Math.pow(GRAPH_PAN_FRICTION, elapsed / 1000);
    currentVelocity.x *= decay;
    currentVelocity.y *= decay;
    updateGraphViewport(svg, isFocus);
    if (Math.hypot(currentVelocity.x, currentVelocity.y) > 0.012) {
      state.graphAnimations[key] = requestAnimationFrame(tick);
    } else {
      state.graphAnimations[key] = null;
    }
  };

  state.graphAnimations[key] = requestAnimationFrame(tick);
}

function scheduleGraphDetailRefresh() {
  clearTimeout(state.graphDetailRefreshTimer);
  state.graphDetailRefreshTimer = setTimeout(() => {
    renderMemoGraph();
  }, 180);
}

function bindGraphViewport(svg, options = {}) {
  const isFocus = Boolean(options.focus);
  const pointers = new Map();
  let panStart = null;
  let pinchStart = null;
  let lastMove = null;
  let velocity = { x: 0, y: 0 };
  let moved = false;

  svg.onpointerdown = (event) => {
    if (event.button !== 0 || event.target.closest?.(".graph-node")) {
      return;
    }
    event.preventDefault();
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    svg.classList.add("is-panning");
    svg.setPointerCapture?.(event.pointerId);
    cancelGraphAnimation(isFocus);
    if (pointers.size === 1) {
      const view = getGraphView(isFocus);
      panStart = { x: event.clientX, y: event.clientY, viewX: view.x, viewY: view.y };
      pinchStart = null;
      lastMove = { x: event.clientX, y: event.clientY, time: performance.now() };
      velocity = { x: 0, y: 0 };
      moved = false;
    }
    if (pointers.size === 2) {
      pinchStart = getGraphPinchState(svg, isFocus, pointers);
      panStart = null;
      moved = true;
    }
  };

  svg.onpointermove = (moveEvent) => {
    if (!pointers.has(moveEvent.pointerId)) {
      return;
    }
    moveEvent.preventDefault();
    pointers.set(moveEvent.pointerId, { x: moveEvent.clientX, y: moveEvent.clientY });
    const rect = svg.getBoundingClientRect();
    const scaleX = (svg.viewBox.baseVal.width || rect.width) / Math.max(rect.width, 1);
    const scaleY = (svg.viewBox.baseVal.height || rect.height) / Math.max(rect.height, 1);
    const view = getGraphView(isFocus);
    moved = true;

    if (pointers.size >= 2 && pinchStart) {
      const current = getGraphPinchPoints(svg, pointers);
      const nextScale = clamp(pinchStart.view.scale * (current.distance / Math.max(pinchStart.distance, 1)), GRAPH_ZOOM_MIN, GRAPH_ZOOM_MAX);
      view.x = current.svgX - pinchStart.pointX * nextScale;
      view.y = current.svgY - pinchStart.pointY * nextScale;
      view.scale = nextScale;
      scheduleGraphViewportUpdate(svg, isFocus);
      scheduleGraphDetailRefresh();
      return;
    }

    if (panStart && lastMove) {
      const now = performance.now();
      const elapsed = Math.max(now - lastMove.time, 1);
      velocity = {
        x: ((moveEvent.clientX - lastMove.x) * scaleX) / elapsed,
        y: ((moveEvent.clientY - lastMove.y) * scaleY) / elapsed
      };
      lastMove = { x: moveEvent.clientX, y: moveEvent.clientY, time: now };
      view.x = panStart.viewX + (moveEvent.clientX - panStart.x) * scaleX;
      view.y = panStart.viewY + (moveEvent.clientY - panStart.y) * scaleY;
      scheduleGraphViewportUpdate(svg, isFocus);
    }
  };

  const endPointer = (event) => {
    pointers.delete(event.pointerId);
    if (pointers.size === 0) {
      svg.classList.remove("is-panning");
      if (moved) {
        startGraphInertia(svg, isFocus, velocity);
      }
      panStart = null;
      pinchStart = null;
      lastMove = null;
      velocity = { x: 0, y: 0 };
      moved = false;
      return;
    }
    if (pointers.size === 1) {
      const remaining = [...pointers.values()][0];
      const view = getGraphView(isFocus);
      panStart = { x: remaining.x, y: remaining.y, viewX: view.x, viewY: view.y };
      pinchStart = null;
      lastMove = { x: remaining.x, y: remaining.y, time: performance.now() };
      velocity = { x: 0, y: 0 };
    }
  };
  svg.onpointerup = endPointer;
  svg.onpointercancel = endPointer;

  svg.onwheel = (event) => {
    event.preventDefault();
    const view = getGraphView(isFocus);
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    if (event.shiftKey) {
      const scaleX = viewBox.width / Math.max(rect.width, 1);
      const scaleY = viewBox.height / Math.max(rect.height, 1);
      const panX = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * scaleX * GRAPH_WHEEL_PAN_SPEED;
      const panY = event.deltaX && Math.abs(event.deltaY) > Math.abs(event.deltaX)
        ? event.deltaY * scaleY * GRAPH_WHEEL_PAN_SPEED
        : 0;
      panGraphViewBy(svg, isFocus, panX, panY, 90);
      return;
    }
    const svgX = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * viewBox.width;
    const svgY = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * viewBox.height;
    const pointX = (svgX - view.x) / view.scale;
    const pointY = (svgY - view.y) / view.scale;
    const zoomFactor = Math.exp(-event.deltaY * (event.ctrlKey ? 0.004 : 0.0018));
    const nextScale = clamp(view.scale * zoomFactor, GRAPH_ZOOM_MIN, GRAPH_ZOOM_MAX);
    animateGraphViewTo(svg, isFocus, {
      x: svgX - pointX * nextScale,
      y: svgY - pointY * nextScale,
      scale: nextScale
    }, event.ctrlKey ? 90 : 120);
    scheduleGraphDetailRefresh();
  };

  svg.ondblclick = (event) => {
    if (event.target.closest?.(".graph-node")) {
      return;
    }
    event.preventDefault();
    const view = getGraphView(isFocus);
    const rect = svg.getBoundingClientRect();
    const viewBox = svg.viewBox.baseVal;
    const svgX = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * viewBox.width;
    const svgY = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * viewBox.height;
    const pointX = (svgX - view.x) / view.scale;
    const pointY = (svgY - view.y) / view.scale;
    const nextScale = clamp(view.scale * (event.shiftKey ? 0.72 : 1.38), GRAPH_ZOOM_MIN, GRAPH_ZOOM_MAX);
    animateGraphViewTo(svg, isFocus, {
      x: svgX - pointX * nextScale,
      y: svgY - pointY * nextScale,
      scale: nextScale
    }, 240);
    scheduleGraphDetailRefresh();
  };
}

function getGraphPinchState(svg, isFocus, pointers) {
  const current = getGraphPinchPoints(svg, pointers);
  const view = getGraphView(isFocus);
  return {
    ...current,
    view: { ...view },
    pointX: (current.svgX - view.x) / view.scale,
    pointY: (current.svgY - view.y) / view.scale
  };
}

function getGraphPinchPoints(svg, pointers) {
  const points = [...pointers.values()].slice(0, 2);
  const a = points[0];
  const b = points[1];
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const distance = Math.hypot(a.x - b.x, a.y - b.y);
  const rect = svg?.getBoundingClientRect?.() || { left: 0, top: 0, width: 1, height: 1 };
  const viewBox = svg?.viewBox?.baseVal || { width: rect.width || 1, height: rect.height || 1 };
  return {
    distance,
    svgX: ((midX - rect.left) / Math.max(rect.width, 1)) * viewBox.width,
    svgY: ((midY - rect.top) / Math.max(rect.height, 1)) * viewBox.height
  };
}

function getGraphMemos(isFocus = false) {
  const source = state.includeArchivedInGraph
    ? state.memos
    : state.memos.filter((memo) => !memo.archived);

  if (state.graphMode === "filtered") {
    return filteredMemos({ includeArchived: state.includeArchivedInGraph });
  }

  if (state.graphMode === "all") {
    return source;
  }

  const selected = getExistingMemo(state.selectedMemoId) || source[0];
  if (!selected) {
    return [];
  }

  const related = new Set([selected.id]);
  asArray(selected.links).forEach((link) => {
    const target = findMemoByLinkName(source, link);
    if (target) {
      related.add(target.id);
    }
  });
  source.forEach((memo) => {
    if (asArray(memo.links).some((link) => link === selected.id || link === selected.title || link === selected.displayTitle)) {
      related.add(memo.id);
    }
  });

  if (isFocus) {
    source.forEach((memo) => {
      if (related.has(memo.id)) {
        asArray(memo.links).forEach((link) => {
          const target = findMemoByLinkName(source, link);
          if (target) {
            related.add(target.id);
          }
        });
      }
    });
  }

  return source.filter((memo) => related.has(memo.id));
}

function findMemoByLinkName(memos, link) {
  return memos.find((memo) => memo.id === link || memo.title === link || memo.displayTitle === link);
}

function openMemoGraphFocus() {
  state.graphFocusOpen = true;
  elements.memoGraphFocusLayer.classList.add("is-visible");
  elements.memoGraphFocusLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("graph-focus-open");
  renderMemoGraph();
}

function closeMemoGraphFocus() {
  state.graphFocusOpen = false;
  elements.memoGraphFocusLayer.classList.remove("is-visible");
  elements.memoGraphFocusLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("graph-focus-open");
}

function openMemoBodyFocus() {
  syncMemoEditorToSource();
  state.memoBodyFocusOpen = true;
  elements.memoBodyFocusLayer.classList.add("is-visible");
  elements.memoBodyFocusLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("memo-body-focus-open");
  elements.memoBodyFocusEditorHost.append(elements.memoBodyPreview);
  elements.memoBodyPreview.focus();
}

function closeMemoBodyFocus() {
  if (!state.memoBodyFocusOpen) {
    return;
  }
  syncMemoEditorToSource();
  state.memoBodyFocusOpen = false;
  elements.memoBodyFocusLayer.classList.remove("is-visible");
  elements.memoBodyFocusLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("memo-body-focus-open");
  elements.memoBodyEditorHost.append(elements.memoBodyPreview);
  elements.memoBodyPreview.focus();
}

function handleSettingsTitleSecretClick() {
  const now = Date.now();
  state.secretToolClickCount = now - state.secretToolClickAt > 1300
    ? 1
    : state.secretToolClickCount + 1;
  state.secretToolClickAt = now;
  if (state.secretToolClickCount >= 5) {
    state.secretToolClickCount = 0;
    startSecretGame();
  }
}

function startSecretGame() {
  if (state.secretGame?.frame) {
    cancelAnimationFrame(state.secretGame.frame);
  }
  state.secretGame = createSecretGameState(1, 0, 3);
  elements.secretGameLayer.classList.add("is-visible");
  elements.secretGameLayer.setAttribute("aria-hidden", "false");
  elements.secretGameCanvas.focus();
  drawSecretGame();
  state.secretGame.frame = requestAnimationFrame(tickSecretGame);
}

function loadGameAsset(src) {
  const image = new Image();
  image.src = src;
  return image;
}

function createSecretGameState(stage = 1, score = 0, lives = 3) {
  const canvas = elements.secretGameCanvas;
  const stageConfig = getSecretGameStageConfig(stage);
  const enemies = [];
  for (let row = 0; row < stageConfig.rows; row += 1) {
    for (let col = 0; col < stageConfig.cols; col += 1) {
      enemies.push({
        x: stageConfig.startX + col * stageConfig.gapX,
        y: 58 + row * stageConfig.gapY,
        alive: true,
        wobble: (row * 9 + col * 13) % 40
      });
    }
  }
  return {
    open: true,
    frame: null,
    lastAt: performance.now(),
    keys: new Set(),
    playerX: canvas.width / 2,
    bullets: [],
    enemyBolts: [],
    enemies,
    enemyDir: 1,
    enemyStepAt: 0,
    enemyShootAt: 0,
    stage,
    stageConfig,
    score,
    lives,
    status: "play"
  };
}

function getSecretGameStageConfig(stage) {
  const safeStage = clamp(Number(stage) || 1, 1, 10);
  const cols = Math.min(6 + safeStage, 12);
  const rows = Math.min(3 + Math.floor((safeStage + 1) / 3), 6);
  return {
    cols,
    rows,
    startX: Math.max(58, 360 - ((cols - 1) * 48) / 2),
    gapX: Math.max(42, 54 - safeStage),
    gapY: Math.max(30, 38 - Math.floor(safeStage / 2)),
    stepInterval: Math.max(170, 560 - safeStage * 42),
    horizontalStep: 10 + safeStage * 2.2,
    dropStep: 10 + safeStage * 2.4,
    enemyFireInterval: Math.max(520, 1600 - safeStage * 115),
    enemyBoltSpeed: 2.3 + safeStage * 0.28,
    playerSpeed: 0.34 + safeStage * 0.008
  };
}

function closeSecretGame() {
  const game = state.secretGame;
  if (game?.frame) {
    cancelAnimationFrame(game.frame);
  }
  state.secretGame = null;
  elements.secretGameLayer.classList.remove("is-visible");
  elements.secretGameLayer.setAttribute("aria-hidden", "true");
  elements.settingsTitle.focus?.();
}

function handleSecretGameKeydown(event) {
  const game = state.secretGame;
  if (!game?.open) {
    return;
  }
  if (["ArrowLeft", "ArrowRight", "a", "A", "d", "D", " "].includes(event.key)) {
    event.preventDefault();
  }
  if (event.key === " ") {
    shootSecretGameBullet();
    return;
  }
  game.keys.add(event.key);
}

function handleSecretGameKeyup(event) {
  state.secretGame?.keys.delete(event.key);
}

function shootSecretGameBullet() {
  const game = state.secretGame;
  if (!game || game.status !== "play" || game.bullets.length >= Math.min(5, 2 + Math.ceil(game.stage / 3))) {
    return;
  }
  game.bullets.push({ x: game.playerX, y: 360, vy: -7 });
}

function tickSecretGame(now) {
  const game = state.secretGame;
  if (!game?.open) {
    return;
  }
  const delta = Math.min(32, now - game.lastAt);
  game.lastAt = now;
  if (game.status === "play") {
    updateSecretGame(delta, now);
  }
  drawSecretGame();
  if (state.secretGame?.open) {
    state.secretGame.frame = requestAnimationFrame(tickSecretGame);
  }
}

function updateSecretGame(delta, now) {
  const game = state.secretGame;
  const canvas = elements.secretGameCanvas;
  const config = game.stageConfig;
  const speed = config.playerSpeed * delta;
  if (game.keys.has("ArrowLeft") || game.keys.has("a") || game.keys.has("A")) {
    game.playerX -= speed;
  }
  if (game.keys.has("ArrowRight") || game.keys.has("d") || game.keys.has("D")) {
    game.playerX += speed;
  }
  game.playerX = clamp(game.playerX, 28, canvas.width - 28);

  game.bullets.forEach((bullet) => {
    bullet.y += bullet.vy;
  });
  game.bullets = game.bullets.filter((bullet) => bullet.y > -20);

  game.enemyBolts.forEach((bolt) => {
    bolt.y += bolt.vy;
  });
  game.enemyBolts = game.enemyBolts.filter((bolt) => bolt.y < canvas.height + 18);

  if (now - game.enemyStepAt > config.stepInterval) {
    game.enemyStepAt = now;
    const alive = game.enemies.filter((enemy) => enemy.alive);
    if (alive.length === 0) {
      advanceSecretGameStage();
      return;
    }
    const left = Math.min(...alive.map((enemy) => enemy.x));
    const right = Math.max(...alive.map((enemy) => enemy.x));
    if (right > 670 || left < 50) {
      game.enemyDir *= -1;
      alive.forEach((enemy) => {
        enemy.y += config.dropStep;
      });
    }
    alive.forEach((enemy) => {
      enemy.x += game.enemyDir * config.horizontalStep;
      enemy.y += Math.sin((now / 280) + enemy.wobble) * (0.35 + game.stage * 0.04);
    });
  }

  if (now - game.enemyShootAt > config.enemyFireInterval) {
    game.enemyShootAt = now;
    const alive = game.enemies.filter((enemy) => enemy.alive);
    const shooter = alive[Math.floor(Math.random() * alive.length)];
    if (shooter) {
      game.enemyBolts.push({ x: shooter.x, y: shooter.y + 20, vy: config.enemyBoltSpeed });
    }
  }

  game.bullets.forEach((bullet) => {
    game.enemies.forEach((enemy) => {
      if (!enemy.alive) {
        return;
      }
      if (Math.abs(bullet.x - enemy.x) < 17 && Math.abs(bullet.y - enemy.y) < 15) {
        enemy.alive = false;
        bullet.y = -99;
        game.score += 10 + game.stage * 2;
      }
    });
  });
  game.bullets = game.bullets.filter((bullet) => bullet.y > -20);

  game.enemyBolts.forEach((bolt) => {
    if (Math.abs(bolt.x - game.playerX) < 22 && Math.abs(bolt.y - 364) < 22) {
      bolt.y = canvas.height + 99;
      game.lives -= 1;
      if (game.lives <= 0) {
        game.status = "over";
      }
    }
  });

  const alive = game.enemies.filter((enemy) => enemy.alive);
  if (alive.length === 0) {
    advanceSecretGameStage();
    return;
  }
  if (alive.some((enemy) => enemy.y > 320)) {
    game.status = "over";
  }
}

function advanceSecretGameStage() {
  const game = state.secretGame;
  if (!game) {
    return;
  }
  if (game.stage >= 10) {
    game.status = "complete";
    return;
  }
  const nextStage = game.stage + 1;
  const nextScore = game.score + 50 + game.stage * 10;
  const nextLives = Math.min(5, game.lives + (nextStage % 3 === 0 ? 1 : 0));
  state.secretGame = createSecretGameState(nextStage, nextScore, nextLives);
}

function drawSecretGame() {
  const game = state.secretGame;
  const canvas = elements.secretGameCanvas;
  const ctx = canvas.getContext("2d");
  if (!game || !ctx) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#050812");
  gradient.addColorStop(0.5, "#101729");
  gradient.addColorStop(1, "#050812");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(143, 238, 255, 0.55)";
  for (let i = 0; i < 90; i += 1) {
    const x = (i * 73) % canvas.width;
    const y = (i * 47) % canvas.height;
    ctx.fillRect(x, y, i % 5 === 0 ? 2 : 1, i % 7 === 0 ? 2 : 1);
  }

  ctx.fillStyle = "#8feeff";
  ctx.shadowColor = "#8feeff";
  ctx.shadowBlur = 14;
  drawSecretGameSprite(ctx, secretGameAssets.player, game.playerX - 30, 326, 60, 70, () => {
    ctx.beginPath();
    ctx.moveTo(game.playerX, 352);
    ctx.lineTo(game.playerX - 22, 382);
    ctx.lineTo(game.playerX + 22, 382);
    ctx.closePath();
    ctx.fill();
  });

  ctx.shadowBlur = 10;
  game.bullets.forEach((bullet) => {
    ctx.fillStyle = "#fff2c8";
    ctx.fillRect(bullet.x - 2, bullet.y - 12, 4, 14);
  });

  ctx.shadowBlur = 12;
  game.enemies.forEach((enemy, index) => {
    if (!enemy.alive) {
      return;
    }
    drawSecretGameSprite(ctx, secretGameAssets.enemy, enemy.x - 17, enemy.y - 16, 34, 34, () => {
      ctx.fillStyle = index % 3 === 0 ? "#d6ff5d" : index % 3 === 1 ? "#ff8db0" : "#9df2ff";
      ctx.fillRect(enemy.x - 13, enemy.y - 9, 26, 18);
      ctx.fillRect(enemy.x - 20, enemy.y - 2, 7, 7);
      ctx.fillRect(enemy.x + 13, enemy.y - 2, 7, 7);
    });
  });

  ctx.shadowBlur = 8;
  game.enemyBolts.forEach((bolt) => {
    ctx.fillStyle = "#ff8db0";
    ctx.fillRect(bolt.x - 2, bolt.y, 4, 13);
  });

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(247, 251, 255, 0.86)";
  ctx.font = "700 16px Segoe UI, sans-serif";
  ctx.fillText(`SCORE ${game.score}`, 18, 28);
  ctx.fillText(`STAGE ${game.stage}/10`, 170, 28);
  ctx.fillText(`CORE ${game.lives}`, 300, 28);
  const statusText = game.status === "complete"
    ? "ALL CONSTELLATIONS RESTORED"
    : game.status === "over"
      ? "SIGNAL LOST"
      : "LUMEN SWEEP";
  ctx.fillText(statusText, 440, 28);
  if (game.status !== "play") {
    ctx.font = "700 24px Segoe UI, sans-serif";
    ctx.fillText(game.status === "complete" ? "全10ステージ完了" : "リスタートで再開", 260, 220);
  }
}

function drawSecretGameSprite(ctx, image, x, y, width, height, fallback) {
  if (image?.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, x, y, width, height);
    return;
  }
  fallback();
}

function handleMemoExport() {
  if (elements.memoExportFormat.value === "word") {
    exportSelectedMemosAsWord();
    return;
  }
  if (elements.memoExportFormat.value === "markdown") {
    exportSelectedMemosAsMarkdown();
    return;
  }
  saveMemosToLocalFile();
}

function renderMemoAutoSaveState() {
  elements.memoAutoSaveEnabled.checked = state.memoAutoSaveEnabled;
  elements.memoAutoSaveEnabled.disabled = !supportsFileSystemAccess();
  elements.setAutoSaveFileButton.disabled = !supportsFileSystemAccess();
  elements.setAutoSaveFileButton.textContent = state.memoAutoSaveHandle
    ? "自動保存先を変更"
    : "自動保存先を設定";
}

async function toggleMemoAutoSave() {
  if (!supportsFileSystemAccess()) {
    elements.memoAutoSaveEnabled.checked = false;
    showMemoStatus("このブラウザは自動ローカル保存に対応していません。", true);
    return;
  }

  if (elements.memoAutoSaveEnabled.checked && !state.memoAutoSaveHandle) {
    const configured = await setMemoAutoSaveFile({ silentCancel: true });
    if (!configured) {
      state.memoAutoSaveEnabled = false;
      elements.memoAutoSaveEnabled.checked = false;
      persistMemoAutoSaveEnabled();
      return;
    }
  }

  state.memoAutoSaveEnabled = elements.memoAutoSaveEnabled.checked;
  persistMemoAutoSaveEnabled();
  renderMemoAutoSaveState();
  if (state.memoAutoSaveEnabled) {
    scheduleMemoAutoSave(0);
  } else {
    showMemoStatus("自動ローカル保存をオフにしました。");
  }
}

async function setMemoAutoSaveFile(options = {}) {
  if (!supportsFileSystemAccess()) {
    showMemoStatus("このブラウザは自動ローカル保存に対応していません。", true);
    return false;
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: `super-memo-autosave.json`,
      types: [
        {
          description: "Super Memo JSON",
          accept: { "application/json": [".json"] }
        }
      ]
    });
    state.memoAutoSaveHandle = handle;
    await saveMemoAutoSaveHandle(handle);
    state.memoAutoSaveEnabled = true;
    persistMemoAutoSaveEnabled();
    renderMemoAutoSaveState();
    await writeMemoAutoSaveFile();
    showMemoStatus("自動保存先を設定し、JSONへ保存しました。");
    return true;
  } catch (error) {
    if (error?.name === "AbortError") {
      if (!options.silentCancel) {
        showMemoStatus("自動保存先の設定をキャンセルしました。");
      }
      return false;
    }
    showMemoStatus("自動保存先の設定に失敗しました。", true);
    return false;
  }
}

async function loadMemoAutoSaveHandle() {
  if (!supportsFileSystemAccess()) {
    state.memoAutoSaveEnabled = false;
    persistMemoAutoSaveEnabled();
    renderMemoAutoSaveState();
    return;
  }

  try {
    state.memoAutoSaveHandle = await readMemoAutoSaveHandle();
  } catch {
    state.memoAutoSaveHandle = null;
  }

  if (!state.memoAutoSaveHandle) {
    state.memoAutoSaveEnabled = false;
    persistMemoAutoSaveEnabled();
  }

  renderMemoAutoSaveState();
}

function scheduleMemoAutoSave(delay = 600) {
  if (!state.memoAutoSaveEnabled || !state.memoAutoSaveHandle) {
    return;
  }

  window.clearTimeout(state.memoAutoSaveTimer);
  state.memoAutoSaveTimer = window.setTimeout(() => {
    writeMemoAutoSaveFile();
  }, delay);
}

async function writeMemoAutoSaveFile() {
  if (!state.memoAutoSaveEnabled || !state.memoAutoSaveHandle) {
    return;
  }
  if (state.memoAutoSaveBusy) {
    state.memoAutoSavePending = true;
    return;
  }

  state.memoAutoSaveBusy = true;
  try {
    const permission = await ensureMemoAutoSavePermission(state.memoAutoSaveHandle);
    if (!permission) {
      state.memoAutoSaveEnabled = false;
      persistMemoAutoSaveEnabled();
      renderMemoAutoSaveState();
      showMemoStatus("自動保存の許可がありません。再度、自動保存先を設定してください。", true);
      return;
    }
    const writable = await state.memoAutoSaveHandle.createWritable();
    await writable.write(JSON.stringify(buildMemoExportPayload(), null, 2));
    await writable.close();
  } catch {
    showMemoStatus("自動ローカル保存に失敗しました。", true);
  } finally {
    state.memoAutoSaveBusy = false;
    if (state.memoAutoSavePending) {
      state.memoAutoSavePending = false;
      scheduleMemoAutoSave(0);
    }
  }
}

async function ensureMemoAutoSavePermission(handle) {
  const options = { mode: "readwrite" };
  if (await handle.queryPermission(options) === "granted") {
    return true;
  }
  return await handle.requestPermission(options) === "granted";
}

function persistMemoAutoSaveEnabled() {
  localStorage.setItem(STORAGE_KEYS.memoAutoSaveEnabled, String(state.memoAutoSaveEnabled));
}

function supportsFileSystemAccess() {
  return Boolean(window.showSaveFilePicker && window.showOpenFilePicker && window.indexedDB);
}

async function saveMemosToLocalFile() {
  syncMemoEditorToSource();
  const payload = buildMemoExportPayload();
  const contents = JSON.stringify(payload, null, 2);
  const suggestedName = `super-memo-${toDateValue(new Date())}.json`;

  if (!window.showSaveFilePicker) {
    downloadTextFile(contents, suggestedName, "application/json");
    showMemoStatus("ブラウザがローカル保存に未対応のため、JSONをダウンロードしました。");
    return;
  }

  try {
    const handle = await window.showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: "Super Memo JSON",
          accept: { "application/json": [".json"] }
        }
      ]
    });
    const writable = await handle.createWritable();
    await writable.write(contents);
    await writable.close();
    showMemoStatus("ローカルファイルへ保存しました。");
  } catch (error) {
    if (error?.name === "AbortError") {
      showMemoStatus("ローカル保存をキャンセルしました。");
      return;
    }
    showMemoStatus("ローカル保存に失敗しました。", true);
  }
}

function buildMemoExportPayload() {
  return {
    exportedAt: new Date().toISOString(),
    app: "Super Memo",
    notes: state.memos
  };
}

function downloadTextFile(contents, filename, type) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function openMemoAutoSaveDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(MEMO_AUTO_SAVE_DB, 1);
    request.addEventListener("upgradeneeded", () => {
      request.result.createObjectStore(MEMO_AUTO_SAVE_STORE);
    });
    request.addEventListener("success", () => resolve(request.result));
    request.addEventListener("error", () => reject(request.error));
  });
}

async function readMemoAutoSaveHandle() {
  const db = await openMemoAutoSaveDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEMO_AUTO_SAVE_STORE, "readonly");
    const store = transaction.objectStore(MEMO_AUTO_SAVE_STORE);
    const request = store.get(MEMO_AUTO_SAVE_HANDLE_KEY);
    request.addEventListener("success", () => resolve(request.result || null));
    request.addEventListener("error", () => reject(request.error));
    transaction.addEventListener("complete", () => db.close());
    transaction.addEventListener("abort", () => {
      db.close();
      reject(transaction.error);
    });
  });
}

async function saveMemoAutoSaveHandle(handle) {
  const db = await openMemoAutoSaveDb();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(MEMO_AUTO_SAVE_STORE, "readwrite");
    const store = transaction.objectStore(MEMO_AUTO_SAVE_STORE);
    store.put(handle, MEMO_AUTO_SAVE_HANDLE_KEY);
    transaction.addEventListener("complete", () => {
      db.close();
      resolve();
    });
    transaction.addEventListener("error", () => {
      db.close();
      reject(transaction.error);
    });
    transaction.addEventListener("abort", () => {
      db.close();
      reject(transaction.error);
    });
  });
}

function importMemos(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }
  handleMemoImportFile(file, () => {
    elements.importMemosField.value = "";
  });
}

function bindMemoDropZone() {
  ["dragenter", "dragover"].forEach((eventName) => {
    elements.memoDropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.memoDropZone.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    elements.memoDropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      elements.memoDropZone.classList.remove("is-dragging");
    });
  });

  elements.memoDropZone.addEventListener("drop", (event) => {
    const file = event.dataTransfer?.files?.[0];
    if (!file) {
      return;
    }
    handleMemoImportFile(file);
  });
}

function handleMemoImportFile(file, onComplete) {
  if (!file.name.toLowerCase().endsWith(".json")) {
    showMemoStatus("JSONファイルを選択してください。", true);
    if (onComplete) {
      onComplete();
    }
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const notes = Array.isArray(parsed) ? parsed : parsed.notes;
      if (!Array.isArray(notes)) {
        throw new Error("Invalid memo data");
      }
      state.memos = notes.map(normalizeMemo).filter(Boolean);
      state.selectedMemoIds.clear();
      persistMemos();
      renderMemo();
      if (state.memos.length > 0) {
        selectMemo(state.memos[0].id);
      } else {
        resetMemoEditor("Meeting");
      }
      showMemoStatus("インポートしました。");
    } catch {
      showMemoStatus("JSONの読み込みに失敗しました。", true);
    } finally {
      if (onComplete) {
        onComplete();
      }
    }
  });
  reader.readAsText(file);
}

function exportSelectedMemosAsWord() {
  syncMemoEditorToSource();
  const memos = getMemosForBatchExport();
  if (memos.length === 0) {
    showMemoStatus("Word出力するメモを選択してください。", true);
    return;
  }

  const title = memos.length === 1
    ? getMemoDisplayName(memos[0])
    : `Super Memo 選択メモ ${toDateValue(new Date())}`;
  const html = buildWordHtml(title, memos);
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(title)}.doc`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showMemoStatus(`${memos.length}件のメモをWord形式で出力しました。`);
}

function exportSelectedMemosAsMarkdown() {
  syncMemoEditorToSource();
  const memos = getMemosForBatchExport();
  if (memos.length === 0) {
    showMemoStatus("Markdown出力するメモを選択してください。", true);
    return;
  }

  const title = memos.length === 1
    ? getMemoDisplayName(memos[0])
    : `Super Memo 選択メモ ${toDateValue(new Date())}`;
  const markdown = buildBatchMemoMarkdown(memos);
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${sanitizeFileName(title)}.md`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showMemoStatus(`${memos.length}件のメモをMarkdown形式で出力しました。`);
}

function getMemosForBatchExport() {
  let memos = state.memos.filter((memo) => state.selectedMemoIds.has(memo.id));
  if (memos.length === 0 && state.selectedMemoId) {
    const currentMemo = buildCurrentMemoSnapshot();
    if (currentMemo) {
      memos = [currentMemo];
    }
  }
  return memos;
}

function buildBatchMemoMarkdown(memos) {
  return memos.map((memo) => {
    const properties = memo.properties || {};
    const frontMatter = [
      "---",
      `id: ${memo.id}`,
      `title: ${getMemoDisplayName(memo)}`,
      `template: ${getTemplateLabel(memo.template)}`,
      `date: ${properties.date || ""}`,
      `categories: ${asArray(properties.categories).join(", ")}`,
      `people: ${asArray(properties.people).join(", ")}`,
      `topics: ${asArray(properties.topics).join(", ")}`,
      `tags: ${asArray(properties.tags).join(", ")}`,
      `pinned: ${Boolean(memo.pinned)}`,
      `starred: ${Boolean(memo.starred)}`,
      `importance: ${clampImportance(memo.importance)}`,
      "---"
    ].join("\n");
    return `# ${getMemoDisplayName(memo)}\n\n${frontMatter}\n\n${memo.body || ""}`;
  }).join("\n\n---\n\n");
}

function buildCurrentMemoSnapshot() {
  const existing = getExistingMemo(state.selectedMemoId);
  if (!existing) {
    return null;
  }

  return {
    ...existing,
    title: elements.memoTitle.value.trim() || existing.title || existing.id,
    displayTitle: elements.memoDisplayTitle.value.trim(),
    template: elements.memoTemplate.value,
    properties: {
      ...existing.properties,
      date: elements.memoDate.value || "",
      categories: parseList(elements.memoCategories.value),
      people: parseList(elements.memoPeople.value),
      topics: parseList(elements.memoTopics.value),
      tags: parseList(elements.memoTags.value)
    },
    body: elements.memoBody.value.trim(),
    links: extractLinks(elements.memoBody.value),
    images: Object.values(state.currentMemoImages),
    starred: Boolean(existing.starred),
    importance: clampImportance(elements.memoImportance.value)
  };
}

function buildWordHtml(title, memos) {
  const sections = memos.map((memo) => {
    const properties = memo.properties || {};
    const rows = [
      ["テンプレート", getTemplateLabel(memo.template)],
      ["ID", memo.title || memo.id],
      ["日付", properties.date || ""],
      ["カテゴリ", asArray(properties.categories).join(", ")],
      ["人物", asArray(properties.people).join(", ")],
      ["話題", asArray(properties.topics).join(", ")],
      ["タグ", asArray(properties.tags).join(", ")],
      ["状態", memo.archived ? "アーカイブ" : "通常"],
      ["スター", memo.starred ? "あり" : ""],
      ["重要度", getImportanceLabel(memo.importance)],
      ["熱量", getMemoHeatLabel(memo)],
      ["リンク", asArray(memo.links).join(", ")]
    ];

    const propertyRows = rows.map(([label, value]) => {
      return `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;
    }).join("");

    return [
      `<section class="note">`,
      `<h1>${escapeHtml(getMemoDisplayName(memo))}</h1>`,
      `<table>${propertyRows}</table>`,
      `<div class="body">${markdownToHtml(memo.body || "", imagesToMap(memo.images), { interactiveImages: false, wordExport: true })}</div>`,
      `</section>`
    ].join("");
  }).join('<div class="page-break"></div>');

  return [
    "<!doctype html>",
    '<html lang="ja">',
    "<head>",
    '<meta charset="utf-8">',
    `<title>${escapeHtml(title)}</title>`,
    "<style>",
    "@page{margin:18mm;}",
    "body{font-family:'Yu Gothic','Meiryo',sans-serif;color:#1f2320;line-height:1.7;}",
    "h1{font-size:22pt;margin:0 0 12pt;}",
    "h2{font-size:14pt;margin:18pt 0 6pt;}",
    "table{border-collapse:collapse;width:100%;margin:0 0 16pt;}",
    "th,td{border:1px solid #cfc7b8;padding:6pt;text-align:left;vertical-align:top;}",
    "th{width:96pt;background:#f3efe7;}",
    "img{height:auto;}",
    ".note{margin-bottom:24pt;}",
    ".page-break{page-break-before:always;}",
    "</style>",
    "</head>",
    "<body>",
    sections,
    "</body>",
    "</html>"
  ].join("");
}

function markdownToHtml(markdown, images = {}, options = {}) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let listOpen = false;

  lines.forEach((line) => {
    const managedImage = parseManagedImageLine(line);
    if (managedImage) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      const image = images[managedImage.id];
      if (image?.src) {
        const width = managedImage.width || image.width || 480;
        const imageStyle = options.wordExport
          ? `width:${getWordImageWidthPt(width)}pt;height:auto;`
          : `width:${width}px;max-width:100%;height:auto;`;
        const img = `<img src="${escapeAttribute(image.src)}" alt="${escapeHtml(image.alt || managedImage.alt || "画像")}" style="${imageStyle}">`;
        html.push(options.interactiveImages
          ? `<figure class="preview-image" data-image-id="${escapeAttribute(managedImage.id)}" data-width="${width}">${img}<span class="image-resize-handle" aria-hidden="true"></span></figure>`
          : `<p>${img}</p>`);
      } else {
        html.push(`<p class="missing-image">画像データが見つかりません: ${escapeHtml(managedImage.id)}</p>`);
      }
      return;
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\((data:image\/[^)]+)\)$/);
    if (imageMatch) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      const imageStyle = options.wordExport ? `width:${WORD_IMAGE_MAX_WIDTH_PT}pt;height:auto;` : "max-width:100%;height:auto;";
      html.push(`<p><img src="${escapeAttribute(imageMatch[2])}" alt="${escapeHtml(imageMatch[1] || "画像")}" style="${imageStyle}"></p>`);
      return;
    }

    if (/^##\s+/.test(line)) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      html.push(`<h2>${escapeHtml(line.replace(/^##\s+/, ""))}</h2>`);
      return;
    }

    if (/^-\s+/.test(line)) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${formatInlineMarkdown(line.replace(/^-\s+/, ""))}</li>`);
      return;
    }

    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }

    if (!line.trim()) {
      html.push("<p>&nbsp;</p>");
      return;
    }

    html.push(`<p>${formatInlineMarkdown(line)}</p>`);
  });

  if (listOpen) {
    html.push("</ul>");
  }

  return html.join("");
}

function formatInlineMarkdown(text) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, target) => {
      if (!isSafeHyperlinkTarget(target)) {
        return match;
      }
      const href = normalizeHyperlinkHref(target);
      const isLocal = isLocalFileHref(href);
      const title = isLocal ? "Ctrl+クリックでパスをコピー" : "Ctrl+クリックで開く";
      const dataKind = isLocal ? ' data-link-kind="local-file"' : "";
      const link = `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer" title="${title}"${dataKind}>${label}</a>`;
      if (!isLocal) {
        return link;
      }
      const explorerPath = fileHrefToWindowsPath(href);
      return `${link} <button type="button" class="local-path-copy" data-path="${escapeAttribute(explorerPath)}" contenteditable="false">コピー</button>`;
    })
    .replace(/\[\[([^\]]+)\]\]/g, (match, target) => {
      const id = target.trim();
      const memo = state.memos.find((item) => item.id === id || item.title === id || item.displayTitle === id);
      const memoId = memo?.id || id;
      const label = memo ? `[[${memo.id}]]` : `[[${id}]]`;
      const className = memo ? "memo-id-link" : "memo-id-link is-missing";
      const title = memo ? "Ctrl+クリックでメモを開く" : "リンク先メモが見つかりません";
      return `<a href="#memo-${escapeAttribute(memoId)}" class="${className}" data-link-kind="memo-id" data-memo-id="${escapeAttribute(memoId)}" title="${title}">${escapeHtml(label)}</a>`;
    });
}

function autoLinkPastedText(text) {
  if (!text.trim()) {
    return text;
  }

  return text.split(/\r?\n/).map((line) => autoLinkTextLine(line)).join("\n");
}

function autoLinkTextLine(line) {
  const trimmed = line.trim();
  if (!trimmed) {
    return line;
  }

  if (isSafeHyperlinkTarget(trimmed)) {
    return line.replace(trimmed, `[${trimmed}](${normalizeHyperlinkHref(trimmed)})`);
  }

  const withUrls = line.replace(/(^|[\s(])(https?:\/\/[^\s)]+|mailto:[^\s)]+|file:\/\/[^\s)]+)/gi, (match, prefix, target) => {
    return `${prefix}[${target}](${normalizeHyperlinkHref(target)})`;
  });

  return withUrls.replace(/(^|[\s(])([A-Za-z]:[\\/][^\r\n]+)/g, (match, prefix, target) => {
    return `${prefix}[${target}](${normalizeHyperlinkHref(target.trim())})`;
  });
}

function isSafeHyperlinkTarget(target) {
  return /^(https?:\/\/|mailto:|file:\/\/)/i.test(target)
    || isWindowsDrivePath(target)
    || isUncPath(target);
}

function normalizeHyperlinkHref(target) {
  const value = decodeRepeated(String(target || "").trim());
  if (/^(https?:\/\/|mailto:|file:\/\/)/i.test(value)) {
    return encodeURI(value);
  }
  if (isWindowsDrivePath(value)) {
    return encodeURI(`file:///${value.replace(/\\/g, "/")}`);
  }
  if (isUncPath(value)) {
    return encodeURI(`file://${value.replace(/^\\\\/, "").replace(/\\/g, "/")}`);
  }
  return value;
}

function isLocalFileHref(value) {
  return /^file:\/\//i.test(String(value || "").trim());
}

function fileHrefToWindowsPath(href) {
  let value = decodeRepeated(String(href || "").trim());
  value = value.replace(/^file:\/\//i, "");

  if (value.startsWith("/")) {
    value = value.slice(1);
  }

  if (/^[A-Za-z]:\//.test(value)) {
    return value.replace(/\//g, "\\");
  }

  return `\\\\${value.replace(/\//g, "\\")}`;
}

function decodeRepeated(value) {
  let next = String(value || "");
  for (let index = 0; index < 8; index += 1) {
    try {
      const decoded = decodeURI(next);
      if (decoded === next) {
        return decoded;
      }
      next = decoded;
    } catch {
      return next;
    }
  }
  return next;
}

function isWindowsDrivePath(value) {
  return /^[A-Za-z]:[\\/]/.test(String(value || "").trim());
}

function isUncPath(value) {
  return /^\\\\[^\\/]+[\\/][^\\/]+/.test(String(value || "").trim());
}

function parseManagedImageLine(line) {
  const match = line.match(/^!\[([^\]]*)\]\(memo-image:([^#)]+)#(\d+)\)$/);
  if (!match) {
    return null;
  }
  return {
    alt: match[1],
    id: match[2],
    width: Number(match[3])
  };
}

function getWordImageWidthPt(widthPx) {
  const widthPt = Math.round((Number(widthPx) || 480) * 0.75);
  return Math.min(widthPt, WORD_IMAGE_MAX_WIDTH_PT);
}

function getBacklinksForMemo(targetMemo) {
  const keys = getMemoLinkKeys(targetMemo);
  return state.memos.filter((memo) => {
    if (memo.id === targetMemo.id) {
      return false;
    }
    return asArray(memo.links).some((link) => keys.has(link));
  });
}

function getSuggestedLinks(currentMemo) {
  const existingLinks = new Set(asArray(currentMemo.links));
  const currentTerms = getMemoSuggestionTerms(currentMemo);
  return state.memos
    .filter((memo) => memo.id !== currentMemo.id && !memo.archived && !existingLinks.has(memo.id) && !existingLinks.has(memo.title) && !existingLinks.has(memo.displayTitle))
    .map((memo) => {
      const terms = getMemoSuggestionTerms(memo);
      let score = 0;
      currentTerms.properties.forEach((term) => {
        if (terms.properties.has(term)) {
          score += 4;
        }
      });
      currentTerms.words.forEach((word) => {
        if (terms.words.has(word)) {
          score += 1;
        }
      });
      if (memo.starred) {
        score += 1;
      }
      score += clampImportance(memo.importance);
      return { memo, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
}

function getUnconnectedMemos() {
  return state.memos
    .filter((memo) => !memo.archived)
    .filter((memo) => asArray(memo.links).length === 0 && getBacklinksForMemo(memo).length === 0)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
}

function getMemoSuggestionTerms(memo) {
  const properties = memo.properties || {};
  const propertyValues = [
    ...asArray(properties.categories),
    ...asArray(properties.people),
    ...asArray(properties.topics),
    ...asArray(properties.tags)
  ];
  const words = [
    memo.displayTitle,
    memo.title,
    memo.body,
    ...propertyValues
  ].join(" ")
    .toLowerCase()
    .replace(/[()[\]{}.,:;!?'"`~<>\/\\|+=*_#-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2 && !/^\d+$/.test(word));

  return {
    properties: new Set(propertyValues.map((value) => value.toLowerCase()).filter(Boolean)),
    words: new Set(words.slice(0, 240))
  };
}

function getMemoLinkKeys(memo) {
  return new Set([memo.id, memo.title, memo.displayTitle].filter(Boolean));
}

function getMemoHeatScore(memo) {
  const now = Date.now();
  const lastTouched = Math.max(
    new Date(memo.lastViewedAt || 0).getTime() || 0,
    new Date(memo.updatedAt || 0).getTime() || 0,
    new Date(memo.createdAt || 0).getTime() || 0
  );
  const ageDays = lastTouched ? (now - lastTouched) / 86400000 : 365;
  const recency = Math.max(0, 100 - ageDays * 8);
  const frequency = Math.min(Number(memo.openCount || 0) * 8, 60);
  const importance = clampImportance(memo.importance) * 8;
  const starred = memo.starred ? 12 : 0;
  return recency + frequency + importance + starred;
}

function getMemoHeatLevel(memo) {
  const score = getMemoHeatScore(memo);
  if (score >= 105) {
    return "hot";
  }
  if (score >= 62) {
    return "warm";
  }
  return "cool";
}

function getMemoHeatLabel(memo) {
  const level = getMemoHeatLevel(memo);
  if (level === "hot") {
    return "熱い";
  }
  if (level === "warm") {
    return "温かい";
  }
  return "冷たい";
}

function clampImportance(value) {
  const number = Number(value || 0);
  if (!Number.isFinite(number)) {
    return 0;
  }
  return Math.max(0, Math.min(3, Math.round(number)));
}

function getImportanceLabel(value) {
  const importance = clampImportance(value);
  if (importance === 3) {
    return "高";
  }
  if (importance === 2) {
    return "中";
  }
  if (importance === 1) {
    return "低";
  }
  return "なし";
}

function bindPreviewImageResize() {
  elements.memoBodyPreview.querySelectorAll(".preview-image").forEach((figure) => {
    const handle = figure.querySelector(".image-resize-handle");
    const imageId = figure.dataset.imageId;
    const image = state.currentMemoImages[imageId];
    if (!handle || !image) {
      return;
    }

    handle.addEventListener("mousedown", (event) => {
      event.preventDefault();
      const startX = event.clientX;
      const startWidth = Number(figure.dataset.width || image.width || 480);
      pushMemoBodyUndoState(elements.memoBody.value);

      const onMove = (moveEvent) => {
        const nextWidth = clamp(startWidth + moveEvent.clientX - startX, 120, 960);
        image.width = nextWidth;
        figure.dataset.width = String(nextWidth);
        const img = figure.querySelector("img");
        if (img) {
          img.style.width = `${nextWidth}px`;
        }
      };

      const onUp = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        updateMemoImageWidth(imageId, image.width || startWidth);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    });
  });
}

function updateMemoImageWidth(imageId, width) {
  const nextWidth = clamp(Math.round(width), 120, 960);
  state.currentMemoImages[imageId].width = nextWidth;
  const pattern = new RegExp(`(!\\[[^\\]]*\\]\\(memo-image:${escapeRegExp(imageId)}#)(\\d+)(\\))`, "g");
  elements.memoBody.value = elements.memoBody.value.replace(pattern, `$1${nextWidth}$3`);
  state.memoBodyHistory.last = elements.memoBody.value;
  state.memoBodyHistory.redo = [];
  renderMemoEditor();
}

function imagesToMap(images) {
  const map = {};
  asArray(images).forEach((image) => {
    if (image?.id && image?.src) {
      map[image.id] = {
        id: image.id,
        src: image.src,
        alt: image.alt || "画像",
        width: image.width || 480
      };
    }
  });
  return map;
}

function createImageId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || min));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");
}

function sanitizeFileName(value) {
  return String(value || "super-memo")
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, "_")
    .slice(0, 80);
}

function getTemplateLabel(template) {
  if (template === "Meeting") {
    return "会議";
  }
  if (template === "Idea") {
    return "アイデア";
  }
  return "ブランク";
}

function normalizeMemo(memo) {
  if (!memo || typeof memo !== "object") {
    return null;
  }
  const id = String(memo.id || memo.title || createUniqueTimestampId(new Date()));
  const body = String(memo.body || "");
  const now = new Date().toISOString();
  return {
    id,
    title: String(memo.title || id),
    displayTitle: String(memo.displayTitle || ""),
    template: memo.template || "Blank",
    properties: {
      created: memo.properties?.created || memo.createdAt || now,
      date: memo.properties?.date || "",
      categories: asArray(memo.properties?.categories),
      people: asArray(memo.properties?.people),
      topics: asArray(memo.properties?.topics),
      tags: asArray(memo.properties?.tags)
    },
    body,
    links: extractLinks(body),
    images: Object.values(imagesToMap(memo.images)),
    archived: Boolean(memo.archived),
    pinned: Boolean(memo.pinned),
    starred: Boolean(memo.starred),
    importance: clampImportance(memo.importance),
    openCount: Number(memo.openCount || 0),
    lastViewedAt: memo.lastViewedAt || "",
    createdAt: memo.createdAt || now,
    updatedAt: memo.updatedAt || now
  };
}

function getExistingMemo(id) {
  return state.memos.find((memo) => memo.id === id);
}

function getMemoDisplayName(memo) {
  return memo?.displayTitle || memo?.title || memo?.id || "無題";
}

function persistMemos() {
  localStorage.setItem(STORAGE_KEYS.memos, JSON.stringify(state.memos));
  scheduleMemoAutoSave();
}

function extractLinks(text) {
  const links = new Set();
  const pattern = /\[\[([^\]]+)\]\]/g;
  let match = pattern.exec(text || "");
  while (match) {
    const value = match[1].trim();
    if (value) {
      links.add(value);
    }
    match = pattern.exec(text || "");
  }
  return [...links];
}

function createTimestampId(date) {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  const hour = pad2(date.getHours());
  const minute = pad2(date.getMinutes());
  return `${year}-${month}-${day} ${hour}${minute}`;
}

function createUniqueTimestampId(date) {
  const base = createTimestampId(date);
  if (!state.memos.some((memo) => memo.id === base || memo.title === base)) {
    return base;
  }

  let index = 2;
  let candidate = `${base}-${index}`;
  while (state.memos.some((memo) => memo.id === candidate || memo.title === candidate)) {
    index += 1;
    candidate = `${base}-${index}`;
  }
  return candidate;
}

function toDateValue(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function parseList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 16);
}

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function createSvgElement(tagName, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

function shorten(value, length) {
  return value.length > length ? `${value.slice(0, length - 1)}...` : value;
}

function showMemoStatus(message, isError = false) {
  elements.memoStatusLine.textContent = message;
  elements.memoStatusLine.classList.toggle("is-error", isError);
}

function renderTextCleaner() {
  elements.cleanerInput.value = state.textCleaner.input || "";
  elements.cleanerOutput.value = state.textCleaner.output || "";
  renderTextStats();
}

function runCleanerAction(action) {
  const source = elements.cleanerInput.value;

  if (!source.trim()) {
    showTextCleanerStatus("入力欄にテキストを貼り付けてください。", true);
    return;
  }

  const result = cleanText(source, action);
  elements.cleanerOutput.value = result;
  state.textCleaner.input = source;
  state.textCleaner.output = result;
  persistTextCleaner();
  renderTextStats();
  showTextCleanerStatus("整形しました。");
}

function cleanText(text, action) {
  if (action === "toMeetingMemo") {
    return buildMemoReadyText(text, "Meeting");
  }

  if (action === "toIdeaMemo") {
    return buildMemoReadyText(text, "Idea");
  }

  if (action === "extractTasks") {
    return extractTaskText(text);
  }

  if (action === "cleanMarkdown") {
    return cleanMarkdownText(text);
  }

  if (action === "trimLines") {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .join("\n");
  }

  if (action === "normalizeSpaces") {
    return text
      .replace(/\t/g, " ")
      .replace(/\u3000/g, " ")
      .split(/\r?\n/)
      .map((line) => line.replace(/ {2,}/g, " ").trim())
      .join("\n");
  }

  if (action === "removeBlankLines") {
    return text
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .join("\n");
  }

  if (action === "toBullets") {
    return text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `- ${line.replace(/^[-*]\s+/, "")}`)
      .join("\n");
  }

  return text;
}

function buildMemoReadyText(text, template) {
  const lines = getCleanTextLines(text);
  const today = toDateValue(new Date());
  const title = guessTextTitle(lines, template);
  const people = extractPeopleFromText(text);
  const topics = extractTopicsFromText(text, template);
  const tags = template === "Meeting" ? ["会議", ...topics.slice(0, 3)] : ["アイデア", ...topics.slice(0, 3)];
  const summary = summarizeTextLines(lines, 3);
  const tasks = extractTaskLines(lines);

  if (template === "Meeting") {
    const decisions = extractDecisionLines(lines);
    const notes = lines
      .filter((line) => !decisions.includes(line) && !tasks.includes(line))
      .slice(0, 12);
    return [
      `タイトル: ${title}`,
      `表示タイトル: ${title}`,
      "種別: Meeting",
      `日付: ${today}`,
      `categories: 会議${topics[0] ? `, ${topics[0]}` : ""}`,
      `people: ${people.join(", ") || "未設定"}`,
      `topics: ${topics.join(", ") || "未設定"}`,
      `tags: ${uniqueList(tags).join(", ")}`,
      `importance: ${tasks.length > 0 || decisions.length > 0 ? 2 : 1}`,
      "",
      "本文:",
      "## 要約",
      formatBulletLines(summary),
      "",
      "## メモ",
      formatBulletLines(notes.length ? notes : lines.slice(0, 8)),
      "",
      "## 決定事項",
      formatBulletLines(decisions, "決定事項は未抽出"),
      "",
      "## 次のアクション",
      formatTaskLines(tasks),
      "",
      "## 関連",
      formatRelatedLinks(topics)
    ].join("\n");
  }

  const ideaCore = lines.slice(0, 4);
  const reasons = extractReasonLines(lines);
  return [
    `タイトル: ${title}`,
    `表示タイトル: ${title}`,
    "種別: Idea",
    `日付: ${today}`,
    `categories: アイデア${topics[0] ? `, ${topics[0]}` : ""}`,
    `people: ${people.join(", ") || "未設定"}`,
    `topics: ${topics.join(", ") || "未設定"}`,
    `tags: ${uniqueList(tags).join(", ")}`,
    `importance: ${tasks.length > 0 || reasons.length > 0 ? 2 : 1}`,
    "",
    "本文:",
    "## 思いつき",
    formatBulletLines(ideaCore),
    "",
    "## なぜ重要か",
    formatBulletLines(reasons.length ? reasons : summary, "重要な理由は未整理"),
    "",
    "## 関連",
    formatRelatedLinks(topics),
    "",
    "## 次の一手",
    formatTaskLines(tasks.length ? tasks : ["15分で試せる最小の検証方法を1つ決める"])
  ].join("\n");
}

function getCleanTextLines(text) {
  return text
    .replace(/\t/g, " ")
    .replace(/\u3000/g, " ")
    .split(/\r?\n/)
    .map((line) => line.replace(/ {2,}/g, " ").trim())
    .map((line) => line.replace(/^[-*・]\s*/, ""))
    .filter(Boolean);
}

function guessTextTitle(lines, template) {
  const fallback = template === "Meeting" ? "会議メモ" : "アイデアメモ";
  const source = lines.find((line) => !/^(日時|日付|参加者|議題|メモ|要約)[:：]/.test(line)) || fallback;
  return shorten(source.replace(/^[#\s]+/, "").replace(/[。.!?！？]$/, ""), 30);
}

function summarizeTextLines(lines, limit) {
  return lines
    .filter((line) => !/^(日時|日付|参加者|people|topics|tags)[:：]/i.test(line))
    .slice(0, limit);
}

function extractPeopleFromText(text) {
  const people = [];
  const labelMatch = text.match(/(?:参加者|出席者|担当|people)[:：]\s*([^\n]+)/i);
  if (labelMatch) {
    people.push(...parseLooseList(labelMatch[1]));
  }
  const suffixMatches = text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}A-Za-z]{2,16}(?:さん|氏|様)/gu) || [];
  people.push(...suffixMatches.map((value) => value.replace(/(さん|氏|様)$/, "")));
  return uniqueList(people).slice(0, 8);
}

function extractTopicsFromText(text, template) {
  const topicMatch = text.match(/(?:議題|テーマ|topics|topic)[:：]\s*([^\n]+)/i);
  const topics = topicMatch ? parseLooseList(topicMatch[1]) : [];
  const keywordSource = getCleanTextLines(text).join(" ");
  const keywordPattern = /[#＃]?([\p{Script=Han}\p{Script=Katakana}A-Za-z0-9][\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}A-Za-z0-9_-]{1,15})/gu;
  const stopWords = new Set(["これ", "それ", "ため", "こと", "もの", "会議", "メモ", "確認", "対応", "今日", "明日", "未定", "アイデア"]);
  let match = keywordPattern.exec(keywordSource);
  while (match && topics.length < 8) {
    const word = match[1];
    if (!stopWords.has(word) && !/^\d+$/.test(word)) {
      topics.push(word);
    }
    match = keywordPattern.exec(keywordSource);
  }
  if (topics.length === 0) {
    topics.push(template === "Meeting" ? "会議" : "アイデア");
  }
  return uniqueList(topics).slice(0, 6);
}

function extractDecisionLines(lines) {
  return lines
    .filter((line) => /(決定|決まった|合意|採用|見送り|承認|方針)/.test(line))
    .slice(0, 8);
}

function extractTaskLines(lines) {
  return lines
    .filter((line) => /(TODO|ToDo|タスク|次|対応|確認|作成|送る|依頼|調査|修正|実装|検討|共有|連絡|期限|担当)/.test(line))
    .slice(0, 12);
}

function extractReasonLines(lines) {
  return lines
    .filter((line) => /(なぜ|理由|重要|課題|問題|困る|価値|効果|収益|検証|リスク|仮説)/.test(line))
    .slice(0, 8);
}

function extractTaskText(text) {
  const lines = getCleanTextLines(text);
  const tasks = extractTaskLines(lines);
  return [
    "## 次のアクション",
    formatTaskLines(tasks.length ? tasks : lines.slice(0, 8))
  ].join("\n");
}

function cleanMarkdownText(text) {
  return getCleanTextLines(text)
    .map((line) => {
      if (/^#{1,6}\s/.test(line) || /^-\s/.test(line) || /^- \[[ xX]\]/.test(line)) {
        return line;
      }
      if (/^(要約|メモ|決定事項|次のアクション|関連|思いつき|なぜ重要か)[:：]?$/.test(line)) {
        return `## ${line.replace(/[:：]$/, "")}`;
      }
      return line;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

function formatBulletLines(lines, emptyText = "未整理") {
  if (!lines.length) {
    return `- ${emptyText}`;
  }
  return lines.map((line) => `- ${line.replace(/^[-*・]\s*/, "")}`).join("\n");
}

function formatTaskLines(lines) {
  if (!lines.length) {
    return "- [ ] 未整理";
  }
  return lines.map((line) => `- [ ] ${line.replace(/^[-*・]\s*/, "").replace(/^TODO[:：]?\s*/i, "")}`).join("\n");
}

function formatRelatedLinks(topics) {
  const related = uniqueList(topics).slice(0, 5);
  if (!related.length) {
    return "- 未設定";
  }
  return related.map((topic) => `- [[${topic}]]`).join("\n");
}

function parseLooseList(value) {
  return String(value || "")
    .split(/[,、，\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueList(items) {
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
}

async function copyCleanerOutput() {
  const output = elements.cleanerOutput.value;

  if (!output.trim()) {
    showTextCleanerStatus("コピーする出力がありません。", true);
    return;
  }

  try {
    await copyText(output);
    showTextCleanerStatus("コピーしました。");
  } catch {
    showTextCleanerStatus("コピーに失敗しました。", true);
  }
}

function clearTextCleaner() {
  elements.cleanerInput.value = "";
  elements.cleanerOutput.value = "";
  state.textCleaner = { input: "", output: "" };
  persistTextCleaner();
  renderTextStats();
  showTextCleanerStatus("クリアしました。");
}

function createDefaultPomodoroState() {
  return {
    mode: "focus",
    durations: {
      focus: TIMER_MODES.focus.minutes,
      short: TIMER_MODES.short.minutes,
      long: TIMER_MODES.long.minutes
    },
    remainingMs: TIMER_MODES.focus.minutes * 60 * 1000,
    running: false,
    startedAt: null,
    loop: false,
    completed: 0
  };
}

function normalizePomodoroState(timer = {}) {
  const mode = TIMER_MODES[timer.mode] ? timer.mode : "focus";
  const durations = normalizeTimerDurations(timer.durations);
  const durationMs = getTimerDurationMs(mode);
  return {
    mode,
    durations,
    remainingMs: clamp(Number(timer.remainingMs || durationMs), 0, durationMs),
    running: Boolean(timer.running),
    startedAt: timer.startedAt || null,
    loop: Boolean(timer.loop),
    completed: Number(timer.completed || 0)
  };
}

function renderPomodoroTimer() {
  state.pomodoro = normalizePomodoroState(state.pomodoro);
  const remainingMs = getPomodoroRemainingMs();
  const mode = TIMER_MODES[state.pomodoro.mode];
  const durationMs = getTimerDurationMs(state.pomodoro.mode);
  const elapsedRatio = durationMs > 0 ? 1 - remainingMs / durationMs : 0;
  const circumference = 2 * Math.PI * 118;

  elements.pomodoroTime.textContent = formatTimerTime(remainingMs);
  elements.pomodoroStatus.textContent = state.pomodoro.running
    ? `${mode.label}${state.pomodoro.loop ? " / Loop" : ""}`
    : `${mode.label} ready${state.pomodoro.loop ? " / Loop" : ""}`;
  elements.pomodoroToggleButton.textContent = state.pomodoro.running ? "一時停止" : "開始";
  elements.pomodoroLoopButton.textContent = state.pomodoro.loop ? "自動ループ ON" : "自動ループ OFF";
  elements.pomodoroLoopButton.classList.toggle("is-active", state.pomodoro.loop);
  elements.pomodoroLoopButton.setAttribute("aria-pressed", String(state.pomodoro.loop));
  elements.pomodoroProgress.style.strokeDasharray = String(circumference);
  elements.pomodoroProgress.style.strokeDashoffset = String(circumference * (1 - elapsedRatio));
  document.querySelector("#view-pomodoro")?.classList.toggle("is-running", state.pomodoro.running);
  elements.pomodoroFocusMinutes.value = state.pomodoro.durations.focus;
  elements.pomodoroShortMinutes.value = state.pomodoro.durations.short;
  elements.pomodoroLongMinutes.value = state.pomodoro.durations.long;
  elements.pomodoroModeButtons.forEach((button) => {
    const active = button.dataset.timerMode === state.pomodoro.mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
    button.textContent = String(state.pomodoro.durations[button.dataset.timerMode] || TIMER_MODES[button.dataset.timerMode]?.minutes || "");
  });

  if (state.pomodoro.running) {
    startPomodoroFrame();
  } else {
    stopPomodoroFrame();
  }
}

function togglePomodoroTimer() {
  state.pomodoro = normalizePomodoroState(state.pomodoro);
  if (state.pomodoro.running) {
    state.pomodoro.remainingMs = getPomodoroRemainingMs();
    state.pomodoro.running = false;
    state.pomodoro.startedAt = null;
  } else {
    state.pomodoro.running = true;
    state.pomodoro.startedAt = new Date().toISOString();
  }
  persistPomodoro();
  renderPomodoroTimer();
}

function togglePomodoroLoop() {
  const timer = normalizePomodoroState(state.pomodoro);
  state.pomodoro = {
    ...timer,
    loop: !timer.loop
  };
  persistPomodoro();
  renderPomodoroTimer();
}

function resetPomodoroTimer() {
  state.pomodoro = {
    ...normalizePomodoroState(state.pomodoro),
    remainingMs: getTimerDurationMs(state.pomodoro.mode),
    running: false,
    startedAt: null
  };
  persistPomodoro();
  renderPomodoroTimer();
}

function setPomodoroMode(mode) {
  if (!TIMER_MODES[mode]) {
    return;
  }
  state.pomodoro = {
    ...normalizePomodoroState(state.pomodoro),
    mode,
    remainingMs: getTimerDurationMs(mode),
    running: false,
    startedAt: null
  };
  persistPomodoro();
  renderPomodoroTimer();
}

function updatePomodoroDuration(mode, value) {
  if (!TIMER_MODES[mode]) {
    return;
  }
  const minutes = clamp(Math.round(Number(value) || TIMER_MODES[mode].minutes), 1, mode === "focus" ? 180 : 120);
  const timer = normalizePomodoroState(state.pomodoro);
  const durations = { ...timer.durations, [mode]: minutes };
  state.pomodoro = {
    ...timer,
    durations,
    remainingMs: timer.mode === mode ? minutes * 60 * 1000 : timer.remainingMs,
    running: timer.mode === mode ? false : timer.running,
    startedAt: timer.mode === mode ? null : timer.startedAt
  };
  persistPomodoro();
  renderPomodoroTimer();
}

function getPomodoroRemainingMs() {
  const timer = normalizePomodoroState(state.pomodoro);
  if (!timer.running || !timer.startedAt) {
    return timer.remainingMs;
  }
  const elapsed = Date.now() - new Date(timer.startedAt).getTime();
  return clamp(timer.remainingMs - elapsed, 0, getTimerDurationMs(timer.mode));
}

function startPomodoroFrame() {
  if (pomodoroFrame) {
    return;
  }
  const tick = () => {
    const remainingMs = getPomodoroRemainingMs();
    if (remainingMs <= 0) {
      completePomodoroCycle();
      return;
    }
    renderPomodoroTimer();
    pomodoroFrame = requestAnimationFrame(tick);
  };
  pomodoroFrame = requestAnimationFrame(tick);
}

function stopPomodoroFrame() {
  if (!pomodoroFrame) {
    return;
  }
  cancelAnimationFrame(pomodoroFrame);
  pomodoroFrame = null;
}

function completePomodoroCycle() {
  stopPomodoroFrame();
  const timer = normalizePomodoroState(state.pomodoro);
  const currentMode = timer.mode;
  const completed = currentMode === "focus" ? timer.completed + 1 : timer.completed;
  const nextMode = timer.loop
    ? (currentMode === "focus" ? "short" : "focus")
    : (currentMode === "focus"
      ? (completed > 0 && completed % 4 === 0 ? "long" : "short")
      : "focus");
  state.pomodoro = {
    mode: nextMode,
    durations: timer.durations,
    remainingMs: getTimerDurationMs(nextMode),
    running: timer.loop,
    startedAt: timer.loop ? new Date().toISOString() : null,
    loop: timer.loop,
    completed
  };
  persistPomodoro();
  renderPomodoroTimer();
}

function getTimerDurationMs(mode) {
  const durations = normalizeTimerDurations(state?.pomodoro?.durations);
  return (durations[mode] || TIMER_MODES[mode]?.minutes || TIMER_MODES.focus.minutes) * 60 * 1000;
}

function normalizeTimerDurations(durations = {}) {
  return {
    focus: clamp(Math.round(Number(durations.focus) || TIMER_MODES.focus.minutes), 1, 180),
    short: clamp(Math.round(Number(durations.short) || TIMER_MODES.short.minutes), 1, 120),
    long: clamp(Math.round(Number(durations.long) || TIMER_MODES.long.minutes), 1, 120)
  };
}

function formatTimerTime(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderTimezoneTool() {
  state.timezones = normalizeTimezoneIds(state.timezones);
  renderTimezoneSelect();
  renderTimezoneCards();
  startTimezoneClock();
}

function renderTimezoneSelect() {
  const currentIds = new Set(state.timezones);
  elements.timezoneSelect.replaceChildren();
  timezoneCatalog.forEach((zone) => {
    const option = document.createElement("option");
    option.value = zone.id;
    option.textContent = `${zone.label} / ${zone.zone}`;
    option.disabled = currentIds.has(zone.id);
    elements.timezoneSelect.append(option);
  });
  const firstAvailable = timezoneCatalog.find((zone) => !currentIds.has(zone.id));
  elements.timezoneSelect.value = firstAvailable?.id || timezoneCatalog[0]?.id || "";
  elements.timezoneAddButton.disabled = !firstAvailable;
}

function renderTimezoneCards() {
  elements.timezoneList.replaceChildren();
  const zones = state.timezones
    .map((id) => timezoneCatalog.find((zone) => zone.id === id))
    .filter(Boolean);

  zones.forEach((zone) => {
    const card = document.createElement("article");
    card.className = "timezone-card";
    card.dataset.timezoneId = zone.id;
    card.dataset.timezoneZone = zone.zone;

    const remove = document.createElement("button");
    remove.className = "timezone-remove";
    remove.type = "button";
    remove.textContent = "x";
    remove.setAttribute("aria-label", `${zone.label}を削除`);
    remove.addEventListener("click", () => removeTimezone(zone.id));

    const label = document.createElement("span");
    label.className = "timezone-label";
    label.textContent = zone.label;

    const time = document.createElement("strong");
    time.className = "timezone-time";
    time.textContent = "--:--";

    const meta = document.createElement("span");
    meta.className = "timezone-meta";
    meta.textContent = zone.zone;

    const date = document.createElement("span");
    date.className = "timezone-date";

    card.append(remove, label, time, meta, date);
    elements.timezoneList.append(card);
  });

  updateTimezoneClocks();
}

function updateTimezoneClocks() {
  const now = new Date();
  elements.timezoneList.querySelectorAll(".timezone-card").forEach((card) => {
    const zone = card.dataset.timezoneZone;
    const time = card.querySelector(".timezone-time");
    const date = card.querySelector(".timezone-date");
    const meta = card.querySelector(".timezone-meta");
    time.textContent = formatZonedTime(now, zone);
    date.textContent = formatZonedDate(now, zone);
    meta.textContent = `${zone} / ${formatZonedOffset(now, zone)}`;
  });
}

function startTimezoneClock() {
  if (timezoneClockFrame) {
    return;
  }
  const tick = () => {
    updateTimezoneClocks();
    timezoneClockFrame = window.setTimeout(tick, 1000);
  };
  timezoneClockFrame = window.setTimeout(tick, 1000);
}

function addSelectedTimezone() {
  const id = elements.timezoneSelect.value;
  if (!id || state.timezones.includes(id)) {
    return;
  }
  state.timezones = normalizeTimezoneIds([...state.timezones, id]);
  persistTimezones();
  renderTimezoneTool();
}

function removeTimezone(id) {
  state.timezones = normalizeTimezoneIds(state.timezones.filter((item) => item !== id));
  persistTimezones();
  renderTimezoneTool();
}

function normalizeTimezoneIds(ids) {
  const known = new Set(timezoneCatalog.map((zone) => zone.id));
  const normalized = Array.isArray(ids)
    ? ids.filter((id) => known.has(id))
    : [];
  const unique = [...new Set(normalized)];
  return unique.length > 0 ? unique : [...defaultTimezoneIds];
}

function renderSubscriptionTool() {
  state.subscriptions = normalizeSubscriptions(state.subscriptions);
  renderSubscriptionTemplates();
  if (!elements.subscriptionRegisteredAt.value) {
    elements.subscriptionRegisteredAt.value = getCurrentDateValue();
  }
  renderSubscriptionSummary();
  renderSubscriptionList();
}

function renderSubscriptionTemplates() {
  const currentValue = elements.subscriptionTemplate.value;
  elements.subscriptionTemplate.replaceChildren();
  const custom = document.createElement("option");
  custom.value = "";
  custom.textContent = "手入力";
  elements.subscriptionTemplate.append(custom);

  subscriptionTemplates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.name;
    elements.subscriptionTemplate.append(option);
  });
  elements.subscriptionTemplate.value = subscriptionTemplates.some((template) => template.id === currentValue)
    ? currentValue
    : "";
}

function renderSubscriptionSummary() {
  const yearlyTotal = state.subscriptions.reduce((sum, item) => sum + getSubscriptionYearlyCost(item), 0);
  elements.subscriptionMonthlyTotal.textContent = formatYen(Math.round(yearlyTotal / 12));
  elements.subscriptionYearlyTotal.textContent = formatYen(yearlyTotal);
}

function renderSubscriptionList() {
  elements.subscriptionList.replaceChildren();
  const sorted = [...state.subscriptions].sort(compareSubscriptionsByNextRenewal);

  if (sorted.length === 0) {
    const empty = document.createElement("div");
    empty.className = "subscription-empty";
    empty.textContent = "契約中のサービスを追加すると、登録日から次回更新日を計算して近い順に並べます。";
    elements.subscriptionList.append(empty);
    return;
  }

  sorted.forEach((subscription) => {
    const card = document.createElement("article");
    card.className = "subscription-card";
    const daysUntilRenewal = getDaysUntilNextRenewal(subscription);
    if (daysUntilRenewal <= 7) {
      card.classList.add("is-current");
    } else if (daysUntilRenewal <= 30) {
      card.classList.add("is-next");
    }

    const icon = document.createElement("span");
    icon.className = "subscription-icon";
    icon.textContent = subscription.icon;
    icon.style.setProperty("--subscription-icon-color", subscription.color);
    if (subscription.logoUrl) {
      icon.classList.add("has-logo");
      const logo = document.createElement("img");
      logo.src = subscription.logoUrl;
      logo.alt = "";
      logo.loading = "lazy";
      logo.addEventListener("error", () => {
        logo.remove();
        icon.classList.remove("has-logo");
      });
      icon.append(logo);
    }

    const title = document.createElement("div");
    title.className = "subscription-title";
    const name = document.createElement("strong");
    name.textContent = subscription.name;
    const badge = document.createElement("span");
    badge.textContent = getRenewalBadge(subscription);
    title.append(name, badge);

    const price = document.createElement("div");
    price.className = "subscription-price";
    price.textContent = `${formatYen(subscription.amount)} / ${getBillingCycleLabel(subscription.billingCycle)}`;

    const renewal = document.createElement("div");
    renewal.className = "subscription-renewal";
    const debitText = subscription.debitDay ? ` / 引落日 毎月${subscription.debitDay}日` : "";
    renewal.textContent = `登録日 ${formatDateJa(subscription.registeredAt)} / 次回 ${formatDateJa(getNextRenewalDate(subscription))}${debitText}`;

    const remove = document.createElement("button");
    remove.className = "subscription-remove";
    remove.type = "button";
    remove.textContent = "削除";
    remove.addEventListener("click", () => removeSubscription(subscription.id));

    card.append(icon, title, price, renewal, remove);
    elements.subscriptionList.append(card);
  });
}

function addSubscription(event) {
  event.preventDefault();
  const name = elements.subscriptionName.value.trim();
  const amount = Math.max(0, Math.round(Number(elements.subscriptionPrice.value)));
  const billingCycle = elements.subscriptionBillingCycle.value === "yearly" ? "yearly" : "monthly";
  const registeredAt = elements.subscriptionRegisteredAt.value;
  const debitDay = normalizeDebitDay(elements.subscriptionDebitDay.value);
  const template = getSubscriptionTemplate(elements.subscriptionTemplate.value);

  if (!name || !Number.isFinite(amount) || !isDateValue(registeredAt)) {
    showSubscriptionStatus("サービス名、料金、登録日を入力してください。", true);
    return;
  }

  const now = new Date().toISOString();
  state.subscriptions = normalizeSubscriptions([
    ...state.subscriptions,
    {
      id: createSubscriptionId(),
      name,
      amount,
      billingCycle,
      registeredAt,
      templateId: template?.id || "",
      icon: template?.icon || createSubscriptionInitials(name),
      color: template?.color || "#8feeff",
      logoUrl: template?.logoSlug ? createSubscriptionLogoUrl(template.logoSlug) : "",
      debitDay,
      createdAt: now,
      updatedAt: now
    }
  ]);
  persistSubscriptions();
  renderSubscriptionTool();
  elements.subscriptionForm.reset();
  elements.subscriptionTemplate.value = "";
  elements.subscriptionBillingCycle.value = "monthly";
  showSubscriptionStatus("追加しました。");
}

function removeSubscription(id) {
  state.subscriptions = state.subscriptions.filter((subscription) => subscription.id !== id);
  persistSubscriptions();
  renderSubscriptionTool();
  showSubscriptionStatus("削除しました。");
}

function normalizeSubscriptions(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => {
      const name = String(item?.name || "").trim();
      if (!name) {
        return null;
      }
      const template = getSubscriptionTemplate(item.templateId) || getSubscriptionTemplateByName(name);
      const amountSource = item.amount ?? item.monthlyPrice ?? item.price ?? 0;
      const amount = Math.max(0, Math.round(Number(amountSource)));
      const billingCycle = item.billingCycle === "yearly" ? "yearly" : "monthly";
      const registeredAt = isDateValue(item.registeredAt)
        ? item.registeredAt
        : renewalMonthToDate(item.renewalMonth);
      const logoSlug = item.logoSlug || template?.logoSlug || "";
      return {
        id: String(item.id || createSubscriptionId()),
        name,
        amount: Number.isFinite(amount) ? amount : 0,
        billingCycle,
        registeredAt,
        templateId: item.templateId || template?.id || "",
        icon: item.icon || template?.icon || createSubscriptionInitials(name),
        color: item.color || template?.color || "#8feeff",
        logoUrl: item.logoUrl || (logoSlug ? createSubscriptionLogoUrl(logoSlug) : ""),
        debitDay: normalizeDebitDay(item.debitDay),
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: item.updatedAt || item.createdAt || new Date().toISOString()
      };
    })
    .filter(Boolean);
}

function compareSubscriptionsByNextRenewal(a, b) {
  const diff = getNextRenewalDate(a).getTime() - getNextRenewalDate(b).getTime();
  if (diff !== 0) {
    return diff;
  }
  return a.name.localeCompare(b.name, "ja");
}

function getRenewalBadge(subscription) {
  const days = getDaysUntilNextRenewal(subscription);
  if (days === 0) {
    return "今日更新";
  }
  if (days <= 7) {
    return `${days}日後`;
  }
  if (days <= 30) {
    return `${days}日後`;
  }
  const months = Math.max(1, Math.round(days / 30));
  return `${months}か月後`;
}

function getDaysUntilNextRenewal(subscription) {
  const today = startOfDay(new Date());
  const renewalDate = getNextRenewalDate(subscription);
  return Math.max(0, Math.ceil((renewalDate.getTime() - today.getTime()) / 86400000));
}

function getNextRenewalDate(subscription) {
  const base = parseDateValue(subscription.registeredAt);
  if (!base) {
    return startOfDay(new Date());
  }

  const today = startOfDay(new Date());
  const interval = subscription.billingCycle === "yearly" ? 12 : 1;
  let monthsToAdd = interval;
  let next = addMonthsClamped(base, monthsToAdd);
  while (next < today) {
    monthsToAdd += interval;
    next = addMonthsClamped(base, monthsToAdd);
  }
  return next;
}

function addMonthsClamped(date, months) {
  const year = date.getFullYear();
  const month = date.getMonth() + months;
  const day = date.getDate();
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, lastDay));
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getSubscriptionYearlyCost(subscription) {
  return subscription.billingCycle === "yearly"
    ? subscription.amount
    : subscription.amount * 12;
}

function getBillingCycleLabel(billingCycle) {
  return billingCycle === "yearly" ? "年額" : "月額";
}

function applySubscriptionTemplate() {
  const template = getSubscriptionTemplate(elements.subscriptionTemplate.value);
  if (!template) {
    return;
  }
  elements.subscriptionName.value = template.name;
}

function getSubscriptionTemplate(id) {
  return subscriptionTemplates.find((template) => template.id === id) || null;
}

function getSubscriptionTemplateByName(name) {
  const normalized = String(name || "").toLowerCase();
  return subscriptionTemplates.find((template) => template.name.toLowerCase() === normalized) || null;
}

function createSubscriptionInitials(name) {
  return String(name || "?").trim().slice(0, 2).toUpperCase() || "?";
}

function createSubscriptionLogoUrl(slug) {
  return `https://cdn.simpleicons.org/${encodeURIComponent(slug)}`;
}

function normalizeDebitDay(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }
  const day = Math.round(Number(value));
  return Number.isFinite(day) && day >= 1 && day <= 31 ? day : null;
}

function formatDateJa(value) {
  const date = value instanceof Date ? value : parseDateValue(value);
  if (!date) {
    return "未設定";
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function formatYen(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0
  }).format(value);
}

function isDateValue(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || "")) && Boolean(parseDateValue(value));
}

function parseDateValue(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ""))) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null;
  }
  return date;
}

function renewalMonthToDate(value) {
  if (/^\d{4}-\d{2}$/.test(String(value || ""))) {
    return `${value}-01`;
  }
  return getCurrentDateValue();
}

function getCurrentDateValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function createSubscriptionId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }
  return `subscription-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function showSubscriptionStatus(message, isError = false) {
  elements.subscriptionStatus.textContent = message;
  elements.subscriptionStatus.classList.toggle("is-error", isError);
}

function renderBookmarkTool() {
  state.bookmarks = normalizeBookmarks(state.bookmarks);
  state.bookmarkFolders = normalizeBookmarkFolders(state.bookmarkFolders, state.bookmarks);
  persistBookmarkFolders();
  syncSelectedBookmarks();
  renderBookmarkFolders();
  renderBookmarkList();
}

function renderBookmarkFolders() {
  const currentValue = state.bookmarkFolder;
  const editFolderValue = elements.bookmarkEditFolder.value;
  const folders = state.bookmarkFolders;
  elements.bookmarkFolderFilter.replaceChildren();
  elements.bookmarkFolderField.replaceChildren();
  elements.bookmarkEditFolder.replaceChildren();
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "トップ（未分類）";
  elements.bookmarkFolderFilter.append(all);
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "フォルダなし";
  elements.bookmarkFolderField.append(none);
  elements.bookmarkEditFolder.append(none.cloneNode(true));
  folders.forEach((folder) => {
    const option = document.createElement("option");
    option.value = folder.name;
    option.textContent = folder.name;
    elements.bookmarkFolderFilter.append(option);
    elements.bookmarkFolderField.append(option.cloneNode(true));
    elements.bookmarkEditFolder.append(option.cloneNode(true));
  });
  elements.bookmarkFolderFilter.value = folders.some((folder) => folder.name === currentValue) ? currentValue : "";
  elements.bookmarkEditFolder.value = folders.some((folder) => folder.name === editFolderValue) ? editFolderValue : "";
  state.bookmarkFolder = elements.bookmarkFolderFilter.value;
  renderBookmarkFolderChips();
}

function renderBookmarkFolderChips() {
  elements.bookmarkFolderList.replaceChildren();
  state.bookmarkFolders.forEach((folder) => {
    const card = document.createElement("article");
    card.className = "bookmark-folder-card";
    card.classList.toggle("is-active", state.bookmarkFolder === folder.name);
    card.style.setProperty("--bookmark-folder-color", folder.color);

    const open = document.createElement("button");
    open.className = "bookmark-folder-open";
    open.type = "button";
    open.addEventListener("click", () => openBookmarkFolder(folder.name));

    const icon = document.createElement("span");
    icon.className = "bookmark-folder-icon";
    icon.setAttribute("aria-hidden", "true");

    const copy = document.createElement("span");
    copy.className = "bookmark-folder-copy";
    const name = document.createElement("strong");
    name.textContent = folder.name;
    const count = document.createElement("small");
    count.textContent = `${getBookmarkCountByFolder(folder.name)}件`;
    copy.append(name, count);

    const swatch = document.createElement("input");
    swatch.type = "color";
    swatch.value = folder.color;
    swatch.setAttribute("aria-label", `${folder.name}の色を変更`);
    swatch.addEventListener("click", (event) => event.stopPropagation());
    swatch.addEventListener("change", (event) => {
      event.stopPropagation();
      updateBookmarkFolderColor(folder.id, swatch.value);
    });

    open.append(icon, copy);
    card.append(open, swatch);
    elements.bookmarkFolderList.append(card);
  });
}

function renderBookmarkList() {
  elements.bookmarkList.replaceChildren();
  elements.bookmarkList.classList.toggle("is-delete-mode", state.bookmarkDeleteMode);
  elements.bookmarkDeleteModeButton.classList.toggle("is-active", state.bookmarkDeleteMode);
  elements.bookmarkDeleteModeButton.setAttribute("aria-pressed", String(state.bookmarkDeleteMode));
  elements.bookmarkDeleteSelectedButton.hidden = !state.bookmarkDeleteMode;
  elements.bookmarkDeleteSelectedButton.disabled = state.selectedBookmarkIds.size === 0;
  elements.bookmarkDeleteSelectedButton.textContent = state.selectedBookmarkIds.size > 0
    ? `削除 (${state.selectedBookmarkIds.size})`
    : "削除";
  const query = state.bookmarkQuery;
  const folder = state.bookmarkFolder;
  const bookmarks = state.bookmarks
    .filter((bookmark) => folder ? bookmark.folder === folder : !bookmark.folder)
    .filter((bookmark) => {
      if (!query) {
        return true;
      }
      return [bookmark.title, bookmark.url, bookmark.folder, bookmark.host]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });

  if (bookmarks.length === 0) {
    const empty = document.createElement("div");
    empty.className = "bookmark-empty";
    empty.textContent = folder
      ? "このフォルダにはまだブックマークがありません。"
      : "未分類のブックマークはありません。フォルダをクリックすると中身を表示できます。";
    elements.bookmarkList.append(empty);
    return;
  }

  bookmarks.forEach((bookmark) => {
    const card = document.createElement("article");
    card.className = "bookmark-card";
    card.tabIndex = state.bookmarkDeleteMode ? -1 : 0;
    if (!state.bookmarkDeleteMode) {
      card.addEventListener("click", () => openBookmark(bookmark.url));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openBookmark(bookmark.url);
        }
      });
    }

    const selector = document.createElement("label");
    selector.className = "bookmark-select";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = state.selectedBookmarkIds.has(bookmark.id);
    checkbox.setAttribute("aria-label", `${bookmark.title}を削除対象にする`);
    checkbox.addEventListener("change", () => toggleBookmarkSelection(bookmark.id, checkbox.checked));
    selector.append(checkbox);

    const favicon = document.createElement("span");
    favicon.className = "bookmark-favicon";
    const img = document.createElement("img");
    img.src = `https://www.google.com/s2/favicons?sz=64&domain_url=${encodeURIComponent(bookmark.url)}`;
    img.alt = "";
    img.loading = "lazy";
    img.addEventListener("error", () => img.remove());
    favicon.textContent = bookmark.title.slice(0, 1).toUpperCase();
    favicon.append(img);

    const body = document.createElement("div");
    body.className = "bookmark-card-body";
    const link = document.createElement("a");
    link.href = bookmark.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = bookmark.title;
    link.addEventListener("click", (event) => event.stopPropagation());
    const meta = document.createElement("span");
    meta.textContent = bookmark.folder ? `${bookmark.folder} / ${bookmark.host}` : bookmark.host;
    const folderInfo = getBookmarkFolder(bookmark.folder);
    if (folderInfo) {
      meta.classList.add("has-folder-color");
      meta.style.setProperty("--bookmark-folder-color", folderInfo.color);
    }
    body.append(link, meta);

    const menu = document.createElement("button");
    menu.className = "bookmark-menu-button";
    menu.type = "button";
    menu.textContent = "⋯";
    menu.setAttribute("aria-label", `${bookmark.title}を編集`);
    menu.addEventListener("click", (event) => {
      event.stopPropagation();
      startBookmarkEdit(bookmark.id);
    });

    card.append(selector, favicon, body, menu);
    elements.bookmarkList.append(card);
  });
}

async function importBookmarkFile() {
  const file = elements.bookmarkImportFile.files?.[0];
  if (!file) {
    return;
  }

  try {
    const text = await file.text();
    const imported = file.name.toLowerCase().endsWith(".json")
      ? parseBookmarkJson(text)
      : parseBookmarkHtml(text);
    if (imported.length === 0) {
      showBookmarkStatus("読み込めるブックマークが見つかりませんでした。", true);
      return;
    }
    const existing = new Map(state.bookmarks.map((bookmark) => [bookmark.url, bookmark]));
    imported.forEach((bookmark) => existing.set(bookmark.url, bookmark));
    state.bookmarks = normalizeBookmarks([...existing.values()]);
    persistBookmarks();
    renderBookmarkTool();
    showBookmarkStatus(`${imported.length}件を読み込みました。`);
  } catch (error) {
    showBookmarkStatus("ブックマークの読み込みに失敗しました。", true);
  } finally {
    elements.bookmarkImportFile.value = "";
  }
}

function parseBookmarkHtml(text) {
  const doc = new DOMParser().parseFromString(text, "text/html");
  return [...doc.querySelectorAll("a[href]")]
    .map((link) => createBookmark({
      title: link.textContent.trim() || link.href,
      url: link.href,
      folder: findBookmarkFolder(link)
    }))
    .filter(Boolean);
}

function parseBookmarkJson(text) {
  const data = JSON.parse(text);
  const found = [];
  const visit = (node, folder = "") => {
    if (Array.isArray(node)) {
      node.forEach((item) => visit(item, folder));
      return;
    }
    if (!node || typeof node !== "object") {
      return;
    }
    const nextFolder = node.name && node.children ? String(node.name) : folder;
    if (node.url) {
      const bookmark = createBookmark({
        title: node.name || node.title || node.url,
        url: node.url,
        folder
      });
      if (bookmark) {
        found.push(bookmark);
      }
    }
    if (node.children) {
      visit(node.children, nextFolder);
    }
    if (node.roots) {
      visit(Object.values(node.roots), folder);
    }
  };
  visit(data);
  return found;
}

function findBookmarkFolder(link) {
  let current = link.parentElement;
  while (current) {
    const heading = current.previousElementSibling;
    if (heading && /^H[1-6]$/.test(heading.tagName)) {
      return heading.textContent.trim();
    }
    current = current.parentElement;
  }
  return "";
}

function addBookmark(event) {
  event.preventDefault();
  const bookmark = createBookmark({
    title: elements.bookmarkTitle.value,
    url: elements.bookmarkUrl.value,
    folder: elements.bookmarkFolderField.value
  });
  if (!bookmark) {
    showBookmarkStatus("タイトルと有効なURLを入力してください。", true);
    return;
  }
  state.bookmarks = normalizeBookmarks([bookmark, ...state.bookmarks.filter((item) => item.url !== bookmark.url)]);
  persistBookmarks();
  renderBookmarkTool();
  elements.bookmarkForm.reset();
  showBookmarkStatus("追加しました。");
}

function startBookmarkEdit(id) {
  const bookmark = state.bookmarks.find((item) => item.id === id);
  if (!bookmark) {
    return;
  }
  state.editingBookmarkId = id;
  state.bookmarkDeleteMode = false;
  state.selectedBookmarkIds.clear();
  elements.bookmarkEditTitle.value = bookmark.title;
  elements.bookmarkEditUrl.value = bookmark.url;
  elements.bookmarkEditFolder.value = bookmark.folder;
  elements.bookmarkEditModal.hidden = false;
  elements.bookmarkEditTitle.focus();
  renderBookmarkList();
}

function cancelBookmarkEdit() {
  state.editingBookmarkId = null;
  elements.bookmarkEditModal.hidden = true;
  elements.bookmarkEditForm.reset();
  renderBookmarkList();
}

function saveBookmarkEdit(event) {
  event.preventDefault();
  const id = state.editingBookmarkId;
  const edited = createBookmark({
    id,
    title: elements.bookmarkEditTitle.value,
    url: elements.bookmarkEditUrl.value,
    folder: elements.bookmarkEditFolder.value,
    createdAt: state.bookmarks.find((bookmark) => bookmark.id === id)?.createdAt
  });
  if (!edited) {
    showBookmarkStatus("ブックマーク名と有効なURLを入力してください。", true);
    return;
  }
  state.bookmarks = normalizeBookmarks(state.bookmarks.map((bookmark) => (
    bookmark.id === id ? edited : bookmark
  )));
  state.editingBookmarkId = null;
  elements.bookmarkEditModal.hidden = true;
  elements.bookmarkEditForm.reset();
  persistBookmarks();
  renderBookmarkTool();
  showBookmarkStatus("更新しました。");
}

function removeBookmark(id) {
  state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id);
  state.selectedBookmarkIds.delete(id);
  persistBookmarks();
  renderBookmarkTool();
  showBookmarkStatus("削除しました。");
}

function toggleBookmarkDeleteMode() {
  state.bookmarkDeleteMode = !state.bookmarkDeleteMode;
  if (!state.bookmarkDeleteMode) {
    state.selectedBookmarkIds.clear();
  }
  renderBookmarkList();
}

function toggleBookmarkSelection(id, selected) {
  if (selected) {
    state.selectedBookmarkIds.add(id);
  } else {
    state.selectedBookmarkIds.delete(id);
  }
  renderBookmarkList();
}

function deleteSelectedBookmarks() {
  if (state.selectedBookmarkIds.size === 0) {
    showBookmarkStatus("削除するブックマークを選択してください。", true);
    return;
  }
  const count = state.selectedBookmarkIds.size;
  state.bookmarks = state.bookmarks.filter((bookmark) => !state.selectedBookmarkIds.has(bookmark.id));
  state.selectedBookmarkIds.clear();
  state.bookmarkDeleteMode = false;
  persistBookmarks();
  renderBookmarkTool();
  showBookmarkStatus(`${count}件のブックマークを削除しました。`);
}

function syncSelectedBookmarks() {
  const existingIds = new Set(state.bookmarks.map((bookmark) => bookmark.id));
  state.selectedBookmarkIds.forEach((id) => {
    if (!existingIds.has(id)) {
      state.selectedBookmarkIds.delete(id);
    }
  });
}

function openBookmark(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function addBookmarkFolder(event) {
  event.preventDefault();
  const name = elements.bookmarkFolderName.value.trim();
  if (!name) {
    showBookmarkStatus("フォルダ名を入力してください。", true);
    return;
  }
  const existing = state.bookmarkFolders.find((folder) => folder.name === name);
  if (existing) {
    showBookmarkStatus("同じ名前のフォルダがあります。", true);
    return;
  }
  state.bookmarkFolders = normalizeBookmarkFolders([
    ...state.bookmarkFolders,
    {
      id: createBookmarkFolderId(name),
      name,
      color: normalizeColor(elements.bookmarkFolderColor.value)
    }
  ], state.bookmarks);
  persistBookmarkFolders();
  renderBookmarkFolders();
  elements.bookmarkFolderName.value = "";
  elements.bookmarkFolderColor.value = "#8feeff";
  showBookmarkStatus("フォルダを作成しました。");
}

function updateBookmarkFolderColor(id, color) {
  state.bookmarkFolders = state.bookmarkFolders.map((folder) => (
    folder.id === id ? { ...folder, color: normalizeColor(color) } : folder
  ));
  persistBookmarkFolders();
  renderBookmarkTool();
}

function openBookmarkFolder(name) {
  state.bookmarkFolder = name;
  elements.bookmarkFolderFilter.value = name;
  renderBookmarkFolders();
  renderBookmarkList();
}

function getBookmarkCountByFolder(name) {
  return state.bookmarks.filter((bookmark) => bookmark.folder === name).length;
}

function normalizeBookmarks(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(createBookmark).filter(Boolean);
}

function normalizeBookmarkFolders(folders, bookmarks) {
  const byName = new Map();
  if (Array.isArray(folders)) {
    folders.forEach((folder) => {
      const name = String(folder?.name || "").trim();
      if (!name || byName.has(name)) {
        return;
      }
      byName.set(name, {
        id: String(folder.id || createBookmarkFolderId(name)),
        name,
        color: normalizeColor(folder.color)
      });
    });
  }
  bookmarks.forEach((bookmark) => {
    const name = String(bookmark.folder || "").trim();
    if (name && !byName.has(name)) {
      byName.set(name, {
        id: createBookmarkFolderId(name),
        name,
        color: getDefaultFolderColor(byName.size)
      });
    }
  });
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "ja"));
}

function getBookmarkFolder(name) {
  return state.bookmarkFolders.find((folder) => folder.name === name) || null;
}

function createBookmarkFolderId(name) {
  return `folder-${btoa(unescape(encodeURIComponent(name))).replace(/=+$/g, "").slice(0, 24)}`;
}

function normalizeColor(value) {
  return /^#[0-9a-f]{6}$/i.test(String(value || "")) ? value : "#8feeff";
}

function getDefaultFolderColor(index) {
  const colors = ["#8feeff", "#d6ff5d", "#ff6b9a", "#b98cff", "#5fffc5", "#ffd166"];
  return colors[index % colors.length];
}

function createBookmark(item) {
  const title = String(item?.title || item?.name || "").trim();
  const url = normalizeBookmarkUrl(item?.url);
  if (!title || !url) {
    return null;
  }
  return {
    id: String(item.id || createBookmarkId(url)),
    title,
    url,
    folder: String(item.folder || "").trim(),
    host: getBookmarkHost(url),
    createdAt: item.createdAt || new Date().toISOString()
  };
}

function normalizeBookmarkUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : "";
  } catch (error) {
    return "";
  }
}

function getBookmarkHost(url) {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch (error) {
    return "";
  }
}

function createBookmarkId(url) {
  return `bookmark-${btoa(unescape(encodeURIComponent(url))).replace(/=+$/g, "").slice(0, 24)}`;
}

function showBookmarkStatus(message, isError = false) {
  elements.bookmarkStatus.textContent = message;
  elements.bookmarkStatus.classList.toggle("is-error", isError);
}

function renderCalculator() {
  state.calculator = normalizeCalculatorState(state.calculator);
  const expression = state.calculator.expression || "";
  elements.calculatorExpression.textContent = expression || "0";
  elements.calculatorDisplay.textContent = state.calculator.result || "0";
  elements.calculatorHistory.replaceChildren();

  if (state.calculator.history.length === 0) {
    const empty = document.createElement("div");
    empty.className = "calculator-history-empty";
    empty.textContent = "まだ計算履歴はありません。";
    elements.calculatorHistory.append(empty);
    return;
  }

  state.calculator.history.forEach((entry) => {
    const row = document.createElement("button");
    row.className = "calculator-history-row";
    row.type = "button";
    row.addEventListener("click", () => {
      state.calculator.expression = entry.expression;
      state.calculator.result = entry.result;
      persistCalculator();
      renderCalculator();
    });

    const expressionText = document.createElement("span");
    expressionText.textContent = entry.expression;
    const resultText = document.createElement("strong");
    resultText.textContent = entry.result;
    row.append(expressionText, resultText);
    elements.calculatorHistory.append(row);
  });
}

function handleCalculatorButton(button) {
  const action = button.dataset.calcAction;
  if (action === "clear") {
    state.calculator.expression = "";
    state.calculator.result = "0";
    showCalculatorStatus("");
  } else if (action === "backspace") {
    state.calculator.expression = state.calculator.expression.slice(0, -1);
    showCalculatorStatus("");
  } else if (action === "equals") {
    evaluateCalculator();
    renderCalculator();
    return;
  } else {
    appendCalculatorValue(button.dataset.calcValue);
  }

  persistCalculator();
  renderCalculator();
}

function appendCalculatorValue(value) {
  if (!value) {
    return;
  }
  const operators = ["+", "−", "×", "÷"];
  const expression = state.calculator.expression;
  const last = expression.slice(-1);

  if (operators.includes(value) && (!expression || operators.includes(last))) {
    state.calculator.expression = expression ? `${expression.slice(0, -1)}${value}` : "";
    return;
  }

  if (value === "." && getCalculatorCurrentNumber(expression).includes(".")) {
    return;
  }

  state.calculator.expression = `${expression}${value}`;
  showCalculatorStatus("");
}

function evaluateCalculator() {
  const expression = state.calculator.expression.trim();
  if (!expression) {
    state.calculator.result = "0";
    showCalculatorStatus("");
    persistCalculator();
    return;
  }

  try {
    const result = calculateExpression(expression);
    state.calculator.result = formatCalculatorResult(result);
    state.calculator.history = [
      { expression, result: state.calculator.result, createdAt: new Date().toISOString() },
      ...state.calculator.history.filter((entry) => entry.expression !== expression)
    ].slice(0, 12);
    showCalculatorStatus("計算しました。");
  } catch (error) {
    showCalculatorStatus("計算式を確認してください。", true);
  }
  persistCalculator();
}

function calculateExpression(expression) {
  const normalized = expression
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");

  if (!/^[\d+\-*/().\s%]+$/.test(normalized)) {
    throw new Error("Invalid expression");
  }

  const result = Function(`"use strict"; return (${normalized})`)();
  if (!Number.isFinite(result)) {
    throw new Error("Invalid result");
  }
  return result;
}

function formatCalculatorResult(value) {
  const rounded = Math.round((value + Number.EPSILON) * 100000000) / 100000000;
  return new Intl.NumberFormat("ja-JP", {
    maximumFractionDigits: 8
  }).format(rounded);
}

function getCalculatorCurrentNumber(expression) {
  const parts = expression.split(/[+−×÷()]/);
  return parts[parts.length - 1] || "";
}

function handleCalculatorKeydown(event) {
  const visible = document.querySelector("#view-calculator.is-visible");
  if (!visible || event.ctrlKey || event.metaKey || event.altKey) {
    return;
  }
  if (document.activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) {
    return;
  }

  const keyMap = {
    "*": "×",
    "/": "÷",
    "-": "−",
    Enter: "=",
    Escape: "clear",
    Backspace: "backspace"
  };
  const value = /^[0-9+().%]$/.test(event.key) ? event.key : keyMap[event.key];
  if (!value) {
    return;
  }
  event.preventDefault();
  if (value === "=") {
    evaluateCalculator();
  } else if (value === "clear") {
    state.calculator.expression = "";
    state.calculator.result = "0";
  } else if (value === "backspace") {
    state.calculator.expression = state.calculator.expression.slice(0, -1);
  } else {
    appendCalculatorValue(value);
  }
  persistCalculator();
  renderCalculator();
}

async function copyCalculatorResult() {
  const result = elements.calculatorDisplay.textContent.trim();
  if (!result) {
    showCalculatorStatus("コピーする結果がありません。", true);
    return;
  }
  try {
    await navigator.clipboard.writeText(result);
    showCalculatorStatus("結果をコピーしました。");
  } catch (error) {
    showCalculatorStatus("コピーに失敗しました。", true);
  }
}

function clearCalculatorHistory() {
  state.calculator.history = [];
  persistCalculator();
  renderCalculator();
  showCalculatorStatus("履歴をクリアしました。");
}

function normalizeCalculatorState(value) {
  const stateValue = value && typeof value === "object" ? value : {};
  return {
    expression: String(stateValue.expression || ""),
    result: String(stateValue.result || "0"),
    history: Array.isArray(stateValue.history)
      ? stateValue.history
        .map((entry) => ({
          expression: String(entry?.expression || ""),
          result: String(entry?.result || ""),
          createdAt: entry?.createdAt || ""
        }))
        .filter((entry) => entry.expression && entry.result)
        .slice(0, 12)
      : []
  };
}

function showCalculatorStatus(message, isError = false) {
  elements.calculatorStatus.textContent = message;
  elements.calculatorStatus.classList.toggle("is-error", isError);
}

function renderVideoFinder() {
  elements.videoApiKey.value = state.videoFinderApiKey;

  if (state.videoFinderLastSearch) {
    elements.videoQuery.value = state.videoFinderLastSearch.query || "";
    elements.videoOrder.value = state.videoFinderLastSearch.order || "relevance";
    elements.videoMaxResults.value = state.videoFinderLastSearch.maxResults || "25";
    elements.videoRegionCode.value = Object.prototype.hasOwnProperty.call(state.videoFinderLastSearch, "regionCode")
      ? state.videoFinderLastSearch.regionCode
      : "JP";
    elements.videoLanguage.value = Object.prototype.hasOwnProperty.call(state.videoFinderLastSearch, "language")
      ? state.videoFinderLastSearch.language
      : "ja";
    elements.videoTitleOnly.checked = Boolean(state.videoFinderLastSearch.titleOnly);
    elements.videoHideLoose.checked = Object.prototype.hasOwnProperty.call(state.videoFinderLastSearch, "hideLoose")
      ? Boolean(state.videoFinderLastSearch.hideLoose)
      : true;
  }

  updateVideoYoutubeSearchLink();
  renderVideoResults(state.videoFinderResults);
}

function saveVideoApiKey() {
  const key = elements.videoApiKey.value.trim();
  if (!key) {
    showVideoStatus("APIキーを入力してください。", true);
    return;
  }

  state.videoFinderApiKey = key;
  localStorage.setItem(STORAGE_KEYS.videoFinderApiKey, key);
  showVideoStatus("APIキーを保存しました。");
}

function clearVideoApiKey() {
  state.videoFinderApiKey = "";
  elements.videoApiKey.value = "";
  localStorage.removeItem(STORAGE_KEYS.videoFinderApiKey);
  showVideoStatus("APIキーを削除しました。");
}

async function handleVideoSearch(event) {
  event.preventDefault();
  const apiKey = elements.videoApiKey.value.trim() || state.videoFinderApiKey;
  const query = elements.videoQuery.value.trim();

  if (!apiKey) {
    showVideoStatus("YouTube Data APIキーを入力してください。", true);
    return;
  }
  if (!query) {
    showVideoStatus("検索キーワードを入力してください。", true);
    return;
  }

  state.videoFinderApiKey = apiKey;
  localStorage.setItem(STORAGE_KEYS.videoFinderApiKey, apiKey);

  const search = getVideoSearchParams(query);
  state.videoFinderLastSearch = search;
  localStorage.setItem(STORAGE_KEYS.videoFinderLastSearch, JSON.stringify(search));
  updateVideoYoutubeSearchLink();

  showVideoStatus("検索しています...");
  elements.videoResults.replaceChildren();

  try {
    const data = await fetchVideoYoutubeResults(apiKey, search);
    let items = normalizeVideoResults(data.items || [], query);
    if (search.order === "subscriberCount") {
      showVideoStatus("登録者数を取得しています...");
      items = await enrichVideoWithChannelStatistics(apiKey, items);
    }
    state.videoFinderResults = sortVideoResults(applyVideoClientFilters(items), search.order);
    renderVideoResults(state.videoFinderResults);
    showVideoStatus(`${state.videoFinderResults.length}件を表示しました。${videoQuotaMessage(search)}`);
  } catch (error) {
    showVideoStatus(error.message || "検索に失敗しました。", true);
  }
}

function getVideoSearchParams(query) {
  return {
    query,
    order: elements.videoOrder.value,
    maxResults: elements.videoMaxResults.value,
    regionCode: elements.videoRegionCode.value.trim().toUpperCase(),
    language: elements.videoLanguage.value.trim(),
    titleOnly: elements.videoTitleOnly.checked,
    hideLoose: elements.videoHideLoose.checked
  };
}

async function fetchVideoYoutubeResults(apiKey, search) {
  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("q", search.query);
  url.searchParams.set("order", VIDEO_API_ORDER[search.order] || "relevance");
  url.searchParams.set("maxResults", search.maxResults);
  url.searchParams.set("safeSearch", "moderate");

  if (search.regionCode) {
    url.searchParams.set("regionCode", search.regionCode);
  }
  if (search.language) {
    url.searchParams.set("relevanceLanguage", search.language);
  }

  const response = await fetch(url.toString());
  const data = await response.json();
  if (!response.ok) {
    const message = data.error && data.error.message
      ? data.error.message
      : `YouTube API error: ${response.status}`;
    throw new Error(message);
  }
  return data;
}

function normalizeVideoResults(items, query) {
  const normalizedQuery = normalizeVideoText(query);
  const words = normalizedQuery.split(/\s+/).filter(Boolean);
  return items
    .filter((item) => item.id && item.id.videoId && item.snippet)
    .map((item) => {
      const snippet = item.snippet;
      const title = decodeVideoHtml(snippet.title || "");
      const description = decodeVideoHtml(snippet.description || "");
      const haystackTitle = normalizeVideoText(title);
      const haystackDescription = normalizeVideoText(description);
      const titleExact = haystackTitle.includes(normalizedQuery);
      const descriptionExact = haystackDescription.includes(normalizedQuery);
      const allWords = words.length > 0 && words.every((word) => (
        haystackTitle.includes(word) || haystackDescription.includes(word)
      ));
      const score = Number(titleExact) * 3 + Number(descriptionExact) * 2 + Number(allWords);

      return {
        videoId: item.id.videoId,
        channelId: snippet.channelId || "",
        title,
        description,
        channelTitle: decodeVideoHtml(snippet.channelTitle || ""),
        publishedAt: snippet.publishedAt,
        thumbnail: snippet.thumbnails && (snippet.thumbnails.medium || snippet.thumbnails.default),
        titleExact,
        descriptionExact,
        allWords,
        score,
        subscriberCount: null
      };
    });
}

function applyVideoClientFilters(items) {
  return items.filter((item) => {
    if (elements.videoTitleOnly.checked && !item.titleExact) {
      return false;
    }
    if (elements.videoHideLoose.checked && item.score === 0) {
      return false;
    }
    return true;
  });
}

function renderVideoResults(results) {
  elements.videoResults.replaceChildren();

  if (results.length === 0) {
    const empty = document.createElement("article");
    empty.className = "video-empty";
    empty.textContent = "表示できる候補はまだありません。検索条件を入れて実行してください。";
    elements.videoResults.append(empty);
    return;
  }

  results.forEach((result) => {
    const card = document.createElement("article");
    card.className = "video-result-card";

    const image = document.createElement("img");
    image.className = "video-thumb";
    image.alt = "";
    image.loading = "lazy";
    image.src = result.thumbnail ? result.thumbnail.url : "";

    const body = document.createElement("div");
    body.className = "video-result-body";

    const title = document.createElement("h3");
    title.textContent = result.title;

    const meta = document.createElement("p");
    meta.className = "video-meta";
    meta.textContent = formatVideoMeta(result);

    const description = document.createElement("p");
    description.className = "video-description";
    description.textContent = result.description || "説明文なし";

    const badges = document.createElement("div");
    badges.className = "video-badge-row";
    appendVideoBadge(badges, "タイトル一致", result.titleExact);
    appendVideoBadge(badges, "説明文一致", result.descriptionExact);
    appendVideoBadge(badges, "全単語一致", result.allWords);
    if (result.score === 0) {
      appendVideoBadge(badges, "一致弱め", false);
    }

    const actions = document.createElement("div");
    actions.className = "video-card-actions";
    actions.append(createVideoLink(`https://www.youtube.com/watch?v=${result.videoId}`, "YouTubeで開く"));
    actions.append(createVideoMemoButton(result));

    body.append(title, meta, description, badges, actions);
    card.append(image, body);
    elements.videoResults.append(card);
  });
}

function createVideoMemoButton(result) {
  const button = document.createElement("button");
  button.className = "secondary-button compact-button";
  button.type = "button";
  button.textContent = "Super Memoへ保存";
  button.addEventListener("click", () => saveVideoResultToSuperMemo(result));
  return button;
}

function saveVideoResultToSuperMemo(result) {
  const existing = state.memos.find((memo) => (memo.body || "").includes(`videoId: ${result.videoId}`));
  if (existing) {
    selectMemo(existing.id);
    showView("superMemo");
    showVideoStatus("保存済みのSuper Memoを開きました。");
    return;
  }

  const now = new Date();
  const id = createUniqueTimestampId(now);
  const url = `https://www.youtube.com/watch?v=${result.videoId}`;
  const matchReasons = [
    result.titleExact ? "タイトル一致" : "",
    result.descriptionExact ? "説明文一致" : "",
    result.allWords ? "全単語一致" : "",
    result.score === 0 ? "一致弱め" : ""
  ].filter(Boolean);
  const body = [
    "## 検索キーワード",
    state.videoFinderLastSearch?.query || "",
    "",
    "## 候補動画",
    `- タイトル: ${result.title}`,
    `- URL: ${url}`,
    `- videoId: ${result.videoId}`,
    `- チャンネル: ${result.channelTitle || "不明"}`,
    `- 公開日: ${formatVideoDate(result.publishedAt)}`,
    `- 一致理由: ${matchReasons.join(", ") || "未分類"}`,
    "",
    "## 説明",
    result.description || "説明文なし",
    "",
    "## 使えそうな観点",
    "- ",
    "",
    "## 除外した理由",
    "- ",
    "",
    "## 記事/企画への反映",
    "- "
  ].join("\n");

  const memo = normalizeMemo({
    id,
    title: id,
    displayTitle: `動画リサーチ: ${shorten(result.title, 34)}`,
    template: "Idea",
    properties: {
      created: now.toISOString(),
      date: toDateValue(now),
      categories: ["リサーチ", "動画"],
      people: [],
      topics: ["YouTube", "動画候補", result.channelTitle].filter(Boolean),
      tags: ["video", "research", "youtube"]
    },
    body,
    links: extractLinks(body),
    images: [],
    archived: false,
    pinned: false,
    starred: false,
    importance: result.score >= 3 ? 3 : result.score > 0 ? 2 : 1,
    openCount: 0,
    lastViewedAt: "",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString()
  });

  state.memos = [memo, ...state.memos];
  persistMemos();
  selectMemo(memo.id);
  showView("superMemo");
  showMemoStatus("動画検索結果をSuper Memoへ保存しました。");
  showVideoStatus("動画検索結果をSuper Memoへ保存しました。");
}

async function enrichVideoWithChannelStatistics(apiKey, items) {
  const channelIds = [...new Set(items.map((item) => item.channelId).filter(Boolean))];
  if (channelIds.length === 0) {
    return items;
  }
  const statistics = await fetchVideoChannelStatistics(apiKey, channelIds);
  return items.map((item) => ({
    ...item,
    subscriberCount: statistics.get(item.channelId) ?? null
  }));
}

async function fetchVideoChannelStatistics(apiKey, channelIds) {
  const statistics = new Map();
  const chunks = chunkVideoArray(channelIds, 50);
  for (const chunk of chunks) {
    const url = new URL("https://www.googleapis.com/youtube/v3/channels");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("part", "statistics");
    url.searchParams.set("id", chunk.join(","));
    const response = await fetch(url.toString());
    const data = await response.json();
    if (!response.ok) {
      const message = data.error && data.error.message
        ? data.error.message
        : `YouTube API error: ${response.status}`;
      throw new Error(message);
    }
    (data.items || []).forEach((item) => {
      const raw = item.statistics && item.statistics.subscriberCount;
      statistics.set(item.id, raw ? Number(raw) : null);
    });
  }
  return statistics;
}

function sortVideoResults(items, order) {
  const sorted = [...items];
  if (order === "date") {
    return sorted.sort((a, b) => toVideoTime(b.publishedAt) - toVideoTime(a.publishedAt) || byVideoScore(b, a));
  }
  if (order === "oldest") {
    return sorted.sort((a, b) => toVideoTime(a.publishedAt) - toVideoTime(b.publishedAt) || byVideoScore(b, a));
  }
  if (order === "subscriberCount") {
    return sorted.sort((a, b) => {
      const aCount = a.subscriberCount ?? -1;
      const bCount = b.subscriberCount ?? -1;
      return bCount - aCount || byVideoScore(b, a) || toVideoTime(b.publishedAt) - toVideoTime(a.publishedAt);
    });
  }
  if (order === "title") {
    return sorted.sort((a, b) => a.title.localeCompare(b.title, "ja") || byVideoScore(b, a));
  }
  if (order === "relevance") {
    return sorted.sort((a, b) => byVideoScore(b, a) || toVideoTime(b.publishedAt) - toVideoTime(a.publishedAt));
  }
  return sorted;
}

function byVideoScore(a, b) {
  return a.score - b.score;
}

function appendVideoBadge(parent, label, active) {
  const badge = document.createElement("span");
  badge.className = active ? "video-badge is-strong" : "video-badge";
  badge.textContent = label;
  parent.append(badge);
}

function createVideoLink(href, text) {
  const link = document.createElement("a");
  link.className = "secondary-button compact-button";
  link.href = href;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = text;
  return link;
}

function updateVideoYoutubeSearchLink() {
  const query = elements.videoQuery.value.trim();
  const url = new URL("https://www.youtube.com/results");
  if (query) {
    url.searchParams.set("search_query", `"${query}"`);
  }
  elements.videoYoutubeSearchLink.href = url.toString();
}

function clearVideoResults() {
  state.videoFinderResults = [];
  elements.videoResults.replaceChildren();
  showVideoStatus("結果をクリアしました。");
  renderVideoResults(state.videoFinderResults);
}

function showVideoStatus(message, isError = false) {
  elements.videoStatusLine.textContent = message;
  elements.videoStatusLine.classList.toggle("is-error", isError);
}

function normalizeVideoText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\u3000/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeVideoHtml(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}

function formatVideoDate(value) {
  if (!value) {
    return "日付不明";
  }
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

function formatVideoMeta(result) {
  const parts = [result.channelTitle, formatVideoDate(result.publishedAt)];
  if (result.subscriberCount !== null) {
    parts.push(`登録者 ${formatVideoNumber(result.subscriberCount)}人`);
  }
  return parts.filter(Boolean).join(" / ");
}

function formatVideoNumber(value) {
  return new Intl.NumberFormat("ja-JP").format(value);
}

function toVideoTime(value) {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function chunkVideoArray(values, size) {
  const chunks = [];
  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }
  return chunks;
}

function videoQuotaMessage(search) {
  if (search.order === "subscriberCount") {
    return "検索API1回に加えて、登録者数取得APIを追加で使っています。";
  }
  return "50件以内は検索API1回の範囲です。";
}

function formatZonedTime(date, zone) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function formatZonedDate(date, zone) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: zone,
    month: "short",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function formatZonedOffset(date, zone) {
  try {
    const value = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      timeZoneName: "shortOffset"
    }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value;
    return value || "UTC";
  } catch {
    return "UTC";
  }
}

function renderTextStats() {
  const text = elements.cleanerOutput.value || elements.cleanerInput.value || "";
  const lines = text ? text.split(/\r?\n/).length : 0;
  elements.textStatChars.textContent = String(text.length);
  elements.textStatLines.textContent = String(lines);
}

function showTextCleanerStatus(message, isError = false) {
  elements.textCleanerStatus.textContent = message;
  elements.textCleanerStatus.classList.toggle("is-error", isError);
}

function renderPromptList() {
  elements.promptList.replaceChildren();
  const prompts = filteredPrompts();

  if (prompts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = state.query ? "該当するプロンプトはありません。" : "保存済みプロンプトはありません。";
    elements.promptList.append(empty);
    renderTagPicker();
    return;
  }

  prompts.forEach((prompt) => {
    const row = document.createElement("button");
    row.className = "prompt-row";
    row.type = "button";
    row.classList.toggle("is-active", prompt.id === state.selectedPromptId);
    row.addEventListener("click", () => selectPrompt(prompt.id));

    const title = document.createElement("strong");
    title.textContent = prompt.title || "無題";

    const promptTags = getPromptTags(prompt);
    const meta = document.createElement("span");
    meta.textContent = promptTags.length > 0 ? promptTags.join(", ") : "タグなし";

    row.append(title, meta);
    elements.promptList.append(row);
  });

  renderTagPicker();
}

function filteredPrompts() {
  const prompts = [...state.prompts].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  if (!state.query) {
    return prompts;
  }

  return prompts.filter((prompt) => {
    const haystack = [
      prompt.title,
      prompt.body,
      getPromptTags(prompt).join(" ")
    ].join(" ").toLowerCase();

    return haystack.includes(state.query);
  });
}

function selectPrompt(id) {
  const prompt = state.prompts.find((item) => item.id === id);
  if (!prompt) {
    return;
  }

  state.selectedPromptId = id;
  elements.promptId.value = prompt.id;
  elements.promptTitle.value = prompt.title;
  elements.promptTags.value = getPromptTags(prompt).join(", ");
  elements.promptBody.value = prompt.body;
  renderPromptList();
  renderTagPicker();
  showPromptStatus("");
}

function resetPromptEditor() {
  state.selectedPromptId = null;
  elements.promptId.value = "";
  elements.promptTitle.value = "";
  elements.promptTags.value = "";
  elements.promptBody.value = "";
  renderPromptList();
  renderTagPicker();
  showPromptStatus("");
}

function savePrompt() {
  const title = elements.promptTitle.value.trim();
  const body = elements.promptBody.value.trim();
  const tags = parseList(elements.promptTags.value).slice(0, 8);

  if (!title && !body) {
    showPromptStatus("タイトルまたは本文を入力してください。", true);
    return;
  }

  const now = new Date().toISOString();
  const existingId = elements.promptId.value;

  if (existingId) {
    state.prompts = state.prompts.map((prompt) => {
      if (prompt.id !== existingId) {
        return prompt;
      }

      return {
        ...prompt,
        title: title || "無題",
        body,
        tags,
        updatedAt: now
      };
    });
    state.selectedPromptId = existingId;
  } else {
    const prompt = {
      id: window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID()
        : String(Date.now()),
      title: title || "無題",
      body,
      tags,
      createdAt: now,
      updatedAt: now
    };
    state.prompts = [prompt, ...state.prompts];
    state.selectedPromptId = prompt.id;
    elements.promptId.value = prompt.id;
  }

  persistPrompts();
  renderPromptList();
  renderTagPicker();
  showPromptStatus("保存しました。");
}

async function copyCurrentPrompt() {
  const body = elements.promptBody.value;

  if (!body.trim()) {
    showPromptStatus("コピーする本文がありません。", true);
    return;
  }

  try {
    await copyText(body);
    showPromptStatus("コピーしました。");
  } catch {
    showPromptStatus("コピーに失敗しました。", true);
  }
}

function deleteCurrentPrompt() {
  const id = elements.promptId.value;

  if (!id) {
    resetPromptEditor();
    return;
  }

  state.prompts = state.prompts.filter((prompt) => prompt.id !== id);
  persistPrompts();
  resetPromptEditor();
  showPromptStatus("削除しました。");
}

function renderTagPicker() {
  elements.tagPicker.replaceChildren();
  const tags = getKnownTags();

  if (tags.length === 0) {
    const empty = document.createElement("span");
    empty.className = "tag-empty";
    empty.textContent = "登録済みタグはまだありません";
    elements.tagPicker.append(empty);
    return;
  }

  const currentTags = new Set(parseList(elements.promptTags.value));

  tags.forEach((tag) => {
    const button = document.createElement("button");
    button.className = "tag-chip";
    button.type = "button";
    button.textContent = tag;
    button.classList.toggle("is-selected", currentTags.has(tag));
    button.addEventListener("click", () => toggleTag(tag));
    elements.tagPicker.append(button);
  });
}

function getKnownTags() {
  const tags = new Set();
  state.prompts.forEach((prompt) => {
    getPromptTags(prompt).forEach((tag) => tags.add(tag));
  });

  return [...tags].sort((a, b) => a.localeCompare(b, "ja"));
}

function toggleTag(tag) {
  const tags = parseList(elements.promptTags.value).slice(0, 8);
  const nextTags = tags.includes(tag)
    ? tags.filter((item) => item !== tag)
    : [...tags, tag].slice(0, 8);

  elements.promptTags.value = nextTags.join(", ");
  renderTagPicker();
}

function getPromptTags(prompt) {
  return Array.isArray(prompt.tags) ? prompt.tags : [];
}

function persistTools() {
  localStorage.setItem(STORAGE_KEYS.tools, JSON.stringify(state.tools));
}

function persistPrompts() {
  localStorage.setItem(STORAGE_KEYS.prompts, JSON.stringify(state.prompts));
}

function persistTextCleaner() {
  localStorage.setItem(STORAGE_KEYS.textCleaner, JSON.stringify(state.textCleaner));
}

function persistPomodoro() {
  localStorage.setItem(STORAGE_KEYS.pomodoro, JSON.stringify(state.pomodoro));
}

function persistCalculator() {
  localStorage.setItem(STORAGE_KEYS.calculator, JSON.stringify(state.calculator));
}

function persistTimezones() {
  localStorage.setItem(STORAGE_KEYS.timezones, JSON.stringify(state.timezones));
}

function persistSubscriptions() {
  localStorage.setItem(STORAGE_KEYS.subscriptions, JSON.stringify(state.subscriptions));
}

function persistBookmarks() {
  localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(state.bookmarks));
}

function persistBookmarkFolders() {
  localStorage.setItem(STORAGE_KEYS.bookmarkFolders, JSON.stringify(state.bookmarkFolders));
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);

    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : fallback;
    }

    if (fallback && typeof fallback === "object" && parsed && typeof parsed === "object") {
      return { ...fallback, ...parsed };
    }

    return parsed;
  } catch {
    return fallback;
  }
}

function showPromptStatus(message, isError = false) {
  elements.statusLine.textContent = message;
  elements.statusLine.classList.toggle("is-error", isError);
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  const temporary = document.createElement("textarea");
  temporary.value = text;
  temporary.setAttribute("readonly", "");
  temporary.style.position = "fixed";
  temporary.style.opacity = "0";
  document.body.append(temporary);
  temporary.select();
  const copied = document.execCommand("copy");
  temporary.remove();
  if (!copied) {
    return Promise.reject(new Error("Copy command failed"));
  }
  return Promise.resolve();
}
