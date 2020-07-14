importScripts("https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.15/lodash.min.js");

onmessage = ({ data }) => {
  postMessage(_.kebabCase(data));
};
