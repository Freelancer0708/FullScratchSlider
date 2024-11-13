import { Show } from './show.js';
import { InfiniteIndex, InfiniteSlide, InfiniteLast } from './infinite.js';

window.addEventListener("load", () => {
  const classNames = {
    slider: "custom-slider",
    sliderInner: "custom-slider-inner",
    slide: "custom-slide",
  };
  // カッコ内に書かないと、letやconstはグローバルスコープ(外部アクセスが可能)になってしまうため、ここに記載してます。
  // varはどこに書いてもグローバルスコープなので、なるべく使わないようにする。
  let sliders = document.querySelectorAll(`.${classNames.slider}`);
  sliders.forEach((slider) => {
    // スライドの初期設定
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
    console.log("show:"+ slidesToShow);

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
      // 移動距離の絶対値(Math.abs(deltaX)) が、スライド幅の4/5(sliderInner.offsetWidth * 4 / 5) より大きい時
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
      console.log("startX:"+startX);
      console.log("targetX:"+targetX);
      console.log("currentX:"+currentX);
      console.log("translateX:"+translateX);
      console.log("currentSlide:"+currentSlide);
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
