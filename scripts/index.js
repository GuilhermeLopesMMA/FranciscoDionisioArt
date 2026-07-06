(function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const thumbs = document.querySelectorAll(".art-tile-inner img");

  let scale = 1;
  let originX = 0;
  let originY = 0;
  let isPanning = false;
  let didDrag = false;
  let startX = 0;
  let startY = 0;
  let downClientX = 0;
  let downClientY = 0;

  function updateTransform() {
    lightboxImg.style.transform = `translate(${originX}px, ${originY}px) scale(${scale})`;
    lightboxImg.classList.toggle("zoomed", scale > 1);
  }

  function resetZoom() {
    scale = 1;
    originX = 0;
    originY = 0;
    updateTransform();
  }

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    resetZoom();
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
    resetZoom();
  }

  thumbs.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });

  lightboxImg.addEventListener("click", (e) => {
    e.stopPropagation();
    if (didDrag) return;
    scale = scale === 1 ? 2.2 : 1;
    if (scale === 1) {
      originX = 0;
      originY = 0;
    }
    updateTransform();
  });

  lightbox.addEventListener(
    "wheel",
    (e) => {
      if (!lightbox.classList.contains("active")) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      scale = Math.min(4, Math.max(1, scale + delta));
      if (scale === 1) {
        originX = 0;
        originY = 0;
      }
      updateTransform();
    },
    { passive: false }
  );

  lightboxImg.addEventListener("mousedown", (e) => {
    if (scale === 1) return;
    e.preventDefault();
    isPanning = true;
    didDrag = false;
    downClientX = e.clientX;
    downClientY = e.clientY;
    startX = e.clientX - originX;
    startY = e.clientY - originY;
    lightboxImg.classList.add("panning");
  });

  window.addEventListener("mousemove", (e) => {
    if (!isPanning) return;
    if (
      !didDrag &&
      (Math.abs(e.clientX - downClientX) > 4 ||
        Math.abs(e.clientY - downClientY) > 4)
    ) {
      didDrag = true;
    }
    originX = e.clientX - startX;
    originY = e.clientY - startY;
    updateTransform();
  });

  window.addEventListener("mouseup", () => {
    isPanning = false;
    lightboxImg.classList.remove("panning");
  });
})();
