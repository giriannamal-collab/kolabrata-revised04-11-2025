document.addEventListener("DOMContentLoaded", () => {
    
    // Observer for the new simple steps
    const simpleStepObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the step is visible

    // Target the new class: .process-simple-step
    const simpleProcessSteps = document.querySelectorAll('.process-simple-step');
    simpleProcessSteps.forEach(step => simpleStepObserver.observe(step));

});