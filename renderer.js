var imageStates = []; // Массив для хранения состояний изображения
var currentStateIndex = -1; // Индекс текущего состояния
var maxStateIndex = -1; // Максимальный индекс в массиве состояний


function saveImageState(rgbArray, width, height) {
    // Сохранение текущего состояния в массив
    imageStates.push({
        rgbArray: rgbArray,
        width: width,
        height: height
    });
    currentStateIndex = maxStateIndex = imageStates.length - 1;
    
}
function displayImage(rgbArray, width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');
    var imageData = ctx.createImageData(width, height);
    var data = imageData.data;

    for (var i = 0; i < rgbArray.length; i++) {
        data[i * 4] = rgbArray[i].r;
        data[i * 4 + 1] = rgbArray[i].g;
        data[i * 4 + 2] = rgbArray[i].b;
        data[i * 4 + 3] = 255; // Прозрачность
    }

    ctx.putImageData(imageData, 0, 0);
    var imgSrc = canvas.toDataURL();
    $('#imagePanel').html('<img src="' + imgSrc + '" style="max-height: 60vh;" alt="Выбранное изображение">');
}

function undo() {
    if (currentStateIndex > 0) {
        currentStateIndex--;
        var state = imageStates[currentStateIndex];
        displayImage(state.rgbArray, state.width, state.height);
       
    }
}

function redo() {
    if (currentStateIndex < maxStateIndex) {
        currentStateIndex++;
        var state = imageStates[currentStateIndex];
        displayImage(state.rgbArray, state.width, state.height);
        
    }
}


// Функция для сохранения текущего состояния изображения
function applyFilter() {
    var img = $('#imagePanel img');
  
    if (img.length > 0) {
        var canvas = document.createElement('canvas');
        canvas.width = img[0].width;
        canvas.height = img[0].height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img[0], 0, 0, img[0].width, img[0].height);

        var imageData = ctx.getImageData(0, 0, img[0].width, img[0].height);
        var data = imageData.data;

        var rgbArray = [];
        for (var i = 0; i < data.length; i += 4) {
            rgbArray.push({
                r: data[i]+20,
                g: data[i + 1]+10,
                b: data[i + 2]+30
            });
        }
       // Если текущее состояние не является последним, удаляем все последующие состояния
       if (currentStateIndex < maxStateIndex) {
        imageStates.splice(currentStateIndex + 1, maxStateIndex - currentStateIndex);
        maxStateIndex = currentStateIndex;
    }
        saveImageState(rgbArray, img[0].width, img[0].height);
        displayImage(rgbArray, img[0].width, img[0].height);
        
    }
}

$(document).ready(function () {


    // При нажатии на кнопку "Открыть файл" открывается диалог выбора файла
    $('#openFile').click(function (e) {
        e.preventDefault();
        $('#fileUploadField').click();

    });
    

    // Обработчик нажатия на кнопку "Применить"
    $('#apply').click(function () {
        applyFilter();
    });
    // Обработка выбора файла
    $('#fileUploadField').change(function (e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                // Отображение выбранного изображения в imagePanel
                $('#imagePanel').show();
                // $('#imagePanel').html('<img src="' + e.target.result + '" style="max-height: 60vh;" alt="Выбранное изображение">');

                currentState = e.target.result;

                // Создание холста и рисование изображения
                var img = new Image();
                img.onload = function () {
                    var canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Получение данных изображения
                    var imageData = ctx.getImageData(0, 0, img.width, img.height);
                    var data = imageData.data;

                    // Преобразование данных в массив RGB
                    var rgbArray = [];
                    for (var i = 0; i < data.length; i += 4) {
                        rgbArray.push({
                            r: data[i],
                            g: data[i + 1],
                            b: data[i + 2]
                        });
                    }
                    // Сохранение состояния изображения
                    saveImageState(rgbArray, img.width, img.height);

                    // Отображение изображения
                    var state = imageStates[currentStateIndex];
                    displayImage(state.rgbArray, state.width, state.height);
                    // Теперь rgbArray содержит RGB значения каждого пикселя
                    // Вы можете передать этот массив в вашу DLL на C++ для дальнейшей обработки
                };
                img.src = e.target.result;
            }
            reader.readAsDataURL(file);
        };
    });

    

    

    // Примеры вызова функций отмены и повтора
    $('#undo').click(undo);
    $('#redo').click(redo);
    $('#clear').click(function () {
        $('#imagePanel').empty();
        $('#imagePanel').hide();
    });

})