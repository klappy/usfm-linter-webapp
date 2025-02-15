document.getElementById("lintButton").addEventListener("click", async () => {
  const usfmInput = document.getElementById("usfmInput").value;
  const output = document.getElementById("output");

  try {
    const { parseUSFM } = await import("usfm-grammar");
    const result = parseUSFM(usfmInput);

    console.log("Linter Result:", result);
    if (result.messages) {
      console.log(`Linter Messages: ${result}`);
    }
    if (result.ERROR) {
      output.innerHTML = "Errors found:<br>" + result.ERROR.replace(/\\n/g, "<br>");
    } else if (result.messages && result.messages.warnings.length > 0) {
      output.innerHTML = "Warnings found:<br>" + result.messages.warnings.join("<br>");
    } else {
      output.innerHTML = "No errors found. USFM is valid.";
    }
  } catch (error) {
    output.textContent = "An error occurred while linting: " + error.message;
  }
});
