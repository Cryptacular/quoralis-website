(function() {
    function email(e, element, emailAddress) {
        element.href = emailAddress;
    }

    function scrollScreenHeight() {
        var height = window.innerHeight;
        window.scroll({
            top: height,
            left: 0,
            behavior: 'smooth'
        });
    }

    var scrollArrow = document.getElementById('quScrollArrow');
    scrollArrow && scrollArrow.addEventListener('click', scrollScreenHeight);
}());
