const doms = {
  div: document.getElementById('file-container'),
  input: document.getElementById('file'),
};

// div simulated file upload
doms.div.onclick = function () {
  doms.input.click();
};
doms.div.ondragenter = function (e) {
  e.preventDefault();
  doms.div.classList.add('hover');
};
doms.div.ondragleave = function (e) {
  e.preventDefault();
  doms.div.classList.remove('hover');
};
doms.div.ondragover = function (e) {
  e.preventDefault();
};
doms.div.ondrop = function (e) {
  e.preventDefault();
  if (!e.dataTransfer.types.includes('Files')) {
    alert('仅支持文件');
    return;
  }
  doms.input.files = e.dataTransfer.files;
  doms.div.classList.remove('hover');
  onFileChange(e.dataTransfer.files[0]);
};

doms.input.onchange = function (e) {
  onFileChange(e.target.files[0]);
};

function onFileChange(file) {
  if (!file) return;
  const reg = /^image\/(jpg|jpeg|png|gif)$/;
  if (!reg.test(file.type)) {
    alert('仅支持图片格式，具体如下: png, jpg, jpeg, gif');
    return;
  }
  uploadFile(file);
}

document.addEventListener('paste', function (e) {
  e.preventDefault();
  // get clipboard data
  const items = e.clipboardData ? e.clipboardData.items : [];

  for (let i = 0; i < items.length; i++) {
    // Only handle image file
    if (items[i].type.indexOf('image') !== -1) {
      const file = items[i].getAsFile();
      onFileChange(file);
    }
  }
});
