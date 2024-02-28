const
    sidebar = $(".nav-area"),
    modeSwitch = $(".sun-moon"),
    modeIcon = $(".mode .sun-moon i"),
    content = $(".container");


if (localStorage.getItem('mode') === 'dark') {
    sidebar.toggleClass("light");
    content.toggleClass("light");
    $("body").toggleClass("light");
    modeIcon.removeClass("bx-moon").addClass("bx-sun");
}

modeSwitch.click(function () {
    sidebar.toggleClass("light");
    content.toggleClass("light");
    $("body").toggleClass("light");
    if (sidebar.hasClass("light")) {
        modeIcon.removeClass("bx-moon").addClass("bx-sun");
        localStorage.setItem('mode', 'dark');
    } else {
        modeIcon.removeClass("bx-sun").addClass("bx-moon");
        localStorage.setItem('mode', 'light');
    }
});





