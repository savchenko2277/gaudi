import { throttle } from "./libs/utils";
import "./polyfills.js";
import "./blocks.js";
import LocomotiveScroll from 'locomotive-scroll';
import { scrollBasedToggle } from "./libs/scrollBasedToggle.js";
import Lenis from 'lenis'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Navigation, EffectFade, Pagination, Mousewheel } from "swiper/modules";
import { tweakerRangeDouble } from "./libs/tweakerRangeDouble.js";
import { driveTabs } from "./libs/driveTabs";

let lenis;

// Функции

const disableScroll = () => {
	lenis.stop();
	document.body.style.overflow = 'hidden';
}

const enableScroll = () => {
	lenis.start();
	document.body.style.overflow = 'unset';
}

// Единицы высоты (ширины) экрана
function updateVH() {
	const { height = window.innerHeight, width = window.innerWidth } = window.visualViewport || {};

	document.documentElement.style.setProperty('--vh', `${height * 0.01}px`);
	['resize', 'orientationchange'].forEach(event => {
		window.addEventListener(event, throttle(updateVH, 200), { passive: true });
	});
}

// Ширина скроллбара
const setScrollbarWidth = () => {
	document.documentElement.style.setProperty('--sw', `${window.innerWidth - document.documentElement.clientWidth}px`);
}

const setHeader = () => {
	const header = document.querySelector('header');
	if (!header) return;

	const burger = header.querySelector('.header__burger');
	const colorSections = Array.from(document.querySelectorAll('[data-header-color]'));
	const COLOR_LOCK_ATTR = 'data-header-color-lock';

	let lastScrollY = 0;

	const hasHeaderColorLock = () => {
		const root = document.documentElement;
		const body = document.body;

		return header.hasAttribute(COLOR_LOCK_ATTR)
			|| body?.hasAttribute(COLOR_LOCK_ATTR)
			|| root?.hasAttribute(COLOR_LOCK_ATTR);
	};

	const clearHeaderMods = () => {
		if (hasHeaderColorLock()) return;

		header.classList.forEach(cls => {
			if (cls.startsWith('header_')) {
				header.classList.remove(cls);
			}
		});
	};

	const applyHeaderColorFromSections = () => {
		if (!colorSections.length) return;
		if (hasHeaderColorLock()) return;

		if (header.classList.contains('is-open')) {
			clearHeaderMods();
			return;
		}

		const headerHeight = header.offsetHeight || 0;
		let applied = false;

		for (const section of colorSections) {
			const rect = section.getBoundingClientRect();
			const intersects = rect.top < headerHeight && rect.bottom > 0;

			if (intersects) {
				const color = section.dataset.headerColor?.trim();
				clearHeaderMods();

				if (color) {
					header.classList.add(`header_${color}`);
				}

				applied = true;
				break;
			}
		}

		if (!applied) {
			clearHeaderMods();
		}
	};

	const syncHeaderColor = throttle(applyHeaderColorFromSections, 100);

	window.addEventListener('scroll', () => {
		const scrollY = window.scrollY;
		const delta = scrollY - lastScrollY;

		if (scrollY > 50 && delta > 0) {
			header.classList.add('is-scroll');
		} else {
			header.classList.remove('is-scroll');
		}

		lastScrollY = scrollY;

		syncHeaderColor();
	});

	burger?.addEventListener('click', () => {
		header.classList.toggle('is-open');

		if (header.classList.contains('is-open')) {
			clearHeaderMods();
			disableScroll();
		} else {
			syncHeaderColor();
			enableScroll();
		}
	});

	window.addEventListener('resize', syncHeaderColor);
	syncHeaderColor();
}

const setSmoothPageScroll = () => {

	lenis = new Lenis({
		smooth: true,
		prevent: (node) => {
			return node.closest('.modal') || node.closest('.header__menu');
		}
	});


	lenis.on('scroll', ScrollTrigger.update);

	gsap.ticker.add((time) => {
		lenis.raf(time * 500);
	});

	gsap.ticker.lagSmoothing(0);
}

const setBlockAnimation = () => {
	const setGsapAnimations = () => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.config({
			nullTargetWarn: false
		});


		if (window.matchMedia("(min-width: 960px)").matches) {
			gsap.fromTo(".promo__circle",
				{
					"--after-opacity": 0,
					width: "20%",
					borderRadius: "100%",
					y: "-20%",
					x: "-50%",
				},
				{
					"--after-opacity": 0.4,
					width: "100%",
					borderRadius: "0%",
					y: "-50%",
					x: "-50%",
					ease: "none",
					scrollTrigger: {
						trigger: ".promo",
						start: "0% top",
						end: "30% top",
						scrub: true,
					},
					onComplete: () => {
						// document.querySelector('.promo__circle').style.aspectRatio = "auto";
					}
				}
			);
			gsap.fromTo(".location-main__location-title",
				{
					x: "0%",
				},
				{
					x: "-50%",
					ease: "none",
					scrollTrigger: {
						trigger: ".location-main__block_first",
						start: "-20% top",
						end: "50% top",
						scrub: true
					}
				}
			);
			gsap.fromTo(".ecology__text",
				{
					y: "0%",
				},
				{
					y: "-50%",
					ease: "none",
					scrollTrigger: {
						trigger: ".ecology",
						start: "0% top",
						end: "100% top",
						scrub: true
					}
				}
			);
			gsap.fromTo(".ecology__photo",
				{
					y: "-50%",
					x: "-50%",
				},
				{
					y: "-120%",
					x: "-50%",
					ease: "none",
					scrollTrigger: {
						trigger: ".ecology",
						start: "0% top",
						end: "100% top",
						scrub: true
					}
				}
			);
		} else {
			gsap.fromTo(".promo__circle",
				{
					"--after-opacity": 0,
					height: "35%",
					borderRadius: "100%",
				},
				{
					"--after-opacity": 0.4,
					height: "100%",
					borderRadius: "0%",
					ease: "none",
					scrollTrigger: {
						trigger: ".promo",
						start: "0% top",
						end: "30% top",
						scrub: true,
					},
					onComplete: () => {
						// document.querySelector('.promo__circle').style.aspectRatio = "auto";
					}
				}
			);
			gsap.fromTo(".ecology__photo",
				{
					y: "-50%",
					x: "-50%",
				},
				{
					y: "-150%",
					x: "-50%",
					ease: "none",
					scrollTrigger: {
						trigger: ".ecology",
						start: "0% top",
						end: "30% top",
						scrub: true
					}
				}
			);
			gsap.fromTo(".about-apartaments__title span",
				{
					x: 0
				},
				{
					x: "-20%",
					ease: "none",
					scrollTrigger: {
						trigger: ".about-apartaments",
						start: "0% top",
						end: "30% top",
						scrub: true,
					},
					onComplete: () => {
						// document.querySelector('.promo__circle').style.aspectRatio = "auto";
					}
				}
			);
		}

		gsap.fromTo(".promo__desc_first",
			{
				opacity: 1,
			},
			{
				opacity: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".promo",
					start: "0% top",
					end: "30% top",
					scrub: true,
				},
				onComplete: () => {
					// document.querySelector('.promo__circle').style.aspectRatio = "auto";
				}
			}
		);

		gsap.fromTo(".promo__block_second",
			{ opacity: 0 },
			{
				opacity: 1,
				ease: "none",
				scrollTrigger: {
					trigger: ".promo",
					start: "30% top",
					end: "60% top",
					scrub: true
				}
			}
		);

		gsap.fromTo(".apartaments__title span",
			{
				opacity: 0,
				y: -100
			},
			{
				opacity: 1,
				y: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".apartaments",
					start: "10% top",
					end: "30% top",
					scrub: true,
				}
			}
		);

		gsap.fromTo(".apartaments__chooses",
			{
				opacity: 0,
				y: -100
			},
			{
				opacity: 1,
				y: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".apartaments",
					start: "20% top",
					end: "40% top",
					scrub: true,
				}
			}
		);

		gsap.fromTo(".apartaments__wrapper",
			{
				// borderRadius: "40% 40% 0 0",
			},
			{
				borderRadius: "0% 0% 0 0",
				ease: "none",
				scrollTrigger: {
					trigger: ".apartaments",
					start: "-20% top",
					end: "30% top",
					scrub: true,
				}
			}
		);

		gsap.fromTo('.ecology__title',
			{
				opacity: 0,
				y: -100
			},
			{
				opacity: 1,
				y: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".ecology",
					start: "-50% top",
					end: "-20% top",
					scrub: true
				}
			}
		);

		gsap.fromTo('.estetic__title',
			{
				opacity: 0,
				y: -100
			},
			{
				opacity: 1,
				y: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".estetic",
					start: "-50% top",
					end: "-20% top",
					scrub: true
				}
			}
		);

		gsap.fromTo(".infrostructure__title span",
			{
				x: "0%",
			},
			{
				x: "-50%",
				ease: "none",
				scrollTrigger: {
					trigger: ".infrostructure",
					start: "-20% top",
					end: "20% top",
					scrub: true
				}
			}
		);

		document?.querySelectorAll(".infrostructure__project").forEach((item, index) => {
			const image = item.querySelector(".infrostructure__project-image img");

			gsap.fromTo(image,
				{ y: 0 },
				{
					y: -50,
					ease: "none",
					scrollTrigger: {
						trigger: ".infrostructure",
						start: "0% top",
						end: "50% top",
						scrub: true
					}
				}
			);
		});

	};

	setGsapAnimations();
};

const setParallax = () => {
	const parallaxBlocks = document.querySelectorAll('[data-parallax]');

	parallaxBlocks.forEach(block => {
		const items = block.querySelectorAll('[data-parallax-item]');

		let mouseX = 0, mouseY = 0;

		block.addEventListener('mousemove', e => {
			const rect = block.getBoundingClientRect();
			mouseX = e.clientX - rect.left - rect.width / 2;
			mouseY = e.clientY - rect.top - rect.height / 2;
		});

		block.addEventListener('mouseleave', () => {
			mouseX = 0;
			mouseY = 0;
		});

		const states = Array.from(items).map(() => ({ x: 0, y: 0 }));

		function animate() {
			items.forEach((item, index) => {
				const data = item.dataset.parallaxItem.split(',');
				const radius = parseFloat(data[0]) || 10;
				const speed = parseFloat(data[1]) || 0.1;

				states[index].x += (mouseX - states[index].x) * speed;
				states[index].y += (mouseY - states[index].y) * speed;

				const translateX = (states[index].x / (block.offsetWidth / 2)) * radius;
				const translateY = (states[index].y / (block.offsetHeight / 2)) * radius;

				item.style.transform = `translate(${translateX}px, ${translateY}px)`;
			});

			requestAnimationFrame(animate);
		}

		animate();
	});
}

const setGallery = () => {
	class EsteticGallery {
		constructor(selector) {
			this.root = document.querySelector(selector);
			if (!this.root) return;

			this.current = this.root.querySelector('.estetic__gallery-current');
			this.images = Array.from(this.root.querySelectorAll('.estetic__gallery-image'));

			this.prevBtn = this.root.querySelector('.estetic__navigation-button-prev');
			this.nextBtn = this.root.querySelector('.estetic__navigation-button-next');

			this.index = 0;

			this.init();
		}

		init() {
			this.updateGallery();

			this.prevBtn.addEventListener('click', () => this.prev());
			this.nextBtn.addEventListener('click', () => this.next());

			this.images.forEach((img, i) => {
				img.addEventListener('click', () => {
					this.index = i;
					this.updateGallery();
				});
			});
		}

		updateGallery() {
			this.current.src = this.images[this.index].querySelector('img').src;

			this.current.classList.remove('active');

			setTimeout(() => {
				this.current.classList.add('active');
			}, 100);

			this.images.forEach(img => {
				img.classList.remove('active');
				img.classList.remove('hidden');
			});

			const activeImg = this.images[this.index];
			activeImg.classList.add('active');
			activeImg.classList.add('hidden');
		}

		prev() {
			this.index--;
			if (this.index < 0) this.index = this.images.length - 1;
			this.updateGallery();
		}

		next() {
			this.index++;
			if (this.index > this.images.length - 1) this.index = 0;
			this.updateGallery();
		}
	}

	new EsteticGallery('.estetic__gallery');
}

const setLocationSwipers = () => {
	const roadPhotos = Array.from(document.querySelectorAll('.location-main__photos .location-main__photo'));

	const updateRoadPhotos = (slideEl) => {
		if (!slideEl || !roadPhotos.length) return;

		const sources = [
			slideEl.dataset.photoPrimary || slideEl.dataset.photoFirst || slideEl.dataset.photo1,
			slideEl.dataset.photoSecondary || slideEl.dataset.photoSecond || slideEl.dataset.photo2
		];

		roadPhotos.forEach((img, index) => {
			const nextSrc = sources[index];
			if (!nextSrc) return;
			if (img.getAttribute('src') === nextSrc) return;

			img.src = nextSrc;
		});
	};

	const aboutSwiper = new Swiper('.location-main__about-swiper', {
		modules: [Navigation],
		slidesPerView: 1,
		spaceBetween: 30,
		loop: true,

		navigation: {
			nextEl: '.location-main__about .location-main__navigation-btn_next',
			prevEl: '.location-main__about .location-main__navigation-btn_prev',
		},
		on: {
			slideChange: function () {
				const activeSlide = this.slides[this.activeIndex];

				const imageSrc = activeSlide.dataset.src;
				const name = activeSlide.dataset.name;
				const nameEl = document.querySelector('.location-main__name');
				const image = document.querySelector('.location-main__location-image');

				image.classList.remove('active');

				setTimeout(() => {
					image.classList.add('active');
				}, 100);

				image.src = imageSrc;
				nameEl.textContent = name;
			}
		}
	});

	const roadSwiper = new Swiper('.location-main__road-swiper', {
		modules: [Navigation, EffectFade],
		slidesPerView: 1,
		spaceBetween: 30,
		effect: 'fade',
		effectFade: {
			crossFade: true
		},
		loop: true,
		autoHeight: true,
		navigation: {
			nextEl: '.location-main__road .location-main__navigation-btn_next',
			prevEl: '.location-main__road .location-main__navigation-btn_prev',
		},
		on: {
			init: function () {
				updateRoadPhotos(this.slides[this.activeIndex]);
			},
			slideChange: function () {
				updateRoadPhotos(this.slides[this.activeIndex]);
			}
		}
	});
}

class AboutApartamentsAdaptive {
	constructor(section) {
		this.section = section;
		this.cards = Array.from(section.querySelectorAll('.about-apartaments__card'));
		this.cardOrigins = new Map();
		this.cards.forEach(card => {
			this.cardOrigins.set(card, {
				parent: card.parentElement,
				nextSibling: card.nextElementSibling
			});
		});

		this.swiperEl = section.querySelector('[data-about-apartaments-swiper]');
		this.wrapper = this.swiperEl?.querySelector('.about-apartaments__swiper-wrapper');
		this.prevBtn = section.querySelector('[data-about-apartaments-nav="prev"]');
		this.nextBtn = section.querySelector('[data-about-apartaments-nav="next"]');
		this.paginationEl = section.querySelector('[data-about-apartaments-pagination]');

		this.mediaQuery = window.matchMedia('(max-width: 960px)');
		this.swiper = null;
		this.handleMode = this.handleMode.bind(this);

		if (!this.cards.length || !this.swiperEl || !this.wrapper) return;

		this.handleMode(this.mediaQuery);

		if (typeof this.mediaQuery.addEventListener === 'function') {
			this.mediaQuery.addEventListener('change', this.handleMode);
		} else if (typeof this.mediaQuery.addListener === 'function') {
			this.mediaQuery.addListener(this.handleMode);
		}
	}

	handleMode(event) {
		const matches = typeof event?.matches === 'boolean' ? event.matches : this.mediaQuery.matches;

		if (matches) {
			this.enable();
		} else {
			this.disable();
		}
	}

	enable() {
		if (this.swiper) return;

		this.cards.forEach(card => {
			card.classList.add('swiper-slide');
			card.removeAttribute('style');
			this.wrapper.appendChild(card);
		});

		const navigation = (this.prevBtn && this.nextBtn) ? {
			prevEl: this.prevBtn,
			nextEl: this.nextBtn
		} : undefined;

		const pagination = this.paginationEl ? {
			el: this.paginationEl,
			type: 'fraction'
		} : undefined;

		this.swiper = new Swiper(this.swiperEl, {
			modules: [Navigation, Pagination],
			slidesPerView: 1,
			spaceBetween: 20,
			navigation,
			pagination
		});
	}

	disable() {
		if (!this.swiper) return;

		this.swiper.destroy(true, true);
		this.swiper = null;

		this.cards.forEach(card => {
			card.classList.remove('swiper-slide', 'swiper-slide-active', 'swiper-slide-next', 'swiper-slide-prev');
			card.removeAttribute('style');

			const origin = this.cardOrigins.get(card);
			if (!origin?.parent) return;

			const reference = origin.nextSibling && origin.nextSibling.parentNode === origin.parent
				? origin.nextSibling
				: null;

			origin.parent.insertBefore(card, reference);
		});

		if (this.paginationEl) {
			this.paginationEl.innerHTML = '';
		}
	}
}

const setAboutApartamentsSwiper = () => {
	const sections = document.querySelectorAll('.about-apartaments');
	if (!sections.length) return;

	sections.forEach(section => new AboutApartamentsAdaptive(section));
};

const setClassOnClick = () => {
	const elements = document.querySelectorAll('[data-section-click]');
	if (!elements.length) return;

	const handlers = [];

	elements.forEach(element => {
		const trigger = element.querySelector('[data-item-click]');
		if (!trigger) return;

		const className = trigger.dataset.itemClick?.trim();
		if (!className) return;

		const toggle = (event) => {
			event.preventDefault();
			event.stopPropagation();
			element.classList.toggle(className);
		};

		trigger.addEventListener('click', toggle);
		handlers.push({ element, className });
	});

	if (!handlers.length) return;

	document.addEventListener('click', (event) => {
		handlers.forEach(({ element, className }) => {
			if (!element.contains(event.target)) {
				element.classList.remove(className);
			}
		});
	});
};

const setPathsPosition = () => {
	const blocks = document.querySelectorAll('[data-path-popup]');
	if (!blocks.length) return;

	blocks.forEach(block => {
		const containerSelector = block.dataset.pathPopupContainer || '.parking__container';
		const popupSelector = block.dataset.pathPopupPopup || '.parking__popup';
		const pathSelector = block.dataset.pathPopupPaths || 'path';
		const container = containerSelector ? block.querySelector(containerSelector) : block;
		const popup = block.querySelector(popupSelector);
		if (!container || !popup) return;

		const paths = container.querySelectorAll(pathSelector);
		if (!paths.length) return;

		const relativeElement = popup.offsetParent instanceof HTMLElement ? popup.offsetParent : container;
		const referenceRect = relativeElement.getBoundingClientRect();

		paths.forEach(path => {
			const pathLength = path.getTotalLength();
			path.setAttribute('stroke-dasharray', pathLength);
			path.setAttribute('stroke-dashoffset', pathLength);

			const rect = path.getBoundingClientRect();
			const offsets = {
				top: rect.top - referenceRect.top,
				right: referenceRect.right - rect.right,
				bottom: referenceRect.bottom - rect.bottom,
				left: rect.left - referenceRect.left
			};

			Object.entries(offsets).forEach(([direction, value]) => {
				const rounded = Math.round(value);
				path.style.setProperty(`--offset-${direction}`, `${rounded}px`);
				const datasetKey = `offset${direction.charAt(0).toUpperCase()}${direction.slice(1)}`;
				path.dataset[datasetKey] = `${rounded}`;
			});
		});
	});
};

const setPathOnClick = () => {
	const blocks = document.querySelectorAll('[data-path-popup]');
	if (!blocks.length) return;

	const xlgQuery = window.matchMedia('(max-width: 1280px)');
	const hoverNoneQuery = window.matchMedia('(hover: none)');
	const pointerCoarseQuery = window.matchMedia('(pointer: coarse)');
	const isTouchDevice = () => hoverNoneQuery.matches || pointerCoarseQuery.matches;

	blocks.forEach(block => {
		const containerSelector = block.dataset.pathPopupContainer || '.parking__container';
		const popupSelector = block.dataset.pathPopupPopup || '.parking__popup';
		const pathSelector = block.dataset.pathPopupPaths || 'path';
		const triggerDesktop = block.dataset.pathPopupTrigger || 'click';
		const triggerMobile = block.dataset.pathPopupTriggerMobile || triggerDesktop;
		const activeTrigger = isTouchDevice() ? triggerMobile : triggerDesktop;
		const horizontalAlign = block.dataset.pathPopupAlign || 'center';
		const verticalAlign = block.dataset.pathPopupVertical || 'auto';
		const shiftX = Number(block.dataset.pathPopupShiftX || 0);
		const shiftY = Number(block.dataset.pathPopupShiftY || 0);

		const container = containerSelector ? block.querySelector(containerSelector) : block;
		const popup = block.querySelector(popupSelector);
		if (!container || !popup) return;

		const paths = container.querySelectorAll(pathSelector);
		if (!paths.length) return;

		const pathElements = Array.from(paths);
		const relativeElement = popup.offsetParent instanceof HTMLElement ? popup.offsetParent : container;

		const getOffset = (path, axis = 'top') => {
			const datasetMap = {
				left: 'offsetLeft',
				right: 'offsetRight',
				bottom: 'offsetBottom',
				top: 'offsetTop'
			};
			const datasetKey = datasetMap[axis] || 'offsetTop';
			const stored = Number(path.dataset[datasetKey]);
			if (!Number.isNaN(stored)) {
				return stored;
			}

			const referenceRect = relativeElement.getBoundingClientRect();
			const rect = path.getBoundingClientRect();
			switch (axis) {
				case 'left':
					return rect.left - referenceRect.left;
				case 'right':
					return referenceRect.right - rect.right;
				case 'bottom':
					return referenceRect.bottom - rect.bottom;
				default:
					return rect.top - referenceRect.top;
			}
		};

		const positionPopup = (path) => {
			const rect = path.getBoundingClientRect();
			const offsetTop = getOffset(path, 'top');
			const offsetLeft = getOffset(path, 'left');
			const offsetRight = horizontalAlign === 'right' ? getOffset(path, 'right') : null;
			const delta = rect.height * 0.5;
			const prefersLower = xlgQuery.matches;
			const popupHeight = popup.offsetHeight || 0;
			const popupWidth = popup.offsetWidth || 0;

			let top;
			if (verticalAlign === 'center') {
				const popupHalf = popupHeight * 0.5;
				top = offsetTop + delta - popupHalf + shiftY;
			} else {
				top = (prefersLower ? offsetTop + delta : offsetTop - delta) + shiftY;
			}

			let left = offsetLeft - rect.width * 0.5 + shiftX;
			let right = null;

			popup.style.left = '';
			popup.style.right = '';

			if (horizontalAlign === 'left') {
				left = offsetLeft + shiftX;
			} else if (horizontalAlign === 'right' && offsetRight !== null) {
				left = null;
				right = offsetRight + shiftX;
			} else if (horizontalAlign === 'outside-right') {
				left = offsetLeft + rect.width + shiftX;
			} else if (horizontalAlign === 'outside-left') {
				left = offsetLeft - popupWidth + shiftX;
			}

			popup.style.top = `${Math.round(top)}px`;
			if (left !== null) {
				popup.style.left = `${Math.round(left)}px`;
			} else if (right !== null) {
				popup.style.right = `${Math.round(right)}px`;
			}
			popup.classList.add('active');
		};

		const hidePopup = () => {
			popup.classList.remove('active');
		};

		const handleDocumentClick = (event) => {
			const target = event.target;
			if (!(target instanceof Element)) {
				hidePopup();
				return;
			}

			if (popup.contains(target)) return;
			const clickedPath = target.closest('path');
			if (clickedPath && pathElements.includes(clickedPath)) return;

			hidePopup();
		};

		if (activeTrigger === 'hover') {
			pathElements.forEach(path => {
				path.addEventListener('mouseenter', () => positionPopup(path));
			});

			block.addEventListener('mouseleave', hidePopup);
		} else {
			pathElements.forEach(path => {
				path.addEventListener('click', (event) => {
					event.preventDefault();
					event.stopPropagation();
					positionPopup(path);
				});
			});
		}

		document.addEventListener('click', handleDocumentClick);
	});
};

const setParamsRanges = () => {
	const rangeBlocks = document.querySelectorAll('.js-range');
	if (!rangeBlocks.length) return;

	rangeBlocks.forEach((range) => {
		tweakerRangeDouble(range, {
			class: 'params__range',
			input: false
		});
	});
}

const setParamsAdaptive = () => {
	const block = document.querySelector('.params');
	if (!block) return;

	const mobileContainer = block.querySelector('.params__popup-filters');
	const desktopContainer = block.querySelector('.params__up');
	const paramsFilters = block.querySelector('.params__filters');

	const popup = block.querySelector('.params__popup');
	const closeBtn = popup.querySelector('.params__popup-close');

	closeBtn.addEventListener('click', () => {
		popup.classList.remove('is-show');
	});

	const resultBtn = block.querySelector(".params__result-btn");

	resultBtn.addEventListener('click', () => {
		popup.classList.toggle('is-show');
	});

	if (!mobileContainer || !desktopContainer) return;

	if (window.matchMedia('(min-width: 640px)').matches) {
		desktopContainer.appendChild(paramsFilters);
	} else {
		mobileContainer.appendChild(paramsFilters);
	}

}

const setNewsModal = () => {
	const block = document.querySelector('.news');

	if (!block) return;

	const modal = document.querySelector('.news-modal');
	const items = block.querySelectorAll('.news__item');

	const modalTitle = modal.querySelector('.news-modal__title');
	const modalText = modal.querySelector('.news-modal__text');
	const modalDate = modal.querySelector('.news-modal__date');

	items.forEach(item => {
		const itemInfo = item.querySelector('.news__item-hidden');
		if (!itemInfo) return;

		const itemTitle = item.querySelector('.news__item-title').innerHTML;
		const itemText = item.querySelector('.news__item-text').innerHTML;
		const itemDate = item.querySelector('.card-b__title').innerHTML;

		item.addEventListener('click', () => {
			modalDate.innerHTML = itemDate;
			modalText.innerHTML = itemText;
			modalTitle.innerHTML = itemTitle;

			modal.classList.add('active');
			disableScroll();
		})
	});
}

const setModals = () => {
	const modals = document.querySelectorAll('.modal');
	const modalOpens = document.querySelectorAll('[data-modal-open]');

	modalOpens.forEach(modalOpen => {
		modalOpen.addEventListener('click', (e) => {
			e.preventDefault();

			const modal = modalOpen.dataset.modalOpen ? document.querySelector(modalOpen.dataset.modalOpen) : modalOpen.closest('.modal');

			modal.classList.add('active');
			disableScroll();
		});
	});

	modals.forEach(modal => {

		modal.addEventListener('click', (event) => {

			if (event.target.closest('.modal__close')) {
				modal.classList.remove('active');
				enableScroll();
				return;
			}

			if (!event.target.closest('.modal__content')) {
				modal.classList.remove('active');
				enableScroll();
			}
		});
	});
};

const setStepsGallery = () => {
	const section = document.querySelector('.steps');
	const gallery = document.querySelector('.steps-gallery');

	if (!section || !gallery) return;

	const cards = Array.from(section.querySelectorAll('.steps__card'));
	if (!cards.length) return;

	const imageEl = gallery.querySelector('.steps-gallery__image img');
	const imageCounter = gallery.querySelector('.steps-gallery__image-counter');
	const thumbsContainer = gallery.querySelector('[data-steps-gallery-thumbs]');
	const closeTriggers = gallery.querySelectorAll('[data-steps-gallery-close]');
	const prevBtn = gallery.querySelector('[data-steps-gallery-prev]');
	const nextBtn = gallery.querySelector('[data-steps-gallery-next]');

	let items = [];
	let currentIndex = 0;

	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			close();
		} else if (event.key === 'ArrowRight') {
			move(1);
		} else if (event.key === 'ArrowLeft') {
			move(-1);
		}
	};

	const updateCounter = () => {
		if (!imageCounter) return;
		imageCounter.textContent = `${currentIndex + 1} / ${items.length}`;
	};

	const renderThumbs = () => {
		if (!thumbsContainer) return;
		thumbsContainer.innerHTML = '';

		const previews = items
			.map((item, index) => ({ ...item, index }))
			.filter(({ index }) => index !== currentIndex)
			.slice(0, 4);

		previews.forEach((preview, idx) => {
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'steps-gallery__thumb';
			btn.style.backgroundImage = `url(${preview.src})`;
			btn.dataset.index = `${preview.index}`;

			if (idx === 0) {
				const badge = document.createElement('span');
				badge.className = 'steps-gallery__thumb-counter';
				badge.textContent = `${currentIndex + 1} / ${items.length}`;
				btn.appendChild(badge);
			}

			thumbsContainer.appendChild(btn);
		});
	};

	const render = () => {
		if (!items.length || !imageEl) return;

		const active = items[currentIndex];
		imageEl.src = active.src;
		imageEl.alt = active.alt;

		updateCounter();
		renderThumbs();
	};

	const move = (direction = 1) => {
		if (!items.length) return;

		currentIndex += direction;

		if (currentIndex >= items.length) {
			currentIndex = 0;
		} else if (currentIndex < 0) {
			currentIndex = items.length - 1;
		}

		render();
	};

	const close = () => {
		gallery.classList.remove('is-open');
		enableScroll();
		document.removeEventListener('keydown', handleKeydown);
	};

	const open = (card) => {
		const cardImages = Array.from(card.querySelectorAll('.steps__card-images img'));
		if (!cardImages.length) return;

		items = cardImages.map(img => ({
			src: img.dataset.full || img.src,
			alt: img.alt || ''
		}));

		const mainImage = card.querySelector('.steps__card-image img');
		const mainSrc = mainImage?.src;
		const matchIndex = items.findIndex(item => item.src === mainSrc);
		currentIndex = matchIndex >= 0 ? matchIndex : 0;

		render();
		gallery.classList.add('is-open');
		disableScroll();
		document.addEventListener('keydown', handleKeydown);
	};

	cards.forEach(card => {
		card.addEventListener('click', (event) => {
			event.preventDefault();
			open(card);
		});
	});

	closeTriggers.forEach(trigger => {
		trigger.addEventListener('click', () => close());
	});

	prevBtn?.addEventListener('click', () => move(-1));
	nextBtn?.addEventListener('click', () => move(1));

	thumbsContainer?.addEventListener('click', (event) => {
		const target = event.target.closest('.steps-gallery__thumb');
		if (!target) return;

		const nextIndex = Number(target.dataset.index);
		if (!Number.isNaN(nextIndex)) {
			currentIndex = nextIndex;
			render();
		}
	});
};

const setStepsTabs = () => {
	const block = document.querySelector('.steps');
	if (!block) return;

	const btnNext = block.querySelector('.steps__navigation-btn_next');
	const btnPrev = block.querySelector('.steps__navigation-btn_prev');
	const tabsItems = block.querySelector('.steps__tab');

	const tabs = driveTabs({
		container: '.steps__body',
		controls: '.steps__button',
		selects: '.steps__tab',
		cls: 'active',
		onTick(i) {
			if (i === 0) {
				btnPrev.classList.add('disabled');
				btnNext.classList.remove('disabled');
			} else if (i >= 0 && i < tabsItems.length - 1) {
				btnPrev.classList.remove('disabled');
				btnNext.classList.remove('disabled');
			} else {
				btnNext.classList.add('disabled');
				btnPrev.classList.remove('disabled');
			}
		}
	});

	btnNext.addEventListener('click', () => {
		tabs.move(1);
	});
	btnPrev.addEventListener('click', () => {
		tabs.move(-1);
	});
}

const setGallerySwipers = () => {
	const gallery = document.querySelector('.gallery');
	if (!gallery) return;

	const modals = gallery.querySelectorAll('.gallery-slide__modal');
	if (!modals.length) return;

	const closeBtns = gallery.querySelectorAll('.gallery-slide__modal-close');

	closeBtns.forEach(item => {
		item.addEventListener('click', () => {
			item.closest('.gallery-slide__modal').classList.remove('active');
		});
	});

	modals.forEach(item => {
		const sliderEl = item.querySelector('.swiper');

		if (!sliderEl) return;

		const swiper = new Swiper(sliderEl, {
			slidesPerView: 2,
			spaceBetween: 0,
			centeredSlides: false,
			direction: 'vertical',
			breakpoints: {
				960: {
					slidesPerView: 1.5,
					spaceBetween: 40,
					direction: 'horizontal',
					centeredSlides: true,
				},
				1280: {
					slidesPerView: 2,
					spaceBetween: 40,
					direction: 'horizontal',
					centeredSlides: true,
				},
				1440: {
					slidesPerView: 2.5,
					spaceBetween: 40,
					direction: 'horizontal',
					centeredSlides: true,
				}
			},

			on: {
				init() {
					updatePagination(this);
				},

				slideChange() {
					updatePagination(this);
				}
			}
		});

		function updatePagination(swiperInstance) {
			const pagination = item.querySelector('.gallery-slide__modal-pagination');
			if (!pagination) return;

			const currentText = pagination.querySelector('.gallery-slide__modal-current');
			const allText = pagination.querySelector('.gallery-slide__modal-all');

			currentText.textContent = swiperInstance.realIndex + 1;
			allText.textContent = swiperInstance.slides.length;
		}
	});

	const mainSwiper = new Swiper('.gallery__swiper', {
		modules: [Navigation],
		slidesPerView: 2,
		spaceBetween: 60,
		centeredSlides: true,
		initialSlide: 1,
		loop: true,
		direction: 'vertical',
		overflow: 'visible',
		navigation: {
			nextEl: '.gallery__navigation-btn_next',
			prevEl: '.gallery__navigation-btn_prev',
		},
		breakpoints: {
			1024: {
				direction: 'horizontal',
				spaceBetween: 80,
			},
			1280: {
				direction: 'horizontal',
				spaceBetween: 100,
			},
			1440: {
				direction: 'horizontal',
				spaceBetween: 157,
			},
			960: {
				direction: 'horizontal',
			},
		},
		on: {
			init() {
				const buttons = document.querySelectorAll('.gallery-slide__btn');

				buttons.forEach(item => {
					item.addEventListener('click', () => {
						modals[item.dataset.openModalGallery - 1].classList.add('active');
					});
				});
			}
		}
	});
}

const setPlanScript = () => {
	const block = document.querySelector('.plan');
	if (!block) return;

	const tabs = driveTabs({
		container: block,
		controls: '.plan-second__navigation-btn',
		selects: '.plan-second__tab',
		cls: 'active'
	});

	const planSecond = block.querySelector('.plan-second');
	const backLink = planSecond?.querySelector('.plan-second__back');
	const desktopQuery = window.matchMedia('(min-width: 961px)');

	const openPlanSecond = () => {
		if (!planSecond || !desktopQuery.matches) return;
		if (!planSecond.classList.contains('active')) {
			planSecond.classList.add('active');
			disableScroll();
			document.querySelector(".header").classList.add("header_green");
		}
	};

	const closePlanSecond = () => {
		if (!planSecond) return;
		if (planSecond.classList.contains('active')) {
			planSecond.classList.remove('active');
			enableScroll();
			document.querySelector(".header").classList.remove("header_green");
		}
	};

	const handleViewportChange = (event) => {
		if (!event.matches) {
			closePlanSecond();
		}
	};

	if (typeof desktopQuery.addEventListener === 'function') {
		desktopQuery.addEventListener('change', handleViewportChange);
	} else if (typeof desktopQuery.addListener === 'function') {
		desktopQuery.addListener(handleViewportChange);
	}

	backLink?.addEventListener('click', (event) => {
		if (!desktopQuery.matches) return;
		event.preventDefault();
		closePlanSecond();
	});

	const pathElements = block.querySelectorAll('.plan__frame-path');
	if (!pathElements.length || typeof tabs?.set !== 'function') return;

	const controlsCount = tabs.controls?.length ?? 0;

	pathElements.forEach((path, defaultIndex) => {
		path.addEventListener('click', (event) => {
			if (desktopQuery.matches) {
				event.preventDefault();
				openPlanSecond();
			}

			const targetAttr = path.dataset.planTab ?? path.dataset.planTarget ?? path.dataset.tabIndex;
			let targetIndex = defaultIndex;

			if (typeof targetAttr !== 'undefined') {
				const parsed = Number(targetAttr);
				if (!Number.isNaN(parsed)) {
					if (parsed >= 0 && parsed < controlsCount) {
						targetIndex = parsed;
					}
				}
			}

			tabs.set(targetIndex);
		});
	});
};

window.addEventListener("load", () => {
	updateVH();
	setScrollbarWidth();
	setHeader();
	setSmoothPageScroll();
	setBlockAnimation();
	setParallax();
	setGallery();
	setLocationSwipers();
	setAboutApartamentsSwiper();
	setClassOnClick();
	setPathsPosition();
	setPathOnClick();
	setParamsRanges();
	setParamsAdaptive();
	setNewsModal();
	setModals();
	setStepsGallery();
	setStepsTabs();
	setGallerySwipers();
	setPlanScript();

	window.addEventListener("resize", throttle(setParamsAdaptive, 200));
	window.addEventListener("resize", throttle(setBlockAnimation, 200));
	window.addEventListener("resize", throttle(setPathsPosition, 200));
});

