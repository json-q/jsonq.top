/**
 * @description
 * @param {String} url
 * @param {String} method
 * @param {Object} params
 * @param {Object} data
 * @param {Function} success
 * @param {Function} error
 */

// const BASE_URL = 'http://localhost:3000';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const http = ({ url = '', method = 'get', params = {}, data = {}, formData, success, error }) => {
  // url = url.indexOf(BASE_URL) > -1 ? url : BASE_URL + url;
  return new Promise((resolve, reject) => {
    let xhr;
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest(); //XMLHttpRequest support
    } else {
      xhr = new ActiveXObject('MicroSoft.XMLHTTP'); //support old ie
    }

    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          const res = xhr.responseText;
          const pareseRes = pareseJson(res);
          if (success) {
            success(pareseRes);
          }
          resolve(pareseRes);
        } else if (xhr.status === 401 && url != '/oauth/refresh') {
          http({
            url: '/oauth/refresh',
            method: 'POST',
            success() {
              http({ url, method, params, data, formData });
            },
            error() {
              console.log('login expired, need login');
            },
          });
        } else {
          if (error) {
            error(xhr.status);
          }
          reject(xhr.status);
        }
      }
    };

    switch (method.toUpperCase()) {
      case 'GET':
        const reqUrl = url + serializeParam(params);
        xhr.open('GET', reqUrl);
        xhr.send();
        break;
      case 'POST':
        xhr.open('POST', url);
        if (formData) {
          xhr.send(formData);
        } else {
          xhr.setRequestHeader('Content-Type', 'application/json');
          if (Object.keys(data).length > 0) {
            xhr.send(JSON.stringify(data));
          } else {
            xhr.send();
          }
        }
        break;
    }
  });
};

function serializeParam(params) {
  if (Object.keys(params).length == 0) {
    return '';
  }
  return (
    '?' +
    Object.keys(params)
      .map((key) => key + '=' + params[key])
      .join('&')
  );
}

function pareseJson(json) {
  if (!json) return json;

  try {
    return JSON.parse(json);
  } catch {
    return json;
  }
}
