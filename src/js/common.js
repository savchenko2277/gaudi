import { throttle } from "./libs/utils";
import "./polyfills.js";
import "./blocks.js";
import LocomotiveScroll from 'locomotive-scroll';
import { scrollBasedToggle } from "./libs/scrollBasedToggle.js";
import Lenis from 'lenis'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";

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

	burger?.addEventListener('click', () => {
		header.classList.toggle('is-open');
	});
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
					opacity: 0,
					width: "20%",
					borderRadius: "100%",
				},
				{
					"--after-opacity": 0.4,
					opacity: 1,
					width: "100%",
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
		} else {
			gsap.fromTo(".promo__circle",
				{
					"--after-opacity": 0,
					opacity: 0,
					height: "40%",
					borderRadius: "100%",
				},
				{
					"--after-opacity": 0.4,
					opacity: 1,
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
		}

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

		gsap.fromTo(".location__block_second",
			{ opacity: 0 },
			{
				opacity: 1,
				ease: "none",
				scrollTrigger: {
					trigger: ".location",
					start: "30% top",
					end: "60% top",
					scrub: true
				}
			}
		);

		gsap.fromTo(".ecology__photo",
			{
				opacity: 0,
				borderRadius: "100%",
				width: "30%",
				height: "30%",
			},
			{
				opacity: 1,
				borderRadius: "0%",
				width: "100%",
				height: "100%",
				ease: "none",
				scrollTrigger: {
					trigger: ".ecology",
					start: "50% top",
					end: "70% top",
					scrub: true
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
					start: "0% top",
					end: "40% top",
					scrub: true
				}
			}
		);

		gsap.fromTo(".location-main__block_second",
			{ opacity: 0 },
			{
				opacity: 1,
				ease: "none",
				scrollTrigger: {
					trigger: ".location-main",
					start: "30% top",
					end: "60% top",
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
		on:{
			slideChange: function() {
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
		modules: [Navigation],
		slidesPerView: 1,
		spaceBetween: 30,
		loop: true,
		autoHeight: true,
		navigation: {
			nextEl: '.location-main__road .location-main__navigation-btn_next',
			prevEl: '.location-main__road .location-main__navigation-btn_prev',
		},
		on:{
			slideChange: function() {

			}
		}
	});
}

window.addEventListener("load", () => {
	updateVH();
	setScrollbarWidth();
	setHeader();
	setSmoothPageScroll();
	setBlockAnimation();
	setParallax();
	setGallery();
	setLocationSwipers();

	window.addEventListener("resize", throttle(setBlockAnimation, 200));
});