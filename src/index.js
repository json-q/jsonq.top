const fs = require("fs-extra");
const glob = require("fast-glob");
const axios = require("axios");

// support file and folder
const MARKDOWN_DIR = "xxxx";
const UPLOAD_URL = "http://localhost:8888/oss/url";
const FETCH_SUCCESS_FILE = "fetch_success_log.txt";
const FETCH_FAIL_FILE = "fetch_fail_log.txt";

const WRITE_SUCCESS_FILE = "write_success_log.txt";
const WRITE_FAIL_FILE = "write_fail_log.txt";

const imageRegex = /!\[.*?\]\((.*?)\)/g; // all image link

// read file and process images
async function processFile(filePath) {
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    let match;
    while ((match = imageRegex.exec(fileContent)) !== null) {
      const imageUrl = match[1];
      // only handle external link
      if (imageUrl.startsWith("http")) {
        await uploadImage(imageUrl, filePath, fileContent, match.index, match[0]);
      }
    }
  } catch (err) {
    console.error(`Error processing file: ${filePath}`, err.message);
  }
}

async function uploadImage(url, filePath, fileContent, index, fullMatch) {
  await axios
    .get(UPLOAD_URL + `?imgUrl=${url}`)
    .then(async (res) => {
      const newUrl = res.data.data.url;
      console.log(`Uploaded: ${url} -> New URL: ${newUrl}`);
      // output log
      const logEntry = `${filePath}: ${url} -> ${newUrl}\n`;
      await fs.appendFile(FETCH_SUCCESS_FILE, logEntry);

      const altText = fullMatch.match(/\[(.*?)\]/)[1]; // 提取alt文本
      await updateFileContent(filePath, fileContent, fullMatch, `![${altText}](${newUrl})`);
    })
    .catch(async (err) => {
      const logEntry = `${filePath}: ${url}\n`;
      await fs.appendFile(FETCH_FAIL_FILE, logEntry);

      console.error(`Upload fetch fail : ${url}`, err.message);
    });
}

// write new image url
async function updateFileContent(filePath, fileContent, oldLink, newLink) {
  const updatedContent = fileContent.replace(oldLink, newLink);
  try {
    await fs.writeFile(filePath, updatedContent, "utf8");
    const logEntry = `${filePath}: ${oldLink} -> ${newLink}\n`;

    await fs.appendFile(WRITE_SUCCESS_FILE, logEntry);
  } catch (err) {
    const logEntry = `${filePath}: ${oldLink} -> ${newLink}\n`;
    await fs.appendFile(WRITE_FAIL_FILE, logEntry);
  }
}

async function main() {
  try {
    // const files = await glob(`${MARKDOWN_DIR}/**/*.md`);
    // for (const file of files) {
    //   await processFile(file);
    // }
    const stats = await fs.stat(MARKDOWN_DIR);
    if (stats.isFile()) {
      await processFile(MARKDOWN_DIR);
    } else if (stats.isDirectory()) {
      const files = await glob(`${MARKDOWN_DIR}/**/*.md`);
      for (const file of files) {
        await processFile(file);
      }
    }
  } catch (err) {
    console.error("Error scanning directory:", err.message);
  }
}

main();
