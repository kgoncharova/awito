'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

const modalAdd = document.querySelector('.modal__add'),
      addAd = document.querySelector('.add__ad'),
      modalBtnSubmit = document.querySelector('.modal__btn-submit'),
      modalSubmit = document.querySelector('.modal__submit'),
      catalog = document.querySelector('.catalog'),
      modalItem = document.querySelector('.modal__item'),
      modalBtnWarning = document.querySelector('.modal__btn-warning'),
      modalFileInput = document.querySelector('.modal__file-input'),
      modalFileBtn = document.querySelector('.modal__file-btn'),
      modalImageAdd = document.querySelector('.modal__image-add');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const elementsModalSubmit = [...modalSubmit.elements]
      .filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');
      // elementsModalSubmit.forEach(console.dir)

const infoPhoto = {};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase))

const checkForm = () => {
  const validForm = elementsModalSubmit.every(elem => elem.value);
  modalBtnSubmit.disabled = !validForm;
  modalBtnWarning.style.display = validForm ? 'none' : '';
}

const closeModal = function(event) {
  const target = event.target;

  if (target.closest('.modal__close') ||
      target.classList.contains('modal') ||
      event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        modalImageAdd.src = srcModalImage;
        modalFileBtn.textContent = textFileBtn;
        checkForm();
      }
};

const renderCard = () => {
  catalog.textContent = '';
  dataBase.forEach((item, i) => {
    catalog.insertAdjacentHTML('beforeend', `
      <li class="card" data-id="${i}">
        <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
        <div class="card__description">
          <h3 class="card__header">${item.nameItem}</h3>
          <div class="card__price">${item.costItem}</div>
        </div>
      </li>
    `);
  });
};

modalFileInput.addEventListener('change', event => {
  const target = event.target;
  const reader = new FileReader();
  const file = target.files[0];

  infoPhoto.filename = file.name;
  infoPhoto.size = file.size;

  reader.readAsBinaryString(file);

  reader.addEventListener('load', event => {
    if (infoPhoto.size < 200000) {
      modalFileBtn.textContent = infoPhoto.filename;
      infoPhoto.base64 = btoa(event.target.result);
      modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
    } else {
      modalFileBtn.textContent = 'Файл не должен превышать 200кб';
      modalFileInput.value = '';
      checkForm();
    }
  });
});

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
  event.preventDefault();
  const itemObj = {};
  for (const elem of elementsModalSubmit) {
    itemObj[elem.name] = elem.value;
  }
  itemObj.image = infoPhoto.base64;
  dataBase.push(itemObj);
  closeModal({target: modalAdd});
  saveDB();
  renderCard();
})

addAd.addEventListener('click', () => {
  modalAdd.classList.remove('hide');
  modalBtnSubmit.disabled = true;
  document.addEventListener('keydown', closeModal);
});

catalog.addEventListener('click', event => {
  const target = event.target;
  if (target.closest('.card')) {
    modalItem.classList.remove('hide');
    document.addEventListener('keydown', closeModal);
  };
});

modalAdd.addEventListener('click', closeModal);
modalItem.addEventListener('click', closeModal);

renderCard();
