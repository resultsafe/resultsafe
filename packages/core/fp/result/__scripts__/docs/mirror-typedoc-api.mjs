import path from "node:path";
import { promises as fs } from "node:fs";

const PACKAGE_ROOT = process.cwd();
const DOCS_API_DIR = path.join(PACKAGE_ROOT, "docs", "api");
const FLAT_FUNCTIONS_DIR = path.join(DOCS_API_DIR, "functions");
const SRC_DIR = path.join(PACKAGE_ROOT, "src");
const MODULE_DIRS = ["constructors", "guards", "methods", "refiners"];
const SMALL_PAGE_MAX_LINES = 40;

const exportRegex = /^export\s+\{\s*([A-Za-z0-9_$]+)\s*\}\s+from\s+'\.\/([^']+)\.js';\s*$/;
const headingRegex = /^# Function: ([^(]+)\(\)$/m;
const moduleTitleMap = {
  constructors: "Конструкторы",
  guards: "Гарды",
  methods: "Методы",
  refiners: "Рефайнеры",
};

const toPosix = (value) => value.replaceAll("\\", "/");

const ensureDotRelative = (value) => {
  if (value.startsWith(".") || value.startsWith("/")) return value;
  return `./${value}`;
};

const isSmallPage = (lines) => lines.length <= SMALL_PAGE_MAX_LINES;

const parseModuleExports = async (moduleDir) => {
  const indexPath = path.join(SRC_DIR, moduleDir, "index.ts");
  const content = await fs.readFile(indexPath, "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => exportRegex.exec(line))
    .filter((match) => match !== null)
    .map((match) => ({
      symbolName: match[1],
      sourceBaseName: match[2],
      moduleDir,
    }));
};

const parseFunctionDocs = async () => {
  const docs = await fs.readdir(FLAT_FUNCTIONS_DIR, { withFileTypes: true });
  const bySymbol = new Map();

  for (const entry of docs) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const filePath = path.join(FLAT_FUNCTIONS_DIR, entry.name);
    const content = await fs.readFile(filePath, "utf8");
    const headingMatch = content.match(headingRegex);
    if (!headingMatch) continue;
    const symbolName = headingMatch[1].trim();
    const existing = bySymbol.get(symbolName) ?? [];
    existing.push({ fileName: entry.name, filePath, content });
    bySymbol.set(symbolName, existing);
  }

  return bySymbol;
};

const chooseDocCandidate = (candidates, sourceBaseName) => {
  if (!candidates || candidates.length === 0) return null;

  const exactFile = `${sourceBaseName}.md`;
  const exact = candidates.find((candidate) => candidate.fileName === exactFile);
  if (exact) return exact;

  return candidates[0];
};

const rewriteLinks = (content, fromAbsPath, movedByOldFileName) =>
  content.replace(/\[([^\]]+)\]\(([^)]+\.md)\)/g, (full, text, target) => {
    if (target.startsWith("http://") || target.startsWith("https://") || target.startsWith("#")) {
      return full;
    }

    const resolvedTarget = movedByOldFileName.get(path.basename(target));
    if (!resolvedTarget) return full;

    const nextTarget = ensureDotRelative(
      toPosix(path.relative(path.dirname(fromAbsPath), resolvedTarget))
    );

    return `[${text}](${nextTarget})`;
  });

const localizeApiMarkdown = (content) => {
  const replacements = [
    [/^# Function: (.+)$/gm, "# Функция: $1"],
    [/^## Type Parameters$/gm, "## Параметры типа"],
    [/^## Parameters$/gm, "## Параметры"],
    [/^## Returns$/gm, "## Возвращает"],
    [/^## Since$/gm, "## Начиная с версии"],
    [/^## See$/gm, "## См. также"],
    [/^## Example$/gm, "## Пример"],
    [/^## Remarks$/gm, "## Примечания"],
    [/^## Throws$/gm, "## Исключения"],
    [/^### Parameters$/gm, "### Параметры"],
    [/^### Returns$/gm, "### Возвращает"],
    [/^### Type Parameters$/gm, "### Параметры типа"],
    [/^#### Parameters$/gm, "#### Параметры"],
    [/^#### Returns$/gm, "#### Возвращает"],
    [/^#### Type Parameters$/gm, "#### Параметры типа"],
    [/^##### Parameters$/gm, "##### Параметры"],
    [/^##### Returns$/gm, "##### Возвращает"],
    [/^##### Type Parameters$/gm, "##### Параметры типа"],
    [/^###### Parameters$/gm, "###### Параметры"],
    [/^###### Returns$/gm, "###### Возвращает"],
    [/^###### Type Parameters$/gm, "###### Параметры типа"],
  ];

  let localized = content;
  for (const [pattern, value] of replacements) {
    localized = localized.replace(pattern, value);
  }
  return localized;
};

const stripExistingNav = (content) =>
  content.replace(/^> \[.*?README.*?\]\(.*?\)\s+\|\s+\[.*?\]\(.*?\)\s*(\|\s+\[.*?\]\(.*?\)\s*)?\n\n/gm, "");

const prependNav = (content, navLine) => `${navLine}\n\n${stripExistingNav(content)}`;

const writeApiIndexes = async (plannedMoves) => {
  const moduleToFiles = new Map();
  for (const move of plannedMoves) {
    const moduleDir = path.basename(path.dirname(move.targetPath));
    const items = moduleToFiles.get(moduleDir) ?? [];
    items.push(path.basename(move.targetPath));
    moduleToFiles.set(moduleDir, items);
  }

  const rootLines = ["# API", "", "Содержание по модулям:"];
  for (const moduleDir of MODULE_DIRS) {
    rootLines.push(`- [${moduleTitleMap[moduleDir]}](./${moduleDir}/index.md)`);
  }
  rootLines.splice(
    2,
    0,
    isSmallPage(rootLines)
      ? "> [Back to package README](../../README.md)"
      : "> [Back to package README](../../README.md) | [Back to top](#api)",
    ""
  );
  rootLines.push("");
  const rootIndex = rootLines.join("\n");
  await fs.writeFile(path.join(DOCS_API_DIR, "index.md"), rootIndex, "utf8");
  await fs.writeFile(path.join(DOCS_API_DIR, "README.md"), rootIndex, "utf8");

  const modulesLines = ["# Modules", "", "Module entry points:"];
  for (const moduleDir of MODULE_DIRS) {
    modulesLines.push(`- [${moduleTitleMap[moduleDir]}](./${moduleDir}/index.md)`);
  }
  try {
    await fs.access(path.join(DOCS_API_DIR, "type-aliases"));
    modulesLines.push("- [Type Aliases](./type-aliases/index.md)");
  } catch {
    // ignore optional section
  }
  modulesLines.splice(
    2,
    0,
    isSmallPage(modulesLines)
      ? "> [Back to package README](../../README.md) | [Back to API index](./index.md)"
      : "> [Back to package README](../../README.md) | [Back to API index](./index.md) | [Back to top](#modules)",
    ""
  );
  modulesLines.push("");
  await fs.writeFile(path.join(DOCS_API_DIR, "modules.md"), modulesLines.join("\n"), "utf8");

  for (const moduleDir of MODULE_DIRS) {
    const files = (moduleToFiles.get(moduleDir) ?? []).sort((a, b) => a.localeCompare(b));
    const lines = [`# ${moduleTitleMap[moduleDir]}`, "", "Символы модуля:"];
    for (const fileName of files) {
      lines.push(`- [${fileName.replace(".md", "")}](./${fileName})`);
    }
    const navWithTop = `> [Back to package README](../../../README.md) | [Back to API index](../index.md) | [Back to top](#${moduleTitleMap[moduleDir].toLowerCase().replace(/\s+/g, "-")})`;
    const navWithoutTop =
      "> [Back to package README](../../../README.md) | [Back to API index](../index.md)";
    lines.splice(2, 0, isSmallPage(lines) ? navWithoutTop : navWithTop, "");
    lines.push("");
    await fs.writeFile(path.join(DOCS_API_DIR, moduleDir, "index.md"), lines.join("\n"), "utf8");
  }

  try {
    const typeAliasDir = path.join(DOCS_API_DIR, "type-aliases");
    const entries = await fs.readdir(typeAliasDir, { withFileTypes: true });
    const mdFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));

    const lines = ["# Type Aliases", "", "Published helper type aliases:"];
    for (const fileName of mdFiles) {
      lines.push(`- [${fileName.replace(".md", "")}](./${fileName})`);
    }
    lines.splice(
      2,
      0,
      isSmallPage(lines)
        ? "> [Back to package README](../../../README.md) | [Back to API index](../index.md)"
        : "> [Back to package README](../../../README.md) | [Back to API index](../index.md) | [Back to top](#type-aliases)",
      ""
    );
    lines.push("");
    await fs.writeFile(path.join(typeAliasDir, "index.md"), lines.join("\n"), "utf8");
  } catch {
    // ignore optional section
  }
};

const main = async () => {
  try {
    await fs.access(FLAT_FUNCTIONS_DIR);
  } catch {
    throw new Error(
      `Missing "${toPosix(path.relative(PACKAGE_ROOT, FLAT_FUNCTIONS_DIR))}". Run TypeDoc generation first.`
    );
  }

  const docsBySymbol = await parseFunctionDocs();
  const exportsListNested = await Promise.all(MODULE_DIRS.map(parseModuleExports));
  const exportsList = exportsListNested.flat();

  const plannedMoves = [];
  for (const entry of exportsList) {
    const candidates = docsBySymbol.get(entry.symbolName);
    const selected = chooseDocCandidate(candidates, entry.sourceBaseName);
    if (!selected) {
      throw new Error(
        `No generated TypeDoc page found for symbol "${entry.symbolName}" (${entry.moduleDir}/${entry.sourceBaseName}.ts).`
      );
    }

    const targetPath = path.join(DOCS_API_DIR, entry.moduleDir, `${entry.sourceBaseName}.md`);
    plannedMoves.push({
      sourceFileName: selected.fileName,
      sourceContent: selected.content,
      targetPath,
    });
  }

  const movedByOldFileName = new Map(
    plannedMoves.map((move) => [move.sourceFileName, move.targetPath])
  );

  for (const moduleDir of MODULE_DIRS) {
    await fs.rm(path.join(DOCS_API_DIR, moduleDir), { recursive: true, force: true });
  }

  for (const move of plannedMoves) {
    await fs.mkdir(path.dirname(move.targetPath), { recursive: true });
    const rewritten = rewriteLinks(move.sourceContent, move.targetPath, movedByOldFileName);
    const localized = localizeApiMarkdown(rewritten);
    const moduleIndexRel = ensureDotRelative(
      toPosix(path.relative(path.dirname(move.targetPath), path.join(path.dirname(move.targetPath), "index.md")))
    );
    const apiIndexRel = ensureDotRelative(
      toPosix(path.relative(path.dirname(move.targetPath), path.join(DOCS_API_DIR, "index.md")))
    );
    const packageReadmeRel = ensureDotRelative(
      toPosix(path.relative(path.dirname(move.targetPath), path.join(PACKAGE_ROOT, "README.md")))
    );
    const navLine = `> [Back to package README](${packageReadmeRel}) | [Back to API index](${apiIndexRel}) | [Back to module](${moduleIndexRel})`;
    await fs.writeFile(move.targetPath, prependNav(localized, navLine), "utf8");
  }

  await writeApiIndexes(plannedMoves);
  await fs.rm(FLAT_FUNCTIONS_DIR, { recursive: true, force: true });
  console.log(`Mirrored ${plannedMoves.length} API pages into docs/api/* following src/* structure.`);
};

await main();
