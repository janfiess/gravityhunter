/**
 * footer.html
 */


    //footer fades in when scrolled to very bottom of the page
/*
var footer = $('.footer'),
    extra  = 10; // In case you want to trigger it a bit sooner than exactly at the bottom.

footer.css({opacity: '0', display: 'block'});


$(window).scroll(function () {

    var scrolledLength = ( $(window).height() + extra ) + $(window).scrollTop(),
        documentHeight = $(document).height();

    //console.log('Scroll length: ' + scrolledLength + ' Document height: ' + documentHeight)


    if (scrolledLength >= documentHeight ) {

        footer
            .addClass('bottom')
            .stop().animate({bottom: '0', opacity: '1'}, 300);
    }

    else if (scrolledLength <= documentHeight && footer.hasClass('bottom')) {
        footer
            .removeClass('bottom')
            .stop().animate({bottom: '-100', opacity: '0'}, 300);
    }
});
*/

/**
 * test.html
 */

// insert sample data

$('#input_button').unbind().click(function () {
    var data = {
        email: $('#input_email').val(),
        name: $('#input_name').val(),
        scores: $('#input_scores').val(),
        level: $('#input_level').val()
    }
    console.log(data);
    socket.emit("testplayer", data);
});


/**
 * signup.html
 */

$('#signup_button').unbind().click(function () {
    var data = {
        email: $('#signup_email').val(),
        name: $('#signup_nickname').val(),
        password: $('#signup_password').val(),
        // server adds timestamp in timestamp
    }
    console.log(data);
    socket.emit("signup", data);
});



/**
 * highscore.html
 */

// generate table dynamically



/**
 * login.html
 */

// form validation

// http://bv.doc.javake.cn/getting-started/



$(".sidepic").fadeIn(1000);

if($(document).width()<600){
    $(".footer").css("height","120");
}
