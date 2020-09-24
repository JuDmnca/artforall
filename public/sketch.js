history.scrollRestoration = "manual";
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

let body = document.getElementById('body');
let slideIndex = 0;

slide = () => {
  body.style.transform = body.style.transform + "translateY(-100vh)";
  slideIndex ++;
}

let step1_btn = document.getElementById('step_1_btn');
let step1_after = document.getElementById('step_1_after');
let step2_btn = document.getElementById('step_2_btn');
let result_btn = document.getElementById('result_btn');

var word = []
var letters = ''

var from, fromless, interA, interB, to, toless = ''

var step_1, step_2 = false

var s1 = ( s ) => {
  let prata;
  s.preload = function() {
    prata = s.loadFont('Prata-Regular.ttf');
  }
  s.setup = function() {
    var bg = s.color(25,25,25)
    let canvas1 = s.createCanvas(window.innerWidth, window.innerHeight, s.WEBGL);
    s.noStroke();
    s.background(bg);

    input = s.createInput().attribute('placeholder', "I'm ...")

    s.textSize(50)
    s.textFont(prata)
    s.textAlign(s.CENTER, s.BASELINE)
  }
  s.draw = function() {
    var bg = s.color(25,25,25)

    s.background(bg);
    s.fill('white')
    s.text('Hi, who are you ?', 0, 0)

    if (step_1 === true) {
      rectX = s.width/3

      s.fill(from)
      s.ellipse(-rectX, 100, 60, 60)
      s.fill(interA)
      s.ellipse(-rectX, -100, 60, 60)
      s.fill(interB)
      s.ellipse(rectX, 100, 60, 60)
      s.fill(to)
      s.ellipse(rectX, -100, 60, 60)
    }
  }
  s.keyPressed = function() {
    let keyIndex = -1;

    if ((((s.key >= 'a' && s.key <= 'z') || (s.key >= 'A' && s.key <= 'Z'))) && (s.key.length === 1)) {
      if (s.key >= 'a' && s.key <= 'z') {
        keyIndex = s.key.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
      } else {
        keyIndex = s.key.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
      }
      s.append(word, s.key);
      letters = letters + s.key
    }

    if (s.keyCode === s.BACKSPACE) {
      word.pop();
      letters = letters.slice(0, -1)
    }

    if (s.keyCode === s.ENTER) {
      if (!step_1) {
        randFill_r = Math.floor(Math.random() * 255 + 1);
        randFill_g = Math.floor(Math.random() * 255 + 1);
        randFill_b = Math.floor(Math.random() * 255 + 1);

        randFill_rL = Math.floor(Math.random() * 255 + 1);
        randFill_gL = Math.floor(Math.random() * 255 + 1);
        randFill_bL = Math.floor(Math.random() * 255 + 1);

        from = s.color(randFill_r, randFill_g, randFill_b);
        fromless = s.color(randFill_r, randFill_g, randFill_b, 100);
        to = s.color(randFill_rL, randFill_gL, randFill_bL);
        toless = s.color(randFill_rL, randFill_gL, randFill_bL, 100);

        interA = s.lerpColor(from, to, 0.33);
        interB = s.lerpColor(from, to, 0.66);
        step_1 = true;
        step1_after.style.visibility = 'visible'
        step1_btn.style.visibility = 'visible'
      }
    }
  }
};

new p5(s1, 'step_1');

let mic, recorder, soundFile
let start_time, stop_time, elapsed
let state = 0

var s2 = ( s ) => {
  let prata;
  s.preload = function() {
    prata = s.loadFont('Prata-Regular.ttf');
  }
  s.setup = function() {
    var bg = s.color(25, 25, 25)
    let canvas2 = s.createCanvas(window.innerWidth, window.innerHeight);
    s.noStroke();
    s.background(bg);

    s.fill('white')
    s.textSize(30);
    s.textFont(prata);
    s.textAlign(s.CENTER, s.BASELINE);
    s.text('Click to start recording your voice', s.width/2, s.height/2);

    canvas2.mousePressed(record)

    // create an audio in
    mic = new p5.AudioIn()
    // users must manually enable their browser microphone for recording to work properly!
    mic.start()
    // create a sound recorder
    recorder = new p5.SoundRecorder()
    // connect the mic to the recorder
    recorder.setInput(mic)
    // create an empty sound file that we will use to playback the recording
    soundFile = new p5.SoundFile()
  }

  s.touchStarted = function() {
    s.getAudioContext().resume()
  }

  function record() {
    // use the '.enabled' boolean to make sure user enabled the mic (otherwise we'd record silence)
    if (state === 0 && mic.enabled) {
      // Tell recorder to record to a p5.SoundFile which we will use for playback
      recorder.record(soundFile)

      s.background(250, 99, 82)
      s.text('Recording now ! Click to stop.', s.width/2, s.height/2)
      state++

      start_time = new Date().getTime()
    } else if (state === 1) {
      recorder.stop() // stop recorder, and send the result to soundFile

      s.background(48, 66, 250)
      s.text('Recording stopped. Ready for the last step ?', s.width/2, s.height/2)
      state++
      step2_btn.style.visibility = 'visible'

      stop_time = new Date().getTime()
      elapsed = stop_time - start_time
      setTimeout(nextStep, 5000)
    }
  }

  function nextStep() {
    step_2 = true
  }
};

new p5(s2, 'step_2');

// center point
let song
let centerX = 0.0, centerY = 0.0
let result = false
let ender
let save = false
let done = false

var s3 = ( s ) => {
  let canvas3

  let prata
  s.preload = function() {
    prata = s.loadFont('Prata-Regular.ttf');
  }
  s.setup = function() {
    canvas3 = s.createCanvas(window.innerWidth, window.innerHeight);
    canvas3.id('myArtWork')
    var bg = s.color(25, 25, 25)
    s.noStroke();
    s.background(bg)

    s.fill('white')
    s.textSize(30);
    s.textFont(prata);
    s.textAlign(s.CENTER, s.BASELINE);
    s.text('Click and move your mouse to create your artwork.', s.width/2, s.height/2);

    canvas3.mousePressed(drawresult)
  }

  s.draw = function() {
    if (result && !ender) {
      // Get the average (root mean square) amplitude
      let rms = analyzer.getLevel();
      s.noStroke();

      s.fill(from);
      s.ellipse(1.61803398875*(s.mouseX), s.mouseY, 10 + rms * 200, 10 + rms * 200);
      s.fill(interA);
      s.ellipse(1/2*1.61803398875*(s.mouseY), s.mouseX, 10 + rms * 200, 10 + rms * 200);
      s.fill(interB);
      s.ellipse(s.mouseX, s.mouseY, 10 + rms * 200, 10 + rms * 200);
      s.fill(to);
      s.ellipse(s.mouseY, s.mouseX, 10 + rms * 200, 10 + rms * 200);
    }
    else if (ender && !save) {
      saving()
      save = true
    }
  }

  function drawresult() {
    if (!done) {
      var bg = s.color(25, 25, 25)
      s.noStroke();
      s.background(bg)
      song = soundFile

      // Create a new Amplitude analyzer
      analyzer = new p5.Amplitude();

      // Patch the input to an volume analyzer
      analyzer.setInput(song);

      song.play();

      result = true
      setTimeout(end, elapsed);
      done = true
    }
  }

  function end() {
    ender = true
  }
};

new p5(s3, 'result');

function saving() {
  const canvas = document.getElementById('myArtWork')
  canvas.toBlob(
    (blob) => {

      var file = canvas.toDataURL()
      var title = letters
      const formData = new FormData()
      formData.append('title', title)
      formData.append('experiment', blob, 'canvas.jpg')

      fetch('/experiment', {
        method: 'POST',
        body: formData,
      }).then(res => document.location.href="/saved.html")

    },
    'image/jpeg',
    0.95,
  )

}
