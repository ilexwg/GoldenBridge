let bannerRender = (function () {
  // elements
  let container = document.querySelector("#container");
  let wrapper = container.querySelector(".wrapper");
  let focus = container.querySelector(".focus");
  let arrowLeft = container.querySelector(".arrowLeft");
  let arrowRight = container.querySelector(".arrowRight");
  let slideList = null;
  let focusList = null;

  // query data
  let queryData = function () {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "json/banner.json");
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let data = JSON.parse(xhr.responseText);
          resolve(data);
        }
      };
      xhr.send(null);
    });
  };

  // bind HTML
  let bindHTML = function (data) {
    let strSlide = ``;
    let strFocus = ``;

    data.forEach((item, index) => {
      let {img, desc} = item;
      strSlide += `
      <div class="slide">
        <img src="${img}" alt="${desc}">
      </div>
      `;
      strFocus += `<li class="${index === 0 ? 'active' : ''}"></li>`;

      wrapper.innerHTML = strSlide;
      focus.innerHTML = strFocus;

      slideList = wrapper.querySelectorAll(".slide");
      focusList = focus.querySelectorAll("li");

      wrapper.appendChild(slideList[0].cloneNode(true));
      slideList = wrapper.querySelectorAll(".slide");

      utils.css(wrapper, "width", slideList.length * 1000);
    });
  };

  // basic arguments
  let stepIndex = 0; // slide counter
  let autoTimer = null; // auto play timer
  let interval = 2500; // swift interval

  // auto play
  let autoMove = function () {
    stepIndex++;
    if (stepIndex >= slideList.length) {
      utils.css(wrapper, "left", 0);
      stepIndex = 1;
    }
    animate(wrapper, {
      left: -stepIndex * 1000
    }, 200);

    changeFocus();
  };

  // change focus
  let changeFocus = function () {
    let tempIndex = stepIndex;
    tempIndex === slideList.length - 1 ? tempIndex = 0 : null;
    [].forEach.call(focusList, (item, index) => {
      item.className = index === tempIndex ? "active" : "";
    });
  };

  // handle container
  let handleContainer = function () {
    container.onmouseenter = function () {
      clearInterval(autoTimer);
      arrowLeft.style.display = arrowRight.style.display = "block";
    };
    container.onmouseleave = function () {
      autoTimer = setInterval(autoMove, interval);
      arrowLeft.style.display = arrowRight.style.display = "none";
    };

    // click
    let queryIndex = function (ele) {
      let ary = [];
      let pre = ele.previousElementSibling;

      while (pre) {
        ary.unshift(pre);
        pre = pre.previousElementSibling;
      }
      return ary.length;
    };

    container.onclick = function (ev) {
      let target = ev.target;
      let tag = target.tagName;
      let par = target.parentNode;

      // focus click
      if (tag === "LI" && par.className.indexOf("focus") > -1) {
        stepIndex = queryIndex(target);
        animate(wrapper, {
          left: -stepIndex * 1000
        }, 200);
        changeFocus();
        return;
      }

      // arrow click
      if (tag === "A" && target.className.indexOf("arrow") > -1) {
        // left arrow click
        if (target.className.indexOf("arrowLeft") > -1) {
          stepIndex--;
          if (stepIndex < 0) {
            utils.css(wrapper, "left", -(slideList.length-1)*1000);
            stepIndex = slideList.length - 2;
          }
          animate(wrapper, {
            left: -stepIndex * 1000
          }, 200);
          changeFocus();
          return;
        }

        // right arrow click
        autoMove();
      }
    };

  };




  return {
    init: function () {
      let promise = queryData();
      promise.then(bindHTML).then(() => {
        autoTimer = setInterval(autoMove, interval);
      }).then(() => {
        handleContainer();
      });
    }
  }
})();

bannerRender.init();