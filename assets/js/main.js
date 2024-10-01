/**--------------------------------------------
    - Template Name: DigiMedia
    - PSD Designer : TemplateMo
    - Author       : Naim Zaaraoui <SimplDev>
    - Last Update  : 01-10-2024
 --------------------------------------------*/

//
// Variables
//

// Needed DOM elements
const bodyEl = $("body");
const header = $(".primary-header");
const navToggler = $(".nav-toggler");
const navMenu = $(".primary-nav");

const tabList = $(".tabs-btns[role='tablist']");
const tabs = $(".tabs-btns [role='tab']");
const panelList = $(".tabs-list");
const panels = $(".tabs-item[role='tabpanel']");

// Main Variables
let isBodyScrolled = false;
const keydownLeft = 37;
const keydownRight = 39;
let tabFocus = 0;

//
// Functions & Methods
//

function changeTabFocus(e) {
  // Change the tabindex of the current tab to -1
  if (e.keyCode === keydownLeft || e.keyCode === keydownRight) {
    tabs.eq(tabFocus).attr("tabindex", -1);

    // If the right key is pushed, move to the next tab on the right
    if (e.keyCode === keydownRight) {
      tabFocus++;
      if (tabFocus >= tabs.length) {
        tabFocus = 0;
      }
    }

    // If the left key is pushed, move to the previous tab on the left
    else if (e.keyCode === keydownLeft) {
      tabFocus--;

      if (tabFocus < 0) {
        tabFocus = tabs.length - 1;
      }
    }

    tabs.eq(tabFocus).attr("tabindex", "0").focus();
  }
}

function changeTabPanel() {
  // Find target panel
  const targetTab = $(this);
  const targetPanel = $(`#${targetTab.attr("aria-controls")}`);

  tabs.attr("aria-selected", "false").attr("tabindex", "-1");
  targetTab.attr("aria-selected", "true").attr("tabindex", "0");
  // Update tabFocus
  tabFocus = tabs.index(targetTab);

  // Show target panel
  panels.removeClass("is-active");
  targetPanel.addClass("is-active");

  // Update panelList height to fit target panel
  const panelHeight = targetPanel.innerHeight();
  panelList.height(`${panelHeight}px`);
}

function syncNavWithTarget() {
  const scrollPos = $(document).scrollTop();

  $(".nav-list .scrollto").each(function () {
    const currentLink = $(this);
    const target = $(currentLink.attr("href"));

    if (
      target.position().top <= scrollPos &&
      target.position().top + target.height() > scrollPos
    ) {
      $(".nav-list .scrollto").removeClass("is-active");
      currentLink.addClass("is-active");
    } else {
      currentLink.removeClass("is-active");
    }
  });
}

function scrollToTarget(target) {
  const headerOffset = header.height();
  $(document).off("scroll");
  $("html, body")
    .stop()
    .animate(
      {
        scrollTop: target.offset().top - headerOffset + 1,
      },
      700,
      "swing",
      function () {
        $(document).on("scroll", syncNavWithTarget);
      }
    );
}

//
// Inits & Events Listeners
//

/** Preloader */
$(".preloader").hide();

/** Toggle .is-scrolled. class on body element */

$(window).on("scroll load", () => {
  if (scrollY >= 100 && !isBodyScrolled) {
    bodyEl.addClass("is-scrolled");
    isBodyScrolled = true;
  } else if (scrollY < 100 && isBodyScrolled) {
    bodyEl.removeClass("is-scrolled");
    isBodyScrolled = false;
  }
});

/** Open & close navigation menu */

navToggler.on("click", function () {
  navMenu.slideToggle();

  navToggler.attr(
    "aria-expanded",
    navToggler.attr("aria-expanded") === "true" ? "false" : "true"
  );
});

/** Synchronize navigation links with target sections when scrolling */
$(".scrollto").on("click", function (e) {
  e.preventDefault();
  const target = $($(this).attr("href"));

  const width = $(window).width();
  if (width < 991 && $(this).closest(".nav-list").length) {
    navToggler.attr("aria-expanded", "false");
    navMenu.slideUp(200);
  }

  scrollToTarget(target);
});

syncNavWithTarget();
$(document).on("scroll", syncNavWithTarget);

/** Services tabs */
tabList.on("keydown", changeTabFocus);
tabs.on("click", changeTabPanel);

/** Init AOS */
AOS.init();

/** Init portfolio owlcarousel */
$(".portfolio-carousel").owlCarousel({
  center: true,
  items: 1,
  loop: true,
  // autoplay: true,
  nav: true,
  dots: false,
  margin: 30,
  responsive: {
    1200: {
      items: 5,
    },
    992: {
      items: 3,
    },
    556: {
      items: 2,
    },
  },
});
