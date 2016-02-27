/**
 * play.html
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
    socket.emit("testplayer",data);
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