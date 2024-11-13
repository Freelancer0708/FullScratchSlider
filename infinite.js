// 無限スライドの設定
export const InfiniteIndex = (isInfinite,oneslideWidth,sliderInner) => {
    console.log("InfiniteIndex:" + isInfinite);

    const slides = sliderInner.children;
    // 最初の要素を複製
    const firstClone = slides[0].cloneNode(true);
    // 最後の要素を複製
    const lastClone = slides[slides.length - 1].cloneNode(true);
    // 最後の要素に追加
    sliderInner.appendChild(firstClone);
    // 最初の要素に追加
    sliderInner.insertBefore(lastClone, slides[0]);

    const currentSlide = 2;
    let targetX = -oneslideWidth;
    let currentX = -oneslideWidth;
    let translateX = -oneslideWidth;
    sliderInner.style.transform = `translateX(${translateX}px)`;

    return {currentSlide,targetX,currentX,translateX};
};

export const InfiniteSlide = (isInfinite,targetX,slideWidth,deltaX,startX,e) => {
    console.log("InfiniteSlide:" + isInfinite);
    // スライダーを1枚分移動させる(targetX) += 1枚のスライド幅(slideWidth) * 移動させる方向(Math.sign(deltaX))
    targetX += slideWidth * Math.sign(deltaX);
    // スライドが移動したら、初期位置を、現在のマウスの位置に更新する(startX = e.clientX)
    startX = e.clientX;
    return {targetX,startX};
};

export const InfiniteLast = (isInfinite,currentSlide,currentX,targetX,translateX,slider,sliderInner,slideWidth) => {
    console.log("InfiniteLast:" + isInfinite);
    const classNames = {
        slider: "custom-slider",
        sliderInner: "custom-slider-inner",
        slide: "custom-slide",
    };

    // 無限スライドの作成後の設定
    const infiniteSliderInner = slider.querySelector(`.${classNames.sliderInner}`);
    const infiniteSlides = infiniteSliderInner.querySelectorAll(`.${classNames.slide}`);

    const infiniteSlids = infiniteSliderInner.children;
    // 最初の要素を複製
    const firstClone = infiniteSlids[2].cloneNode(true);
    // 最後の要素を複製
    const lastClone = infiniteSlids[infiniteSlids.length - 3].cloneNode(true);

    // 現在のスライドの番号(currentSlide) が 1より小さい時
    if (currentSlide < 2) {
      // 現在のスライドの番号(currentSlide) を1に設定
      currentSlide = 2;
      infiniteSliderInner.removeChild(infiniteSlides[infiniteSlides.length - 1]);
      infiniteSliderInner.insertBefore(lastClone, infiniteSlides[0]);
      targetX -= slideWidth;
      currentX = targetX;
      translateX = currentX;
      sliderInner.style.transform = `translateX(${translateX}px)`;
    // 現在のスライドの番号(currentSlide) が スライドの枚数(slides.length) より大きい時
    } else if (currentSlide >= infiniteSlides.length - 1) {
      // 現在のスライドの番号(currentSlide) をスライドの枚数(slides.length) に設定
      currentSlide = infiniteSlides.length - 2;
      infiniteSliderInner.removeChild(infiniteSlides[0]);
      infiniteSliderInner.appendChild(firstClone);
      targetX += slideWidth;
      currentX = targetX;
      translateX = currentX;
      sliderInner.style.transform = `translateX(${translateX}px)`;
    }

    if (translateX > -slideWidth) {
        targetX = -slideWidth;
        currentX = targetX;
        translateX = currentX;
        sliderInner.style.transform = `translateX(${translateX}px)`;
    }
    if (translateX < -slideWidth * (infiniteSlides.length - 3)) {
        targetX = -slideWidth * (infiniteSlides.length - 3);
        currentX = targetX;
        translateX = currentX;
        sliderInner.style.transform = `translateX(${translateX}px)`;
    }

    return {currentSlide,targetX,currentX,translateX};
};