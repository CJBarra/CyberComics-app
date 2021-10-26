function ResponseStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return Promise.resolve(res);
  } else {
    return Promise.reject(new Error(res.status));
  }
}

function json(res) {
  return res.json();
}

function setControlVisibility(id, max) {
  if (id !== max) {
    document.getElementById("btn-next").hidden = false;
  } else {
    document.getElementById("btn-next").hidden = true;
  }

  if (id == 1) {
    document.getElementById("btn-prev").hidden = true;
  } else {
    document.getElementById("btn-prev").hidden = false;
  }
}

export { ResponseStatus, json, setControlVisibility };
