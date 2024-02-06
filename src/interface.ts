import fs from "fs";

export function generateInterface(obj: any, interfaceName: string) {
  let result = `export interface ${interfaceName} {\n`;

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += `    ${key}: ${obj[key]};\n`;
    }
  }

  result += `}\n`;

  fs.writeFile("generated/interface.ts", result, function (err: any) {
    if (err) {
      return console.log(err);
    }
  });
}
