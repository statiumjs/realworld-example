const baseURL = 'https://api.realworld.io/api';

// GET headers are separate because sending Content-Type header
// with 'application/json' causes the browser to make preflight
// CORS OPTIONS requests that are successful but add to the initial
// page loading time. We don't want that.
const getHeaders = {};
const postHeaders = {
  'Content-Type': 'application/json',
};

const handle = async fetchPromise => {
  let response, json;

  try {
    response = await fetchPromise;

    // Responses to some DELETE requests contain empty body,
    // which will result in an exception when trying to parse it.
    json = await response.json();
  }
  catch {
    json = {};
  }

  if (response.ok) {
    return json ?? {};
  }
  else {
    const error = new Error(response.status);

    // Some back end API calls do not conform to the rest of the spec
    // and return plain text error descrptions, e.g. PUT /user
    // In real application we'd file a ticket to fix it on the backend,
    // however in a demo it's easier to accommodate for this discrepancy
    // in the client code.
    if (typeof json === 'object') {
      error.response = json;
    }
    else {
      error.response = {
        errors: {
          error: json,
        },
      }
    }

    throw error;
  }
};

export const get = async url => handle(fetch(baseURL + url, { headers: getHeaders }));

export const post = async (url, payload) => handle(
  fetch(baseURL + url, {
    method: 'POST',
    headers: postHeaders,
    body: JSON.stringify(payload),
  })
);

export const put = async (url, payload) => handle(
  fetch(baseURL + url, {
    method: 'PUT',
    headers: postHeaders,
    body: JSON.stringify(payload),
  })
);

export const del = async url => handle(
  fetch(baseURL + url, {
    method: 'DELETE',
    headers: postHeaders,
    body: '',
  })
);

export const setToken = token => {
  if (token) {
    getHeaders.authorization = postHeaders.authorization = `Token ${token}`;
  }
  else {
    delete getHeaders.authorization;
    delete postHeaders.authorization;
  }
};
