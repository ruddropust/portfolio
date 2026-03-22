$(function () {
    const $menu = $('#menu'),
          $header = $('header'),
          $top = $('.top'),
          $bar = $('#myBar');

    // Menu toggle
    $menu.click(() => {
        $menu.toggleClass('fa-times');
        $header.toggleClass('toggle');
    });

    // Update UI on scroll/load
    const updateUI = () => {
        $menu.removeClass('fa-times');
        $header.removeClass('toggle');
        $top.toggle($(window).scrollTop() > 0);
        if ($bar.length) {
            const winScroll = $(window).scrollTop();
            const height = $(document).height() - $(window).height();
            const scrolled = (winScroll / height) * 100;
            $bar.css('width', scrolled + '%');
        }
    };

    $(window).on('scroll load', updateUI);

    // Smooth scrolling for anchor links
    $('a[href*="#"]').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 500, 'linear');
    });

    // Contact form "Not sent yet" popup
    document.getElementById("contactForm").addEventListener("submit", function(e) {
        e.preventDefault(); // stop form submission
    
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const project = document.getElementById("project").value;
        const message = document.getElementById("message").value;
    
        const mailtoLink = `mailto:sharkabir01@gmail.com?subject=${encodeURIComponent(project)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nMessage: " + message)}`;
    
        // Show alert first
        alert("Message ready to send!");
    
        // Open mail client after a short delay
        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 100); // 100ms delay
    });
});