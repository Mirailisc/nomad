// interface.ts

import fs from "fs";
import path from "path";

export function generateInterface(
  obj: any,
  interfaceName: string,
  depth: number = 1,
  directoryPath: string = "nomad"
): void {
  const directory = path.join(process.cwd(), directoryPath);
  const filePath = path.join(directory, "interface.ts");

  let result = `export interface ${interfaceName} {\n`;

  for (const [key, value] of Object.entries(obj)) {
    const tabs = "    ".repeat(depth);

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      result += `${tabs}${key}: {\n`;
      for (const [nestedKey, nestedValue] of Object.entries(value)) {
        result += `${tabs}    ${nestedKey}: ${getType(nestedValue)};\n`;
      }
      result += `${tabs}};\n`;
    } else if (
      Array.isArray(value) &&
      value.length > 0 &&
      typeof value[0] === "object" &&
      value[0] !== null
    ) {
      result += `${tabs}${key}: {\n`;
      for (const [nestedKey, nestedValue] of Object.entries(value[0])) {
        result += `${tabs}    ${nestedKey}: ${getType(nestedValue)};\n`;
      }
      result += `${tabs}}[];\n`;
    } else {
      const valueType = getType(value);
      result += `${tabs}${key}: ${valueType};\n`;
    }
  }

  result += "}\n";

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  fs.writeFileSync(filePath, result);
}

function getType(value: any): string {
  if (Array.isArray(value)) {
    return value.length > 0 && typeof value[0] === "object"
      ? "{ }[]"
      : `${typeof value}[]`;
  } else {
    return typeof value === "object"
      ? "{ }"
      : typeof value === "string"
        ? "string"
        : typeof value;
  }
}
