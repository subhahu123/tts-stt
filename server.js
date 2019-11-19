// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const speech = require('@google-cloud/speech');
const express = require('express');
const app = express();
const BodyParser = require("body-parser");
const util = require('util');
const fs = require('fs');



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));


app.get("/pucho/stt", async (request, response) => {
    const client = new speech.SpeechClient();

    const filename = './output.mp3';

      const audio = {
        content: fs.readFileSync(filename).toString('base64'),
      };
      
      const request1 = {
        audio: audio,
      };
      
      // Detects speech in the audio file
      const [response1] = await client.recognize(request1);
      const transcription = response1.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: `, transcription);
});


app.get("/pucho/stt1", async (request, response) => {
//    console.log(request);
    console.log(request.query);
    main(request.query.text) ;
    
});



app.listen(process.env.PORT || 8080, function (data) {
    console.log(data + "App is running at localhost:8080");
});





async function main(txt) {
    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();
  
    // The text to synthesize
    const text = txt ;
  
    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML Voice Gender (optional)
      voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
      // Select the type of audio encoding
      audioConfig: {audioEncoding: 'LINEAR16'},
    };
  
    // Performs the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
  }