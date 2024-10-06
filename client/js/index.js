const completeFile = [];
let selectedTag = '1'; // 1: URL 2: HTML 3: Markdown
const textarea = document.getElementById('int_urls');
const radios = document.getElementsByName('tagRadio');

for (let i = 0; i < radios.length; i++) {
  radios[i].onchange = function () {
    selectedTag = this.value;
    genTextAreaValue();
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  http({
    url: '/oss/upload',
    method: 'POST',
    formData,
  }).then((res) => {
    if (res.code != 0) {
      return;
    }
    completeFile.push(res.data);
    genTextAreaValue();
  });
}

function genTextAreaValue() {
  if (selectedTag == '1') {
    textarea.value = completeFile.map((item) => item.url).join('\n');
  } else if (selectedTag == '2') {
    textarea.value = completeFile.map((item) => {
      return `<img src="${item.url}" alt="${item.name}" title="${item.name}" />`;
    });
  } else if (selectedTag == '3') {
    textarea.value = completeFile.map((item) => {
      return `![${item.name}](${item.url})`;
    });
  }
}
