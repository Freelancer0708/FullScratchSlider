const classNames = {
  slider: "custom-slider",
  sliderInner: "custom-slider-inner",
  slide: "custom-slide",
};

// スライドの初期設定
function InitializeSlider(slider) {
  const slideitems = Array.from(slider.children);
  slideitems.forEach((slideitem) => {
    let slideWapper = document.createElement("div");
    slideWapper.classList.add(classNames.slide);
    slideWapper.appendChild(slideitem);
    slider.appendChild(slideWapper);
  });
  let sliderWapper = document.createElement("div");
  sliderWapper.classList.add(classNames.sliderInner);
  while (slider.firstChild) {
    sliderWapper.appendChild(slider.firstChild);
  }
  slider.appendChild(sliderWapper);
};

// 無限スライドの設定
// 無限スライドの初期設定
function InfiniteIndex(isInfinite,oneslideWidth,sliderInner) {
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
// 無限スライドの挙動の設定
function InfiniteSlide(isInfinite,targetX,slideWidth,deltaX,startX,e) {
  console.log("InfiniteSlide:" + isInfinite);
  // スライダーを1枚分移動させる(targetX) += 1枚のスライド幅(slideWidth) * 移動させる方向(Math.sign(deltaX))
  targetX += slideWidth * Math.sign(deltaX);
  // スライドが移動したら、初期位置を、現在のマウスの位置に更新する(startX = e.clientX)
  startX = e.clientX;
  return {targetX,startX};
};
// 無限スライドの作成後の設定
function InfiniteLast(isInfinite,currentSlide,currentX,targetX,translateX,slider,sliderInner,slideWidth) {
  console.log("InfiniteLast:" + isInfinite);
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

// スライドの1画面の表示枚数の設定
function Show(slidesToShow,slides) {
  // slidesToShowが0以下は1に変更
  if(slidesToShow <= 0) {slidesToShow = 1;}
  // slidesToShowがスライドの数(slides.length)以上の時、スライドの数(slides.length)に変更
  if(slidesToShow > slides.length) {slidesToShow = slides.length;}
  return slidesToShow; // slidesToShowを返す
};



window.addEventListener("load", () => {
  // カッコ内に書かないと、letやconstはグローバルスコープ(外部アクセスが可能)になってしまうため、ここに記載してます。
  // varはどこに書いてもグローバルスコープなので、なるべく使わないようにする。
  let sliders = document.querySelectorAll(`.${classNames.slider}`);
  sliders.forEach((slider) => {

    // スライドの初期設定
    InitializeSlider(slider);

    // スライドの挙動の初期値
    let startX = 0;
    let targetX = 0;
    let currentX = 0;
    let translateX = 0;
    let currentSlide = 1;
    let isDragging = false;

    // スライドの作成後の設定
    const sliderInner = slider.querySelector(`.${classNames.sliderInner}`);
    const slides = sliderInner.querySelectorAll(`.${classNames.slide}`);

    // スライドの1画面の表示枚数の設定
    let slidesToShow = parseInt(slider.getAttribute("data-show")) || 1;
    if (slidesToShow != 1) { slidesToShow = Show(slidesToShow,slides); };
    const oneslideWidth = sliderInner.offsetWidth / slidesToShow;
    slides.forEach((slideitem) => { slideitem.style.width = `${oneslideWidth}px`; });

    // slider-inner の幅をスライド数で割り、スライドの移動幅を計算
    const slideWidth = sliderInner.offsetWidth / slides.length;

    // 無限スライドの設定
    const isInfinite = slider.getAttribute("data-infinite") === "true";
    if (isInfinite) { ({currentSlide,targetX,currentX,translateX} = InfiniteIndex(isInfinite,oneslideWidth,sliderInner)); };

    // スライドの挙動
    // マウスをクリックしている間に起こる関数
    function onMouseMove(e) {
      // 移動距離(deltaX) = クリックしながら移動したマウスの位置(e.clientX) - クリックし始めた位置(startX)
      const deltaX = e.clientX - startX;
      // 移動距離の絶対値(Math.abs(deltaX)) が、スライド幅の2.5 / 5(slider.offsetWidth * 2.5 / 5) より大きい時
      if (Math.abs(deltaX) >= slider.offsetWidth * 2.5 / 5) {
        // 現在のスライドの番号(currentSlide) を更新
        currentSlide -= Math.sign(deltaX);

        if (isInfinite) {
          ({targetX,startX} = InfiniteSlide(isInfinite,targetX,slideWidth,deltaX,startX,e));
        } else {
          // 現在のスライドの番号(currentSlide) が 1以上 スライドの枚数(slides.length) 以下の時
          if (currentSlide >= 1 && currentSlide <= slides.length) {
            // スライダーを1枚分移動させる(targetX) += 1枚のスライド幅(slideWidth) * 移動させる方向(Math.sign(deltaX))
            targetX += slideWidth * Math.sign(deltaX);
            // スライドが移動したら、初期位置を、現在のマウスの位置に更新する(startX = e.clientX)
            startX = e.clientX;
          // 現在のスライドの番号(currentSlide) が 1より小さい時
          } else if (currentSlide < 1) {
            // 現在のスライドの番号(currentSlide) を1に設定
            currentSlide = 1;
          // 現在のスライドの番号(currentSlide) が スライドの枚数(slides.length) より大きい時
          } else if (currentSlide > slides.length) {
            // 現在のスライドの番号(currentSlide) をスライドの枚数(slides.length) に設定
            currentSlide = slides.length;
          }
        }
      }
    }
    // アニメーション関数
    function animate() {
      // しきい値(閾値)の設定
      const threshold = 5;
      // 現在のスライド位置(currentX) が 目標の位置(targetX) まで 閾値(threshold) よりも小さい時
      if (Math.abs(targetX - currentX) < threshold) {
        // 現在のスライド位置(currentX) を 目標の位置(targetX) まで 動かす
        currentX = targetX;
        // スライド位置(currentX) を 動かす
        translateX = currentX;
        sliderInner.style.transform = `translateX(${translateX}px)`;
        if (isInfinite) { ({currentSlide,targetX,currentX,translateX} = InfiniteLast(isInfinite,currentSlide,currentX,targetX,translateX,slider,sliderInner,slideWidth)); };
        // クリックが継続しているか判定する
        if (!isDragging) return;
      } else {
        // 現在のスライド位置(currentX) を 目標の位置(targetX) まで 少しずつ動かす
        currentX += (targetX - currentX) * 0.12;
        // スライド位置(currentX) を 動かす
        translateX = currentX;
        sliderInner.style.transform = `translateX(${translateX}px)`;
      }
      // 次の画面更新でanimateを再度実行
      requestAnimationFrame(animate);
    }

    // スライダー(.slider-inner)クリック時
    slider.addEventListener("mousedown", (e) => {
      // 最初の位置にマウスの位置を設定
      startX = e.clientX;
      isDragging = true;
      // 画面更新でanimateを実行
      requestAnimationFrame(animate);
      // マウスが動いたらonMouseMoveを実行
      document.addEventListener("mousemove", onMouseMove);
      // クリックを離した時
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseUp() {
      isDragging = false;
      // onMouseMoveを停止
      document.removeEventListener("mousemove", onMouseMove);
      // onMouseUpを停止
      document.removeEventListener("mouseup", onMouseUp);
    }
  });
});
