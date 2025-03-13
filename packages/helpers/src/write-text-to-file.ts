export const writeTextToFile = (data: string) => {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "demystify.json";
  a.click();
  URL.revokeObjectURL(url);
};
