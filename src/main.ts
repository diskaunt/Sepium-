import { Carousel } from '@fancyapps/ui/dist/carousel/';
import '@fancyapps/ui/dist/carousel/carousel.css';

import { Dots } from '@fancyapps/ui/dist/carousel/carousel.dots.js';
import '@fancyapps/ui/dist/carousel/carousel.dots.css';

import { Autoplay } from '@fancyapps/ui/dist/carousel/carousel.autoplay.js';
import '@fancyapps/ui/dist/carousel/carousel.autoplay.css';

import { Arrows } from '@fancyapps/ui/dist/carousel/carousel.arrows.js';
import '@fancyapps/ui/dist/carousel/carousel.arrows.css';

import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

// путь к иконке
const vector = '/public/icon.svg#vector';
const arrow = '/public/icon.svg#arrow';

// функция для рендеринга карточек (проблема в input type="radio" и checkbox, картинках для fancybox)
function renderCards() {
  const list = document.querySelector<HTMLUListElement>('.cardList');
  const template = document.querySelector<HTMLLIElement>('.productCard');
  const btn = `<button type="button" data-expand-action="toggle" class="carousel__button" title="Переключить полноразмерный режим"><svg style="pointer-events: none; width: 1.125rem; height: 1.125rem"> <use href="${vector}"></use> </svg></button>`;

  if (!list || !template) return;

  const cardTemplateHTML = template.outerHTML;
  list.innerHTML = '';

  for (let i = 0; i < 6; i++) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cardTemplateHTML;
    const card = tempDiv.firstElementChild as HTMLElement;
    const inputs = card.querySelectorAll('input');
    const imgs = card.querySelectorAll('.productCard__imageWrapper');
    const carousel = card.querySelector('.f-carousel');

    imgs.forEach((img: any) => {
      const oldDataset = img.dataset.fancybox;
      const newSrc = `${oldDataset}-${i}`;
      img.dataset.dataFancybox = newSrc;
    });

    inputs.forEach((input: any) => {
      const oldId = input.id;
      const newId = `${oldId}-${i}`;
      input.id = newId;
      input.name = `material-${i}`;
      card.querySelector(`label[for="${oldId}"]`)?.setAttribute('for', newId);
    });

    // добавляем кнопку, вешаем нажатие с открытием fancybox
    if (carousel) {
      carousel.id = `carousel-${i}`;
      carousel.innerHTML += btn;
      const button = carousel.querySelector('[data-expand-action="toggle"]');

      button?.addEventListener('click', (e) => {
        e.preventDefault();
        Fancybox.show([
          { src: '/productImage.jpg', type: 'image' },
          { src: '/productImage.jpg', type: 'image' },
          { src: '/productImage.jpg', type: 'image' },
          { src: '/productImage.jpg', type: 'image' },
          { src: '/productImage.jpg', type: 'image' },
          { src: '/productImage.jpg', type: 'image' },
        ]);
      });
    }

    // обработчик для лайков
    const likeInput = card.querySelector<HTMLInputElement>('input[id^="like"]');
    const likeCountSpan = card.querySelector<HTMLElement>(
      '.productCard__like span',
    );

    if (likeInput && likeCountSpan) {
      const initialValue = parseInt(likeCountSpan.textContent || '0', 10);

      likeInput.addEventListener('change', () => {
        if (likeInput.checked) {
          likeCountSpan.textContent = (initialValue + 1).toString();
        } else {
          likeCountSpan.textContent = initialValue.toString();
        }
      });
    }

    // обработчик для открытия карточки в новом окне
    card.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      const isInteractive = target.closest(
        'button, input, label, .f-carousel__slide, a, .carousel__button',
      );

      if (!isInteractive) {
        window.open('/card', '_blank');
      }
    });

    list.appendChild(card);
  }
}

// Функция для определения типа устройства
function getDeviceType() {
  const ua = navigator.userAgent;
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua,
    )
  ) {
    return 'mobile';
  }
  return 'desktop';
}

// Функция для получения конфига карусели
const getCarouselOptions = (isDesktop: boolean) => ({
  Dots: {
    dotTpl:
      '<button data-carousel-go-to="%i" class="carousel__dot"><div></div></button>',
  },

  Autoplay: isDesktop
    ? false
    : {
        timeout: 3000,
      },

  Arrows: {
    prevClass: isDesktop ? 'carousel__arrow' : 'display_none',
    nextClass: isDesktop ? 'carousel__arrow' : 'display_none',
    prevTpl: `<svg style='transform: rotate(180deg); stroke: none'><use href="${arrow}"></use></svg>`,
    nextTpl: `<svg style='stroke: none'><use href="${arrow}"></use></svg>`,
  },
});

// Функция для инициализации карусели
function initAllCarousels() {
  const isDesktop = getDeviceType() === 'desktop';
  const options = getCarouselOptions(isDesktop);
  const carouselNodes = document.querySelectorAll<HTMLElement>('.f-carousel');

  carouselNodes.forEach((node) => {
    const instance = Carousel(node, options, {
      Dots,
      Arrows,
      Autoplay,
    });

    instance.init();
  });
}

renderCards();

initAllCarousels();
