// =========================================================
// TEAM SUAVE
// =========================================================


// ---------------------------------------------------------
// ENTRADA
// ---------------------------------------------------------

window.addEventListener(
    'load',
    () => {

        document.body.classList.add(
            'loaded'
        );

    }
);


// ---------------------------------------------------------
// ANO
// ---------------------------------------------------------

const year =
    document.querySelector(
        '#year'
    );

if (year) {

    year.textContent =
        new Date().getFullYear();

}


// ---------------------------------------------------------
// CURSOR
// ---------------------------------------------------------

const cursor =
    document.querySelector(
        '.cursor'
    );


if (cursor) {

    window.addEventListener(
        'mousemove',
        event => {

            cursor.style.left =
                `${event.clientX}px`;

            cursor.style.top =
                `${event.clientY}px`;

        }
    );


    const links =
        document.querySelectorAll(
            'a'
        );


    links.forEach(
        link => {

            link.addEventListener(
                'mouseenter',
                () => {

                    cursor.classList.add(
                        'active'
                    );

                }
            );


            link.addEventListener(
                'mouseleave',
                () => {

                    cursor.classList.remove(
                        'active'
                    );

                }
            );

        }
    );

}


// ---------------------------------------------------------
// PEQUENO MOVIMENTO DO SUAVE COM O SCROLL
// ---------------------------------------------------------

const heroWord =
    document.querySelector(
        '.hero-word'
    );


window.addEventListener(
    'scroll',
    () => {

        if (!heroWord) {
            return;
        }


        const scroll =
            window.scrollY;


        if (
            scroll >
            window.innerHeight
        ) {
            return;
        }


        heroWord.style.marginLeft =
            `${scroll * 0.06}px`;

    },
    {
        passive: true
    }
);