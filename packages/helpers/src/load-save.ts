export const loadSave = (): Promise<string | null> => new Promise((resolve, reject) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "*";

  input.onchange = async (event) => {
    try {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        resolve(await file.text());
      }
    } catch {
      reject("Failed to load from save");
    }
  };

  input.click();
  return null;
});
