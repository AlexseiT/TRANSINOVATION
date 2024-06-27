const isMobile = document.documentElement.clientWidth <= 640;
const isCustomTablet = document.documentElement.clientWidth <= 830;
const isCustomTablet2 = document.documentElement.clientWidth > 980;
const isTablet = document.documentElement.clientWidth <= 1200;
const isLaptop = document.documentElement.clientWidth <= 1440;
const isDesktop = document.documentElement.clientWidth > 1440;

function isWebp() {
    // Проверка поддержки webp
    const testWebp = (callback) => {
        const webP = new Image();

        webP.onload = webP.onerror = () => callback(webP.height === 2);
        webP.src =
            'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    };

    // Добавление класса _webp или _no-webp для HTML
    testWebp((support) => {
        const className = support ? 'webp' : 'no-webp';
        document.querySelector('html')
            .classList.add(className);
        console.log(support ? 'webp поддерживается' : 'webp не поддерживается');
    });
}

isWebp();

const InsertPostContents = () => {
    const headers = [];
    const indexes = [0];
    const articleContent = document.querySelector('.post__content');
    // функция для получения предыдущего header
    const getPrevHeader = (diff = 0) => {
        if ((indexes.length - diff) === 0) {
            return null;
        }
        let header = headers[indexes[0]];
        for (let i = 1, length = indexes.length - diff; i < length; i++) {
            header = header.contains[indexes[i]];
        }
        return header;
    }
    // функция для добавления item в headers
    const addItemToHeaders = (el, diff) => {
        let header = headers;
        if (diff === 0) {
            header = indexes.length > 1 ? getPrevHeader(1)
                .contains : header;
            indexes.length > 1 ? indexes[indexes.length - 1]++ : indexes[0]++;
        }
        else if (diff > 0) {
            header = getPrevHeader()
                .contains;
            indexes.push(0);
        }
        else if (diff < 0) {
            const parentHeader = getPrevHeader(Math.abs(diff) + 1);
            for (let i = 0; i < Math.abs(diff); i++) {
                indexes.pop();
            }
            header = parentHeader ? parentHeader.contains : header;
            parentHeader ? indexes[indexes.length - 1]++ : indexes[0]++;
        }
        header.push({
            el,
            contains: []
        });
    }
    // сформируем оглавление страницы для вставки его на страницу
    let html = '';
    const createTableOfContents = (items) => {
        html += '<ol>';
        for (let i = 0, length = items.length; i < length; i++) {
            const url = `${location.href.split('#')[0]}#${items[i].el.id}`;
            html += `<li><a href="${url}">${items[i].el.textContent}</a>`;
            if (items[i].contains.length) {
                createTableOfContents(items[i].contains);
            }
            html += '</li>';
        }
        html += '</ol>';
    }

    if (articleContent) {
        const contentsList = document.querySelector('.post__contents-list');
        if (contentsList) {
            // добавим заголовки в headers
            articleContent.querySelectorAll('h2, h3, h4')
                .forEach((el, index) => {
                    if (!el.id) {
                        el.id = `id-${index}`;
                    }
                    if (!index) {
                        addItemToHeaders(el);
                        return;
                    }
                    const diff = el.tagName.substring(1) - getPrevHeader()
                        .el.tagName.substring(1);
                    addItemToHeaders(el, diff);
                });

            createTableOfContents(headers);
            contentsList.insertAdjacentHTML('afterbegin', html);
        }
    }
}

async function CallbackFormInit() {
    let forms = document.querySelectorAll('form');

    if (forms.length > 0) {
        forms.forEach((form) => {
            let phoneInputs = form.querySelectorAll('input[name="phone"]');

            if (phoneInputs.length > 0) {
                phoneInputs.forEach((phoneInput) => {
                    const phoneMask = new IMask(phoneInput, {
                        mask: "+{7} (000) 000-00-00",
                    });

                    phoneInput.addEventListener('input', (event) => {
                        event.preventDefault();

                        if (!phoneMask.masked.isComplete) {
                            phoneInput.classList.add("uk-form-danger");
                        }
                        else {
                            phoneInput.classList.remove("uk-form-danger");
                        }
                    });

                    form.addEventListener('submit', (event) => {
                        event.preventDefault();

                        if (!phoneMask.masked.isComplete) {
                            return;
                        }

                        let formData = {};
                        let inputs = form.querySelectorAll('input:not([type="submit"]), textarea');
                        if (inputs.length > 0) {
                            inputs.forEach((input) => {
                                formData[input.getAttribute('name')] = input.value;
                            })
                        }

                        let successPopupNode = document.querySelector('#callback-popup-success');
                        // Удалить в проде
                        UIkit.modal(successPopupNode)
                            .show();
                        //  //

                        // jQuery.ajax({
                        // 	url: '/wp-admin/admin-ajax.php',
                        // 	method: 'post',
                        // 	data: {
                        // 		action: 'sendForm',
                        // 		data: JSON.stringify(formData)
                        // 	},
                        // 	success: function(data){
                        // 		UIkit.modal(successPopupNode).show();
                        // 	}
                        // });
                    })
                })
            }
        })
    };
}

function LoadMapOnScroll() {
    let isMapAppend = false;
    let mapNode = document.querySelector('.map');
    if (mapNode) {
        document.addEventListener('scroll', (event) => {
            if (!isMapAppend) {
                if (window.scrollY > 1000) {
                    let script = document.createElement('script');

                    script.src = 'https://nalogsib.ru/wp-content/themes/NalogSib/js/map.js';
                    script.type = 'text/javascript';

                    mapNode.append(script);
                    isMapAppend = true;
                }
            }
        });
    }
}

async function InitCenteredSliders() {
    let centeredSliders = document.querySelectorAll('.slider_centered');
    if (centeredSliders.length > 0) {
        centeredSliders.forEach((centeredSlider) => {
            let lastSlide = document.querySelector('.slider_centered__item_center');
            UIkit.util.on(centeredSlider, 'itemshown', (event) => {
                lastSlide.classList.remove('slider_centered__item_center');
                event.target.classList.add('slider_centered__item_center');
                lastSlide = event.target;
            });
        });
    };
}

async function EnableSubmitOnCheckbox() {
    let checks = document.querySelectorAll('.form-checkbox');
    checks.forEach((checkbox) => {
        let form = checkbox.closest('form');
        let button = form.querySelector('button[type="submit"]');
        if (form && button) {
            button.classList.toggle('btn_inactive');
            checkbox.addEventListener('click', (event) => {
                button.classList.toggle('btn_inactive');
            });
        }
    });
}

function InitBurgerMenu() {
    const burgerNode = document.querySelector('.header__burger-button');
    if (burgerNode) {
        UIkit.modal(document.querySelector('.header__burger-menu'));
        burgerNode.addEventListener('click', (event) => {
            burgerNode.classList.toggle('header__burger-button_active');
        });
    }
}

function InitCityPopup() {
    if (document.cookie.includes("selectedCity")) {
        return;
    }

    const cityPopupNode = document.querySelector("#city-popup");

    if (cityPopupNode) {
        const acceptBtn = document.querySelector(".city-popup__accept-btn");
        const cityPopup = UIkit.modal(cityPopupNode);

        cityPopup.show();

        if (acceptBtn) {
            acceptBtn.addEventListener('click', (event) => {
                let domainSplit = window.location.host.split('.');
                let subDomain = domainSplit.length > 2 ? window.location.host.split('.')[0] : 'новосибирск';

                document.cookie = `selectedCity=${subDomain}; path=/; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}`;
            });
        }
    }
}

function InitCookieAgree() {
    if (document.cookie.includes("cookieAgree")) {
        return;
    }

    const cookieNoteNode = document.querySelector("#cookie-note");
    if (cookieNoteNode) {
        const acceptBtn = cookieNoteNode.querySelector(".cookie-note__accept-btn");

        if (acceptBtn) {
            cookieNoteNode.style.display = "block";
            acceptBtn.addEventListener('click', (event) => {
                document.cookie = `cookieAgree=true; path=/; expires=${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString()}`;
                cookieNoteNode.style.display = "none";
            });
        }
    }
}

async function InitLoadMorePosts() {
    const moreBtn = document.querySelector('.blog__articles-more-btn');
    if (moreBtn) {
        jQuery(function($) {
            $(".blog__articles-more-btn")
                .on("click", function() {
                    const button = $(this);
                    button.html("Загрузка...");

                    const data = {
                        "action": "load_more",
                        "page": currentPage
                    }

                    $.ajax({
                        url: "/wp-admin/admin-ajax.php",
                        data: data,
                        type: "POST",
                        success: function(data) {
                            if (data) {
                                button.html("Загрузить ещё");
                                button.prev()
                                    .prev()
                                    .append(data);
                                currentPage++;
                                if (currentPage == maxPages) {
                                    button.remove();
                                }
                            }
                            else {
                                button.remove();
                            }
                        }
                    });
                });
        });
    }
}

function MapPathInit() {
    let pathsChine = document.querySelectorAll(".pathGreen");
    let index = 0;
    pathsChine.forEach((path) => {
        index += 1;
        if (index % 3 == 0) {
            anime({
                targets: path,
                strokeDashoffset: [120, 0],
                easing: 'easeInOutSine',
                duration: 3000,
                direction: 'normal',
                loop: true,
            });
        }
        else {
            anime({
                targets: path,
                strokeDashoffset: [120, 0],
                easing: 'easeInOutSine',
                duration: 3000,
                direction: 'reverse',
                loop: true,
            });
        }

    });
    let path0Russia = document.querySelectorAll(".pathGray.path0");
    let path1Russia = document.querySelectorAll(".pathGray.path1");
    let path2Russia = document.querySelectorAll(".pathGray.path2");
    let path3Russia = document.querySelectorAll(".pathGray.path3");
    let path4Russia = document.querySelectorAll(".pathGray.path4");
    let path5Russia = document.querySelectorAll(".pathGray.path5");
    anime({
        targets: path0Russia,
        strokeDashoffset: [64, 0],
        easing: 'easeInOutSine',
        duration: 2500,
        direction: 'normal',
        loop: true,
    });
    anime({
        targets: path1Russia,
        strokeDashoffset: [64, 0],
        easing: 'easeInOutSine',
        duration: 2500,
        direction: 'normal',
        loop: true,
    });
    anime({
        targets: path2Russia,
        strokeDashoffset: [64, 0],
        easing: 'easeInOutSine',
        duration: 2500,
        direction: 'normal',
        loop: true,
    });
    anime({
        targets: path3Russia,
        strokeDashoffset: [64, 0],
        easing: 'easeInOutSine',
        duration: 2500,
        direction: 'normal',
        loop: true,
    });
    anime({
        targets: path4Russia,
        strokeDashoffset: [64, 0],
        easing: 'easeInOutSine',
        duration: 2500,
        direction: 'reverse',
        loop: true,
    });
    anime({
        targets: path5Russia,
        strokeDashoffset: [64, 0],
        easing: 'easeInOutSine',
        duration: 2500,
        direction: 'reverse',
        loop: true,
    });
    let circles = document.querySelectorAll(".map__img circle")
    circles.forEach((circle) => {
        anime({
            targets: circle,
            easing: 'easeInOutSine',
            duration: 3000,
            direction: 'alternate',
            r: 9,
            loop: true,
        });
    });
}

function LinckMapInit() {
    let elementsMap = document.querySelectorAll(".map__sity");
    let map = document.querySelector('.map__img');
    if (map) {
        let mapWidthNow = parseFloat(map.getBoundingClientRect()
            .width);
        let mapHeightNow = parseFloat(map.getBoundingClientRect()
            .height);
        let mapWidth = 1364;
        let mapHeight = 963;
        let coeffX = mapWidthNow / mapWidth;
        let coeffY = mapHeightNow / mapHeight;

        elementsMap.forEach((objLink) => {
            let obj = document.querySelector("." + objLink.id);
            let coordinateX = (obj.getAttribute('cx') * coeffX);
            let coordinateY = (obj.getAttribute('cy') * coeffY);
            if (objLink.classList.contains("map__sityRussia") && objLink.id != "circle_nsk" && objLink.id != "circle_nau" && objLink.id != 'circle_nahod') {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect()
                    .width) / 2 + 20) * coeffX;
                coordinateY -= 55 * coeffX;
            }
            if (objLink.id == "circle_nau" || objLink.id == 'circle_nahod') {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect()
                    .width) / 2 + 20) * coeffX;
                coordinateY += 6 * coeffX;
            }
            if (objLink.id == "circle_nsk") {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect()
                    .width) / 2 + 40) * coeffX;
                coordinateY += 6 * coeffX;
            }
            if (objLink.id == "circle_krsnd") {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect()
                    .width) / 2 - 120) * coeffX;
                coordinateY += -6 * coeffX;
            }
            if (objLink.classList.contains("map__sityChina")) {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect()
                    .width) - 0) * coeffX;
                coordinateY += 6 * coeffX;
            }
            objLink.style.left = coordinateX + "px";
            objLink.style.top = coordinateY + "px";
        });
    }
}

function TippyRussiaCityInit() {
    let obj = document.querySelector(".circle_msk");
    let mskTippy = tippy(obj, {
        content: '<a class = "text_min map__sity">Москва</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'left',
    });
    mskTippy.show();

    obj = document.querySelector(".circle_spb");
    let spbTippy = tippy(obj, {
        content: '<a class = "text_min map__sity">Санкт- Петербург</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'left',
    });
    spbTippy.show();

    obj = document.querySelector(".circle_kazan");
    let kazanTippy = tippy(obj, {
        content: '<a class = "text_min map__sity">Казань</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'top',
    });
    kazanTippy.show();

    obj = document.querySelector(".circle_ekb");
    let ekbTippy = tippy(obj, {
        content: '<a class = "text_min map__sity">Екатеренбург</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'top',
    });
    ekbTippy.show();

    obj = document.querySelector(".circle_nsk");
    let nskTippy = tippy(obj, {
        content: '<a class = "text_min map__sity">Новосибирск</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'left',
    });
    nskTippy.show();

    obj = document.querySelector(".circle_vsk");
    let vskTippy = tippy(obj, {
        content: '<a class = "text_min map__sity">Владивосток</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'top',
    });
    vskTippy.show();

}
function TippyChinaCityInit() {
    let obj = document.querySelector(".circle_cin");
    let circle_cin = tippy(obj, {
        content: '<a class = "text_min map__sity">Циндао</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'top',
    });
    circle_cin.show();

    obj = document.querySelector(".circle_jaen");
    let circle_jaen = tippy(obj, {
        content: '<a class = "text_min map__sity">Чжэнчжоу</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'bottom',
    });
    circle_jaen.show();

    obj = document.querySelector(".circle_chen");
    let circle_chen = tippy(obj, {
        content: '<a class = "text_min map__sity">Чэнду</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'bottom',
    });
    circle_chen.show();

    obj = document.querySelector(".circle_shan");
    let circle_shan = tippy(obj, {
        content: '<a class = "text_min map__sity">Шанхай</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'top',
    });
    circle_shan.show();

    obj = document.querySelector(".circle_shen");
    let circle_shen = tippy(obj, {
        content: '<a class = "text_min map__sity">Шэньян</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'top',
    });
    circle_shen.show();

    obj = document.querySelector(".circle_nin");
    let circle_nin = tippy(obj, {
        content: '<a href = "#" class = "text_min map__sity">Нинбо</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'bottom',
    });
    circle_nin.show();

    obj = document.querySelector(".circle_tyan");
    let circle_tyan = tippy(obj, {
        content: '<a class = "text_min map__sity">Тяньцзинь</a>',
        theme: 'map',
        arrow: false,
        trigger: 'click',
        onHidden(instance) {
            instance.show();
        },
        allowHTML: true,
        placement: 'left',
    });
    circle_tyan.show();
}

function RevealInit() {
    let reveals = document.querySelectorAll(".reveal");

    for (let i = 0; i < reveals.length; i++) {
        let windowHeight = window.innerHeight;
        let elementTop = reveals[i].getBoundingClientRect()
            .top;

        if (elementTop < windowHeight + 10) {
            reveals[i].classList.add("active-reveal");
        }
        else {
            reveals[i].classList.remove("active-reveal");
        }
    }
}

function ButtonTop() {
    let backToTop = document.querySelector(".footer__button-top");

    // Показать/скрыть кнопку при прокрутке страницы
    window.addEventListener("scroll", function() {
        if (window.pageYOffset > 300) {
            //backToTop.style.display = "flex";
            backToTop.classList.add("button-top-active");
        }
        else {
            //backToTop.style.display = "none";
            backToTop.classList.remove("button-top-active");
        }
    });

    // Плавная прокрутка при клике на кнопку
    backToTop.addEventListener("click", function(event) {
        event.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

function WhiteSliderEvent() {
    let activeSlides = document.querySelectorAll(".white-slide.uk-active");
    let predSlide = document.querySelectorAll(".green-active");
    predSlide.forEach((slide) => {
        slide.classList.remove("green-active");
    });

    let lastSlide = document.querySelector('.white-slide:last-of-type');
    let lastActive = document.querySelector('.white-slide.uk-active:last-of-type');
    let firstSlide = document.querySelector('.white-slide');
    let firstActive = document.querySelector('.white-slide.uk-active');
    for (var i = 0, len = activeSlides.length; i < len; i++) {
        let prevSlide = activeSlides[i].previousElementSibling;
        let nextSlide = activeSlides[i].nextElementSibling;

        if (prevSlide == null && nextSlide != null && nextSlide.classList.contains("uk-active") && lastSlide === lastActive) {
            activeSlides[i].classList.add("green-active");
            nextSlide.classList.remove("green-active");
            break;
        }
        else if (nextSlide == null && prevSlide != null && prevSlide.classList.contains("uk-active") && firstSlide === firstActive) {
            activeSlides[i].classList.add("green-active");
            prevSlide.classList.remove("green-active");
            break;
        }
        else if (nextSlide != null && prevSlide != null && prevSlide.classList.contains("uk-active") && nextSlide.classList.contains("uk-active")) {
            activeSlides[i].classList.add("green-active");
            nextSlide.classList.remove("green-active");
            prevSlide.classList.remove("green-active");
            break;
        }
    }
}

function GreenSliderEvent() {
    let activeSlides = document.querySelectorAll(".green-slide.uk-active");
    let predSlide = document.querySelectorAll(".white-active");
    predSlide.forEach((slide) => {
        slide.classList.remove("white-active");
    });

    let lastSlide = document.querySelector('.green-slide:last-of-type');
    let lastActive = document.querySelector('.green-slide.uk-active:last-of-type');
    let firstSlide = document.querySelector('.green-slide');
    let firstActive = document.querySelector('.green-slide.uk-active');
    for (var i = 0, len = activeSlides.length; i < len; i++) {
        let prevSlide = activeSlides[i].previousElementSibling;
        let nextSlide = activeSlides[i].nextElementSibling;

        if (prevSlide == null && nextSlide != null && nextSlide.classList.contains("uk-active") && lastSlide === lastActive) {
            activeSlides[i].classList.add("white-active");
            nextSlide.classList.remove("white-active");
            break;
        }
        else if (nextSlide == null && prevSlide != null && prevSlide.classList.contains("uk-active") && firstSlide === firstActive) {
            activeSlides[i].classList.add("white-active");
            prevSlide.classList.remove("white-active");
            break;
        }
        else if (nextSlide != null && prevSlide != null && prevSlide.classList.contains("uk-active") && nextSlide.classList.contains("uk-active")) {
            activeSlides[i].classList.add("white-active");
            nextSlide.classList.remove("white-active");
            prevSlide.classList.remove("white-active");
            break;
        }
    }
}

function initActiveGreenSlide() {
    let checkSliderWhite = document.querySelector(".white-slider");
    let checkSliderGreen = document.querySelector(".green-slider");

    UIkit.util.on(checkSliderWhite, 'itemshow', function() {
        if (!isCustomTablet) {
            setTimeout(() => {
                WhiteSliderEvent();
            }, "800");
        }
    });
    UIkit.util.on(checkSliderGreen, 'itemshow', function() {
        if (!isCustomTablet) {
            setTimeout(() => {
                GreenSliderEvent();
            }, "800");
        }
    });
}

function DeleteActiveSlides() {
    let predSlideGreen = document.querySelectorAll(".green-active");
    predSlideGreen.forEach((slide) => {
        slide.classList.remove("green-active");
    });
    let predSlideWhite = document.querySelectorAll(".white-active");
    predSlideWhite.forEach((slide) => {
        slide.classList.remove("white-active");
    });
}
function InitContactMapMSK(){
    let check = document.querySelector(".contacts__map_second");
    if (check){
        let map = new ymaps.Map('contacts__map_second', {
            center: [55.579225, 37.607655],
            zoom: 16.5
        }, 
        {
            searchControlProvider: 'yandex#search'
        }),
        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="margin: 10px;">' +
                '<span id="counter-button"> улица Дорожная, 60 </span>' +
            '</div>', {

            build: function () {
                BalloonContentLayout.superclass.build.call(this);
            },

            clear: function () {
                BalloonContentLayout.superclass.clear.call(this);
            },
        });
        map.events.add('click', function() {
            map.balloon.close();
        });

        let placemark = new ymaps.Placemark(
            [55.579225, 37.607655],{
                    address: 'улица Дорожная, 60'
                },
            {
            balloonContentLayout: BalloonContentLayout,
            balloonOffset: [0, 0],
            balloonShadow: false,
            balloonPanelMaxMapArea: 0,
            iconLayout: 'default#image',
            iconImageHref: 'https://raw.githubusercontent.com/AlexseiT/TR/master/icon.png',
            iconImageSize: [81, 110],
            iconImageOffset: [-40, -90],
            hideIconOnBalloonOpen: false,
            balloonCloseButton: false,
            }
        );
        map.geoObjects.add(placemark);
    }
}
function InitContactMapNSK(){
    let check = document.querySelector(".contacts__map_first");
    if (check){
        let map = new ymaps.Map('contacts__map_first', {
            center: [55.058172, 82.915758],
            zoom: 16.5
        }, 
        {
            searchControlProvider: 'yandex#search'
        }),
        BalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            '<div style="margin: 10px;">' +
                '<span id="counter-button"> улица Дуси Ковальчук, 274 </span>' +
            '</div>', {

            build: function () {
                BalloonContentLayout.superclass.build.call(this);
            },

            clear: function () {
                BalloonContentLayout.superclass.clear.call(this);
            },
        });
        map.events.add('click', function() {
            map.balloon.close();
        });

        let placemark = new ymaps.Placemark(
            [55.058328, 82.915683],{
                    address: 'улица Дуси Ковальчук, 274'
                },
            {
            balloonContentLayout: BalloonContentLayout,
            balloonOffset: [0, 0],
            balloonShadow: false,
            balloonPanelMaxMapArea: 0,
            iconLayout: 'default#image',
            iconImageHref: 'https://raw.githubusercontent.com/AlexseiT/TR/master/icon.png',
            iconImageSize: [81, 110],
            iconImageOffset: [-40, -90],
            hideIconOnBalloonOpen: false,
            balloonCloseButton: false,
            }
        );
        map.geoObjects.add(placemark);
    }
}
function EdditTerminal(map, block, arrayTerminal){
    arrayTerminal.forEach(element => {
        let string =  element.split("|");
        let adress = string[0];
        let name = string[1];
        let lon = string[2];
        let lat = string[3];
        let card = document.createElement("div");
        card.classList = "terminal__card";
        card.setAttribute("lon",lon);
        card.setAttribute("lat",lat);
        let nameAdress = document.createElement("span");
        nameAdress.classList = "terminal__adress text_standart";
        nameAdress.innerText = adress;
        let nameCard = document.createElement("span");
        nameCard.classList = "terminal__name text_small";
        nameCard.innerText = name;
        card.appendChild(nameAdress);
        card.appendChild(nameCard);
        block.appendChild(card);
        let placemark = new ymaps.Placemark([lon,lat], {
            iconCaption: name
        }, {
            preset: 'islands#greenDotIcon'
        });
        map.geoObjects.add(placemark);
        card.addEventListener('click', function (event) {
            map.setZoom(18);
            map.panTo([parseFloat(lon),parseFloat(lat)]);
        })
    });
}
let listTerminals = ['г. Новосибирск, Восточное шоссе, 2|АО "Евросиб-СПб-ТС"|55.125731|83.006803', 
    'г. Новосибирск, ул. Толмачевская, 1|ПАО "Трансконтейнер"|54.965471|82.827858', 
    'г. Новосибирск, ул. Тайгинская, 6 к. 1|ООО "ФИТ"|55.106551|82.990929', 
    'с. Прокудское, ст. ЧИК, 3307 км|ТЛЦ Сибирский|54.999000|82.536696',
    'г. Новосибирск, ул Молодости 53 Г|Чемской пл 1|54.861668|82.958922',
    'г. Новосибирск, ул Варшавская 1 А корп. 1|Чемской пл 2|54.855921|82.957701',
    'г. Новосибирск, ст. Сеятель, ул.Плотинная, 12|ООО «Сервис-Эклон»|54.858554|83.026116',
    'г. Новосибирск, ул 2-я Станционная, 21, корпус 2|ТГ Континент|55.011732|82.823717',
    'г. Новосибирск, Толмачевское 53Г|ТК Терминал|54.973646|82.781352',
    'г. Новосибирск, Тайгинская 7/12|ТК Терминал|55.110486|82.993031',
    'г. Новосибирск, ул Аэропорт, 2/3|ТЕРМИНАЛ-СЕВЕР|55.088815|82.921005',
    'г. Новосибирск, Толмачёвское шоссе, д 45, сток ПАО "ТрансКонтейнер"|ООО «ТК 54 РЕГИОН»|54.970029|82.788656',
    'г. Новосибирск, Толмачёвское шоссе, 27 к31|Азимут|54.961915|82.822055',
    'г. Новосибирск, Новосибирский р-н, Толмачевская складская зона 5а|Терминал ТрейдТранс|54.963801|82.788108',
    'Новосибирский район, Адрес НСО, Пашинский переезд, Восточное шоссе, 2. Сток Евросиб|Терминал ЕТН|55.125731|83.006803',
    'г. Новосибирск, Станционная, 38/4|Терминал НГТ|54.998803|82.835548',
    'г. Новосибирск, ул. Толмачёвская складская зона 1|Терминал ОБЬ|54.963967|82.788189',
    'г. Обь, Октябрьская 8/2|Терминал Константа|54.988949|82.694171',
    'г. Новосибирск, Петухова 47А|Терминал Ross|54.954342|82.861150',
    'г. Новосибирск, ул. Пасечная, 23|Терминал Восточный|55.147695|82.988477',
];
function TerminalList(terminals){
    let block = document.querySelector(".terminal__content-list");

    //map.addChild(new YMapDefaultSchemeLayer());

    if (block)
    {
        let map = new ymaps.Map("terminal__map", {
            center: [54.995963, 82.904236],
            zoom: 11,
        });
        InitTerminalInput(map);
        EdditTerminal(map, block, terminals);
    }
}
function InitTerminalInput(map){
    let input = document.querySelector(".terminal__search");
    if (input){
        let block = document.querySelector(".terminal__content-list");
        input.addEventListener('input', function (event)
        {
            let value = input.value;
            let terminals = [];
            listTerminals.forEach(terminal => {
                let check = terminal.toLowerCase().includes(value.toLowerCase());
                if (check){
                    terminals.push(terminal);
                }
            });
            block.innerHTML = "";
            terminals.forEach(element => {
                let string =  element.split("|");
                let adress = string[0];
                let name = string[1];
                let lon = string[2];
                let lat = string[3];
                let card = document.createElement("div");
                card.classList = "terminal__card";
                card.setAttribute("lon",lon);
                card.setAttribute("lat",lat);
                let nameAdress = document.createElement("span");
                nameAdress.classList = "terminal__adress text_standart";
                nameAdress.innerText = adress;
                let nameCard = document.createElement("span");
                nameCard.classList = "terminal__name text_small";
                nameCard.innerText = name;
                card.appendChild(nameAdress);
                card.appendChild(nameCard);
                block.appendChild(card);
                card.addEventListener('click', function (event) {
                    map.setZoom(18);
                    map.panTo([parseFloat(lon),parseFloat(lat)]);
                })
            });
        });
    }
}
function InitAnimCircleContainer(){
    let object = document.querySelector(".object-container__object");
    if (object){
        let circles = document.querySelectorAll(".object-container__object circle");
        circles.forEach((circle) => {
            anime({
                targets: circle,
                easing: 'easeInOutSine',
                duration: 3000,
                direction: 'alternate',
                r: 9,
                loop: true,
            });
        });
    }
}
function InitCircleContainer(){
    let object = document.querySelector(".object-container__object");
    if (object)
    {
        let mapWidthNow = parseFloat(object.getBoundingClientRect().width);
        let mapHeightNow = parseFloat(object.getBoundingClientRect().height);
        let mapWidth = 1920;
        let mapHeight = 864;
        let coeffX = mapWidthNow / mapWidth;
        let coeffY = mapHeightNow / mapHeight;
        let elementsMap = document.querySelectorAll(".map__sity");//34679
        elementsMap.forEach((objLink) => {

            let obj = document.querySelector("." + objLink.id);
            let coordinateX = (obj.getAttribute('cx') * coeffX);
            let coordinateY = (obj.getAttribute('cy') * coeffY);

            if (obj.classList.contains("obj1")) {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect().width) - parseFloat(objLink.getBoundingClientRect().width) / 8 ) * coeffX;
                coordinateY -= (17) * coeffX;
            }
            if (obj.classList.contains("obj2")) {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect().width) - parseFloat(objLink.getBoundingClientRect().width) / 5.5 ) * coeffX;
                coordinateY -= (17) * coeffX;
            }
            if (obj.classList.contains("obj5")) {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect().width) - parseFloat(objLink.getBoundingClientRect().width) / 5.7 ) * coeffX;
                coordinateY -= (17) * coeffX;
            }
            if (obj.classList.contains("obj8")) {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect().width) - parseFloat(objLink.getBoundingClientRect().width) / 6.7 ) * coeffX;
                coordinateY -= (17) * coeffX;
            }
            if (obj.classList.contains("obj3") || obj.classList.contains("obj4") || obj.classList.contains("obj6") || obj.classList.contains("obj7") || obj.classList.contains("obj9")) {
                coordinateX += 10 * coeffX;
                coordinateY -= (17) * coeffX;
            }
            if (obj.classList.contains("obj10") || obj.classList.contains("obj11") || obj.classList.contains("obj12") || obj.classList.contains("obj13") || obj.classList.contains("obj14")) {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect().width) / 2.5 ) * coeffX;
                coordinateY += (9) * coeffX;
            }
            /*if (objLink.classList.contains("obj3") || objLink.classList.contains("obj4") || objLink.classList.contains("obj6") || objLink.classList.contains("obj7") || objLink.classList.contains("obj9") || objLink.classList.contains("obj10") || objLink.classList.contains("obj11") || objLink.classList.contains("obj12") || objLink.classList.contains("obj13") || objLink.classList.contains("obj14")) {
                coordinateX -= (parseFloat(objLink.getBoundingClientRect().width) - parseFloat(objLink.getBoundingClientRect().width) / 8 ) * coeffX;
                coordinateY -= (17) * coeffX;
            }*/
            objLink.style.left = coordinateX + "px";
            objLink.style.top = coordinateY + "px";
        });
    }
}
function InitNumberContainer(){
    let object = document.querySelector(".object-container__object");
    if (object)
    {
        let mapWidthNow = parseFloat(object.getBoundingClientRect().width);
        let mapHeightNow = parseFloat(object.getBoundingClientRect().height);
        let mapWidth = 1920;
        let mapHeight = 864;
        let coeffX = mapWidthNow / mapWidth;
        let coeffY = mapHeightNow / mapHeight;
        let elementsMap = document.querySelectorAll(".object__number");
        elementsMap.forEach((objLink) => {

            let obj = document.querySelector("." + objLink.id.slice(0, -1));
            let coordinateX = (obj.getAttribute('cx') * coeffX);
            let coordinateY = (obj.getAttribute('cy') * coeffY);
            coordinateX -= 10;
            coordinateY -= 10;
            objLink.style.left = coordinateX + "px";
            objLink.style.top = coordinateY + "px";
        });
    }
}
document.addEventListener('DOMContentLoaded', (event) => {
    // ASYNC
    InitCenteredSliders(); // Преключение класса центрального слайда при свайпах
    CallbackFormInit(); // Инцициализация всех форм (Маска тел. + ajax на submit)
    EnableSubmitOnCheckbox(); // Активация submit только после согласия с политикой
    // InitLoadMorePosts();        // Инит кнопки "Загрузить еще" для постов, см. WP ExBlog.php, functions.php
    // END ASYNC

    InitCityPopup();
    InitCookieAgree();
    ButtonTop();
    // InsertPostContents();    // Содержание статьи по заголовкам
    // LoadMapOnScroll();       // Прогрузка карты при скролле

    if (!isMobile) {
        MapPathInit();
        InitAnimCircleContainer();
    }

    RevealInit();
    LinckMapInit();
    InitCircleContainer();
    if (isMobile) {
        InitNumberContainer();
    }
    setTimeout(() => {
        TerminalList(listTerminals);
        InitContactMapNSK();
        InitContactMapMSK();
    }, 1000);
    window.addEventListener("scroll", RevealInit);
    if (isTablet) {
        InitBurgerMenu();
    }
    if (isCustomTablet2) {
        initActiveGreenSlide();
    }
    if (!isCustomTablet2) {
        DeleteActiveSlides();
    }

    // Наложение партикла
    // particlesJS.load('particles-slider', 'static/ParticlesJSON/GreenHexagons.json');
})


document.addEventListener('DOMContentLoaded', (event) => {
    
    let forms = document.querySelectorAll('form');
    forms.forEach((form) => {
        form.addEventListener('submit', (event) => {
            jQuery.ajax({
                url: '/mail.php',
                method: 'post',
                dataType: 'html',
                data: jQuery(form).serialize(),
                success: function(data){
                    $('.uk-modal-close').click();
                    setTimeout(() => {
                        alert("Спасибо! Мы свяжемся с Вами в ближайшее время!");
                    }, 1000);
            	    
                }
            });
        })
    })
})
