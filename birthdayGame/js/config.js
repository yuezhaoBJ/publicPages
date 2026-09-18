var config = (function () {


    var row = 4;
    var col = 4;
    var objectCount = 8;
    var repeatCount = row * col / objectCount;

    var time = 0;

    var imgUrl = "./img/test/";
    var imgExtension = ".png";
    var imgByName = function (name) {
        var src = imgUrl + name + imgExtension;
        return `<img class="img-circle" draggable="false" src="${src}"></img>`;
    }

    var itemDirectionHTML = ` <div class="grid-item-direction">
                                    <div class="y up"></div>
                                    <div class="y down"></div>
                                    <div class="x left"></div>
                                    <div class="x right"></div>
                              </div>`;

    var resetConfig = function () {
        imgUrl = "./img/";
        imgExtension = ".jpg";
    }

    return {
        row: row,
        col: col,
        objectCount: objectCount,
        repeatCount: repeatCount,
        imgByName: imgByName,
        resetConfig: resetConfig,
        itemDirectionHTML: itemDirectionHTML,
        time: time,
    }

})();