// js/hero.js

/**
 * hero-split.js
 * Efecto split interactivo para el hero del portfolio.
 *
 * Lógica:
 *  - mousemove  → mueve el clip-path de img-normal y el divisor visual
 *  - mouseleave → vuelve al estado 50/50 con animación suave (lerp)
 *  - Los textos designer / coder se desvanecen al acercarse al extremo opuesto
 *
 * Dependencias: ninguna (vanilla JS puro)
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ── Referencias al DOM ── */
    var hero      = document.getElementById('hero');
    var imgNormal = document.getElementById('img-normal');
    var divider   = document.getElementById('divider');
    var designer  = document.getElementById('designer');
    var coder     = document.getElementById('coder');

    /* ── Estado ── */
    var targetPct  = 50;   // porcentaje objetivo (0-100)
    var currentPct = 50;   // porcentaje animado actual
    var animFrame  = null; // referencia al requestAnimationFrame activo

    /* Zona de fade: cuántos % desde cada extremo empieza a desvanecerse la etiqueta */
    var FADE_ZONE = 20;


    /* ── Utilidades ──────────────────────────────────────────── */

    /** Interpolación lineal */
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /** Aplica el porcentaje actual a los elementos del DOM */
    function applyPct(pct) {

        /* Clip-path: la imagen normal cubre desde pct% hacia la derecha */
        imgNormal.style.clipPath = 'inset(0 0 0 ' + pct + '%)';

        /* Posición del divisor */
        divider.style.left = pct + '%';

        /* Opacidad de las etiquetas */
        var designerOpacity, coderOpacity;

        if (pct < FADE_ZONE) {
            /* Mouse muy a la izquierda → designer se desvanece */
            designerOpacity = pct / FADE_ZONE;
            coderOpacity    = 1;
        } else if (pct > (100 - FADE_ZONE)) {
            /* Mouse muy a la derecha → coder se desvanece */
            designerOpacity = 1;
            coderOpacity    = (100 - pct) / FADE_ZONE;
        } else {
            /* Zona central → ambas visibles */
            designerOpacity = 1;
            coderOpacity    = 1;
        }

        designer.style.opacity = designerOpacity;
        coder.style.opacity    = coderOpacity;

        /* Desplazamiento sutil en X para reforzar el fade */
        designer.style.transform = 'translateY(-50%) translateX(' + ((1 - designerOpacity) * -16) + 'px)';
        coder.style.transform    = 'translateY(-50%) translateX(' + ((1 - coderOpacity)    *  16) + 'px)';
    }


    /* ── Bucle de animación (lerp hacia el target) ────────────── */
    function animate() {

        currentPct = lerp(currentPct, targetPct, 0.12);

        applyPct(currentPct);

        /* Continuar mientras no hayamos llegado al objetivo */
        if (Math.abs(currentPct - targetPct) > 0.05) {
            animFrame = requestAnimationFrame(animate);
        } else {
            /* Snap final exacto y liberar el frame */
            applyPct(targetPct);
            animFrame = null;
        }
    }

    /** Arranca el bucle solo si no está corriendo */
    function startAnimation() {
        if (!animFrame) {
            animFrame = requestAnimationFrame(animate);
        }
    }


    /* ── Eventos ─────────────────────────────────────────────── */

    hero.addEventListener('mousemove', function (e) {
        var rect   = hero.getBoundingClientRect();
        var mouseX = e.clientX - rect.left;

        targetPct = Math.max(0, Math.min(100, (mouseX / rect.width) * 100));
        startAnimation();
    });

    hero.addEventListener('mouseleave', function () {
        targetPct = 50;   /* volver al centro */
        startAnimation();
    });

    /* Touch — para móviles */
    hero.addEventListener('touchmove', function (e) {
        e.preventDefault();
        var rect   = hero.getBoundingClientRect();
        var touchX = e.touches[0].clientX - rect.left;

        targetPct = Math.max(0, Math.min(100, (touchX / rect.width) * 100));
        startAnimation();
    }, { passive: false });

    hero.addEventListener('touchend', function () {
        targetPct = 50;
        startAnimation();
    });


    /* ── Estado inicial ────────────────────────────────────────── */
    applyPct(50);

});