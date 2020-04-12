/*****************************************************
                   services
*****************************************************/
$(function () {
    //animate on scroll
    new WOW().init();
})

/*****************************************************
                   Magnetic popup
*****************************************************/
$(function () {
    $("#work").magnificPopup({
        delegate: 'a', // the selector for gallery item
        type: 'image',
        gallery: {
            enabled: true
        }

    });
});
/*****************************************************
                   Team members
*****************************************************/

$(function () {
    $("#team-members").owlCarousel({
        items: 3,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            }
        }


    });
});
$(function () {
    $("#team-members2").owlCarousel({
        items: 3,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            }
        }


    });
});


$(function () {
    $("#customer-testimonials").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 700,
        loop: true,
        autoplayHoverPause: true
    });
});


/*****************************************************
                   stats
*****************************************************/
$(function () {
    $('.counter').counterUp({
        delay: 10,
        time: 2000,
    });
});



/*****************************************************
                   Navigation
*****************************************************/
$(function () {
    $(window).scroll(function () {
        if ($(this).scrollTop() < 50) {
            $("nav").removeClass("navbar-top-custom");
            $("#back-to-top").fadeOut();
        } else {
            $("nav").addClass("navbar-top-custom");
            $("#back-to-top").fadeIn();
        }
    });
});



$(function () {
    $("a.smooth-scroll").click(function (event) {
        event.preventDefault();
        var section = $(this).attr("href");
        $('html,body').animate({
            scrollTop: $(section).offset().top - 20
        }, 1250, "easeInOutExpo");
    });


});
//close nav-bar on click
$(function () {
    $(".navbar-collapse ul li a").on("click touch", function () {
        $(".navbar-toggle").click();
    });
});
