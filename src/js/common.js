import { throttle } from "./libs/utils";
import "./polyfills.js";
import "./blocks.js";
import LocomotiveScroll from 'locomotive-scroll';
import { scrollBasedToggle } from "./libs/scrollBasedToggle.js";
import Lenis from 'lenis'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Navigation, EffectFade, Pagination } from "swiper/modules";

// Функции

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

	let lastScrollY = 0;

	const clearHeaderMods = () => {
		header.classList.forEach(cls => {
			if (cls.startsWith('header_')) {
				header.classList.remove(cls);
			}
		});
	};

	const applyHeaderColorFromSections = () => {
		if (!colorSections.length) return;
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

		// if (scrollY > 50 && delta > 0) {
		// 	header.classList.add('is-scroll');
		// } else {
		// 	header.classList.remove('is-scroll');
		// }

		lastScrollY = scrollY;

		syncHeaderColor();
	});

	burger?.addEventListener('click', () => {
		header.classList.toggle('is-open');

		if (header.classList.contains('is-open')) {
			clearHeaderMods();
		} else {
			syncHeaderColor();
		}
	});

	window.addEventListener('resize', syncHeaderColor);
	syncHeaderColor();
}

const setSmoothPageScroll = () => {
	const lenis = new Lenis();

	lenis.on('scroll', ScrollTrigger.update);

	gsap.ticker.add((time) => {
		lenis.raf(time * 500);
	});

	gsap.ticker.lagSmoothing(0);
}

const setBlockAnimation = () => {
	console.log('setBlockAnimation');
	const setGsapAnimations = () => {
		gsap.registerPlugin(ScrollTrigger);

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
			gsap.fromTo(".ecology__text",
				{
					y: "0%",
				},
				{
					y: "-20%",
					ease: "none",
					scrollTrigger: {
						trigger: ".ecology",
						start: "0% top",
						end: "30% top",
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
					y: "-80%",
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
					y: "-120%",
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

		gsap.fromTo(".infrostructure__title",
			{
				x: "100%",
			},
			{
				x: 0,
				ease: "none",
				scrollTrigger: {
					trigger: ".infrostructure",
					start: "-50% top",
					end: "0% top",
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
	const aboutSwiper = new Swiper('.location-main__about-swiper', {
		modules: [Navigation],
		slidesPerView: 1,
		spaceBetween: 30,
		loop: true,
		autoHeight: true,
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
			slideChange: function () {

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

	window.addEventListener("resize", throttle(setBlockAnimation, 200));
});
