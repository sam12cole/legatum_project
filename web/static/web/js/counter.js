document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".counter");
  let started = false;

  const startCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      const speed = 50;

      const updateCount = () => {
        const current = +counter.innerText;
        const increment = Math.ceil(target / 100);
        if (current < target) {
          counter.innerText = current + increment;
          setTimeout(updateCount, speed);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !started) {
      startCounters();
      started = true;
    }
  }, { threshold: 0.5 });

  observer.observe(document.querySelector(".counter-floating"));
});
