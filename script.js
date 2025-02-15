document.addEventListener("DOMContentLoaded", function () {
  const editor = CodeMirror.fromTextArea(document.getElementById("usfmInput"), {
    lineNumbers: true,
    mode: "text/plain",
    theme: "default",
  });

  document.getElementById("lintButton").addEventListener("click", async () => {
    console.log("Lint button clicked");
    const usfmInput = editor.getValue();
    console.log("USFM Input:", usfmInput);
    const output = document.getElementById("output");

    try {
      const { parseUSFM } = await import("usfm-grammar");
      console.log("Parsing USFM input");
      const result = parseUSFM(usfmInput);
      console.log("Parse result:", result);

      console.log("Linter Result:", result);
      if (result.messages) {
        console.log(`Linter Messages: ${result}`);
      }
      if (result.ERROR) {
        console.log("Error found in USFM:", result.ERROR);
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
      console.error("An error occurred:", error);
      if (error.message.includes("Cannot declare a parameter named 'e' in strict mode")) {
        output.textContent =
          "An internal error occurred likely with the build, check your node version with `nvm install`, then clear your caches and node_modules, then build again.";
      } else {
        output.textContent = "An error occurred while linting: " + error.message;
      }
    }
  });
});
