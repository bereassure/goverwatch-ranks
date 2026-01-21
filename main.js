class RateInfo {
    name; // 원생명
    ratings; // 점수들
    constructor(name) {
        this.name = name;
        this.ratings = [];
    }
    get gpa() {
        if (this.ratings.length > 0) {
            var total = 0;
            this.ratings.forEach(v => {
                total += v.rate;
            });
            return total / this.ratings.length;
        }
        return 0;
    }
    // 평가 추가
    addRate(critic, rate, review) {
        this.ratings.push({ critic: critic, rate: rate, review: review });
    }
}
class WebHandle {
    highestZIndex = 0;
    currentSelected;
    topStars;
    bottomStars;
    topReview;
    bottomReview;
    topAnim;
    bottomAnim;
    constructor() {
        window.handle = this;
        this.topStars = document.querySelector(".review-background.review-top .review-stars");
        this.bottomStars = document.querySelector(".review-background.review-bottom .review-stars");
        this.topReview = document.querySelector(".review-background.review-top .review-content");
        this.bottomReview = document.querySelector(".review-background.review-bottom .review-content");
    }
    async generate() {
        await this.settingLayouts();
    }
    async settingLayouts() {
        const rates = await loadRates("week1");
        function getRate(name) {
            for (var i = 0; i < rates.length; i++) {
                if (rates[i]?.name == name)
                    return rates[i];
            }
            return undefined;
        }
        const layout = document.getElementById("ui-layout");
        const container = layout?.firstElementChild;
        const template = container.firstElementChild.innerHTML;
        for (var i = 0; i < 7; i++) {
            var child = container.children.item(i);
            var rate = rates[i];
            var html = template;
            var total = 0;
            rate.ratings.forEach(v => { total += v.rate; });
            var score = total / rate.ratings.length;
            html = html.replaceAll("$name", rate.name);
            html = html.replaceAll("$score", score.toString());
            child.innerHTML = html;
            child.dataset["name"] = rate.name;
            var img = child.querySelector("img.ui-rate-card-profile-portrait-img");
            img.src = img.dataset["src"];
            child.addEventListener("mouseenter", e => {
                this.currentSelected = e.target;
                if (this.currentSelected != undefined) {
                    var data = getRate(this.currentSelected.dataset["name"]);
                    if (data != undefined) {
                        const updateReview = (rating, review, stars) => {
                            var rows = rating.review.split("\n");
                            review.replaceChildren();
                            for (var i = 0; i < rows.length; i++) {
                                if (i > 0) {
                                    review.appendChild(document.createElement("br"));
                                }
                                var sp = document.createElement("span");
                                sp.textContent = rows[i];
                                review.appendChild(sp);
                            }
                            stars.replaceChildren();
                            var a = rating.rate / 2;
                            var b = Math.ceil(a);
                            var c = !Number.isInteger(a);
                            var star;
                            for (var i = 0; i < b; i++) {
                                star = document.createElement('span');
                                star.textContent = "★";
                                stars.appendChild(star);
                            }
                            if (c && star) {
                                star.classList.add("half");
                            }
                        };
                        updateReview(data.ratings[0], this.topReview, this.topStars);
                        updateReview(data.ratings[1], this.bottomReview, this.bottomStars);
                        if (this.topAnim != undefined)
                            this.topAnim.cancel();
                        if (this.bottomAnim != undefined)
                            this.bottomAnim.cancel();
                        var topParent = this.topReview.parentElement;
                        this.topAnim = topParent.animate([
                            // Keyframes
                            { opacity: 0, transform: 'translateX(-20px)' },
                            { opacity: 1, transform: 'translateX(0)' }
                        ], {
                            // Timing options
                            duration: 500,
                            easing: 'ease-out',
                            fill: 'forwards'
                        });
                        var bottomParent = this.bottomReview.parentElement;
                        this.bottomAnim = bottomParent.animate([
                            // Keyframes
                            { opacity: 0, transform: 'translateX(-20px)' },
                            { opacity: 1, transform: 'translateX(0)' }
                        ], {
                            // Timing options
                            duration: 500,
                            easing: 'ease-out',
                            fill: 'forwards'
                        });
                    }
                    // this.currentSelected.style.zIndex = (++this.highestZIndex).toString();
                }
            });
            child.addEventListener("mouseleave", e => {
                this.currentSelected = undefined;
            });
        }
    }
}
async function loadRates(fileName) {
    const res = await fetch(`./rates/${fileName}.json`);
    const data = await res.json();
    return data;
}
const handle = new WebHandle();
handle.generate();
export {};
//# sourceMappingURL=main.js.map