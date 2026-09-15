(function (window, document) {
  "use strict";

  var historyKey = "dairyfed_chat_history";
  var openKey = "dairyfed_chat_open";
  var base = document.body.getAttribute("data-page") === "home" ? "" : "../";
  var messages = [];
  var lastIntent = "";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHtml(value) {
    return value.replace(/[&<>\"']/g, function (char) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" })[char]; });
  }
  function loadHistory() {
    try { messages = JSON.parse(localStorage.getItem(historyKey) || "[]"); } catch (error) { messages = []; }
    if (!Array.isArray(messages)) messages = [];
  }
  function saveHistory() { localStorage.setItem(historyKey, JSON.stringify(messages.slice(-40))); }
  function addMessage(role, content, suggestions) {
    messages.push({ role: role, content: content, timestamp: Date.now() });
    saveHistory();
    renderMessages();
    if (suggestions) renderSuggestions(suggestions);
  }
  function renderMessages() {
    var list = document.getElementById("dfChatMessages");
    if (!list) return;
    list.innerHTML = messages.map(function (message) {
      return '<div class="df-chat-message df-chat-message--' + message.role + '"><div class="df-chat-avatar" aria-hidden="true">' + (message.role === "assistant" ? "D" : "You") + '</div><div class="df-chat-bubble">' + escapeHtml(message.content) + '</div></div>';
    }).join("");
    list.scrollTop = list.scrollHeight;
  }
  function renderSuggestions(items) {
    var suggestions = document.getElementById("dfChatSuggestions");
    if (!suggestions) return;
    suggestions.innerHTML = (items || []).slice(0, 4).map(function (item) { return '<button type="button" class="df-chat-chip">' + escapeHtml(item) + '</button>'; }).join("");
    suggestions.querySelectorAll("button").forEach(function (button) { button.addEventListener("click", function () { send(button.textContent); }); });
  }
  function showTyping(show) {
    var typing = document.getElementById("dfChatTyping");
    if (typing) typing.hidden = !show;
    var list = document.getElementById("dfChatMessages");
    if (show && list) list.scrollTop = list.scrollHeight;
  }
  function send(value) {
    var input = document.getElementById("dfChatInput");
    var text = (value || (input && input.value) || "").trim();
    if (!text || document.body.classList.contains("df-chat-busy")) return;
    if (input) { input.value = ""; input.style.height = "auto"; }
    document.body.classList.add("df-chat-busy");
    addMessage("user", text);
    var response = window.DairyFedChatEngine.reply(text, lastIntent);
    lastIntent = response.intent;
    showTyping(true);
    window.setTimeout(function () {
      showTyping(false);
      addMessage("assistant", response.content, response.suggestions);
      document.body.classList.remove("df-chat-busy");
      if (input) input.focus();
    }, reduceMotion ? 0 : 520);
  }
  function setOpen(open) {
    var panel = document.getElementById("dfChatPanel");
    var launcher = document.getElementById("dfChatLauncher");
    if (!panel || !launcher) return;
    panel.hidden = !open;
    launcher.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { localStorage.setItem(openKey, "true"); window.setTimeout(function () { var input = document.getElementById("dfChatInput"); if (input) input.focus(); }, 50); }
    else { localStorage.removeItem(openKey); launcher.focus(); }
  }
  function clearChat() {
    messages = [];
    lastIntent = "";
    localStorage.removeItem(historyKey);
    addMessage("assistant", "Hello. I’m the DairyFed Assistant, your guide to India's digital dairy ecosystem. What would you like to explore?", ["What is DairyFed?", "How does DairyFed help farmers?", "What can cooperatives do?", "How does the platform work?"]);
  }
  function mount() {
    var mountPoint = document.createElement("div");
    mountPoint.innerHTML = '<button class="df-chat-launcher" id="dfChatLauncher" type="button" aria-label="Open DairyFed Assistant" aria-controls="dfChatPanel" aria-expanded="false"><span class="df-chat-launcher__icon" aria-hidden="true">✦</span><span class="df-chat-launcher__label">Ask DairyFed</span></button><section class="df-chat-panel" id="dfChatPanel" role="dialog" aria-modal="false" aria-labelledby="dfChatTitle" hidden><header class="df-chat-header"><div class="df-chat-brand"><span class="df-chat-brand__mark" aria-hidden="true">D</span><div><h2 id="dfChatTitle">DairyFed Assistant</h2><p><span class="df-chat-status"></span> Ready to help</p></div></div><div class="df-chat-actions"><button type="button" class="df-chat-icon-button" id="dfChatClear" aria-label="Clear chat" title="Clear chat">↺</button><button type="button" class="df-chat-icon-button" id="dfChatClose" aria-label="Close DairyFed Assistant" title="Close">×</button></div></header><div class="df-chat-body"><div class="df-chat-messages" id="dfChatMessages" aria-live="polite"></div><div class="df-chat-typing" id="dfChatTyping" hidden><span>Assistant is thinking</span><i></i><i></i><i></i></div><div class="df-chat-suggestions" id="dfChatSuggestions"></div></div><form class="df-chat-form" id="dfChatForm"><label class="sr-only" for="dfChatInput">Message DairyFed Assistant</label><textarea id="dfChatInput" rows="1" maxlength="600" placeholder="Ask about DairyFed..." autocomplete="off"></textarea><button type="submit" aria-label="Send message" title="Send message">↑</button><p>Frontend assistant · No live records accessed</p></form></section>';
    document.body.appendChild(mountPoint);
    loadHistory();
    if (!messages.length) clearChat(); else renderMessages();
    document.getElementById("dfChatLauncher").addEventListener("click", function () { setOpen(true); });
    document.getElementById("dfChatClose").addEventListener("click", function () { setOpen(false); });
    document.getElementById("dfChatClear").addEventListener("click", clearChat);
    document.getElementById("dfChatForm").addEventListener("submit", function (event) { event.preventDefault(); send(); });
    var input = document.getElementById("dfChatInput");
    input.addEventListener("keydown", function (event) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } });
    input.addEventListener("input", function () { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 100) + "px"; });
    document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !document.getElementById("dfChatPanel").hidden) setOpen(false); });
    if (localStorage.getItem(openKey) === "true") setOpen(true);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})(window, document);
