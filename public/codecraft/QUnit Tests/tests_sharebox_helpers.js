/**
 * Created by Tang on 14/1/2015.
 */

function makeCostume(path) {
    var url = path,
        img = new Image();
    img.src = url;
    return new Costume(img);
}

function makeSound(path) {
    var url = path,
        audio = new Audio();
    audio.src = url;
    audio.load();
    return audio;
}