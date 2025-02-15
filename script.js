document.addEventListener("DOMContentLoaded", function () {
  const editor = CodeMirror.fromTextArea(document.getElementById("usfmInput"), {
    lineNumbers: true,
    mode: "text/plain",
    theme: "default",
  });

  document.getElementById("lintButton").addEventListener("click", async () => {
    const usfmInput = editor.getValue();
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
        const errorMatch = result.ERROR.match(/Line (\d+), col (\d+)/);
        if (errorMatch) {
          const lineNumber = parseInt(errorMatch[1], 10) - 1; // Convert to 0-based index
          editor.addLineClass(lineNumber, "background", "error-line");
          editor.addLineClass(lineNumber, "text", "error-line");
          editor.scrollIntoView({ line: lineNumber, ch: 0 }, 200);
        }
      } else if (result.messages && result.messages.warnings.length > 0) {
        output.innerHTML = "Warnings found:<br>" + result.messages.warnings.join("<br>");
      } else {
        output.innerHTML = "No errors found. USFM is valid.";
      }
    } catch (error) {
      output.textContent = "An error occurred while linting: " + error.message;
    }
  });
});
