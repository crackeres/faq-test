document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll(".nav__item-link").forEach((link) => {
            let id = link.getAttribute("href").replace("#", "");
            if (id === entry.target.id) {
              link.classList.add("nav__item-link_active");
            } else {
              link.classList.remove("nav__item-link_active");
            }
          });
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  document.querySelectorAll(".faq__content-item").forEach((section) => {
    observer.observe(section);
  });
});
