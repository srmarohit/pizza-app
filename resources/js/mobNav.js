

export default function mobNav(){
    // JavaScript source code
 $(document).ready(function () {
    $('.food-slider').slick({
        autoplay:true,
        slidesToShow: 3,         // If you max no. of alides use to show then automatically pre and next btn disabled . no auto play.
        slidesToScroll: 1,
        prevArrow:'.prev-btn',
        nextArrow: '.next-btn',

        responsive: [{
            breakpoint:992,
            settings: {
                slidesToShow:2
            }
        },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1
                }
            }]
    });
    

/* Apply scaled class to nav trigger to show mobile nav menu. */

    $('.nav-trigger').click(function () {
        $('.nav-background').toggleClass('display');
        $('.site-content-wrapper').toggleClass('scaled');
    });

});

}