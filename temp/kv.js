var stage = new Konva.Stage({
    container: 'container',
    width: 1500,
    height: 1500,
});

var layer = new Konva.Layer();
let currentShape;

var lcSeatModel = {};
lcSeatModel.seats = [];
lcSeatModel.groupSeats = [];

function mapToTxt(j) {
    switch (j) {
        case 1:
            // code block
            return 'A';
            break;
        case 2:
            // code block
            return 'B';
            break;
        case 3:
            // code block
            return 'C';
            break;
        case 4:
            // code block
            return 'D';
            break;
        case 5:
            // code block
            return 'E';
            break;
        case 6:
            // code block
            return 'F';
            break;
        case 7:
            // code block
            return 'G';
            break;
        case 8:
            // code block
            return 'H';
            break;
        case 9:
            // code block
            return 'I';
            break;
        case 10:
            // code block
            return 'J';
            break;
        case 11:
            // code block
            return 'K';
            break;
        case 12:
            // code block
            return 'L';
            break;
        case 13:
            // code block
            return 'M';
            break;
        case 14:
            // code block
            return 'N';
            break;
        case 15:
            // code block
            return 'P';
            break;
        case 16:
            // code block
            return 'Q';
            break;
        case 17:
            // code block
            return 'R';
            break;
        case 18:
            // code block
            return 'S';
            break;
        case 19:
            // code block
            return 'T';
            break;
        case 20:
            // code block
            return 'U';
            break;
        case 21:
            // code block
            return 'V';
            break;
        case 22:
            // code block
            return 'W';
            break;
        case 23:
            // code block
            return 'X';
            break;
        case 24:
            // code block
            return 'Y';
            break;
        case 25:
            // code block
            return 'Z';
            break;

        default:
            return '0';
        // c

    }
}
function buildDefaultMap() {
    var lcSeatModel = {};
lcSeatModel.seats = [];
lcSeatModel.groupSeats = [];
    var row_number = 20;
    var column_number = 12;
    seatSetting(row_number, column_number); // Assuming seatSetting takes row and column numbers as parameters
    buildMapx(); // This will use the seat data to build the map
}
function seatSetting(row_number, column_number) {
    var row_number = 20;
    var column_number = 12;
    var collection = [];

    window.collection = [];
    lcSeatModel.seats = [];


    for (var j = 0; j < column_number + 1; j++) {
        for (var i = 0; i < row_number + 1; i++) {
            var x = 50 + i * 35;
            var y = 50 + j * 45;
            var text = ' ';
            if (i != 0 && j != 0) {
                text = mapToTxt(j) + i.toString();
            }
            let coor = {x: x, y: y, text: text, color :'grey'};
            //console.log('====');
            //console.log(coor);
            window.collection.push(coor);

        }
    }
    for (var k = 0; i < window.collection.length; i++) {
        var seatModel  = window.collection[i];
        seatModel.index = i;
        lcSeatModel.seats.push(seatModel);

    }

}



var seatModel = {
    x: 0,
    y : 0,
    text : 0
};

var groupSeats = {
    textObj: '',
    rectObj : '',
    iconObj: ''
};
function buildMap() {
    stage = Konva.Node.create(window.lcStageJson, 'container');
    var shapes = stage.find('Group');
    // apply transition to all nodes in the array
    shapes.forEach(function (shape) {
        var rectx = shape.find('Rect');
        var textx = shape.find('Text');
        var rect;
        var text;

        if (rectx!=undefined &&  textx!=undefined) {
            rectx.forEach(function (item) {
                rect = item
            });
            textx.forEach(function (item) {
                text = item
            });
            if (rect != undefined && text != undefined) {
                rect.label = text;
                text.seat = rect;

                rect.on('mouseup', function (e) {
                    currentShape = this;
                });

                text.on('mouseup', function (e) {
                    currentShape = this;
                });
            }
        }

    });


}
function buildMapx() {

    window.rowI = 1;
    window.columI = 1;
    for (var i = 0; i < lcSeatModel.seats.length; i++) {
        var coord = lcSeatModel.seats[i];

        if (coord.x == 50 && coord.y != 50) {

            var rect2 = new Konva.Text({
                x: coord.x,
                y: coord.y,
                // text: window.rowI.toString() + ' ' + coord.x.toString() + " " + coord.y.toString(),
                text: mapToTxt(window.rowI ),
                fontSize: 16,
                fontFamily: 'Calibri',
                fill: 'green',
            });
            layer.add(rect2);

            rowI = rowI + 1;
        } else if (coord.y == 50 && coord.x != 50) {
            var rect2 = new Konva.Text({
                x: coord.x,
                y: coord.y,
                // text: window.columI.toString() +  ' ' + coord.x.toString() +  " " + coord.y.toString(),
                text: window.columI.toString(),
                fontSize: 15,
                fontFamily: 'Calibri',
                fill: 'red',
            });
            layer.add(rect2);

            window.columI = window.columI + 1;
        } else if (coord.y != 50 && coord.x != 50) {
            var rect2 = new Konva.Rect({
                x: coord.x,
                y: coord.y,
                width: 20,
                height: 20,
                fill: 'grey',
                shadowBlur: 1,
                cornerRadius: 1,
                shadowBlur: 1,
                cornerRadius: 1,
                shadowBlur: 1,
                cornerRadius: 1,
                id: 'seat-' + i, // Make sure each seat has a unique ID
                selected: false
            });
            rect2.on('mouseup', function (e) {
                // Toggle the selected state and fill color
                this.setAttr('selected', !this.getAttr('selected'));
                this.fill(this.getAttr('selected') ? 'purple' : 'grey');
                layer.draw();
                currentShape = this;
            });

            if (rect2 != undefined) {

                rect2.on('mouseup', function (e) {
                    currentShape = this;
                });


                if (coord.text != undefined && coord.text != ' ') {
                    var simpleText = new Konva.Text({
                        x: coord.x + 2,
                        y: coord.y + 2,
                        text: coord.text,
                        fontSize: 10,
                        fontFamily: 'Calibri',
                        fill: 'white',
                    });


                    simpleText.on('mouseup', function (e) {
                        currentShape = this;
                    });

                    simpleText.seat = rect2;
                    rect2.label = simpleText;
                    rect2.lcIndex = i;

                    var group = new Konva.Group({
                        draggable: true,
                    });

                    group.add(rect2);
                    group.add(simpleText);


                    layer.add(group);
                    lcSeatModel.groupSeats.push(group);

                }

            }

        }
    }
    stage.add(layer);

}
// seatSetting();

// buildMapx();


function pullSeat() {
    currentShape.to({
        scaleX: 2,
        scaleY: 2,
        onFinish: () => {
            currentShape.to({scaleX: 1, scaleY: 1});
        },
    });
}

function deleteSeat() {
    //rect is selected
    if (currentShape.label != undefined) {
        currentShape.label.destroy();
        var index = currentShape.lcIndex;
        lcSeatModel.seats.splice(index, 1);


        currentShape.destroy();
//label is selected
    } else if (currentShape.seat != undefined) {
        var index = currentShape.seat.lcIndex;
        lcSeatModel.seats.splice(index, 1);
        currentShape.seat.destroy();
        currentShape.destroy();
    }
}

function addLabelSeat() {
    //is rect
    if (currentShape.label != undefined) {
        currentShape.label.destroy();
        var index = currentShape.lcIndex;
        var x = currentShape.attrs.x;
        var y = currentShape.attrs.y;
        currentShape.destroy();
        var g = lcSeatModel.groupSeats[index];

        var simpleText = new Konva.Text({
            x: x + 2,
            y: y + 2,
            text: jQuery('#lc_label_input').val(),
            fontSize: 10,
            fontFamily: 'Calibri',
            fill: 'red',
        });
        var group = new Konva.Group({
            draggable: true,
        });
        var rect2 = new Konva.Rect({
            x: x,
            y: y,
            width: 20,
            height: 20,
            fill: 'green',
            shadowBlur: 1,
            cornerRadius: 1,
        });
        simpleText.seat = rect2;
        rect2.attrs.ten_ve =  jQuery('#lc_label_input').val();
        rect2.attrs.loai_ve =  'sweetbox';

        group.add(rect2);
        group.add(simpleText);
        var layers = stage.find('Layer');
        layers.forEach(function (layer) {
            layer.add(group);

        });

        lcSeatModel.groupSeats[index]= group;

         lcSeatModel.seats[index].text = jQuery('#lc_label_input').val() ;

        rect2.on('mouseup', function (e) {
            currentShape = this;
        });
        simpleText.on('mouseup', function (e) {
            currentShape = this;
        });

        //label is selected
    } else if (currentShape.seat != undefined) {
        var seat = currentShape.seat;
        var x =seat.attrs.x;
        var y =seat.attrs.y;

        var index = seat.index;

        currentShape.destroy();
        seat.destroy();
        var simpleText = new Konva.Text({
            x: x + 2,
            y: y + 2,
            text:jQuery('#lc_label_input').val(),
            fontSize: 10,
            fontFamily: 'Calibri',
            fill: 'white',
        });
        var rect2 = new Konva.Rect({
            x: x,
            y: y,
            width: 20,
            height: 20,
            fill: 'green',
            shadowBlur: 1,
            cornerRadius: 1,
        });
        simpleText.seat = rect2;

        var g = lcSeatModel.groupSeats[index];
        var group = new Konva.Group({
            draggable: true,
        });
        group.add(rect2);
        group.add(simpleText);
        rect2.on('mouseup', function (e) {
            currentShape = this;
        });
        simpleText.on('mouseup', function (e) {
            currentShape = this;
        });
        layer.add(group);

        lcSeatModel.groupSeats[index]= group;

        lcSeatModel.seats[index].text = jQuery('#lc_label_input').val() ;

    }
}
function addtagsSeat() {
    //rect is selected
    if (currentShape.label != undefined) {
        currentShape.label.destroy();
        var x =currentShape.attrs.x;
        var y =currentShape.attrs.y;
        var index = currentShape.lcIndex;
        currentShape.destroy();

        var simpleText = new Konva.Text({
            x: currentShape.attrs.x + 2,
            y: currentShape.attrs.y + 2,
            text: 'X',
            fontSize: 10,
            fontFamily: 'Calibri',
            fill: 'white',
        });
        var rect = new Konva.Rect({
            x: x,
            y: y,
            width: 20,
            height: 20,
            fill: 'red',
            shadowBlur: 1,
            cornerRadius: 1,
        });
        simpleText.seat = rect;

        var group = new Konva.Group({
            draggable: true,
        });
        group.add(rect);
        group.add(simpleText);

        rect.on('mouseup', function (e) {
            currentShape = this;
        });
        simpleText.on('mouseup', function (e) {
            currentShape = this;
        });
        layer.add(group);

        lcSeatModel.groupSeats[index]= group;

        lcSeatModel.seats[index].text = jQuery('#lc_label_input').val() ;

        lcSeatModel.seats[index].text = 'VIP' ;
        lcSeatModel.seats[index].color = 'red' ;


        //label is selected
    }
    if (currentShape.seat != undefined) {
        var seat = currentShape.seat;
        var x =currentShape.attrs.x;
        var y =currentShape.attrs.y;
        var index = seat.lcIndex;

        currentShape.destroy();
        seat.destroy();

        var simpleText = new Konva.Text({
            x: x + 2,
            y: y + 2,
            text: 'x',
            fontSize: 10,
            fontFamily: 'Calibri',
            fill: 'white',
        });
        var rect = new Konva.Rect({
            x: x,
            y: y,
            width: 20,
            height: 20,
            fill: 'red',
            shadowBlur: 1,
            cornerRadius: 1,
        });
        simpleText.seat = rect;
        var group = new Konva.Group({
            draggable: true,
        });
        rect.on('mouseup', function (e) {
            currentShape = this;
        });
        simpleText.on('mouseup', function (e) {
            currentShape = this;
        });
        group.add(rect);
        group.add(simpleText);

        layer.add(group);

        lcSeatModel.groupSeats[index]= group;
        lcSeatModel.seats[index].text = 'VIP' ;
        lcSeatModel.seats[index].color = 'red' ;

    }
}
function reserveSelectedSeats() {
    lcSeatModel.seats.forEach((seatModel, index) => {
        var seatShape = stage.findOne('#seat-' + index); // Use the unique ID to find the seat
        if (seatShape && seatShape.getAttr('selected')) {
            seatShape.fill('red'); // Reserved color
            seatShape.setAttr('selected', false);
        }
    });
    layer.draw();
}
function submitSeatSetting() {
    jQuery('#lc_stage').val(stage.toJSON());
    jQuery( "#lc_form" ).submit();

}
function rebuildSeat() {
 console.log(stage.toJSON());
}


