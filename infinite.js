// 無限スライドの設定
export const Infinite = (isInfinite,oneslideWidth,sliderInner) => {
    console.log("isInfinite:" + isInfinite);
    const currentSlide = 3;
    let targetX = -oneslideWidth * 2;
    let currentX = -oneslideWidth * 2;
    let translateX = -oneslideWidth * 2;
    sliderInner.style.transform = `translateX(${translateX}px)`;
    return {currentSlide,targetX,currentX,translateX};
};

