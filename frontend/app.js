/* =========================================
   AU HELP AI - FRONTEND JAVASCRIPT
   ========================================= */

const API_BASE_URL = "http://localhost:5000/api";

const searchForm = document.getElementById("aiSearchForm");
const aiInput = document.getElementById("aiInput");
const askButton = document.getElementById("askButton");

const responseText = document.getElementById("responseText");
const responseStatus = document.getElementById("responseStatus");
const clearButton = document.getElementById("clearButton");

const connectionText = document.getElementById("connectionText");
const statusDot = document.querySelector(".status-dot");

const quickButtons = document.querySelectorAll(".quick-button");
const cardActions = document.querySelectorAll(".card-action");

/* =========================================
   INITIAL SETUP
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  checkBackendConnection();
});

/* =========================================
   BACKEND CONNECTION CHECK
   ========================================= */

async function checkBackendConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error("Backend unavailable");
    }

    setConnectionStatus(true);
  } catch (error) {
    setConnectionStatus(false);
  }
}

function setConnectionStatus(connected) {
  if (connected) {
    connectionText.textContent = "Backend connected";
    statusDot.style.background = "#22c55e";
  } else {
    connectionText.textContent = "Backend offline";
    statusDot.style.background = "#ef4444";
  }
}

/* =========================================
   SEARCH FORM
   ========================================= */

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = aiInput.value.trim();

  if (!question) {
    showError("Please enter a question.");
    aiInput.focus();
    return;
  }

  await askAI(question);
});

/* =========================================
   ASK AI
   ========================================= */

async function askAI(question) {
  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: question
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
        data.error ||
        "Unable to get a response from the backend."
      );
    }

    displayResponse(data);
  } catch (error) {
    console.error("AI request error:", error);

    showError(
      "Unable to connect to AU Help AI. Make sure the backend server is running."
    );
  } finally {
    setLoading(false);
  }
}

/* =========================================
   DISPLAY RESPONSE
   ========================================= */

function displayResponse(data) {
  responseStatus.textContent = "Answered";

  const answer =
    data.answer ||
    data.response ||
    data.message ||
    "No answer was returned.";

  responseText.innerHTML = "";

  const answerElement = document.createElement("div");
  answerElement.className = "ai-answer";
  answerElement.textContent = answer;

  responseText.appendChild(answerElement);

  if (data.source) {
    const sourceElement = document.createElement("p");

    sourceElement.style.marginTop = "18px";
    sourceElement.style.color = "#94a3b8";
    sourceElement.style.fontSize = "12px";

    sourceElement.textContent = `Source: ${data.source}`;

    responseText.appendChild(sourceElement);
  }
}

/* =========================================
   LOADING STATE
   ========================================= */

function setLoading(isLoading) {
  askButton.disabled = isLoading;

  if (isLoading) {
    responseStatus.textContent = "Thinking...";

    responseText.innerHTML = `
      <div class="loading">
        <span>Getting information</span>
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
        <span class="loading-dot"></span>
      </div>
    `;

    askButton.innerHTML = "Asking...";
  } else {
    askButton.innerHTML = 'Ask AI <span>→</span>';
  }
}

/* =========================================
   ERROR MESSAGE
   ========================================= */

function showError(message) {
  responseStatus.textContent = "Error";

  responseText.innerHTML = "";

  const errorElement = document.createElement("div");
  errorElement.className = "error-message";
  errorElement.textContent = message;

  responseText.appendChild(errorElement);
}

/* =========================================
   CLEAR RESPONSE
   ========================================= */

clearButton.addEventListener("click", () => {
  aiInput.value = "";

  responseStatus.textContent = "Ready";

  responseText.innerHTML = `
    <div class="welcome-message">
      <h2>How can I help?</h2>
      <p>
        Ask a question about publicly available
        Annamalai University information.
      </p>
    </div>
  `;

  aiInput.focus();
});

/* =========================================
   QUICK BUTTONS
   ========================================= */

quickButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const question = button.dataset.query;

    if (!question) {
      return;
    }

    aiInput.value = question;

    await askAI(question);
  });
});

/* =========================================
   INFORMATION CARD BUTTONS
   ========================================= */

cardActions.forEach((button) => {
  button.addEventListener("click", async () => {
    const question = button.dataset.query;

    if (!question) {
      return;
    }

    aiInput.value = question;

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    await askAI(question);
  });
});
