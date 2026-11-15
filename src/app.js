const platformSelect = document.getElementById("platformSelect");
const repeatType = document.getElementById("repeatType");
const charLimit = document.getElementById("charLimit");
const unitLength = document.getElementById("unitLength");
const textInput = document.getElementById("textInput");
const generateBtn = document.getElementById("generateBtn");
const statusOutput = document.getElementById("statusOutput");

// 1. Sync character limit when platform dropdown changes
platformSelect.addEventListener("change", (e) => {
  const val = e.target.value;
  if (val !== "custom") {
    charLimit.value = val;
  } else {
    charLimit.focus();
  }
  updateUnitLength();
});

// 2. Real-time Unit Length calculation
function updateUnitLength() {
  const text = textInput.value;
  unitLength.textContent = text.length;
}

textInput.addEventListener("input", updateUnitLength);
charLimit.addEventListener("input", updateUnitLength);

// Initial calculation
updateUnitLength();

// 3. Main Generation & Copy Logic
generateBtn.addEventListener("click", async () => {
  const limit = parseInt(charLimit.value, 10);
  const text = textInput.value;
  const mode = repeatType.value;

  if (isNaN(limit) || limit <= 0) {
    logStatus("[Error] Please enter a valid character limit.", "error");
    return;
  }

  if (!text) {
    logStatus("[Error] Input text cannot be empty.", "error");
    return;
  }

  let resultString = "";
  let repeatCount = 0;

  if (mode === "multiline") {
    const unitLen = text.length + 1; // includes '\n'
    repeatCount = Math.floor(limit / unitLen);
    if (repeatCount > 0) {
      resultString = Array(repeatCount).fill(text).join("\n");
    }
  } else if (mode === "single_nospace") {
    const unitLen = text.length;
    repeatCount = Math.floor(limit / unitLen);
    if (repeatCount > 0) {
      resultString = text.repeat(repeatCount);
    }
  } else if (mode === "single_space") {
    const unitLen = text.length + 1; // includes space ' '
    repeatCount = Math.floor(limit / unitLen);
    if (repeatCount > 0) {
      resultString = Array(repeatCount).fill(text).join(" ");
    }
  }

  if (repeatCount <= 0) {
    logStatus("[Error] Your text length exceeds the total character limit!", "error");
    return;
  }

  // 4. Copy to clipboard
  try {
    await navigator.clipboard.writeText(resultString);
    logStatus(
      `[Status] Ready to generate...\n` +
      `[History] Text: "${text}" repeat count set to ${repeatCount}...\n` +
      `[Success] Text has been generated and copied to clipboard! Total chars: ${resultString.length}/${limit}`,
      "success"
    );
  } catch (err) {
    logStatus("[Error] Failed to copy to clipboard automatically.", "error");
  }
});

// Helper for status log
function logStatus(message, type) {
  const colorClass = type === "error" ? "log-error" : type === "success" ? "log-success" : "log-info";
  statusOutput.innerHTML = `<span class="${colorClass}">${message.replace(/\n/g, "<br/>")}</span>`;
}