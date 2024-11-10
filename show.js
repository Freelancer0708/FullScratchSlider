// スライドの1画面の表示枚数の設定
export const Show = (slidesToShow,slides) => {
    if(slidesToShow <= 0) {slidesToShow = 1;} // slidesToShowが0以下は1に変更
    if(slidesToShow > slides.length) {slidesToShow = slides.length;} // slidesToShowがスライドの数(slides.length)以上の時、スライドの数(slides.length)に変更
    return slidesToShow; // slidesToShowを返す
};

