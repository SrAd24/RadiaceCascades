// Set default params
document.querySelector('#works').style.display = 'none';  
document.querySelector('#save').style.display = 'none';  
document.querySelector('#search').style.display = 'none';  

// Handling
const UI = document.querySelector("#UI_move");
const Person = document.querySelector("#Person_move");
const showWorks = document.querySelector('#headerWorks');
const saveWork = document.querySelector('#headerSave');
const search = document.querySelector('#headerSearch');

let isClicked = false;
let isButtonMoved = false;
let isClickedButtonU = false;
let isClickedButtonP = false;
let isClickedButtonWorks = false;
let isClickedButtonSave = false;
let isClickedButtonSearch = false;

const UIHeight = 24;

let dX = 0;
let dY = 0;
let x;
let y;

function style(id) {
  return window.getComputedStyle(document.querySelector(id));
}

function setPos(id, pos) {
  const elem = document.querySelector(id);

  elem.style.cssText = `left: ${pos.x}px; top: ${pos.y}px`; 
}

let personStyle = window.getComputedStyle(document.querySelector('#Person'));

document.addEventListener('mousedown', (event) => {
  isClicked = true;

  x = event.clientX;
  y = event.clientY;
}); 

document.addEventListener('mouseup', (event) => {
  isClicked = false;
  isClickedButtonU = false;
  isClickedButtonP = false;
  isClickedButtonWorks = false;
  isClickedButtonSave = false;
  isClickedButtonSearch = false;

  dX = 0;
  dY = 0;
});

document.querySelector('#UI_move').addEventListener(('mousedown'), (event) => {
  isClickedButtonU = true;
});

document.querySelector('#headerWorks').addEventListener(('mousedown'), (event) => {
  isClickedButtonWorks = true;
});

document.querySelector('#headerSave').addEventListener(('mousedown'), (event) => {
  isClickedButtonSave = true;
});

document.querySelector('#headerSearch').addEventListener(('mousedown'), (event) => {
  isClickedButtonSearch = true;
});

document.querySelector('#Person_move').addEventListener(('mousedown'), (event) => {
  isClickedButtonP = true;
});

document.addEventListener('mousemove', (event) => {
  isButtonMoved = true;

  if (isClickedButtonU) {

   const rect = document.querySelector('#UI_move').getBoundingClientRect();

    if (rect.left - event.clientX >= -50 && rect.right - event.clientX <= 50);

    dX = event.clientX - x;
    dY = event.clientY - y;

    x = event.clientX;
    y = event.clientY;

    const left = style('#UI').left.slice(0, style('#UI').left.length - 2);
    const top = style('#UI').top.slice(0, style('#UI').top.length - 2);

    const newPostiion = {
      x: Number(left) + dX, 
      y: Number(top) + dY
    };

    setPos('#UI', newPostiion);
  }

  if (isClickedButtonP) {

   const rect = document.querySelector('#Person_move').getBoundingClientRect();

    if (rect.left - event.clientX >= -50 && rect.right - event.clientX <= 50);

    dX = event.clientX - x;
    dY = event.clientY - y;

    x = event.clientX;
    y = event.clientY;

    const left = style('#Person').left.slice(0, style('#Person').left.length - 2);
    const top = style('#Person').top.slice(0, style('#Person').top.length - 2);

    const newPostiion = {
      x: Number(left) + dX,
      y: Number(top) + dY
    };

    setPos('#Person', newPostiion);
  }

  if (isClickedButtonWorks) {
    const mainConRect = document.querySelector('#main_con').getBoundingClientRect();
    const rect = document.querySelector('#works').getBoundingClientRect();

    if (rect.left - event.clientX >= -50 && rect.right - event.clientX <= 50);

    console.log(rect.bottom - mainConRect.bottom)

    if (rect.bottom - mainConRect.bottom > 0 || mainConRect.right - rect.right < 0 ||
        rect.top - mainConRect.top < 0 || mainConRect.left - rect.left > 0
    ) {
      const newPostiion = {
        x: rect.left, 
        y: rect.top
      };

      if (mainConRect.bottom - rect.bottom < 0) {
        newPostiion.y -= rect.height / 52;
      } else if (mainConRect.right - rect.right < 0) {
        newPostiion.x -= rect.width / 52;
      } else if (rect.top - mainConRect.top < 0) {
        newPostiion.y += rect.height / 52;
      } else newPostiion.x += rect.width / 52;

      setPos('#works', newPostiion);

    } else {

      dX = event.clientX - x;
      dY = event.clientY - y;

      x = event.clientX;
      y = event.clientY;

      const left = style('#works').left.slice(0, style('#works').left.length - 2);
      const top = style('#works').top.slice(0, style('#works').top.length - 2);

      const newPostiion = {
        x: Number(left) + dX, 
        y: Number(top) + dY
      };

      setPos('#works', newPostiion);
    }
  }

  if (isClickedButtonSave) {
    const mainConRect = document.querySelector('#main_con').getBoundingClientRect();
    const rect = document.querySelector('#save').getBoundingClientRect();

    if (rect.left - event.clientX >= -50 && rect.right - event.clientX <= 50);

    console.log(rect.bottom - mainConRect.bottom)

    if (rect.bottom - mainConRect.bottom > 0 || mainConRect.right - rect.right < 0 ||
        rect.top - mainConRect.top < 0 || mainConRect.left - rect.left > 0
    ) {
      const newPostiion = {
        x: rect.left, 
        y: rect.top
      };

      if (mainConRect.bottom - rect.bottom < 0) {
        newPostiion.y -= rect.height / 52;
      } else if (mainConRect.right - rect.right < 0) {
        newPostiion.x -= rect.width / 52;
      } else if (rect.top - mainConRect.top < 0) {
        newPostiion.y += rect.height / 52;
      } else newPostiion.x += rect.width / 52;

      setPos('#save', newPostiion);

    } else {

      dX = event.clientX - x;
      dY = event.clientY - y;

      x = event.clientX;
      y = event.clientY;

      const left = style('#save').left.slice(0, style('#save').left.length - 2);
      const top = style('#save').top.slice(0, style('#save').top.length - 2);

      const newPostiion = {
        x: Number(left) + dX, 
        y: Number(top) + dY
      };

      setPos('#save', newPostiion);
    }
  }

  if (isClickedButtonSearch) {
    const mainConRect = document.querySelector('#main_con').getBoundingClientRect();
    const rect = document.querySelector('#search').getBoundingClientRect();

    if (rect.left - event.clientX >= -50 && rect.right - event.clientX <= 50);

    if (rect.bottom - mainConRect.bottom > 0 || mainConRect.right - rect.right < 0 ||
        rect.top - mainConRect.top < 0 || mainConRect.left - rect.left > 0
    ) {
      const newPostiion = {
        x: rect.left, 
        y: rect.top
      };

      if (mainConRect.bottom - rect.bottom < 0) {
        newPostiion.y -= rect.height / 52;
      } else if (mainConRect.right - rect.right < 0) {
        newPostiion.x -= rect.width / 52;
      } else if (rect.top - mainConRect.top < 0) {
        newPostiion.y += rect.height / 52;
      } else newPostiion.x += rect.width / 52;

      setPos('#search', newPostiion);

    } else {

      dX = event.clientX - x;
      dY = event.clientY - y;

      x = event.clientX;
      y = event.clientY;

      const left = style('#search').left.slice(0, style('#search').left.length - 2);
      const top = style('#search').top.slice(0, style('#search').top.length - 2);

      const newPostiion = {
        x: Number(left) + dX, 
        y: Number(top) + dY
      };

      setPos('#search', newPostiion);
    }
  }
});

document.querySelector('#work_close').addEventListener('mousedown', (event) => {
  document.querySelector('#works').style.display = 'none';  
});

document.querySelector('#save_close').addEventListener('mousedown', (event) => {
  document.querySelector('#save').style.display = 'none';  
});

document.querySelector('#search_close').addEventListener('mousedown', (event) => {
  document.querySelector('#search').style.display = 'none';  
});
