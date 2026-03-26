$(function () {
    const $menu = $('#menu'),
          $header = $('header'),
          $top = $('.top'),
          $bar = $('#myBar');

    // ── Menu toggle ──────────────────────────────────────────────────────
    $menu.click(() => {
        $menu.toggleClass('fa-times');
        $header.toggleClass('toggle');
    });

    // ── Update UI on scroll/load ─────────────────────────────────────────
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

    // ── Smooth scrolling for anchor links ────────────────────────────────
    $('a[href*="#"]').click(function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 500, 'linear');
    });

    // ── Contact form mailto popup ────────────────────────────────────────
    document.getElementById("contactForm").addEventListener("submit", function(e) {
        e.preventDefault();

        const name    = this.querySelector('[name="name"]').value;
        const email   = this.querySelector('[name="email"]').value;
        const project = this.querySelector('[name="project"]').value;
        const message = this.querySelector('[name="message"]').value;

        const mailtoLink = `mailto:sharkabir01@gmail.com?subject=${encodeURIComponent(project)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\nMessage: " + message)}`;

        alert("Message ready to send!");

        setTimeout(() => {
            window.location.href = mailtoLink;
        }, 100);
    });

    // ── Lightbox ─────────────────────────────────────────────────────────

    $('body').append(`
        <div class="lightbox-overlay" id="lightboxOverlay">
            <img src="" alt="Certificate" class="lightbox-img" id="lightboxImg" />
        </div>
        <button class="lightbox-close" id="lightboxClose" aria-label="Close">
            <i class="fas fa-times"></i>
        </button>
    `);

    $('.portfolio .box-container .box').on('click', function () {
        const src = $(this).find('img').attr('src');
        $('#lightboxImg').attr('src', src);
        $('#lightboxOverlay, #lightboxClose').addClass('active');
        $('body').css('overflow', 'hidden');
    });

    $('#lightboxOverlay').on('click', function (e) {
        if (e.target === this) closeLightbox();
    });

    $('#lightboxClose').on('click', () => closeLightbox());

    $(document).on('keydown', e => {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        $('#lightboxOverlay, #lightboxClose').removeClass('active');
        $('body').css('overflow', '');
        setTimeout(() => $('#lightboxImg').attr('src', ''), 350);
    }

    // ================================================================
    //  EDUCATION SECTION — Scroll-triggered slide-in animation
    // ================================================================

    /**
     * Uses IntersectionObserver to add .edu-visible to each education
     * box as it enters the viewport.  Falls back to immediate reveal
     * in browsers that don't support IntersectionObserver.
     */
    const eduBoxes = document.querySelectorAll('.education .box-container .box');

    if ('IntersectionObserver' in window) {
        const eduObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('edu-visible');
                        // once revealed, stop watching
                        eduObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15 }     // trigger when 15 % of box is visible
        );

        eduBoxes.forEach(box => eduObserver.observe(box));
    } else {
        // fallback: reveal everything immediately
        eduBoxes.forEach(box => box.classList.add('edu-visible'));
    }

    // ================================================================
    //  SKILLS SECTION — Scroll-triggered progress-bar + heading
    // ================================================================

    /**
     * Skill bar widths are stored as data attributes on the <span>
     * element.  We inject those data-width values from the CSS class
     * names already present (html→95, css→85, etc.) so the HTML
     * doesn't need to change.
     */
    const skillWidthMap = {
        html:   95,
        css:    85,
        jquery: 95,
        python: 95,
        mysql:  90,
        django: 90,
        devops: 75,
    };

    // Inject percentage labels into each .info div
    document.querySelectorAll('.skill-bars .bar').forEach(bar => {
        const infoDiv = bar.querySelector('.info');
        if (infoDiv && !infoDiv.querySelector('.pct-label')) {
            // figure out the width from the progress-line class
            const progressLine = bar.querySelector('.progress-line');
            if (progressLine) {
                let pct = 0;
                for (const [key, val] of Object.entries(skillWidthMap)) {
                    if (progressLine.classList.contains(key)) { pct = val; break; }
                }
                const label = document.createElement('span');
                label.className = 'pct-label';
                label.textContent = pct + '%';
                infoDiv.appendChild(label);
            }
        }
    });

    const skillHeading = document.querySelector('.skill');
    const skillBars    = document.querySelectorAll('.skill-bars .bar');

    if ('IntersectionObserver' in window) {

        // Heading observer
        if (skillHeading) {
            const headingObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('skill-heading-visible');
                            headingObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.5 }
            );
            headingObserver.observe(skillHeading);
        }

        // Bars observer
        const barObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const bar = entry.target;
                        bar.classList.add('bar-visible');

                        // Animate the fill span to its target width
                        const progressLine = bar.querySelector('.progress-line');
                        const fillSpan     = progressLine ? progressLine.querySelector('span') : null;

                        if (fillSpan && progressLine) {
                            let targetWidth = 0;
                            for (const [key, val] of Object.entries(skillWidthMap)) {
                                if (progressLine.classList.contains(key)) { targetWidth = val; break; }
                            }
                            // Short delay so the bar-slide-up plays first
                            setTimeout(() => {
                                fillSpan.style.width = targetWidth + '%';
                            }, 200);
                        }

                        barObserver.unobserve(bar);
                    }
                });
            },
            { threshold: 0.3 }
        );

        skillBars.forEach(bar => barObserver.observe(bar));

    } else {
        // Fallback: reveal everything and fill bars immediately
        if (skillHeading) skillHeading.classList.add('skill-heading-visible');
        skillBars.forEach(bar => {
            bar.classList.add('bar-visible');
            const progressLine = bar.querySelector('.progress-line');
            const fillSpan     = progressLine ? progressLine.querySelector('span') : null;
            if (fillSpan && progressLine) {
                for (const [key, val] of Object.entries(skillWidthMap)) {
                    if (progressLine.classList.contains(key)) {
                        fillSpan.style.width = val + '%';
                        break;
                    }
                }
            }
        });
    }

});