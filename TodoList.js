const $ = function (sel) {
    return document.querySelector(sel);
}

const $All = function (sel) {
    return document.querySelectorAll(sel);
}

const makeArray = function (likeArray) {
    var array = [];
    for (var i = 0; i < likeArray.length; ++i) {
        array.push(likeArray[i]);
    }
    return array;
}

var idCount = 0, play = false;
var itemCount, activeCount, completeCount, emphasizedCount;
var filterItems = new Array();

function addItem(){
    //console.log($('.input'));
    var completeStatus = $('.set-status').checked;
    var newItem = $('.new-item');
    var msg = newItem.value;
    if(msg == ''){
        alert('Please enter a new item');
        return;
    } else {
        model.data.items.push({msg: msg, completed: completeStatus, id: idCount, emphasized: false, menu: false});
        idCount++;
    }

    updateList();
    newItem.value = '';
    $('.set-status').checked = false;
}



function updateList(){
    model.flush();
    //itemCount = model.data.items.length;
    setCount();
    var filter = model.data.filter;
    var items = model.data.items;
    var list = $('.list');
    //console.log(items.length);
    list.innerHTML='';
    var filterCount = 0, length;

    if(filter == 'All'){
        length = model.data.items.length;
    } else if(filter == 'Active'){
        length = activeCount;
    } else if(filter == 'Completed'){
        length = completeCount;
    }

    filterItems.splice(0, filterItems.length);

    model.data.items.forEach(function(itemData, index){
        if(filter == 'All'
            || (filter == 'Active' && !itemData['completed'])
            || (filter == 'Completed' && itemData['completed'])
        ){
            filterItems.push(itemData.id);
            createElement(itemData, index, filterCount, length);
            filterCount++;
        }

    });


}

function createElement(itemData, index, filterCount, length){
    var item = document.createElement('li');
    var list = $('.list');
    var items = model.data.items;

    var front = [
        '<div class="view">',
        '  <input class="toggle" type="checkbox">',
        '  <label class="todo-label">' + itemData.msg + '</label>',
        '  <button class="close-button close"> 》</button>'
    ].join('');

    var emphasizeElement = '  <button class="emphasize-button close">!</button>';

    if(!itemData['completed']){
        front += emphasizeElement;
    }

    var goUpElement = '  <button class="goUp close">↑</button>';
    var goDownElement = '  <button class="goDown close">↓</button>';

    var back = ['  <button class="delete close">x</button>',
        '  <button class="open-button open">《</button>',
        '</div>'
    ].join('');

    if(filterCount != 0 && filterCount != length-1){
        item.innerHTML = front + goUpElement + goDownElement + back;
    } else if(filterCount == 0 && filterCount == length-1){
        item.innerHTML = front + back;
    }else if(filterCount == length-1){
        item.innerHTML = front + goDownElement + back;
    } else if(filterCount == 0){
        item.innerHTML = front + goUpElement + back;
    }

    var openButton = item.querySelector('.open-button');
    openButton.addEventListener('click', function () {

        item.querySelector('.close-button').classList.remove('close');
        item.querySelector('.close-button').classList.add('open');

        if(item.querySelector('.emphasize-button')){
            item.querySelector('.emphasize-button').classList.remove('close');
            item.querySelector('.emphasize-button').classList.add('open');
        }
        if( item.querySelector('.goUp')){
            item.querySelector('.goUp').classList.remove('close');
            item.querySelector('.goUp').classList.add('open');
        }
        if(item.querySelector('.goDown')){
            item.querySelector('.goDown').classList.remove('close');
            item.querySelector('.goDown').classList.add('open');
        }
        item.querySelector('.delete').classList.remove('close');
        item.querySelector('.delete').classList.add('open');

        item.querySelector('.open-button').classList.remove('open');
        item.querySelector('.open-button').classList.add('close');
    });

    var closeButton = item.querySelector('.close-button');
    closeButton.addEventListener('click', function () {

        item.querySelector('.close-button').classList.remove('open');
        item.querySelector('.close-button').classList.add('close');

        if(item.querySelector('.emphasize-button')){
            item.querySelector('.emphasize-button').classList.remove('open');
            item.querySelector('.emphasize-button').classList.add('close');
        }
        if( item.querySelector('.goUp')){
            item.querySelector('.goUp').classList.remove('open');
            item.querySelector('.goUp').classList.add('close');
        }
        if(item.querySelector('.goDown')){
            item.querySelector('.goDown').classList.remove('open');
            item.querySelector('.goDown').classList.add('close');
        }
        item.querySelector('.delete').classList.remove('open');
        item.querySelector('.delete').classList.add('close');

        item.querySelector('.open-button').classList.remove('close');
        item.querySelector('.open-button').classList.add('open');
    });




    //edit
    var label = item.querySelector('.todo-label');
    label.addEventListener('dblclick', function() {
        item.classList.add('editing');

        var editElement = document.createElement('input');
        var finished = false;
        editElement.setAttribute('type', 'text');
        editElement.setAttribute('class', 'editElement');
        editElement.setAttribute('value', label.innerHTML);

        function finish() {
            if (finished) return;
            finished = true;
            item.removeChild(editElement);
            item.classList.remove('editing');
        }

        editElement.addEventListener('blur', function() {
            finish();
        });

        editElement.addEventListener('keyup', function(ev) {
            if (ev.key == 'Escape') { // Esc
                finish();
            }
            else if (ev.key == 'Enter') {
                label.innerHTML = this.value;
                itemData.msg = this.value;
                updateList();
            }
        });

        item.appendChild(editElement);
        editElement.focus();
    });


    if(itemData['emphasized'] && !itemData['completed']){
        item.classList.add('emphasized');

    } else if (!itemData['emphasized'] || itemData['completed']){
        item.classList.remove('emphasized');
    }

    if( item.querySelector('.emphasize-button')){
        item.querySelector('.emphasize-button').addEventListener('click', function () {
            //console.log(item.classList);
            if(itemData['emphasized']){
                //item.classList.remove('emphasized');
                model.data.items[index]['emphasized'] = false;

            } else if (!itemData['emphasized']){
                //item.classList.add('emphasized');
                model.data.items[index]['emphasized'] = true;
                // console.log(index, items.length, emphasizedCount);
                // setPosition(model.data.items, index, items.length - emphasizedCount);

                //console.log('in');
                //console.log(item.classList);
            }
            updateList();
            //console.log(itemData);
            //console.log(item.classList);
        });
    }

    if( item.querySelector('.delete')){
        item.querySelector('.delete').addEventListener('click', function () {
            model.data.items.splice(index, 1);
            updateList();
        });
    }

    if(item.querySelector('.goUp')){
        item.querySelector('.goUp').addEventListener('click', function () {
            swapById(model.data.items, filterItems[filterCount+1], filterItems[filterCount]);
            updateList();
        });
    }

    if(item.querySelector('.goDown')){
        item.querySelector('.goDown').addEventListener('click', function () {
            swapById(model.data.items, filterItems[filterCount-1], filterItems[filterCount]);
            updateList();
        });
    }

    item.querySelector('.toggle').checked = itemData.completed;
    if(itemData.completed){
        item.classList.remove('normal');
        item.classList.add('completed');
    } else {
        item.classList.remove('completed');
        item.classList.add('normal');
    }

    item.querySelector('.toggle').addEventListener('change', function () {
        //console.log(itemData.completed);
        itemData.completed = !itemData.completed;
        if(itemData.completed){
            item.classList.remove('normal');
            item.classList.add('completed');
            itemData['emphasized'] = false;
        } else {
            item.classList.remove('completed');
            item.classList.add('normal');
        }
        updateList();
        // $('.itemCount').innerHTML = itemCount + ' item left';
        // model.flush();
        // //console.log(itemData.completed);
    });


    list.insertBefore(item, list.firstChild);

}

function swapById(arr, id1, id2){
    var flag1 = false, flag2 = false;
    var index1, index2;

    while(!(flag1&&flag2)){
        model.data.items.forEach(function(itemData, index){
            if(itemData['id'] == id1){
                flag1 = true;
                index1 = index;
            }
            if(itemData['id'] == id2){
                flag2 = true;
                index2 = index;
            }

        });
    }

    var temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}

function setPosition(arr, index, toPos){
    while(index < toPos){
        swap(arr, index, index+1);
        index++;
    }
    while(index > toPos){
        swap(arr, index, index-1);
        index--;
    }
}



window.onload = function () {

    function setTime(){
        $('.time').innerText = new Date().toLocaleString();
    }
    setInterval(setTime, 1000);

    model.init();
    // model.data.items[7] =  model.data.items[1];
    // model.data.items[8] =  model.data.items[1];

    itemCount = model.data.items.length;
    var items = model.data.items;

    $('.fix-mode').addEventListener('click', function () {
        $('.list').classList.add('fix');
    });

    $('.scroll-mode').addEventListener('click', function () {
        $('.list').classList.remove('fix');
    });

    $('.music').addEventListener('click', function () {
        if(!play){
            $('.audio').play();
            $('.music span').innerText = 'Pause Music';
            play = true;
        } else {
            $('.audio').pause();
            $('.music span').innerText = 'Resume Music';
            play = false;
        }
    });

    $('.new-item').addEventListener('keyup', function(ev){
        if(ev.key == 'Enter') addItem();
    });

    $('.add-button').addEventListener('click', addItem);

    $('.complete-all').addEventListener('click', function () {
        setCount();
        for(var i = 0; i < itemCount; i++){
            model.data.items[i]['completed'] = true;
        }
        updateList();
    });

    $('.reset-all').addEventListener('click', function () {
        setCount();
        for(var i = 0; i < itemCount; i++){
            model.data.items[i]['completed'] = false;
        }
        updateList();
    });



    $('.clear-completed').addEventListener('click', function () {
        setCount();
        for(var i = itemCount-1; i >= 0; i--){
            if(model.data.items[i]['completed'] == true){
                model.data.items.splice(i, 1);
            }
        }

        updateList();
    });

    $('.clear-all').addEventListener('click', function () {

        model.data.items.splice(0, model.data.items.length);
        updateList();
    });

    $('.separate-active').addEventListener('click', function () {

        setCount();
        var items = model.data.items;
        var sortList = new Array();
        var front = 0, back = completeCount;

        model.data.items.forEach(function (itemData, index) {
            if(itemData['completed']){
                sortList.splice(front, 0, itemData);
                front++;
            }else if(!itemData['completed']){
                sortList.splice(back, 0, itemData);
                back++;
           }
        });

        model.data.items = sortList;
        model.flush();
        updateList();
    });

    $('.urgent-up').addEventListener('click', function () {

        setCount();
        var items = model.data.items;
        var sortList = new Array();
        var front = 0, mid = 0, back = 0;

        model.data.items.forEach(function (itemData, index) {
            if(itemData['emphasized']){
                sortList.splice(back, 0, itemData);
                back++;
            }else if(itemData['completed']){
                sortList.splice(front, 0, itemData);
                front++;
                mid++;
                back++;
            }else if(!itemData['completed']){
                sortList.splice(mid, 0, itemData);
                mid++;
                back++;
            }

        });

        model.data.items = sortList;
        model.flush();
        updateList();
    });

    var filters = makeArray($All('.filter li a'));

    filters.forEach(function(filter){
        if(filter.innerText == model.data.filter){
            filter.classList.add('selected');
        }

        filter.addEventListener('click', function(){
            model.data.filter = filter.innerText;
            filters.forEach(function(filter){
                filter.classList.remove('selected');
            });
            filter.classList.add('selected');
            updateList();
        });
    });



    updateList();
    //console.log('updated');

    setCount();


}

function setCount() {
    activeCount = 0;
    completeCount = 0;
    emphasizedCount = 0;

    var items = model.data.items;
    itemCount = items.length;

    for(var i = 0; i < itemCount; i++){
        if(items[i]['completed'] == true){
            completeCount++;
        } else if (items[i]['completed'] == false){
            activeCount++;
        }

        if(items[i]['emphasized'] == true){
            emphasizedCount++;
        }
    }

    $('.activeCount').innerHTML = activeCount + ' item left ( ' + emphasizedCount + ' urgent )';

    $('.completeCount').innerHTML = completeCount + ' item complete';
}

function swap(arr, index1, index2) {
    var temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}


