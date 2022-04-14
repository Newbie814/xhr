const listElement = document.querySelector('.posts');
const form = document.querySelector('#new-post form');
const fetchBtn = document.querySelector('#available-posts button');

const postTemplate = document.getElementById('single-post');
const postList = document.querySelector('ul');

function sendHttpRequest(method, url, data) {
  // const promise = new Promise((resolve, reject) => {
  //   const xhr = new XMLHttpRequest();
  //   xhr.open(method, url);

  //   xhr.responseType = 'json';

  //   xhr.onload = function() {
  //     if (xhr.status >= 200 && xhr.status < 300) {
  //       resolve(xhr.response);
  //     } else {
  //       reject(new Error('Error: ' + xhr.statusText));
  //     }
  //   };

  //   xhr.onerror = function() {
  //     reject(new Error('Failed to send request'));
  //   };

  //   xhr.send(JSON.stringify(data));

  // });
  // return promise;
  return fetch(url, {
    method: method,
    // body: JSON.stringify(data),
    body: data,
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  })
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        return response.json().then((errData) => {
          console.log(errData);
          throw new Error('Something went wrong - server-side.');
        });
      }
    })
    .catch((error) => {
      console.log(error);
      throw new Error('Something went wrong!');
    });
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
  try {
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
  } catch (error) {
    alert(error.message);
  }
}

async function createPost(title, content) {
  const userId = Math.floor(Math.random() * 100);
  const post = {
    title: title,
    body: content,
    userId: userId,
  };

  const dataFromForm = new FormData();
  dataFromForm.append('title', title);
  dataFromForm.append('body', content);
  dataFromForm.append('userId', userId);

  sendHttpRequest(
    'POST',
    'https://jsonplaceholder.typicode.com/posts',
    // post,
    dataFromForm
  );
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
