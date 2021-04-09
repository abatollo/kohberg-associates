const ESC_KEYCODE = 27;
const HEADER_SCROLL_BREAKPOINT = 200;

const isEscEvent = (evt, action) => {
  if (evt.keyCode === ESC_KEYCODE) {
    action();
  }
};

const isTarget = (evt, target, action) => {
  if (evt.target === target) {
    action();
  }
};

// Обработка клика по гамбургеру

const headerMain = document.querySelector(`.header-main`);
const headerMainButton = headerMain.querySelector(`.burger-button`);
const headerMainMenu = headerMain.querySelector(`.header-main__menu`);
const headerMainLoginButton = headerMain.querySelector(
  `.header-main__login-button`
);

headerMainButton.addEventListener(`click`, function () {
  headerMainButton.classList.toggle(`burger-button--opened`);
  headerMainMenu.classList.toggle(`header-main__menu--opened`);
  headerMainLoginButton.classList.toggle(`header-main__login-button--opened`);
});

// Обработка клика по кнопкам поинтов

const pointButtons = document.querySelectorAll(`.section-points__item-button`);
const pointModals = document.querySelectorAll(`.modal-point`);

const getPointModal = (dataPointValue) => {
  for (const pointModal of pointModals) {
    if (pointModal.dataset.point === dataPointValue) {
      return (validPointModal = pointModal);
    }
  }
};

const showPointModal = (dataPointValue) => {
  const pointModal = getPointModal(dataPointValue);
  const pointModalClose = pointModal.querySelector(`.modal__close`);

  pointModal.classList.add(`modal--opened`);

  document.addEventListener(`keydown`, onPointModalEscPress);
  pointModal.addEventListener(`click`, onPointModalClick);
  pointModalClose.addEventListener(`click`, hidePointModal);
  removePointButtonListeners();
};

const hidePointModal = () => {
  const pointModal = document.querySelector(`.modal--opened`);
  const pointModalClose = pointModal.querySelector(`.modal__close`);

  pointModal.classList.remove(`modal--opened`);
  document.removeEventListener(`keydown`, onPointModalEscPress);
  pointModal.removeEventListener(`click`, onPointModalClick);
  pointModalClose.removeEventListener(`click`, hidePointModal);
  addPointButtonListeners();
};

const onPointModalEscPress = (evt) => {
  isEscEvent(evt, hidePointModal);
};

const onPointModalClick = (evt) => {
  const pointModal = document.querySelector(`.modal--opened`);

  isTarget(evt, pointModal, hidePointModal);
};

const onPointButtonClick = function (evt) {
  evt.preventDefault();
  showPointModal(this.dataset.point);
};

const addPointButtonListeners = () => {
  for (const pointButton of pointButtons) {
    pointButton.addEventListener(`click`, onPointButtonClick);
  }
};

const removePointButtonListeners = () => {
  for (const pointButton of pointButtons) {
    pointButton.removeEventListener(`click`, onPointButtonClick);
  }
};

addPointButtonListeners();

// Обработка клика по кнопкам фичей

const featureButtons = document.querySelectorAll(
  `.section-features__item:not(.section-features__item--action) .section-features__item-link`
);
const featureModals = document.querySelectorAll(`.modal-feature`);

const getFeatureModal = (dataFeatureValue) => {
  for (const featureModal of featureModals) {
    if (featureModal.dataset.feature === dataFeatureValue) {
      return featureModal;
    }
  }
};

const showFeatureModal = (dataFeatureValue) => {
  const featureModal = getFeatureModal(dataFeatureValue);
  const featureModalClose = featureModal.querySelector(`.modal__close`);

  featureModal.classList.add(`modal--opened`);

  document.addEventListener(`keydown`, onFeatureModalEscPress);
  featureModal.addEventListener(`click`, onFeatureModalClick);
  featureModalClose.addEventListener(`click`, hideFeatureModal);
  removeFeatureButtonListeners();

  addFeatureModalLetter();
};

const hideFeatureModal = () => {
  const featureModal = document.querySelector(`.modal--opened`);
  const featureModalClose = featureModal.querySelector(`.modal__close`);

  featureModal.classList.remove(`modal--opened`);
  document.removeEventListener(`keydown`, onFeatureModalEscPress);
  featureModal.removeEventListener(`click`, onFeatureModalClick);
  featureModalClose.removeEventListener(`click`, hideFeatureModal);
  addFeatureButtonListeners();
};

const onFeatureModalEscPress = (evt) => {
  isEscEvent(evt, hideFeatureModal);
};

const onFeatureModalClick = (evt) => {
  const featureModal = document.querySelector(`.modal--opened`);

  isTarget(evt, featureModal, hideFeatureModal);
};

const onFeatureButtonClick = function (evt) {
  evt.preventDefault();
  showFeatureModal(this.dataset.feature);
};

const addFeatureButtonListeners = () => {
  for (const featureButton of featureButtons) {
    featureButton.addEventListener(`click`, onFeatureButtonClick);
  }
};

const removeFeatureButtonListeners = () => {
  for (const featureButton of featureButtons) {
    featureButton.removeEventListener(`click`, onFeatureButtonClick);
  }
};

addFeatureButtonListeners();

const addFeatureModalLetter = () => {
  const featureModal = document.querySelector(`.modal--opened`);
  const featureModalWrapper = featureModal.querySelector(
    `.modal-feature__wrapper`
  );

  const featureModalLetterElement = document.createElement(`div`);
  featureModalLetterElement.classList.add(`modal-feature__id`);
  featureModalLetterElement.innerHTML = String.fromCharCode(
    64 + Number.parseInt(featureModal.dataset.feature)
  );
  featureModalWrapper.appendChild(featureModalLetterElement);
};

// Обработка клика по кнопкам слайдера с кейсами

const prevButton = document.querySelector(`.section-cases__button--prev`);
const nextButton = document.querySelector(`.section-cases__button--next`);

const slides = document.querySelectorAll(`[data-case]`);

// Проверка на существование slides: если на странице их нет, то это не главная страница

if (slides.length > 0) {
  prevButton.addEventListener(`click`, function () {
    const activeSlide = document.querySelector(
      `.section-cases__wrapper--shown`
    );
    const prevSlide = document.querySelector(
      `[data-case="${Number.parseInt(activeSlide.dataset.case) - 1}"]`
    );

    if (prevSlide !== null) {
      activeSlide.classList.remove(`section-cases__wrapper--shown`);
      prevSlide.classList.add(`section-cases__wrapper--shown`);
    }
  });

  nextButton.addEventListener(`click`, function () {
    const activeSlide = document.querySelector(
      `.section-cases__wrapper--shown`
    );
    const nextSlide = document.querySelector(
      `[data-case="${Number.parseInt(activeSlide.dataset.case) + 1}"]`
    );

    if (nextSlide !== null) {
      activeSlide.classList.remove(`section-cases__wrapper--shown`);
      nextSlide.classList.add(`section-cases__wrapper--shown`);
    }
  });
}

// Обработка клика по кнопкам вопросов-ответов

const faqButtons = document.querySelectorAll(
  `.section-faq__description-item-button`
);

// Проверка на существование faqButtons: если на странице их нет, то это не страница FAQ

if (faqButtons.length > 0) {
  faqButtons.forEach((faqButton) => {
    faqButton.addEventListener(`click`, function () {
      faqButton.parentElement.classList.toggle(
        `section-faq__description-item--active`
      );
    });
  });
}

// Обработка клика по кнопкам услуг и тарифов

const tariffsButtons = document.querySelectorAll(
  `.section-tariffs__item-button`
);

// Проверка на существование tariffsButtons: если на странице их нет, то это не страница услуг и тарифов

if (tariffsButtons.length > 0) {
  tariffsButtons.forEach((tariffsButton) => {
    tariffsButton.addEventListener(`click`, function () {
      tariffsButton.parentElement.classList.toggle(
        `section-tariffs__item--active`
      );
    });
  });
}

// Обработка прокрутки страницы

const onWindowScroll = () => {
  if (window.pageYOffset > HEADER_SCROLL_BREAKPOINT) {
    headerMain.classList.add(`header-main--scrolled`);
  } else {
    headerMain.classList.remove(`header-main--scrolled`);
  }
};

window.addEventListener(`scroll`, onWindowScroll);
