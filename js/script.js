(function ($) {
  "use strict";

  /*------------------------------------------
        = FUNCTIONS
    -------------------------------------------*/
  // Check ie and version
  function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return myNav.indexOf("msie") != -1
      ? parseInt(myNav.split("msie")[1], 10)
      : false;
  }

  // Navbar shrink function
  var navbarShrink = function () {
    const navbarCollapsible = document.body.querySelector("#mainNav");
    if (!navbarCollapsible) {
      return;
    }
    if (window.scrollY === 0) {
      navbarCollapsible.classList.remove("navbar-shrink");
    } else {
      navbarCollapsible.classList.add("navbar-shrink");
    }
  };
  // Shrink the navbar
  navbarShrink();
  // Shrink the navbar when page is scrolled
  document.addEventListener("scroll", navbarShrink);
  // Activate Bootstrap scrollspy on the main nav element
  const mainNav = document.body.querySelector("#mainNav");
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#mainNav",
      rootMargin: "0px 0px -40%",
    });
  }
  // Collapse responsive navbar when toggler is visible
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });

  // Parallax background
  function bgParallax() {
    if ($(".parallax").length) {
      $(".parallax").each(function () {
        var height = $(this).position().top;
        var resize = height - $(window).scrollTop();
        var parallaxSpeed = $(this).data("speed");
        var doParallax = -(resize / parallaxSpeed);
        var positionValue = doParallax + "px";
        var img = $(this).data("bg-image");

        $(this).css({
          backgroundImage: "url(" + img + ")",
          backgroundPosition: "50%" + positionValue,
          backgroundSize: "cover",
        });

        if (window.innerWidth < 768) {
          $(this).css({
            backgroundPosition: "center center",
          });
        }
      });
    }
  }

  bgParallax();

  // Hero slider background setting
  function sliderBgSetting() {
    if ($(".hero-slider .slide-item").length) {
      $(".hero-slider .slide-item").each(function () {
        var $this = $(this);
        var img = $this.find(".slider-bg").attr("src");

        $this.css({
          backgroundImage: "url(" + img + ")",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        });
      });
    }
  }

  //Setting hero slider
  function heroSlider() {
    if ($(".hero-slider").length) {
      $(".hero-slider").slick({
        arrows: true,
        prevArrow: '<button type="button" class="slick-prev">Previous</button>',
        nextArrow: '<button type="button" class="slick-next">Next</button>',
        dots: true,
        fade: true,
        cssEase: "linear",
      });
    }
  }

  // set two coloumn height equial
  function setTwoColEqHeight($col1, $col2) {
    var firstCol = $col1,
      secondCol = $col2,
      firstColHeight = $col1.innerHeight(),
      secondColHeight = $col2.innerHeight();

    if (firstColHeight > secondColHeight) {
      secondCol.css({
        height: firstColHeight + 1 + "px",
      });
    } else {
      firstCol.css({
        height: secondColHeight + 1 + "px",
      });
    }
  }

  function popupSaveTheDateCircle() {
    var saveTheDateCircle = $(".save-the-date");
    saveTheDateCircle.addClass("popup-save-the-date");
  }

  /*------------------------------------------
        = HIDE PRELOADER
    -------------------------------------------*/
  function preloader() {
    if ($(".preloader").length) {
      $(".preloader")
        .delay(100)
        .fadeOut(500, function () {
          //active wow
          wow.init();

          if ($(".save-the-date").length) {
            popupSaveTheDateCircle();
          }

          //Active heor slider
          heroSlider();
        });
    }
  }

  /*------------------------------------------
        = WOW ANIMATION SETTING
    -------------------------------------------*/
  var wow = new WOW({
    boxClass: "wow", // default
    animateClass: "animated", // default
    offset: 0, // default
    mobile: true, // default
    live: true, // default
  });

  /*------------------------------------------
        = ACTIVE POPUP GALLERY
    -------------------------------------------*/
  if ($(".gallery-fancybox").length) {
    $(".fancybox").fancybox({
      openEffect: "elastic",
      closeEffect: "elastic",
      wrapCSS: "project-fancybox-title-style",
    });
  }

  /*------------------------------------------
        = POPUP VIDEO
    -------------------------------------------*/
  if ($(".video-play-btn").length) {
    $(".video-play-btn").on("click", function () {
      var videoUrl = this.href;
      var videoType = $(this).data("type");

      // Check if it's an MP4 video file
      if (videoUrl.match(/\.(mp4|MP4)$/i)) {
        // Create HTML5 video element for MP4 files
        var videoHtml =
          '<video controls autoplay style="max-width: 100%; max-height: 90vh;">' +
          '<source src="' +
          videoUrl +
          '" type="video/mp4">' +
          "Your browser does not support the video tag." +
          "</video>";

        $.fancybox({
          content: videoHtml,
          type: "html",
          helpers: {
            media: {},
          },
          beforeShow: function () {
            $(".fancybox-wrap").addClass("gallery-fancybox");
          },
        });
      } else {
        // Handle iframe videos (YouTube, Google Drive, Vimeo, etc.)
        // Convert URLs to embed format
        var embedUrl = videoUrl;
        var isYouTube = false;
        var isGoogleDrive = false;
        
        // Google Drive video handling
        if (videoUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i)) {
          // Google Drive file URL - convert to preview/embed format
          var fileId = videoUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i)[1];
          embedUrl = "https://drive.google.com/file/d/" + fileId + "/preview";
          isGoogleDrive = true;
        } else if (videoUrl.match(/youtube\.com\/watch\?v=([^&]+)/i)) {
          // Regular YouTube watch URL
          var videoId = videoUrl.match(/youtube\.com\/watch\?v=([^&]+)/i)[1];
          embedUrl = "https://www.youtube.com/embed/" + videoId + "?enablejsapi=1&origin=" + window.location.origin + "&rel=0&modestbranding=1&autoplay=1";
          isYouTube = true;
        } else if (videoUrl.match(/youtube\.com\/shorts\/([^?]+)/i)) {
          // YouTube Shorts URL
          var videoId = videoUrl.match(/youtube\.com\/shorts\/([^?]+)/i)[1];
          embedUrl = "https://www.youtube.com/embed/" + videoId + "?enablejsapi=1&origin=" + window.location.origin + "&rel=0&modestbranding=1&autoplay=1";
          isYouTube = true;
        } else if (videoUrl.match(/youtu\.be\/([^?]+)/i)) {
          // Short YouTube URL
          var videoId = videoUrl.match(/youtu\.be\/([^?]+)/i)[1];
          embedUrl = "https://www.youtube.com/embed/" + videoId + "?enablejsapi=1&origin=" + window.location.origin + "&rel=0&modestbranding=1&autoplay=1";
          isYouTube = true;
        } else if (videoUrl.match(/youtube\.com\/embed\/([^?]+)/i)) {
          // Already in embed format, just add parameters if needed
          var separator = videoUrl.indexOf("?") === -1 ? "?" : "&";
          embedUrl = videoUrl + separator + "enablejsapi=1&origin=" + window.location.origin + "&rel=0&modestbranding=1&autoplay=1";
          isYouTube = true;
        }
        
        // For YouTube and Google Drive videos, create iframe HTML directly
        if (isYouTube || isGoogleDrive) {
          // Simple responsive iframe container
          var iframeHtml = '<div style="width: 100%; max-width: 960px; margin: 0 auto;"><div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #000;"><iframe src="' + embedUrl + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div></div>';
          
          $.fancybox({
            content: iframeHtml,
            type: "html",
            padding: 10,
            fitToView: true,
            autoSize: true,
            autoCenter: true,
            scrolling: 'no',
            helpers: {
              media: {},
              overlay: {
                locked: false
              }
            },
            beforeShow: function () {
              $(".fancybox-wrap").addClass("gallery-fancybox");
            },
            afterShow: function() {
              // Ensure proper sizing on mobile
              var $wrap = $(".fancybox-wrap");
              if (window.innerWidth <= 768) {
                $wrap.css({
                  'width': '95%',
                  'max-width': '95%',
                  'left': '50%',
                  'margin-left': '-47.5%'
                });
              }
            }
          });
        } else {
          // For other video platforms (Vimeo, etc.)
          $.fancybox({
            href: embedUrl,
            type: videoType || "iframe",
            title: this.title,
            padding: 0,
            width: 853,
            height: 480,
            helpers: {
              title: { type: "inside" },
              media: {},
            },
            beforeShow: function () {
              $(".fancybox-wrap").addClass("gallery-fancybox");
            },
          });
        }
      }
      return false;
    });
  }

  /*------------------------------------------
        = POPUP YOUTUBE, VIMEO, GMAPS
    -------------------------------------------*/
  $(".popup-youtube, .popup-vimeo, .popup-gmaps").magnificPopup({
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  /*------------------------------------------
        = ACTIVE GALLERY POPUP IMAGE
    -------------------------------------------*/
  if ($(".popup-gallery").length) {
    $(".popup-gallery").magnificPopup({
      delegate: "a",
      type: "image",

      gallery: {
        enabled: true,
      },

      zoom: {
        enabled: true,

        duration: 300,
        easing: "ease-in-out",
        opener: function (openerElement) {
          return openerElement.is("img")
            ? openerElement
            : openerElement.find("img");
        },
      },
    });
  }

  /*------------------------------------------
        = ACTIVE POPUP IMAGE
    -------------------------------------------*/
  if ($(".popup-image").length) {
    $(".popup-image").magnificPopup({
      type: "image",
      zoom: {
        enabled: true,

        duration: 300,
        easing: "ease-in-out",
        opener: function (openerElement) {
          return openerElement.is("img")
            ? openerElement
            : openerElement.find("img");
        },
      },
    });
  }

  /*------------------------------------------
        = FUNCTION FORM SORTING GALLERY
    -------------------------------------------*/
  function sortingGallery() {
    if ($(".sortable-gallery .gallery-filters").length) {
      var $container = $(".gallery-container");

      // Initially show couple photos (બધું)
      $container.isotope({
        filter: ".couple",
        animationOptions: {
          duration: 750,
          easing: "linear",
          queue: false,
        },
      });

      $(".gallery-filters li a").on("click", function () {
        $(".gallery-filters li .current").removeClass("current");
        $(this).addClass("current");
        var selector = $(this).attr("data-filter");
        $container.isotope({
          filter: selector,
          animationOptions: {
            duration: 750,
            easing: "linear",
            queue: false,
          },
        });
        return false;
      });
    }
  }

  sortingGallery();

  /*------------------------------------------
        = MASONRY GALLERY SETTING
    -------------------------------------------*/
  function masonryGridSetting() {
    if ($(".masonry-gallery").length) {
      var $grid = $(".masonry-gallery").masonry({
        itemSelector: ".grid",
        columnWidth: ".grid",
        percentPosition: true,
      });

      $grid.imagesLoaded().progress(function () {
        $grid.masonry("layout");
      });
    }
  }

  masonryGridSetting();

  /*------------------------------------------
        = STICKY HEADER
    -------------------------------------------*/

  // Function for clone an element for sticky menu
  function cloneNavForSticyMenu($ele, $newElmClass) {
    $ele
      .addClass("original")
      .clone()
      .insertAfter($ele)
      .addClass($newElmClass)
      .removeClass("original");
  }

  // clone home style 1 navigation for sticky menu
  if ($(".header-style-1 .navigation").length) {
    cloneNavForSticyMenu($(".header-style-1 .navigation"), "sticky");
  }

  // clone home style 1 navigation for sticky menu
  if ($(".header-style-2 .navigation").length) {
    cloneNavForSticyMenu($(".header-style-2 .navigation"), "sticky-2");
  }

  // Function for sticky menu
  function stickIt($stickyClass, $toggleClass, $topOffset) {
    if ($(window).scrollTop() >= $topOffset) {
      var orgElement = $(".original");
      var widthOrgElement = orgElement.css("width");

      $stickyClass.addClass($toggleClass);

      $stickyClass
        .css({
          width: widthOrgElement,
        })
        .show();

      $(".original").css({
        visibility: "hidden",
      });
    } else {
      $(".original").css({
        visibility: "visible",
      });

      $stickyClass.removeClass($toggleClass);
    }
  }

  /*-------------------------------------------------------
        = COUPLE SECTION IMAGE BG SETTING
    -----------------------------------------------------*/
  if ($(".wedding-couple-section .gb").length) {
    var imgHolder = $(".wedding-couple-section .gb .img-holder");

    imgHolder.each(function () {
      var $this = $(this);
      var imgHolderPic = $this.find("img").attr("src");

      $this.css({
        backgroundImage: "url(" + imgHolderPic + ")",
        backgroundSize: "cover",
        backgroundPosition: "center center",
      });
    });
  }

  /*------------------------------------------
        = COUNTDOWN CLOCK
    -------------------------------------------*/
  var countdownInterval = null;

  function initCountdown() {
    var $clock = $("#clock");
    if ($clock.length === 0) {
      return false;
    }

    // Clear any existing interval
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    // Set target date: January 26, 2026 at 11:30 AM (matching hero section)
    var targetDate = new Date(2026, 0, 26, 11, 30, 0); // Month is 0-indexed (0 = January)

    // Manual countdown function
    function updateCountdown() {
      var now = new Date().getTime();
      var distance = targetDate.getTime() - now;

      // Calculate time components
      var totalSeconds = Math.floor(distance / 1000);
      var totalMinutes = Math.floor(totalSeconds / 60);
      var totalHours = Math.floor(totalMinutes / 60);

      var days = Math.floor(totalHours / 24);
      var hours = totalHours % 24;
      var minutes = totalMinutes % 60;
      var seconds = totalSeconds % 60;

      // If date has passed, hide the countdown section
      if (distance < 0) {
        // Clear the interval
        if (countdownInterval) {
          clearInterval(countdownInterval);
          countdownInterval = null;
        }
        // Hide/remove the countdown section
        $(".count-down-section").fadeOut(500, function () {
          $(this).remove();
        });
        return;
      }

      // Format with leading zeros (always 2 digits) - compatible with older browsers
      var daysStr = (days < 10 ? "0" : "") + days;
      var hoursStr = (hours < 10 ? "0" : "") + hours;
      var minutesStr = (minutes < 10 ? "0" : "") + minutes;
      var secondsStr = (seconds < 10 ? "0" : "") + seconds;

      // Update the HTML
      $clock.html(
        "" +
          '<div class="box"><div>' +
          daysStr +
          "</div> <span>દિવસ</span> </div>" +
          '<div class="box"><div>' +
          hoursStr +
          "</div> <span>કલાક</span> </div>" +
          '<div class="box"><div>' +
          minutesStr +
          "</div> <span>મિનિટ</span> </div>" +
          '<div class="box"><div>' +
          secondsStr +
          "</div> <span>સેકન્ડ</span> </div>"
      );
    }

    // Update immediately
    updateCountdown();

    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);

    return true;
  }

  /*------------------------------------------
        = STORY SLIDER
    -------------------------------------------*/
  if ($(".story-slider").length) {
    $(".story-slider").owlCarousel({
      items: 1,
      dots: false,
      autoplay: true,
      autoplayTimeout: 3000,
      smartSpeed: 1000,
      loop: true,
    });
  }

  /*------------------------------------------
        = GIFT REGISTRATION SLIDER
    -------------------------------------------*/
  if ($(".gif-registration-slider").length) {
    $(".gif-registration-slider").owlCarousel({
      items: 3,
      dots: false,
      autoplay: true,
      autoplayTimeout: 3000,
      smartSpeed: 1000,
      loop: true,
      margin: 20,
      stagePadding: 10,
      responsive: {
        0: {
          items: 1,
        },
        480: {
          items: 2,
        },
        768: {
          items: 3,
        },
      },
    });
  }

  /*------------------------------------------
        = RSVP FORM SUBMISSION
    -------------------------------------------*/
  if ($("#rsvp-form").length) {
    $("#rsvp-form").validate({
      rules: {
        name: {
          required: true,
          minlength: 2,
        },
        email: "required",

        guest: {
          required: true,
        },

        events: {
          required: true,
        },
      },

      messages: {
        name: "Please enter your name",
        email: "Please enter your email",
        guest: "Select your number of guest",
        events: "Select your event list",
      },

      submitHandler: function (form) {
        $("#loader").css("display", "inline-block");
        $.ajax({
          type: "POST",
          url: "mail.php",
          data: $(form).serialize(),
          success: function () {
            $("#loader").hide();
            $("#success").slideDown("slow");
            setTimeout(function () {
              $("#success").slideUp("slow");
            }, 3000);
            form.reset();
          },
          error: function () {
            $("#loader").hide();
            $("#error").slideDown("slow");
            setTimeout(function () {
              $("#error").slideUp("slow");
            }, 3000);
          },
        });
        return false; // required to block normal submit since you used ajax
      },
    });
  }

  /*------------------------------------------
        = TOGGLE MUSUC BIX
    -------------------------------------------*/
  if ($(".music-box").length) {
    var musicBtn = $(".music-box-toggle-btn"),
      musicBox = $(".music-holder");

    musicBtn.on("click", function () {
      musicBox.toggleClass("toggle-music-box");
      return false;
    });
  }

  /*------------------------------------------
        = BACK TO TOP
    -------------------------------------------*/
  if ($(".back-to-top-btn").length) {
    $(".back-to-top-btn").on("click", function () {
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        2000,
        "easeInOutExpo"
      );
      return false;
    });
  }

  /*------------------------------------------
        = BLOG MEDIA CAROUSEL
    -------------------------------------------*/
  if ($(".media-carousel").length) {
    $(".media-carousel").owlCarousel({
      items: 1,
      smartSpeed: 500,
      nav: true,
      navText: [
        "<i class='fa fa-angle-left'></i>",
        "<i class='fa fa-angle-right'></i>",
      ],
      dots: false,
    });
  }

  /*------------------------------------------
        = WATER RIPPLE
    -------------------------------------------*/
  if ($(".ripple").length) {
    $(".ripple").ripples({
      resolution: 512,
      dropRadius: 20, //px
      perturbance: 0.04,
    });

    // Automatic drops
    setInterval(function () {
      var $el = $(".ripple");
      var x = Math.random() * $el.outerWidth();
      var y = Math.random() * $el.outerHeight();
      var dropRadius = 20;
      var strength = 0.04 + Math.random() * 0.04;

      $el.ripples("drop", x, y, dropRadius, strength);
    }, 400);
  }

  /*------------------------------------------
        = PARTICLE GROUND
    -------------------------------------------*/
  if ($(".particleground").length) {
    $(".particleground").particleground({
      dotColor: "#78c1b3",
      lineColor: "#5e9a8e",
      lineWidth: 0.7,
      particleRadius: 6,
    });
  }

  /*------------------------------------------
        = VIDEO BACKGROUND
    -------------------------------------------*/
  if ($("#video-background").length) {
    $("#video-background").YTPlayer({
      showControls: false,
      playerVars: {
        modestbranding: 0,
        autoplay: 1,
        controls: 1,
        showinfo: 0,
        wmode: "transparent",
        branding: 0,
        rel: 0,
        autohide: 0,
        origin: window.location.origin,
      },
    });
  }

  /*------------------------------------------
        = SURFACE SHADER
    -------------------------------------------*/
  if ($(".surface-shader").length) {
    //$('.surface-shader')
  }

  /*==========================================================================
        WHEN DOCUMENT LOADING
    ==========================================================================*/
  $(window).on("load", function () {
    preloader();

    sliderBgSetting();

    // Initialize countdown after everything is loaded
    initCountdown();

    //set the couple section groom bride two col equal height
    if ($(".wedding-couple-section").length) {
      setTwoColEqHeight(
        $(".wedding-couple-section .gb .img-holder"),
        $(".wedding-couple-section .gb .details")
      );
    }

    // Confetti on page load
    if (typeof confetti !== "undefined") {
      var duration = 3000;
      var animationEnd = Date.now() + duration;

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }

      var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          particleCount: particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          particleCount: particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  });

  // Also initialize on document ready
  $(document).ready(function () {
    // Initialize countdown if clock element exists
    if ($("#clock").length) {
      initCountdown();
    }
  });

  /*==========================================================================
        WHEN WINDOW SCROLL
    ==========================================================================*/
  $(window).on("scroll", function () {
    bgParallax();

    if ($(".header-style-1").length) {
      stickIt(
        $(".sticky"),
        "sticky-on",
        $(".header-style-1 .navbar").offset().top
      );
    }

    if ($(".header-style-2").length) {
      stickIt($(".sticky-2"), "sticky-on", 300);
    }
  });
  window.onscroll = function () {
    myFunction();
  };

  var header = document.getElementById("myHeader");
  var sticky = header.offsetTop;

  function myFunction() {
    if (window.pageYOffset > sticky) {
      header.classList.add("sticky-header");
    } else {
      header.classList.remove("sticky-header");
    }
  }

  /*==========================================================================
        WHEN WINDOW RESIZE
    ==========================================================================*/
  $(window).on("resize", function () {
    // Resize handlers if needed
  });
})(window.jQuery);
