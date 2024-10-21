const fs = require("fs-extra");
const path = require("path");
const glob = require("fast-glob");
const axios = require("axios");

const SCAN_PATH = "E:/blog-temp/jsonq.top/post/mini";
const FETCH_URL = "http://localhost:8888/oss/url"; // nest server

const imageRegex = /!\[.*?\]\((.*?)\)/g;
// const imageRegex = /!\[.*?\]\(https:\/\/cdn\.jsdelivr\.net\/(.*?)\)/g;

// 发送图片链接到服务器并获取新链接
async function updateImageLink(imgUrl) {
  try {
    const response = await axios.get(FETCH_URL + `?imgUrl=${imgUrl}`);

    if (response.status === 200) {
      const newImgUrl = response.data.data.url;
      console.log(`Updated ${imgUrl} to ${newImgUrl}`);
      return newImgUrl;
    } else {
      throw new Error("Failed to update the image link.");
    }
  } catch (error) {
    console.error(`Error updating ${imgUrl}:`, error.message);
    return null;
  }
}

async function processMdFile(filePath) {
  let fileContent = await fs.readFile(filePath, "utf-8");
  let updated = false;

  // 查找所有图片链接
  let match;
  while ((match = imageRegex.exec(fileContent)) !== null) {
    // const oldImageUrl = `https://cdn.jsdelivr.net/${match[1]}`;
    const oldImgUrl = match[1];
    const newImgUrl = await updateImageLink(oldImgUrl);

    if (newImgUrl) {
      fileContent = fileContent.replace(oldImgUrl, newImgUrl);
      updated = true;
    }
  }

  if (updated) {
    await fs.writeFile(filePath, fileContent, "utf-8");
  }
}

// 递归处理文件夹中的所有.md文件
async function processDirectory(directoryPath) {
  const files = await glob(`${directoryPath}/**/*.md`, {
    ignore: ["**/node_modules/**"],
  });
  for (const file of files) {
    await processMdFile(file);
  }
}

// 处理文件或文件夹
async function processPath(pathToProcess) {
  const stats = await fs.stat(pathToProcess);

  if (stats.isDirectory()) {
    await processDirectory(pathToProcess);
  } else if (stats.isFile() && path.extname(pathToProcess) === ".md") {
    await processMdFile(pathToProcess);
  }
}

// 主函数
async function main() {
  await processPath(SCAN_PATH);
}

main().catch((err) => {
  console.error("Run error: ", err);
});
