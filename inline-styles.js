const fs = require('fs');
const path = require('path');
const PurgeCSS = require('purgecss').PurgeCSS;

async function purifyCSS(styles) {
  const content = ['deploy/**/*.html', 'deploy/**/*.js'];

  return await new PurgeCSS().purge({
    content: content,
    css: [styles],
    safelist: {
      standard: [':focus', ':host', /^swiper-/],
      deep: [],
      greedy: [],
      keyframes: [],
      variables: []
    }
  });
}

function processDirectory(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.css')) {
      processCssFile(filePath);
    }
  });
}

function getContentFromFile(filePath) {
  try {
    // Чтение содержимого файла синхронно
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`);
    return '';
  }
}

function processHtmlFile(filePath) {
  try {
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error(`Error reading file ${filePath}:`, readErr);
        return;
      }

      const modifiedData = data.replace(/<link rel="stylesheet" id="inline-styles" href="(.*?)">/g, (match, p1) => {
        let fileContent = getContentFromFile('./deploy' + p1);

        if (fileContent) {
          fileContent = fileContent.replace(/\/\*#.*\*\//, '');
        }

        return `<style id="inline-styles">${fileContent.trim()}</style>`;
      });

      const fileName = filePath; //.replace('index', 'inline');

      fs.writeFile(fileName, modifiedData, (writeErr) => {
        if (writeErr) {
          console.error(`Error writing file ${fileName}:`, writeErr);
        } else {
          console.log(`File ${fileName} processed and saved.`);
        }
      });
    });
  } catch (error) {
    console.error(`Error processing SCSS file ${filePath}:`, error);
  }
}

function processCssFile(filePath) {
  try {
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        console.error(`Error reading file ${filePath}:`, readErr);
        return;
      }

      const modifiedData = data.replace(/@font-face\{font-family:swiper-icons;[\s\S]*?\}/g, "");

      const fileName = filePath; //.replace('index', 'inline');

      fs.writeFile(fileName, modifiedData, (writeErr) => {
        if (writeErr) {
          console.error(`Error writing file ${fileName}:`, writeErr);
        } else {
          console.log(`File ${fileName} processed and saved.`);
        }
      });

      //purifyCSS({raw: modifiedData}).then(result => {
      //  const fileName = filePath.replace(/.css$/, '-p.css');
      //
      //  console.log('purifyCSS end', fileName, modifiedData.length, result[0].css.length);
      //
      //  fs.writeFile(fileName, result[0].css, (writeErr) => {
      //    if (writeErr) {
      //      console.error(`Error writing file ${fileName}:`, writeErr);
      //    } else {
      //      console.log(`File ${fileName} processed and saved.`);
      //
      //    }
      //  });
      //});
    });
  } catch (error) {
    console.error(`Error processing SCSS file ${filePath}:`, error);
  }
}

const startDirectory = './deploy/styles';

if (process?.argv?.[2] === 'css') {
  processDirectory(startDirectory);
} else if (process?.argv?.[2] === 'html') {
  processHtmlFile('./deploy/index.html');
}
