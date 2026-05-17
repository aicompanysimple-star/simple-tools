const STORAGE_KEYS = {
  tools: "simpleTools.tools.v1",
  prompts: "simpleTools.prompts.v1",
  textCleaner: "simpleTools.textCleaner.v1",
  activeView: "simpleTools.activeView.v1"
};

const toolCatalog = [
  {
    id: "promptPad",
    name: "プロンプトパッド",
    description: "保存、検索、コピー",
    available: true,
    view: "promptPad"
  },
  {
    id: "textCleaner",
    name: "テキスト整形",
    description: "空白、空行、箇条書き",
    available: true,
    view: "textCleaner"
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
  promptPad: true,
  textCleaner: true,
  timeboxPlanner: false
};

let state = {
  tools: readJson(STORAGE_KEYS.tools, defaultTools),
  prompts: readJson(STORAGE_KEYS.prompts, []),
  textCleaner: readJson(STORAGE_KEYS.textCleaner, { input: "", output: "" }),
  selectedPromptId: null,
  query: ""
};

const elements = {
  views: document.querySelectorAll(".view"),
  navItems: document.querySelectorAll("[data-view]"),
  enabledTools: document.querySelector("#enabled-tools"),
  toolSettings: document.querySelector("#tool-settings"),
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
  textCleanerStatus: document.querySelector("#text-cleaner-status")
};

init();

function init() {
  renderHome();
  renderSettings();
  renderPromptList();
  renderTextCleaner();
  bindEvents();
  resetEditor();

  const savedView = localStorage.getItem(STORAGE_KEYS.activeView);
  const startView = savedView && !isViewEnabled(savedView)
    ? "home"
    : savedView || "home";
  showView(startView);
}

function bindEvents() {
  elements.navItems.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view;
      if (!isViewEnabled(view)) {
        showStatus("このツールは設定で無効になっています。", true);
        showView("settings");
        return;
      }
      showView(view);
    });
  });

  elements.promptSearch.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderPromptList();
  });

  elements.promptTags.addEventListener("input", renderTagPicker);

  elements.newPromptButton.addEventListener("click", () => {
    resetEditor();
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
}

function showView(viewName) {
  const safeView = document.querySelector(`#view-${viewName}`) ? viewName : "home";

  elements.views.forEach((view) => {
    view.classList.toggle("is-visible", view.id === `view-${safeView}`);
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === safeView);
  });

  localStorage.setItem(STORAGE_KEYS.activeView, safeView);
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
  const enabled = toolCatalog.filter((tool) => state.tools[tool.id] && tool.available);

  if (enabled.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "有効なツールはありません。";
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
    description.textContent = tool.description;
    copy.append(title, description);

    const label = document.createElement("label");
    label.className = "toggle";
    label.title = tool.available ? `${tool.name}を切り替える` : `${tool.name}は準備中です`;

    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(state.tools[tool.id]);
    input.disabled = !tool.available;
    input.setAttribute("aria-label", `${tool.name}を切り替える`);
    input.addEventListener("change", () => {
      state.tools[tool.id] = input.checked;
      persistTools();
      renderHome();
      showStatus(`${tool.name}を${input.checked ? "有効" : "無効"}にしました。`);
    });

    const track = document.createElement("span");
    track.className = "toggle-track";
    label.append(input, track);

    item.append(copy, label);
    elements.toolSettings.append(item);
  });
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
  showStatus("");
}

function resetEditor() {
  state.selectedPromptId = null;
  elements.promptId.value = "";
  elements.promptTitle.value = "";
  elements.promptTags.value = "";
  elements.promptBody.value = "";
  renderPromptList();
  renderTagPicker();
  showStatus("");
}

function savePrompt() {
  const title = elements.promptTitle.value.trim();
  const body = elements.promptBody.value.trim();
  const tags = parseTags(elements.promptTags.value);

  if (!title && !body) {
    showStatus("タイトルまたは本文を入力してください。", true);
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
  showStatus("保存しました。");
}

async function copyCurrentPrompt() {
  const body = elements.promptBody.value;

  if (!body.trim()) {
    showStatus("コピーする本文がありません。", true);
    return;
  }

  try {
    await copyText(body);
    showStatus("コピーしました。");
  } catch {
    showStatus("コピーに失敗しました。", true);
  }
}

function deleteCurrentPrompt() {
  const id = elements.promptId.value;

  if (!id) {
    resetEditor();
    return;
  }

  state.prompts = state.prompts.filter((prompt) => prompt.id !== id);
  persistPrompts();
  resetEditor();
  showStatus("削除しました。");
}

function parseTags(value) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
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

  const currentTags = new Set(parseTags(elements.promptTags.value));

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
  const tags = parseTags(elements.promptTags.value);
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

function showStatus(message, isError = false) {
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
  document.execCommand("copy");
  temporary.remove();
  return Promise.resolve();
}
