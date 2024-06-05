//import Swiper from "swiper";
//import {Controller, Navigation, Keyboard, Mousewheel, Pagination, EffectCoverflow, EffectFade} from "swiper/modules";

let openMobileMenu = false;
let prevScrollPos = 0;
let scrollTrigger;

const PROD = process.env.NODE_ENV === 'production';
const AUTO_PLAY_DELAY = 3000;

const goTo = (top) => {
  window.scrollTo({
    top,
    behavior: "smooth"
  });
};

const toggleMobileMenu = (e) => {
  e?.preventDefault();
  openMobileMenu = !openMobileMenu;
  document.documentElement.classList.toggle("__open-mob-menu", openMobileMenu);
  return false;
};

const closePopups = () => {
  document.querySelectorAll(".js-popup").forEach((item) => {
    item.style.display = "none";
  });
};

const closeMobileMenu = (e) => {
  e?.preventDefault();
  openMobileMenu = false;
  document.documentElement.classList.remove("__open-mob-menu");
  document.documentElement.classList.remove("__open-popup");
  closePopups();
  return false;
};

const togglePopup = (open) => {
  document.documentElement.classList.toggle("__open-popup", open);
  return false;
};

const initPopup = () => {
  document.querySelectorAll(".js-popup-app").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const popup = document.getElementById(item.dataset.popup);

      if (popup) {
        popup.style.display = "block";
        togglePopup(true);
      }

      return false;
    });
  });
};

const slideUp = function (e) {
  let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 500;
  e.style.transitionProperty = "height, margin, padding",
    e.style.transitionDuration = t + "ms",
    e.style.boxSizing = "border-box",
    e.style.height = e.offsetHeight + "px",
    e.offsetHeight,
    e.style.overflow = "hidden",
    e.style.height = 0,
    e.style.paddingTop = 0,
    e.style.paddingBottom = 0,
    e.style.marginTop = 0,
    e.style.marginBottom = 0,
    window.setTimeout((function () {
      e.style.display = "none",
        e.style.removeProperty("height"),
        e.style.removeProperty("padding-top"),
        e.style.removeProperty("padding-bottom"),
        e.style.removeProperty("margin-top"),
        e.style.removeProperty("margin-bottom"),
        e.style.removeProperty("overflow"),
        e.style.removeProperty("transition-duration"),
        e.style.removeProperty("transition-property");
    }), t);
};
const slideDown = function (e) {
  let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 500;
  e.style.removeProperty("display");
  let i = window.getComputedStyle(e).display;
  "none" === i && (i = "block"),
    e.style.display = i;
  let s = e.offsetHeight;
  e.style.overflow = "hidden",
    e.style.height = 0,
    e.style.paddingTop = 0,
    e.style.paddingBottom = 0,
    e.style.marginTop = 0,
    e.style.marginBottom = 0,
    e.offsetHeight,
    e.style.boxSizing = "border-box",
    e.style.transitionProperty = "height, margin, padding",
    e.style.transitionDuration = t + "ms",
    e.style.height = s + "px",
    e.style.removeProperty("padding-top"),
    e.style.removeProperty("padding-bottom"),
    e.style.removeProperty("margin-top"),
    e.style.removeProperty("margin-bottom"),
    window.setTimeout((function () {
      e.style.removeProperty("height"),
        e.style.removeProperty("overflow"),
        e.style.removeProperty("transition-duration"),
        e.style.removeProperty("transition-property");
    }), t);
};
const slideToggle = function (e) {
  let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 500,
    i = arguments.length > 2 ? arguments[2] : void 0;
  "none" === window.getComputedStyle(e).display ? (slideDown(e, t), "function" == typeof i && i("down")) : (slideUp(e, t), "function" == typeof i && i("up"));
};


const initFaqToggle = () => {
  document.querySelectorAll(".js-toggle-faq").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = item.dataset.toggle;

      if (target) {
        document.querySelectorAll(".js-toggle-block").forEach((block) => {
          if (block.dataset.toggle === target) {
            if (block.classList.contains('__open')) {
              block.classList.remove('__open');
              slideUp(block);
            } else {
              block.classList.add('__open');
              slideDown(block);
            }
          }
        });
      }

      return false;
    });
  });
};

const initBurger = () => {
  document.querySelectorAll(".js-toggle-menu").forEach((item) => {
    item.addEventListener("click", toggleMobileMenu);
  });
};

const initOverlay = () => {
  document.querySelectorAll(".js-close-menu").forEach((item) => {
    item.addEventListener("click", closeMobileMenu);
  });
};

const initGoto = () => {
  document.querySelectorAll(".js-goto").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById(item?.getAttribute("href")?.replace("#", ""));

      if (target) {
        closeMobileMenu();
        goTo(target.offsetTop);
      }

      return false;
    });
  });
};

const getScrollbarWidth = () => {
  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";
  outer.style.msOverflowStyle = "scrollbar";
  document.body.appendChild(outer);

  const inner = document.createElement("div");
  outer.appendChild(inner);

  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
};

function getScrollTop() {
  return (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0);
}

const appHeight = () => {
  const doc = document.documentElement;
  const sab = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab")) || 0;
  doc.style.setProperty("--app-height", `${Math.max(300, window.innerHeight - 1 - sab)}px`);
  doc.style.setProperty("--app-scroll-size", getScrollbarWidth() + "px");
};

const removeHeadStyles = () => {
  let rm = document.getElementById("remove-styles");

  if (rm) {
    rm.remove();
  }
};

const initSliders = () => {
  let sliderRegPhoto, sliderRegText;
  let useAutoplay = {};
  const regPagination = document.getElementById("js-slider-reg-pagination");
  const regPhoto = document.getElementById("js-slider-reg-photo");
  const regText = document.getElementById("js-slider-reg-text");

  if (PROD) {
    useAutoplay = {
      autoplay: {
        delay: AUTO_PLAY_DELAY
      }
    };
  }

  if (regPhoto && regText) {
    new Promise((res, rej) => {
      new Swiper(regText, {
        //loop: true,
        //   modules: [Navigation],
        centeredSlides: true,
        allowTouchMove: false,
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl: "#js-slider-reg-next",
          prevEl: "#js-slider-reg-prev"
        },
        on: {
          init: (swp) => {
            res(swp);
          }
        }
      });
    }).then(s => {
      sliderRegText = s;

      new Promise((res, rej) => {
        new Swiper(regPhoto, {
          ...useAutoplay,
          //   modules: [EffectCoverflow, Controller, Mousewheel, Navigation, Keyboard, Pagination],
          //loop: true,
          speed: 500,
          effect: "coverflow",
          centeredSlides: true,
          pagination: {
            el: regPagination,
            clickable: true,
            type: "bullets"
          },
          navigation: {
            nextEl: "#js-slider-reg-next",
            prevEl: "#js-slider-reg-prev"
          },
          controller: {
            by: "container",
            control: "#js-slider-reg-text"
          },
          keyboard: {
            enabled: true
          },
          mousewheel: {
            thresholdDelta: 70
          },
          on: {
            init: (swp) => {
              res(swp);
            }
          },
          slidesPerView: 2.3,
          coverflowEffect: {
            rotate: 0,
            depth: 230,
            stretch: 60,
            slideShadows: false
          },
          breakpoints: {
            1024: {
              coverflowEffect: {
                stretch: 60
              }
            },
            1280: {
              coverflowEffect: {
                stretch: 84
              }
            },
            1440: {
              coverflowEffect: {
                stretch: 94
              }
            },
            1920: {
              coverflowEffect: {
                stretch: 142
              }
            }
          }
        });
      }).then(s => {
        sliderRegPhoto = s;

        regPagination.style.setProperty("--slider-delay", (sliderRegPhoto.passedParams?.autoplay?.delay ?? AUTO_PLAY_DELAY) + `ms`);

        sliderRegPhoto.slideTo(1);
      });
    });
  }
};


const initAdvantagesSliders = () => {
  let sliderRegPhoto, sliderRegText;
  let useAutoplay = {};
  const ADVANTAGE_SLIDER_SPEED = 500;
  const regPagination = document.getElementById("js-slider-reg-pagination");
  const regPhoto = document.getElementById("js-slider-reg-photo");
  const regText = document.getElementById("js-slider-reg-text");

  if (PROD) {
    useAutoplay = {
      autoplay: {
        delay: AUTO_PLAY_DELAY
      }
    };
  }

  if (regPhoto && regText) {
    new Promise((res, rej) => {
      new Swiper(regText, {
        //   modules: [EffectFade, Navigation],
        loop: true,
        centeredSlides: true,
        allowTouchMove: false,
        speed: ADVANTAGE_SLIDER_SPEED,
        effect: "fade",
        fadeEffect: {
          crossFade: true
        },
        slidesPerView: 1,
        spaceBetween: 0,
        navigation: {
          nextEl: "#js-slider-reg-next",
          prevEl: "#js-slider-reg-prev"
        },
        on: {
          init: (swp) => {
            res(swp);
          }
        }
      });
    }).then(s => {
      sliderRegText = s;

      new Promise((res, rej) => {
        new Swiper(regPhoto, {
          ...useAutoplay,
          //   modules: [EffectFade, Controller, Mousewheel, Navigation, Keyboard, Pagination],
          loop: true,
          speed: ADVANTAGE_SLIDER_SPEED,
          effect: "fade",
          centeredSlides: true,
          pagination: {
            el: regPagination,
            clickable: true,
            type: "bullets"
          },
          navigation: {
            nextEl: "#js-slider-reg-next",
            prevEl: "#js-slider-reg-prev"
          },
          controller: {
            by: "container",
            control: "#js-slider-reg-text"
          },
          keyboard: {
            enabled: true
          },
          on: {
            init: (swp) => {
              res(swp);
            }
          },
          slidesPerView: 1
        });
      }).then(s => {
        sliderRegPhoto = s;

        regPagination.style.setProperty("--slider-delay", (sliderRegPhoto.passedParams?.autoplay?.delay ?? AUTO_PLAY_DELAY) + `ms`);

        sliderRegPhoto.slideTo(1);
      });
    });
  }
};

const initFunctionsSliders = () => {
  let sliderPhoto1, sliderPhoto2, sliderFunctions;
  let useAutoplay = {};
  const breakpoint = window.matchMedia("(min-width:1280px)");
  const functionsText = document.getElementById("js-slider-functions");
  const funcPagination = document.getElementById("js-slider-functions-pagination");
  const funcPhoto1 = document.getElementById("js-slider-screen-1");
  const funcPhoto2 = document.getElementById("js-slider-screen-2");

  if (PROD) {
    useAutoplay = {
      autoplay: {
        delay: AUTO_PLAY_DELAY
      }
    };
  }

  const updateSlideIndexes = function (active) {
    document.querySelectorAll(".js-slide-to-parent").forEach((item, index) => {
      item.classList[index === active ? "add" : "remove"]("__active");
    });
  };

  const enableSwiper = function () {
    new Promise((res, rej) => {
      new Swiper(functionsText, {
        //loop: true,
        //   modules: [Mousewheel],
        allowTouchMove: true,
        speed: 500,
        slidesPerView: 1,
        spaceBetween: 0,
        initialSlide: sliderPhoto1?.activeIndex ?? 0,
        mousewheel: {
          thresholdDelta: 70
        },
        on: {
          init: (swp) => {
            res(swp);
          },
          slideChange() {
            sliderPhoto1.slideTo(this.activeIndex);
          }
        }
      });
    }).then(s => {
      sliderFunctions = s;
    });
  };

  const breakpointChecker = function () {
    if (breakpoint.matches === true) {
      if (sliderFunctions !== undefined) {
        sliderFunctions.destroy(true, true);
        return false;
      }
    } else if (breakpoint.matches === false) {
      return enableSwiper();
    }
  };

  if (functionsText && funcPhoto1 && funcPhoto2) {
    new Promise((res, rej) => {
      new Swiper(funcPhoto1, {
        ...useAutoplay,
        //   modules: [Navigation, EffectFade, Pagination],
        //loop: true,
        speed: 500,
        slidesPerView: 1,
        effect: "fade",
        //fadeEffect: {
        //  crossFade: true
        //},
        navigation: {
          nextEl: "#js-slider-functions-next",
          prevEl: "#js-slider-functions-prev"
        },
        pagination: {
          el: funcPagination,
          clickable: true,
          type: "bullets"
        },
        on: {
          init: (swp) => {
            res(swp);
          },
          slideChange() {
            if (sliderFunctions && !sliderFunctions?.destroyed) {
              sliderFunctions.slideTo(this.activeIndex);
            }
            if (sliderPhoto2 && !sliderPhoto2?.destroyed) {
              sliderPhoto2.slideTo(this.activeIndex);
            }

            updateSlideIndexes(this.activeIndex);
          }
        }
      });
    }).then(s => {
      sliderPhoto1 = s;

      funcPagination.style.setProperty("--slider-delay", (sliderPhoto1.passedParams?.autoplay?.delay ?? AUTO_PLAY_DELAY) + `ms`);

      new Promise((res, rej) => {
        new Swiper(funcPhoto2, {
          //loop: true,
          //   modules: [EffectFade],
          speed: 500,
          slidesPerView: 1,
          effect: "fade",
          //fadeEffect: {
          //  crossFade: true
          //},
          on: {
            init: (swp) => {
              res(swp);
            },
            slideChange() {
              sliderPhoto1.slideTo(this.activeIndex);
            }
          }
        });
      }).then(s => {
        sliderPhoto2 = s;

        document.querySelectorAll(".js-slide-to").forEach((item) => {
          item.addEventListener("click", () => {
            const clickedIndex = parseInt(item.dataset.slide);

            if (sliderFunctions && !sliderFunctions?.destroyed) {
              sliderFunctions.slideTo(clickedIndex);
            }

            sliderPhoto2.slideTo(clickedIndex);
          });
        });

        setTimeout(() => {
          updateSlideIndexes(sliderPhoto2.activeIndex);
        }, 1);

        breakpoint.addEventListener("change", breakpointChecker);
        breakpointChecker();
      });
    });
  }
};

const initReviews = () => {
  let sliderReviews;
  let useAutoplay = {};
  const reviewsBlock = document.getElementById("js-slider-reviews");

  if (PROD) {
    useAutoplay = {
      autoplay: {
        delay: AUTO_PLAY_DELAY
      }
    };
  }

  if (reviewsBlock) {
    new Promise((res, rej) => {
      new Swiper(reviewsBlock, {
        ...useAutoplay,
        //   modules: [Mousewheel, Navigation, Keyboard],
        loop: true,
        speed: 600,
        centeredSlides: true,
        navigation: {
          nextEl: "#js-slider-reviews-next",
          prevEl: "#js-slider-reviews-prev"
        },
        keyboard: {
          enabled: true
        },
        mousewheel: {
          thresholdDelta: 70
        },
        on: {
          init: (swp) => {
            res(swp);
          }
        },
        slidesPerView: 'auto'
      });
    }).then(s => {
      sliderReviews = s;
      sliderReviews.slideTo(1);
    });
  }
};

const initDatings = () => {
  let sliderReviews;
  const datingsBlock = document.getElementById("js-slider-datings");

  if (datingsBlock) {
    new Promise((res, rej) => {
      new Swiper(datingsBlock, {
        //   modules: [Navigation],
        speed: 2000,
        slidesPerView: 1,
        navigation: {
          nextEl: "#js-slider-datings-next",
          prevEl: "#js-slider-datings-prev"
        },
        watchSlidesProgress: true,
        virtualTranslate: true,
        effect: "islandCustomTransition",
        on: {
          init: (swp) => {
            res(swp);
          },
          progress(progress) {

          },
          setTransition(transition) {

          },
          setTranslate(translate) {

          }
        }
      });
    }).then(s => {
      sliderReviews = s;

      //datingsBlock.style.setProperty("--slider-delay", sliderReviews.params.speed + `ms`);

      if (PROD) {
        setInterval(() => {
          let index = sliderReviews.activeIndex + 1;
          if (index > sliderReviews.slides.length - 1) {
            index = 0;
          }
          sliderReviews.slideTo(index);
        }, AUTO_PLAY_DELAY * 2);
      }
    });
  }
};

document.addEventListener("DOMContentLoaded", function () {
  appHeight();
  initBurger();
  initGoto();
  initOverlay();
  //initSliders();
  initAdvantagesSliders();
  removeHeadStyles();
  initReviews();
  initFunctionsSliders();
  initDatings();
  initPopup();
  initFaqToggle();
});

const scrollUpCheck = (newScrollTop) => {
  document.documentElement.classList.toggle("__scroll-hide", newScrollTop > 150);
  document.documentElement.classList.toggle("__scroll-up", newScrollTop === 0 ? false : prevScrollPos > newScrollTop);

  if (!scrollTrigger) {
    scrollTrigger = document.querySelector(".js-header-trigger");
  }

  if (scrollTrigger) {
    document.documentElement.classList.toggle("__scroll-screen", scrollTrigger.getBoundingClientRect().top <= 0);
  }

  prevScrollPos = newScrollTop;
};

const debounceScrollUpCheck = scrollUpCheck.debounce(20);

const checkWindowScroll = () => {
  const newScrollTop = getScrollTop();
  document.documentElement.classList.toggle("__scrolled", newScrollTop > 0);
  debounceScrollUpCheck(newScrollTop);
};

checkWindowScroll();

window.addEventListener("resize", () => {
  appHeight();
});

window.addEventListener("scroll", (e) => {
  checkWindowScroll();
});
