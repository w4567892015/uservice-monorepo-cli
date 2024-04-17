function jsonValueToEnv(value: any): string {
  let processedValue = String(value);
  processedValue = processedValue.replace(/\n/g, '\\n');
  processedValue = processedValue.includes('\\n')
    ? `"${processedValue}"`
    : processedValue;
  return processedValue;
}

export function envStringify(obj: any): string {
  let result = '';
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      const line = `${key}=${jsonValueToEnv(value)}`;
      result += `${line}\n`;
    }
  }
  return result;
}

export function envCommonStringify(obj: any): string {
  let result = '';
  for (const [key, value] of Object.entries(obj)) {
    if (key) {
      const line = `${key}: ${jsonValueToEnv(value)}`;
      result += `# ${line}\n`;
    }
  }
  return result;
}
