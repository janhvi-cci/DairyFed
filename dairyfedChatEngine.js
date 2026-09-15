(function (window) {
  "use strict";

  var K = window.DairyFedKnowledge;
  var intents = [
    { name: "GREETING", words: ["hello", "hi", "hey", "namaste", "नमस्ते"], answer: "Hello. I’m the DairyFed Assistant, your guide to India's digital dairy ecosystem. What would you like to explore?", suggestions: ["What is DairyFed?", "How does it help farmers?", "What can cooperatives do?"] },
    { name: "WHAT_IS_DAIRYFED", words: ["what is dairyfed", "what does dairyfed", "dairyfed kya", "dairy fed", "dairifed", "dairyfeed"], answer: K.overview, suggestions: ["How does it help farmers?", "What can cooperatives do?", "What is the Federation Dashboard?"] },
    { name: "PROBLEM", words: ["problem", "challenge", "fragmented", "slow information", "why needed"], answer: K.problem, suggestions: ["What is DairyFed?", "How does the platform work?", "What is the roadmap?"] },
    { name: "STRUCTURE", words: ["three tier", "village society", "district union", "state federation", "cooperative structure", "ecosystem"], answer: K.structure, suggestions: ["How does it help farmers?", "What can a cooperative do?", "What is the Federation Dashboard?"] },
    { name: "FARMER", words: ["farmer", "kisan", "benefit", "fayda", "farmer dashboard"], answer: K.farmers, suggestions: ["Can I see payment history?", "What is milk quality?", "Can I book a veterinarian?"] },
    { name: "COOPERATIVE", words: ["cooperative", "co-operative", "society", "coop", "cooperatve", "procurement", "daily collection"], answer: K.cooperative, suggestions: ["What is milk procurement?", "How are complaints tracked?", "What does the Federation Dashboard do?"] },
    { name: "FEDERATION", words: ["federation", "federaton", "district dashboard", "benchmarking"], answer: K.federation, suggestions: ["What is the cooperative structure?", "How does AI help DairyFed?", "What is procurement analytics?"] },
    { name: "QUALITY", words: ["milk quality", "fat", "snf", "solids not fat", "quality record", "collection history", "collection record"], answer: K.quality, suggestions: ["What is FAT and SNF?", "Can I see milk collection history?", "How does it help farmers?"] },
    { name: "PAYMENTS", words: ["payment", "paymant", "paisa", "settlement", "financial", "bank", "money"], answer: K.payments, suggestions: ["Can farmers see payment history?", "What is milk quality?", "What other farmer services are available?"] },
    { name: "COMMUNICATION", words: ["communication", "circular", "notifcation", "notification", "alert", "announcement"], answer: K.communication, suggestions: ["What can cooperatives do?", "What are disease alerts?", "What is the farmer dashboard?"] },
    { name: "SCHEMES", words: ["government scheme", "scheme", "eligibility", "training", "extension", "subsidy"], answer: K.schemes, suggestions: ["What training is included?", "How does it help farmers?", "Can I contact DairyFed?"] },
    { name: "VETERINARY", words: ["veterinary", "vet", "veternary", "vaccinaton", "vaccination", "artificial insemination", "disease", "animal health", "booking"], answer: K.veterinary, suggestions: ["Does it provide vaccination reminders?", "What is artificial insemination support?", "What are disease alerts?"] },
    { name: "COMPLAINTS", words: ["complaint", "grievance", "resolve", "track complaint"], answer: K.complaints, suggestions: ["What can a cooperative do?", "How does communication work?", "What are digital records?"] },
    { name: "ANALYTICS", words: ["analytics", "governance", "dashboard", "decision support", "ai", "artificial intelligence"], answer: K.analytics, suggestions: ["What is the Federation Dashboard?", "What is the roadmap?", "What can cooperatives do?"] },
    { name: "ROADMAP", words: ["roadmap", "pilot", "district expansion", "statewide", "national scale", "available nationwide", "already available"], answer: K.roadmap, suggestions: ["What is the pilot phase?", "How does it help farmers?", "Who can partner with DairyFed?"] },
    { name: "MARKET", words: ["largest milk", "230", "190k", "80m", "market", "sector"], answer: K.market, suggestions: ["What problem does DairyFed solve?", "What is the business model?", "What is the roadmap?"] },
    { name: "BUSINESS", words: ["make money", "revenue", "business model", "funding", "investment", "capital", "million", "projection", "projected"], answer: K.business, suggestions: ["What is the funding requirement?", "What are the projections?", "Who can partner with DairyFed?"] },
    { name: "CONTACT", words: ["contact", "email", "phone", "address", "partner", "partnership"], answer: K.contact, suggestions: ["What is DairyFed?", "What can cooperatives do?", "How does the roadmap work?"] },
    { name: "PRIVACY", words: ["privacy", "secure", "security", "data", "audit trail", "safe"], answer: K.records, suggestions: ["What are digital records?", "How does the platform work?", "Can I contact DairyFed?"] }
  ];

  function normalize(text) {
    return text.toLowerCase().replace(/[.,!?;:()[\]{}]/g, " ").replace(/\s+/g, " ").trim();
  }

  function isSafetyQuestion(text) {
    return /fever|medicine|medicine|treatment|sick|ill|dawai|दवाई|बीमार/.test(text);
  }

  function classify(text, previous) {
    var normalized = normalize(text);
    if (!normalized) return { name: "UNKNOWN", confidence: 0 };
    if (isSafetyQuestion(normalized)) return { name: "SAFETY", confidence: 1 };
    var best = { name: "UNKNOWN", confidence: 0, answer: K.fallback, suggestions: ["What is DairyFed?", "How does it help farmers?", "What can cooperatives do?"] };
    intents.forEach(function (intent) {
      var score = 0;
      intent.words.forEach(function (word) {
        var normalizedWord = normalize(word);
        if (normalized.indexOf(normalizedWord) !== -1) score += normalizedWord.indexOf(" ") !== -1 ? 3 : 1;
      });
      if (score > best.confidence) best = { name: intent.name, confidence: score, answer: intent.answer, suggestions: intent.suggestions };
    });
    if (best.name === "UNKNOWN" && previous && /^(it|this|that|what about|iske|iska|isme|and|also|aur)/.test(normalized)) {
      var followUp = intents.filter(function (intent) { return intent.name === previous; })[0];
      if (followUp) return { name: followUp.name, confidence: 1, answer: followUp.answer, suggestions: followUp.suggestions };
    }
    if (best.name === "UNKNOWN" && !/(dairy|milk|farmer|coop|feder|vet|payment|scheme|animal|collection|quality|complaint|dashboard|platform|dudh|gaay|kisan)/.test(normalized)) best.answer = K.unrelated;
    return best;
  }

  window.DairyFedChatEngine = {
    reply: function (text, previousIntent) {
      var result = classify(text, previousIntent);
      if (result.name === "SAFETY") return { intent: result.name, content: K.safety, suggestions: ["What veterinary features are included?", "What are disease alerts?", "Can I contact DairyFed?"] };
      return { intent: result.name, content: result.answer, suggestions: result.suggestions };
    }
  };
})(window);
