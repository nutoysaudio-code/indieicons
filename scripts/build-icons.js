'use strict';

/**
 * Genera los iconos de lenguaje y el mapa del tema desde una sola tabla.
 *
 * Uso: node scripts/build-icons.js
 *
 * Los SVG usan <text> para las siglas; después hay que convertirlas a paths
 * con scripts/convert-text.ps1 para que no dependan de fuentes instaladas.
 */

const fs = require('fs');
const path = require('path');
const { buildSvg } = require('./icon-template');

const ROOT = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT, 'icons');
const THEME_PATH = path.join(ROOT, 'themes', 'indie-icons-theme.json');

const SPECIAL_ICONS = {
  leaf: '../icons/leaf.svg',
  note: '../icons/note.svg',
  coffee: '../icons/coffee.svg',
  file: '../icons/file.svg',
  folder: '../icons/folder.svg',
  folder_open: '../icons/folder-open.svg',
};

/**
 * Un icono por familia. `label` usa una sigla corta; `glyph` elige un dibujo.
 * El color es la base del sticker; el gradiente se calcula solo.
 */
const LANGUAGE_ICONS = {
  js: { label: 'JS', color: '#D9A23C' },
  ts: { label: 'TS', color: '#4A7FA5' },
  react: { glyph: 'atom', color: '#4C9BD1' },
  python: { label: 'Py', color: '#3F6E9E' },
  rust: { glyph: 'gear', color: '#C06A3E' },
  go: { glyph: 'gopher', color: '#3E9C9C' },
  c: { label: 'C', color: '#5B7FB0' },
  cpp: { label: 'C+', color: '#3F6E9E' },
  csharp: { glyph: 'csharp', color: '#7E5A9E' },
  kotlin: { label: 'K', color: '#8A63B8' },
  swift: { label: 'S', color: '#D9784F' },
  ruby: { glyph: 'gem', color: '#B24A4A' },
  php: { label: 'PHP', color: '#6F74B8' },
  lua: { glyph: 'moon', color: '#4A6FA5' },
  r: { label: 'R', color: '#4A7FA5' },
  dart: { label: 'D', color: '#3E9C9C' },
  scala: { label: 'SC', color: '#B24A4A' },
  perl: { label: 'PL', color: '#4A6FA5' },
  elixir: { label: 'EX', color: '#7E5A9E' },
  erlang: { label: 'ER', color: '#B24A4A' },
  clojure: { label: 'CLJ', color: '#4E9E74' },
  haskell: { label: 'HS', color: '#7E5A9E' },
  fsharp: { label: 'F#', color: '#4A7FA5' },
  vb: { label: 'VB', color: '#4A7FA5' },
  pascal: { label: 'P', color: '#5B7FB0' },
  nim: { label: 'N', color: '#C9A227' },
  zig: { label: 'Z', color: '#D9A23C' },
  solidity: { label: 'SOL', color: '#6B7C93' },
  verilog: { label: 'V', color: '#4E9E74' },
  vhdl: { label: 'VH', color: '#4E9E74' },
  julia: { label: 'JL', color: '#9558B2' },
  ocaml: { label: 'ML', color: '#D9A23C' },
  lisp: { label: 'L', color: '#6E6A63' },
  fortran: { label: 'F', color: '#5B7FB0' },
  groovy: { label: 'GR', color: '#5B8FB9' },
  asm: { glyph: 'chip', color: '#6B7C93' },
  shell: { glyph: 'terminal', color: '#5F8A57' },
  powershell: { label: 'PS', color: '#4A7FA5' },
  bat: { glyph: 'terminal', color: '#6E6A63' },
  sql: { glyph: 'database', color: '#6B7C93' },
  html: { glyph: 'chevrons', color: '#D9714C' },
  css: { glyph: 'hash', color: '#5B8FB9' },
  scss: { glyph: 'hash', color: '#C97795' },
  less: { glyph: 'hash', color: '#5B8FB9' },
  vue: { glyph: 'vue', color: '#4E9E74' },
  svelte: { glyph: 'bolt', color: '#D96A45' },
  astro: { label: 'A', color: '#8A63B8' },
  json: { glyph: 'braces', color: '#C9A227' },
  yaml: { glyph: 'yaml', color: '#B25A4A' },
  toml: { glyph: 'sliders', color: '#6E6A63' },
  config: { glyph: 'sliders', color: '#6E6A63' },
  xml: { glyph: 'tags', color: '#C08A3E' },
  tex: { label: 'TeX', color: '#4E9E74' },
  docker: { glyph: 'containers', color: '#4A7FA5' },
  git: { glyph: 'branch', color: '#D2691E' },
  image: { glyph: 'image', color: '#4E8E8A' },
  video: { glyph: 'video', color: '#8A63B8' },
  archive: { glyph: 'archive', color: '#8B6B4A' },
  lock: { glyph: 'lock', color: '#6E6A63' },
  font: { glyph: 'font', color: '#4A4A5A' },
  table: { glyph: 'table', color: '#4E8E6E' },
  pdf: { label: 'PDF', color: '#C0504D' },
  word: { label: 'W', color: '#4A7FA5' },
  slides: { label: 'P', color: '#D9714C' },
  code: { glyph: 'chevrons', color: '#6B7C93' },
};

const EXTENSIONS = {
  leaf: ['md', 'mdx', 'markdown', 'mdown', 'mkd', 'rst', 'adoc', 'txt', 'log', 'org'],
  note: ['mp3', 'wav', 'flac', 'ogg', 'oga', 'm4a', 'm4b', 'aac', 'opus', 'aiff', 'aif', 'wma', 'mid', 'midi'],
  coffee: ['java', 'jar', 'class', 'jsp', 'coffee', 'litcoffee'],
  js: ['js', 'mjs', 'cjs'],
  react: ['jsx', 'tsx'],
  ts: ['ts', 'mts', 'cts'],
  python: ['py', 'pyw', 'pyi', 'ipynb'],
  rust: ['rs'],
  go: ['go'],
  c: ['c', 'h'],
  cpp: ['cpp', 'cc', 'cxx', 'hpp', 'hxx', 'hh', 'ino', 'mm'],
  csharp: ['cs', 'csx'],
  kotlin: ['kt', 'kts'],
  swift: ['swift'],
  ruby: ['rb', 'erb', 'rake', 'gemspec'],
  php: ['php', 'phtml', 'php3', 'php4', 'php5', 'phps'],
  lua: ['lua'],
  r: ['r'],
  dart: ['dart'],
  scala: ['scala', 'sc'],
  perl: ['pl', 'pm'],
  elixir: ['ex', 'exs'],
  erlang: ['erl', 'hrl'],
  clojure: ['clj', 'cljs', 'cljc', 'edn'],
  haskell: ['hs', 'lhs'],
  fsharp: ['fs', 'fsx', 'fsi'],
  vb: ['vb', 'vbs'],
  pascal: ['pas', 'pp'],
  nim: ['nim'],
  zig: ['zig'],
  solidity: ['sol'],
  verilog: ['v', 'sv'],
  vhdl: ['vhd', 'vhdl'],
  julia: ['jl'],
  ocaml: ['ml', 'mli'],
  lisp: ['lisp', 'el', 'scm', 'rkt'],
  fortran: ['f', 'f90', 'f95', 'f03'],
  groovy: ['groovy', 'gradle'],
  asm: ['asm', 's', 'nasm', 'basm', 'spasm'],
  shell: ['sh', 'bash', 'zsh', 'fish', 'ksh', 'ash'],
  powershell: ['ps1', 'psm1', 'psd1'],
  bat: ['bat', 'cmd'],
  sql: ['sql', 'sqlite'],
  html: ['html', 'htm', 'xhtml'],
  css: ['css'],
  scss: ['scss', 'sass'],
  less: ['less'],
  vue: ['vue'],
  svelte: ['svelte'],
  astro: ['astro'],
  json: ['json', 'jsonc', 'json5', 'jsonl', 'ndjson', 'webmanifest'],
  yaml: ['yaml', 'yml'],
  toml: ['toml'],
  config: ['ini', 'cfg', 'conf', 'config', 'env', 'properties'],
  xml: ['xml', 'xsl', 'xslt', 'xsd', 'dtd', 'plist', 'csproj', 'vbproj', 'fsproj', 'props', 'targets', 'resx'],
  tex: ['tex', 'sty', 'cls', 'bib'],
  code: ['m'],
  video: ['mp4', 'm4v', 'mkv', 'mov', 'avi', 'webm', 'wmv', 'flv', 'mpg', 'mpeg', 'ogv'],
  image: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'ico', 'tif', 'tiff', 'psd', 'ai', 'svg', 'avif', 'heic'],
  font: ['ttf', 'otf', 'woff', 'woff2', 'eot'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz', 'tgz', 'bz2', 'xz', 'zst', 'lz4'],
  table: ['csv', 'tsv', 'xls', 'xlsx', 'xlsm', 'ods'],
  pdf: ['pdf'],
  word: ['doc', 'docx', 'odt', 'rtf'],
  slides: ['ppt', 'pptx', 'odp', 'key'],
};

const FILE_NAMES = {
  leaf: ['readme', 'readme.md', 'readme.txt', 'license', 'license.md', 'license.txt', 'copying', 'notice', 'authors', 'contributors', 'changelog', 'changelog.md', 'history.md'],
  js: ['package.json'],
  ts: ['tsconfig.json', 'jsconfig.json'],
  lock: ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'cargo.lock', 'composer.lock', 'gemfile.lock', 'poetry.lock', 'pipfile.lock', 'mix.lock', 'pubspec.lock'],
  rust: ['cargo.toml'],
  go: ['go.mod', 'go.sum'],
  python: ['requirements.txt', 'pyproject.toml', 'pipfile', 'setup.py', 'manage.py'],
  ruby: ['gemfile', 'rakefile'],
  php: ['composer.json'],
  dart: ['pubspec.yaml'],
  coffee: ['pom.xml'],
  docker: ['dockerfile', 'docker-compose.yml', 'docker-compose.yaml', '.dockerignore', 'compose.yml', 'compose.yaml'],
  git: ['.gitignore', '.gitattributes', '.gitmodules', '.gitconfig', '.gitkeep'],
  groovy: ['build.gradle', 'settings.gradle', 'gradlew'],
  config: ['makefile', 'cmakelists.txt', 'justfile', '.editorconfig', '.npmrc', '.nvmrc', '.prettierrc', '.eslintrc', '.babelrc', 'vite.config.js', 'vite.config.ts', 'webpack.config.js', 'rollup.config.js', 'gradle.properties'],
  shell: ['mvnw'],
};

const LANGUAGE_IDS = {
  leaf: ['markdown', 'plaintext', 'restructuredtext', 'asciidoc'],
  coffee: ['java', 'coffeescript'],
  js: ['javascript'],
  react: ['javascriptreact', 'typescriptreact'],
  ts: ['typescript'],
  python: ['python'],
  rust: ['rust'],
  go: ['go'],
  c: ['c'],
  cpp: ['cpp', 'objective-cpp'],
  csharp: ['csharp'],
  kotlin: ['kotlin'],
  swift: ['swift'],
  ruby: ['ruby'],
  php: ['php'],
  lua: ['lua'],
  r: ['r'],
  dart: ['dart'],
  scala: ['scala'],
  perl: ['perl'],
  elixir: ['elixir'],
  erlang: ['erlang'],
  clojure: ['clojure'],
  haskell: ['haskell'],
  fsharp: ['fsharp'],
  vb: ['vb'],
  pascal: ['pascal'],
  nim: ['nim'],
  zig: ['zig'],
  solidity: ['solidity'],
  verilog: ['verilog', 'systemverilog'],
  vhdl: ['vhdl'],
  julia: ['julia'],
  ocaml: ['ocaml'],
  lisp: ['lisp'],
  fortran: ['fortran'],
  groovy: ['groovy'],
  asm: ['asm', 'assembly'],
  shell: ['shellscript', 'shell'],
  powershell: ['powershell'],
  bat: ['bat'],
  sql: ['sql'],
  html: ['html', 'razor'],
  css: ['css'],
  scss: ['scss'],
  less: ['less'],
  vue: ['vue'],
  svelte: ['svelte'],
  astro: ['astro'],
  json: ['json', 'jsonc'],
  yaml: ['yaml'],
  toml: ['toml'],
  config: ['ini', 'properties', 'dotenv'],
  xml: ['xml'],
  tex: ['latex', 'tex'],
  code: ['objective-c', 'matlab'],
  docker: ['dockerfile'],
  git: ['git-commit', 'git-rebase'],
};

function buildMap(groups, kind) {
  const map = {};
  for (const [icon, values] of Object.entries(groups)) {
    if (!(icon in LANGUAGE_ICONS) && !(icon in SPECIAL_ICONS)) {
      throw new Error(`El icono "${icon}" no existe (${kind})`);
    }
    for (const value of values) {
      if (map[value] && map[value] !== '_' + icon) {
        throw new Error(`Conflicto en ${kind} "${value}": ${map[value]} y _${icon}`);
      }
      map[value] = '_' + icon;
    }
  }
  return Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
}

function main() {
  fs.mkdirSync(ICONS_DIR, { recursive: true });

  for (const [id, spec] of Object.entries(LANGUAGE_ICONS)) {
    fs.writeFileSync(path.join(ICONS_DIR, `lang-${id}.svg`), buildSvg(spec));
  }

  const iconDefinitions = {};
  for (const [id, iconPath] of Object.entries(SPECIAL_ICONS)) {
    iconDefinitions['_' + id] = { iconPath };
  }
  for (const id of Object.keys(LANGUAGE_ICONS)) {
    iconDefinitions['_' + id] = { iconPath: `../icons/lang-${id}.svg` };
  }

  const theme = {
    iconDefinitions,
    file: '_file',
    folder: '_folder',
    folderExpanded: '_folder_open',
    fileExtensions: buildMap(EXTENSIONS, 'extensión'),
    fileNames: buildMap(FILE_NAMES, 'nombre'),
    languageIds: buildMap(LANGUAGE_IDS, 'languageId'),
  };

  fs.writeFileSync(THEME_PATH, JSON.stringify(theme, null, 2) + '\n');

  console.log(`Iconos generados: ${Object.keys(LANGUAGE_ICONS).length}`);
  console.log(`Extensiones: ${Object.keys(theme.fileExtensions).length}`);
  console.log(`Nombres: ${Object.keys(theme.fileNames).length}`);
  console.log(`languageIds: ${Object.keys(theme.languageIds).length}`);
}

main();
