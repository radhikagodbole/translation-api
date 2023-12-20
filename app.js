// const translator = document.querySelector('#translation-box')
// var outputBox = document.getElementById('output-text')
// var inputBox = document.getElementById('input-text')
// var myButton = document.getElementById('translate-btn')
// var language = document.getElementById('lang')
// myButton.onclick = function()
// {
//     var inputText = inputBox.value;
//     outputBox.value = result + '     translated to ' + language.value;
// }

// async function performTranslation() {
//     const url = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';
    
//     const query = inputBox.value;
//     const targetLanguage = language.value;

//     const options = {
//         method: 'POST',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '624490503fmshb0f1676885ace7bp147425jsnbbf550e722cb',
//             'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
//         },
//         body: JSON.stringify({
//             q: query,
//             source: 'en', // Assuming the source language is English, you can change this if needed
//             target: targetLanguage
//         })
//     };

//     try {
//         const response = await fetch(url, options);
//         const result = await response.text();
//         console.log(result);
//         // Handle the result as needed, e.g., display it on the page
//     } catch (error) {
//         console.error(error);
//     }
// }

const translator = document.querySelector('#translation-box');
var outputBox = document.getElementById('output-text');
var inputBox = document.getElementById('input-text');
var translitBox = document.getElementById('translit-text');
var myButton = document.getElementById('translate-btn');
var language = document.getElementById('lang');

myButton.onclick = function () {
    performTranslation();
    // generateTransliteration(translatedText);
};

async function performTranslation() {
    const url = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';

    const query = inputBox.value;
    const targetLanguage = language.value;

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '624490503fmshb0f1676885ace7bp147425jsnbbf550e722cb',
            'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
        },
        body: JSON.stringify({
            q: query,
            source: 'en',
            target: targetLanguage
        })

    };

    try {
        const response = await fetch(url, options);
        const result = await response.json(); // Parse the JSON response

        // Extract the translated text from the response
        const translatedText = result.data.translations.translatedText;

        // Update the output box with the translated text
        outputBox.value = translatedText;
        generateTransliteration(translatedText);
    } catch (error) {
        console.error(error);
        // Update the output box with an error message if translation fails
        outputBox.value = 'Translation failed. Please try again.';
    }
}

async function generateTransliteration(translatedText) {
    const inputText = translatedText;
    
    if (!inputText) {
        alert('Please enter translated text first.');
        return;
    }

    const url = 'https://linguatoolbox.p.rapidapi.com/getTransliteration';
    const targetLanguage = 'en' // Change the target language as needed

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '624490503fmshb0f1676885ace7bp147425jsnbbf550e722cb',
            'X-RapidAPI-Host': 'linguatoolbox.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(`${url}?text=${encodeURIComponent(inputText)}&targetLanguage=${targetLanguage}`, options);
        const result = await response.json();

        // Check if result structure is as expected
        if (result && Array.isArray(result.result) && result.result.length > 1) {
            const transliterationObj = result.result[1];
            
            // Check if the expected object is found
            if (transliterationObj && transliterationObj.value && transliterationObj.value.finalText) {
                const transliteratedText = transliterationObj.value.finalText;

                // Display the transliteration in the translit-text textarea
                translitBox.value = transliteratedText;
            } else {
                alert('Transliteration data not found in the response.');
            }
        } else {
            alert('Unexpected response format.');
        }
    } catch (error) {
        console.error(error);
        alert('Transliteration request failed. Please try again.');
    }
}