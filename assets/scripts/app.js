const listElement = document.querySelector('.posts');
const form = document.querySelector('#new-post form');
const fetchBtn = document.querySelector('#available-posts button');

const postTemplate = document.getElementById('single-post');
const postList = document.querySelector('ul');

function sendHttpRequest(method, url, data) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);

    xhr.responseType = 'json';

    xhr.onload = function() {
      resolve(xhr.response);
    };

    xhr.send(JSON.stringify(data));
  });
  return promise;
}

// function fetchPosts() {
//   sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts').then(
//     (responseData) => {
//       const listOfPosts = xhr.response;
//       console.log(listOfPosts);
//       for (const post of listOfPosts) {
//         const postElement = document.importNode(postTemplate.content, true);
//         postElement.querySelector('h2').textContent = post.title;
//         postElement.querySelector('p').textContent = post.body;
//         listElement.append(postElement);
//       }
//     }
//   );
// }

async function fetchPosts() {
  const responseData = await sendHttpRequest(
    'GET',
    'https://jsonplaceholder.typicode.com/posts'
  );

  const listOfPosts = responseData;
  console.log(listOfPosts);
  for (const post of listOfPosts) {
    const postElement = document.importNode(postTemplate.content, true);
    postElement.querySelector('h2').textContent = post.title;
    postElement.querySelector('p').textContent = post.body;
    postElement.querySelector('li').id = post.id;
    listElement.append(postElement);
  }
}

async function createPost(title, content) {
  const userId = Math.floor(Math.random() * 100);
  const post = {
    title: title,
    body: content,
    userId: userId,
  };

  sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', post);
}

fetchBtn.addEventListener('click', fetchPosts);
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const enteredTitle = e.currentTarget.querySelector('#title').value;

  const enteredContent = event.currentTarget.querySelector('#content').value;

  createPost(enteredTitle, enteredContent);
  form.reset();
});

postList.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const postId = e.target.closest('li').id;
    sendHttpRequest(
      'DELETE',
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
  }
});
