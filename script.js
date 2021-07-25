'use strict';

// Variables
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('header');
const message = document.createElement('div');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const mainHeader = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const allImages = document.querySelectorAll('img[data-src]');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

// Modal window
const openModal = function (e) {
	e.preventDefault();
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

const closeModal = function () {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModal();
	}
});

// Cookie message
message.classList.add('cookie-message');
message.textContent = 'We use cookies for improved functionality and analytics.';
message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

header.prepend(message);

document.querySelector('.btn--close-cookie').addEventListener('click', function () {
	message.remove();
});

message.style.backgroundColor = '#37383d';

// Smooth scroll
btnScrollTo.addEventListener('click', function (e) {
	section1.scrollIntoView({ behavior: 'smooth' });
});

// Page navigation
navLinks.addEventListener('click', function (e) {
	e.preventDefault();
	if (e.target.classList.contains('nav__link')) {
		const id = e.target.getAttribute('href');
		document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
	}
});

// Tabbed component
tabsContainer.addEventListener('click', function (e) {
	const clicked = e.target.closest('.operations__tab');

	if (!clicked) {
		return;
	}

	tabs.forEach(t => t.classList.remove('operations__tab--active'));
	clicked.classList.add('operations__tab--active');

	tabsContent.forEach(c => c.classList.remove('operations__content--active'));
	document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e, opacity) {
	if (e.target.classList.contains('nav__link')) {
		const link = e.target;
		const siblings = link.closest('.nav').querySelectorAll('.nav__link');
		const logo = link.closest('.nav').querySelector('img');

		siblings.forEach(el => {
			if (el !== link) {
				el.style.opacity = this;
			}
			logo.style.opacity = this;
		});
	}
};

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
const stickyNav = function (entries) {
	const [entry] = entries;
	if (!entry.isIntersecting) {
		nav.classList.add('sticky');
	} else {
		nav.classList.remove('sticky');
	}
};

const headerObserver = new IntersectionObserver(stickyNav, {
	root: null,
	threshold: 0,
	rootMargin: `-${navHeight}px`,
});

headerObserver.observe(mainHeader);

// Reveal sections
const revealSection = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) {
		return;
	}

	entry.target.classList.remove('section--hidden');
	observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
	root: null,
	threshold: 0.15,
});

allSections.forEach(function (section) {
	sectionObserver.observe(section);
	section.classList.add('section--hidden');
});

// Lazy loading images
const loadImage = function (entries, observer) {
	const [entry] = entries;

	if (!entry.isIntersecting) {
		return;
	}

	entry.target.src = entry.target.dataset.src;

	entry.target.addEventListener('load', function (e) {
		entry.target.classList.remove('lazy-img');
	});

	observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImage, {
	root: null,
	threshold: 0,
	rootMargin: '200px',
});

allImages.forEach(img => imageObserver.observe(img));

// Slider
const slider = function () {
	let currentSlide = 0;
	const maxSlide = slides.length;

	const createDots = function () {
		slides.forEach(function (_, i) {
			dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button`);
		});
	};

	const activateDot = function (slide) {
		document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
		document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
	};

	const goToSlide = function (slide) {
		slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
	};

	const nextSlide = function () {
		if (currentSlide === maxSlide - 1) {
			currentSlide = 0;
		} else {
			currentSlide++;
		}
		goToSlide(currentSlide);
		activateDot(currentSlide);
	};

	const prevSlide = function () {
		if (currentSlide === 0) {
			currentSlide = maxSlide - 1;
		} else {
			currentSlide--;
		}
		goToSlide(currentSlide);
		activateDot(currentSlide);
	};

	const initSlider = function () {
		goToSlide(0);
		createDots();
		activateDot(0);
	};

	initSlider();

	btnRight.addEventListener('click', nextSlide);
	btnLeft.addEventListener('click', prevSlide);

	document.addEventListener('keydown', function (e) {
		if (e.key === 'ArrowLeft') {
			prevSlide();
		} else if (e.key === 'ArrowRight') {
			nextSlide();
		}
	});

	dotContainer.addEventListener('click', function (e) {
		if (e.target.classList.contains('dots__dot')) {
			const { slide } = e.target.dataset;
			goToSlide(slide);
			activateDot(currentSlide);
		}
	});
};

slider();
