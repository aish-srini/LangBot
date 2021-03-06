/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

 'use strict';

 const Alexa = require('alexa-sdk');
 //const lanCodes = require('./languages');
 const RapidAPI = require('rapidapi-connect');
 const rapid = new RapidAPI("ForeignCompanion", "083e204f-70fe-4969-9c09-ade3f2057ae5");

 const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

 const handlers = {
     'NewSession': function () {
         this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
         // If the user either does not reply to the welcome message or says something that is not
         // understood, they will be prompted again with this text.
         this.attributes.repromptSpeech = this.t('WELCOME_REPROMT');
         this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
     },
     'TopicIntent': function () {
         const input = this.event.request.intent.slots.Phrase;
         const target = this.event.request.intent.slots.Language;

         //this.t(':tell', 'potato');

         const langCodes = {
         "german" : "de",
         "dutch" : "nl",
         "english" : "en",
         "french" : "fr",
         "italian" : "it",
         "polish" : "pl",
         "russian" : "ru",
         "spanish" : "es"
         };

         let inputPhrase;
         let targetLan;

         if (input && input.value) {
             inputPhrase = input.value.toLowerCase();
         }
         if (target && target.value) {
             targetLan = target.value.toLowerCase();
         }

         const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), inputPhrase);
         //const myPrompts = this.t('PROMPTS');
         //const prompt = myPrompts[itemName];

         const lanCode = langCodes[targetLan];

         rapid.call('GoogleTranslate', 'translate', {
         'apiKey': 'AIzaSyCT0fa6soTqc5G3LX1N0qmdBqg1zBGwZZY',
         'string': inputPhrase, //inputPhrase
          // 'targetLanguage': 'Spanish'
         'targetLanguage': lanCode,

         }).on('success', (payload)=>{
           // callback({});
           console.log(payload);
           var speechOutput = payload;
           this.emit(':tell', JSON.stringify(speechOutput));
          //  this.attributes.speechOutput = payload
          //  this.attributes.repromptSpeech = "What else can I help with?";
          //  this.emit(':tell', this.attributes.speechOutput, this.attributes.repromptSpeech)
         }).on('error', (payload)=>{
           // callback({});
           console.log(payload);
           var speechOutput = "Can't";
           //this.attributes.speechOutput = "Can't translate";
          //  this.attributes.speechOutput = "Can you say it again?"
          //  this.attributes.repromptSpeech = "What else can I help?"
           this.emit(':ask', "Can you say it again?");
         });


         if (inputPhrase) {
             this.attributes.speechOutput = speechOutput
             this.attributes.repromptSpeech = this.t('RECIPE_REPEAT_MESSAGE');
             this.emit(':askWithCard', "today", this.attributes.repromptSpeech, cardTitle, "today");
         } else {
             let this.attributes.speechOutput = this.t('RECIPE_NOT_FOUND_MESSAGE');
             const repromptSpeech = this.t('RECIPE_NOT_FOUND_REPROMPT');
             if (inputPhrase) {
                 this.attributes.speechOutput += this.t('RECIPE_NOT_FOUND_WITH_ITEM_NAME', this.attributes.speechOutput);
             } else {
                 this.attributes.speechOutput += this.t('RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME');
             }
             speechOutput += repromptSpeech;

            //  this.attributes.speechOutput = speechOutput;
             this.attributes.repromptSpeech = repromptSpeech;

             this.emit(':ask', this.attributes.speechOutput, repromptSpeech);
         }
     },
     'AMAZON.HelpIntent': function () {
         this.attributes.speechOutput = this.t('HELP_MESSAGE');
         this.attributes.repromptSpeech = this.t('HELP_REPROMT');
         this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
     },
     'AMAZON.RepeatIntent': function () {
         this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptSpeech);
     },
     'AMAZON.StopIntent': function () {
         this.emit('SessionEndedRequest');
     },
     'AMAZON.CancelIntent': function () {
         this.emit('SessionEndedRequest');
     },
     'SessionEndedRequest': function () {
         this.emit(':tell', this.t('STOP_MESSAGE'));
     },
 };

 const languageStrings = {
     'en-US': {
         translation: {
             SKILL_NAME: 'Lang Bot',
             WELCOME_MESSAGE: "Hi, welcome to %s. You can ask a question like, how do I say hello in Spanish ... Now, hoew can I help you?",
             WELCOME_REPROMT: 'For instructions on what you can say, please say help me.',
             DISPLAY_CARD_TITLE: '%s  - Translation for %s.',
             HELP_MESSAGE: "You can ask questions such as, what\'s the translation, or, you can say exit...Now, what can I help you with?",
             HELP_REPROMT: "You can say things like, what\'s the translation, or you can say exit...Now, what can I help you with?",
             STOP_MESSAGE: 'Goodbye!',
             RECIPE_REPEAT_MESSAGE: 'Try saying repeat.',
             RECIPE_NOT_FOUND_MESSAGE: "I\'m sorry, I currently do not know ",
             RECIPE_NOT_FOUND_WITH_ITEM_NAME: 'the translation for %s. ',
             RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME: 'that phrase. ',
             RECIPE_NOT_FOUND_REPROMPT: 'What else can I help with?',
         },
     },
 };

 exports.handler = (event, context) => {
     const alexa = Alexa.handler(event, context);
     alexa.APP_ID = APP_ID;
     // To enable string internationalization (i18n) features, set a resources object.
     alexa.resources = languageStrings;
     alexa.registerHandlers(handlers);
     alexa.execute();
 };
