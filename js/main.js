

(function(html) {

    "use strict";

    html.className = html.className.replace(/\bno-js\b/g, '') + ' js ';



   /* Animations
    * -------------------------------------------------- */
    const tl = anime.timeline( {
        easing: 'easeInOutCubic',
        duration: 800,
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 1000,
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    .add({
        targets: '.s-header',
        translateY: [-100, 0],
        opacity: [0, 1]
    }, '-=200')
    .add({
        targets: [ '.s-intro .text-pretitle', '.s-intro .text-huge-title'],
        translateX: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(400)
    })
    .add({
        targets: '.circles span',
        keyframes: [
            {opacity: [0, .3]},
            {opacity: [.3, .1], delay: anime.stagger(100, {direction: 'reverse'})}
        ],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-social li',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100, {direction: 'reverse'})
    })
    .add({
        targets: '.intro-scrolldown',
        translateY: [100, 0],
        opacity: [0, 1]
    }, '-=800');



   /* Preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;
        
        window.addEventListener('load', function() {
            document.querySelector('html').classList.remove('ss-preload');
            document.querySelector('html').classList.add('ss-loaded');

            document.querySelectorAll('.ss-animated').forEach(function(item){
                item.classList.remove('ss-animated');
            });

            tl.play();
        });

        // force page scroll position to top at page refresh
        // window.addEventListener('beforeunload' , function () {
        //     // window.scrollTo(0, 0);
        // });

    }; // end ssPreloader


   /* Mobile Menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.mobile-menu-toggle');
        const mainNavWrap = document.querySelector('.main-nav-wrap');
        const siteBody = document.querySelector("body");

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.main-nav a').forEach(function(link) {
            link.addEventListener("click", function(event) {

                // at 800px and below
                if (window.matchMedia('(max-width: 800px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 800px
            if (window.matchMedia('(min-width: 801px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains("is-clicked")) toggleButton.classList.remove("is-clicked");
            }
        });

    }; // end ssMobileMenu


   /* Highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll(".target-section");

        // Add an event listener listening for scroll
        window.addEventListener("scroll", navHighlight);

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute("id");
            
               /* If our current scroll position enters the space where current section 
                * on screen is, add .current class to parent element(li) of the thecorresponding 
                * navigation link, else remove it. To know which link is active, we use 
                * sectionId variable we are getting while looping through sections as 
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.add("current");
                } else {
                    document.querySelector(".main-nav a[href*=" + sectionId + "]").parentNode.classList.remove("current");
                }
            });
        }

    }; // end ssScrollSpy


   /* Animate elements if in viewport
    * ------------------------------------------------------ */
    const ssViewAnimate = function() {

        const blocks = document.querySelectorAll("[data-animate-block]");

        window.addEventListener("scroll", viewportAnimation);

        function viewportAnimation() {

            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains("ss-animated");

                if (inView && (!isAnimated)) {
                    anime({
                        targets: current.querySelectorAll("[data-animate-el]"),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(400, {start: 200}),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add("ss-animated");
                        }
                    });
                }
            });
        }

    }; // end ssViewAnimate


   /* Swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const mySwiper = new Swiper('.swiper-container', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 32
                },
                // when window width is > 1200px
                1201: {
                    slidesPerView: 2,
                    spaceBetween: 80
                }
            }
         });

    }; // end ssSwiper


   /* Lightbox
    * ------------------------------------------------------ */
    const ssLightbox = function() {

        const folioLinks = document.querySelectorAll('.folio-list__item-link');
        const modals = [];

        folioLinks.forEach(function(link) {
            let modalbox = link.getAttribute('href');
            let instance = basicLightbox.create(
                document.querySelector(modalbox),
                {
                    onShow: function(instance) {
                        //detect Escape key press
                        document.addEventListener("keydown", function(event) {
                            event = event || window.event;
                            if (event.keyCode === 27) {
                                instance.close();
                            }
                        });
                    }
                }
            )
            modals.push(instance);
        });

        folioLinks.forEach(function(link, index) {
            link.addEventListener("click", function(event) {
                event.preventDefault();
                modals[index].show();
            });
        });

    };  // end ssLightbox


   /* Alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(event) {
                if (event.target.matches(".alert-box__close")) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add("hideit");

                    setTimeout(function(){
                        box.style.display = "none";
                    }, 500)
                }    
            });

        })

    }; // end ssAlertBoxes


   /* Smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssScrollSpy();
        ssViewAnimate();
        ssSwiper();
        ssLightbox();
        ssAlertBoxes();
        ssMoveTo();

    })();

})(document.documentElement);


let currentSlide = 0;
const slides = document.querySelectorAll('.slide-image');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.display = i === index ? 'block' : 'none';
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Initialize with the first image
showSlide(currentSlide);


const quizQuestions = [
    {
        question: "Which company did Youssef intern with in 2024?",
        options: ["ABS Computer", "Primatec Engineering", "SEREPT"],
        correctAnswer: 1
    },
    {
        question: "What programming language is Youssef certified in for data science?",
        options: ["Java", "Python", "PHP"],
        correctAnswer: 1
    },
    {
        question: "In which year did Youssef complete an internship at SEREPT?",
        options: ["2022", "2023", "2024"],
        correctAnswer: 0
    },
    {
        question: "Which framework is Youssef experienced with for web development?",
        options: ["Angular", "Flask", "Django"],
        correctAnswer: 2
    },
    {
        question: "What certification course did Youssef complete for MySQL?",
        options: ["PHP & MySQL", "Python & MySQL", "Java & MySQL"],
        correctAnswer: 0
    },
    {
        question: "Which of these is NOT listed as Youssef's skill?",
        options: ["Flutter", "Swift", "React.js"],
        correctAnswer: 1
    },
    {
        question: "Which high school did Youssef attend?",
        options: ["Institute Majida Boulila", "ISET Sfax", "SEREPT High"],
        correctAnswer: 0
    },
    {
        question: "What is the duration of Youssef's internship at ABS Computer?",
        options: ["6 months", "1 month", "3 months"],
        correctAnswer: 1
    },
    {
        question: "Which platform did Youssef use for his Python for Data Science course?",
        options: ["Udemy", "Coursera", "edX"],
        correctAnswer: 0
    },
    {
        question: "Which of these technologies is Youssef skilled in?",
        options: ["Kotlin", "PL/SQL", "Ruby"],
        correctAnswer: 1
    }
];

class Quiz {
  constructor() {
      this.currentQuestionIndex = 0;
      this.answers = new Array(quizQuestions.length).fill(null);
      this.initElements();
      this.bindEvents();
      this.loadQuestion();
      this.updateRoadmap();

  }

  initElements() {
      // Question Section
      this.questionSection = document.getElementById('questionSection');
      this.questionText = document.getElementById('questionText');
      this.optionsContainer = document.getElementById('optionsContainer');
      this.prevBtn = document.getElementById('prevBtn');
      this.nextBtn = document.getElementById('nextBtn');

      // Result Section
      this.resultSection = document.getElementById('resultSection');
      this.percentageText = document.getElementById('percentageText');
      this.scoreText = document.getElementById('scoreText');
      this.reviewBtn = document.getElementById('reviewBtn');

      // Review Section
      this.reviewSection = document.getElementById('reviewSection');
      this.reviewQuestionText = document.getElementById('reviewQuestionText');
      this.reviewOptionsContainer = document.getElementById('reviewOptionsContainer');
      this.reviewPrevBtn = document.getElementById('reviewPrevBtn');
      this.reviewNextBtn = document.getElementById('reviewNextBtn');
      this.restartBtn = document.getElementById('restartBtn');
  
        // Roadmap elements
        this.questionProgress = document.getElementById('questionProgress');
        this.progressFill = document.getElementById('progressFill');
    }

  bindEvents() {
      this.nextBtn.addEventListener('click', () => this.navigateQuestion('next'));
      this.prevBtn.addEventListener('click', () => this.navigateQuestion('prev'));
      this.reviewBtn.addEventListener('click', () => this.startReview());
      this.reviewNextBtn.addEventListener('click', () => this.navigateReview('next'));
      this.reviewPrevBtn.addEventListener('click', () => this.navigateReview('prev'));
      this.restartBtn.addEventListener('click', () => this.restartQuiz());
  }

  loadQuestion() {
    const question = quizQuestions[this.currentQuestionIndex];
    this.questionText.textContent = question.question;

    this.optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => this.selectAnswer(index));
        
        if (this.answers[this.currentQuestionIndex] === index) {
            optionElement.classList.add('selected');
        }

        this.optionsContainer.appendChild(optionElement);
    });

     // Update navigation buttons
     this.prevBtn.classList.toggle('hidden', this.currentQuestionIndex === 0);
     this.nextBtn.textContent = this.currentQuestionIndex === quizQuestions.length - 1 ? 'Submit' : 'Next';
     
     // Update roadmap
     this.updateRoadmap();
 }
    updateRoadmap() {
        // Update the question progress text
        this.questionProgress.textContent = `Question ${this.currentQuestionIndex + 1} of ${quizQuestions.length}`;

        // Calculate progress as a percentage
        const progressPercentage = ((this.currentQuestionIndex + 1) / quizQuestions.length) * 100;
        
        // Update the width of the progress bar fill
        this.progressFill.style.width = `${progressPercentage}%`;
    }
  selectAnswer(index) {
      this.answers[this.currentQuestionIndex] = index;
      
      // Remove selected from all options
      this.optionsContainer.querySelectorAll('.option').forEach(opt => {
          opt.classList.remove('selected');
      });
      
      // Add selected to clicked option
      this.optionsContainer.children[index].classList.add('selected');

      if (this.currentQuestionIndex === quizQuestions.length - 1) {
          this.nextBtn.textContent = 'Submit';
      }
  }

  navigateQuestion(direction) {
    if (direction === 'next') {
        if (this.currentQuestionIndex === quizQuestions.length - 1) {
            this.submitQuiz();
            return;
        }
        this.currentQuestionIndex++;
    } else {
        this.currentQuestionIndex--;
    }
    this.loadQuestion();
}
  submitQuiz() {
      const correctAnswers = this.answers.filter((answer, index) => 
          answer === quizQuestions[index].correctAnswer
      ).length;
      
      const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);

      // Update result section
      this.percentageText.textContent = `${percentage}%`;
      this.scoreText.textContent = `You scored ${correctAnswers} out of ${quizQuestions.length}`;

      // Animate progress circle
      const circleProgress = document.querySelector('.circle-progress');
      circleProgress.style.strokeDashoffset = 283 - (283 * percentage) / 100;

      // Switch to result section
      this.questionSection.classList.add('hidden');
      this.resultSection.classList.remove('hidden');
  }

  startReview() {
      this.currentQuestionIndex = 0;
      this.resultSection.classList.add('hidden');
      this.reviewSection.classList.remove('hidden');
      this.loadReviewQuestion();
  }

  loadReviewQuestion() {
      const question = quizQuestions[this.currentQuestionIndex];
      this.reviewQuestionText.textContent = question.question;

      this.reviewOptionsContainer.innerHTML = '';
      question.options.forEach((option, index) => {
          const optionElement = document.createElement('div');
          optionElement.classList.add('option');
          optionElement.textContent = option;
          
          // Mark correct and incorrect answers
          if (index === question.correctAnswer) {
              optionElement.classList.add('correct');
          }
          
          if (this.answers[this.currentQuestionIndex] !== null) {
              if (this.answers[this.currentQuestionIndex] === index && 
                  index !== question.correctAnswer) {
                  optionElement.classList.add('incorrect');
              }
          }

          this.reviewOptionsContainer.appendChild(optionElement);
      });

      // Update navigation buttons
      this.reviewPrevBtn.classList.toggle('hidden', this.currentQuestionIndex === 0);
      this.reviewNextBtn.textContent = this.currentQuestionIndex === quizQuestions.length - 1 
          ? 'Finish' : 'Next';
  }

  navigateReview(direction) {
      if (direction === 'next') {
          if (this.currentQuestionIndex === quizQuestions.length - 1) {
              this.restartQuiz();
              return;
          }
          this.currentQuestionIndex++;
      } else {
          this.currentQuestionIndex--;
      }
      this.loadReviewQuestion();
  }

  restartQuiz() {
      // Reset all quiz states
      this.currentQuestionIndex = 0;
      this.answers = new Array(quizQuestions.length).fill(null);

      // Hide all sections
      this.questionSection.classList.remove('hidden');
      this.resultSection.classList.add('hidden');
      this.reviewSection.classList.add('hidden');

      // Reset progress circle
      const circleProgress = document.querySelector('.circle-progress');
      circleProgress.style.strokeDashoffset = 283;

      // Load first question
      this.loadQuestion();
  }
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
  });