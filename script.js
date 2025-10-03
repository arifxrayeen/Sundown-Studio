// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Locomotive Scroll with error handling
    try {
        const scroll = new LocomotiveScroll({
            el: document.querySelector('#main'),
            smooth: true,
            // Avoid GPU transforms on mobile/tablet that can affect fixed/video
            smartphone: { smooth: false },
            tablet: { smooth: false }
        });
    } catch (error) {
        console.log('Locomotive Scroll not available:', error);
    }

    // Initialize all functions
    swiperAnimation();
    page4Animation();
    menuAnimation();
    loaderAnimation();
    ensureHeroVideoPlayback();
    preloadHoverImages();
});

function page4Animation() {
    var elemC = document.querySelector("#elem-container");
    var fixed = document.querySelector("#fixed-image");
    
    // Check if elements exist before adding event listeners
    if (!elemC || !fixed) return;
    
    elemC.addEventListener("mouseenter", function () {
        fixed.style.display = "block";
    });
    elemC.addEventListener("mouseleave", function () {
        fixed.style.display = "none";
    });

    var elems = document.querySelectorAll(".elem");
    elems.forEach(function (e) {
        e.addEventListener("mouseenter", function () {
            var image = e.getAttribute("data-image");
            if (!image) return;

            var optimized = getOptimizedImageUrl(image);

            // Swap background only after the optimized image is ready to avoid flicker/blur
            var img = new Image();
            img.onload = function () {
                fixed.style.backgroundImage = "url(" + optimized + ")";
                fixed.style.opacity = 1;
            };
            img.src = optimized;
        });
    });
}

function swiperAnimation() {
    try {
        var swiper = new Swiper(".mySwiper", {
            slidesPerView: "auto",
            centeredSlides: true,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            breakpoints: {
                768: {
                    spaceBetween: 50,
                },
                1024: {
                    spaceBetween: 100,
                }
            }
        });
    } catch (error) {
        console.log('Swiper not available:', error);
    }
}

function menuAnimation() {
    var menu = document.querySelector("nav h3");
    var full = document.querySelector("#full-scr");
    var navimg = document.querySelector("nav img");
    
    // Check if elements exist before adding event listeners
    if (!menu || !full || !navimg) return;
    
    var flag = 0;
    menu.addEventListener("click", function () {
        if (flag == 0) {
            full.style.top = 0;
            navimg.style.opacity = 0;
            flag = 1;
        } else {
            full.style.top = "-100%";
            navimg.style.opacity = 1;
            flag = 0;
        }
    });
}

function loaderAnimation() {
    var loader = document.querySelector("#loader");
    if (!loader) return;
    
    setTimeout(function () {
        loader.style.top = "-100%";
    }, 4200);
}

function ensureHeroVideoPlayback() {
    var video = document.querySelector("#page1 video");
    if (!video) return;

    // Ensure attributes for mobile/web autoplay
    video.setAttribute("muted", "");
    video.muted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("autoplay", "");
    video.setAttribute("loop", "");
    video.setAttribute("preload", "auto");

    var tryPlay = function () {
        try {
            var playPromise = video.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(function () { /* ignore autoplay restrictions */ });
            }
        } catch (e) { /* noop */ }
    };

    // Attempt playback at key readiness points
    video.addEventListener("loadeddata", tryPlay, { once: true });
    video.addEventListener("canplay", tryPlay, { once: true });

    // Resume when tab becomes visible again
    document.addEventListener("visibilitychange", function () {
        if (!document.hidden && video.paused) {
            tryPlay();
        }
    });

    // Harden loop in case native looping stalls
    video.addEventListener("ended", function () {
        try {
            video.currentTime = 0;
        } catch (e) { /* noop */ }
        tryPlay();
    });
}

function getOptimizedImageUrl(originalUrl) {
    try {
        var url = new URL(originalUrl);
        // Target higher width and quality for crispness
        var targetWidth = Math.min(1400, Math.max(800, window.innerWidth));
        url.searchParams.set("w", String(targetWidth));
        url.searchParams.set("q", "80");
        // Hint for HiDPI
        if (!url.searchParams.get("dpr")) {
            var dpr = Math.min(2, Math.max(1, Math.round(window.devicePixelRatio || 1)));
            url.searchParams.set("dpr", String(dpr));
        }
        // Ensure efficient format
        url.searchParams.set("auto", "format");
        url.searchParams.set("fit", "crop");
        return url.toString();
    } catch (e) {
        return originalUrl;
    }
}

function preloadHoverImages() {
    var fixed = document.querySelector("#fixed-image");
    if (fixed) {
        fixed.style.opacity = 0;
    }
    var urls = [];
    document.querySelectorAll(".elem").forEach(function (e) {
        var u = e.getAttribute("data-image");
        if (u) urls.push(getOptimizedImageUrl(u));
    });
    urls.forEach(function (u) {
        var img = new Image();
        img.src = u;
    });
}