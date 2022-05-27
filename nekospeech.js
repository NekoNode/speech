var nekospeechStauts = 0;
var nekospeechAudio = null;

const nekospeechEventHelper = (scope, type, handler, capture) => {
    scope.addEventListener(type, handler, capture);
    return () => {
        scope.removeEventListener(type, handler, capture);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var div = document.getElementById('nekospeech');
    if (!div) {
        return;
    }
    var elem = document.createElement('div');
    elem.style.cssText = `border: 3px solid;
    border-radius: 999em;
    width: 150px;
    height: 50px;
    text-align: center;
    font-weight: bold;
    font-size: 1.5em;`;
    elem.innerHTML = `
    <div title="由NekoNode.com提供的朗读服务" style="position: relative; top: 50%; transform: translate(0, -50%);" onclick="nekospeech()">
        <span id="nekospeech-status">😺 朗读文章</span>
    </span>
    `;
    div.appendChild(elem);
})

function nekospeech() {
    var statusSpan = document.getElementById("nekospeech-status");

    if (nekospeechStauts == 2) {
        statusSpan.innerHTML = "😺 暂停中";
        nekospeechStauts = 3;
        nekospeechAudio.pause();
    } else if (nekospeechStauts == 0) {
        statusSpan.innerHTML = "😺 加载中";
        nekospeechStauts = 1;

        if (nekospeechAudio == null) {
            const audioURL = "https://jumao.speech.nekonode.com/api/speech?target=" + btoa(window.location.href);
            nekospeechAudio = new Audio(audioURL);
        }

        nekospeechAudio.addEventListener('canplaythrough', function () {
            if (nekospeechStauts == 1) {
                nekospeechAudio.play();
                statusSpan.innerHTML = "😺 朗读中";
                nekospeechStauts = 2;
            }
        });

        nekospeechAudio.addEventListener("ended", function () {
            statusSpan.innerHTML = "😺 播放完毕";
            nekospeechStauts = 4;
        });

        nekospeechAudio.onerror = function () {
            statusSpan.innerHTML = "😿 加载失败";
            nekospeechStauts = -1;
        }
    } else if (nekospeechStauts == 3) {
        nekospeechAudio.play();
        statusSpan.innerHTML = "😺 朗读中";
        nekospeechStauts = 2;
    } else if (nekospeechStauts == 4) {
        nekospeechAudio.currentTime = 0;
        nekospeechAudio.play();
        statusSpan.innerHTML = "😺 朗读中";
        nekospeechStauts = 2;
    }
}