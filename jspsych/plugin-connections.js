
var jsPsychConnections = (function (jspsych) {
  'use strict';

  const info = {
      name: "connections",
      parameters: {
          /** The HTML string to be displayed */
          stimulus: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Stimulus",
              default: undefined,
          },
          category1name: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: "Category1Name",
            default: undefined,
        },
          category1: {
            type: jspsych.ParameterType.ARRAY,
            pretty_name: "Category1",
            default: undefined,
        },
        category2name: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: "Category2Name",
            default: undefined,
        },
        category2: {
            type: jspsych.ParameterType.ARRAY,
            pretty_name: "Category2",
            default: undefined,
        },
        category3name: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: "Category3Name",
            default: undefined,
        },
        category3: {
            type: jspsych.ParameterType.ARRAY,
            pretty_name: "Category3",
            default: undefined,
        },
        category4name: {
            type: jspsych.ParameterType.HTML_STRING,
            pretty_name: "Category4Name",
            default: undefined,
        },
        category4: {
            type: jspsych.ParameterType.ARRAY,
            pretty_name: "Category4",
            default: undefined,
        },
        
          /** How long to show the stimulus. */
          stimulus_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Stimulus duration",
              default: null,
          },
          /** How long to show the trial. */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
      },
  };
  /**
   based on html button response plugin, added grid to stimulus
   */
  class ConnectionsPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
      // display stimulus
      var gridSquares = '';
      for (var i = 0; i < 16; i++) {
      gridSquares +='<div class="b" id=s' + i + '>'+ trial.stimulus[i] +'</div>';
    }
    var html = '<div>Connections<div/>'
    html += '<div id="connections"><div class= "grid-container">' + gridSquares + '</div></div>'
    html += '<div id="submit-btn"><div class="jspsych-btn" id="submit-btn"> SUBMIT </div>';
      
          html += "</div>";
          
          display_element.innerHTML = html;
          // start time
          var start_time = performance.now();
          
          let pressedSquares = [];
          let correctSquares = [];
          let pressTimes = [];

          //event listener for squares
          for (var i = 0; i < trial.stimulus.length; i++) {
            display_element
                .querySelector("#s" + i)
                .addEventListener("click", (e) => {
                var selectedSquare = e.currentTarget;
                //record which square was pressed and when
                var id = selectedSquare.getAttribute("id");
                var word = selectedSquare.getAttribute("innerHTML");
                //create var that gets the word in the square
                var currentTime = performance.now();
                var pressTime = Math.round(currentTime - start_time);
                //records square id (position) word in the square and time pressed
                pressTimes.push([word, id, pressTime]);
                
                if (selectedSquare.getAttribute("disabled") != "disabled"){
                //if square is not part of a category that has already been correctly guessed 
                if(pressedSquares.includes(id)) {
                    selectedSquare.style.backgroundColor = '#d3d3d3f5'
                    const index = pressedSquares.indexOf(id);
                    if (index > -1) { // only splice array when item is found
                    pressedSquares.splice(index, 1); // 2nd parameter means remove one item only
                    }
                    //remove id from list

                }
                else{   //if square has not been pressed already
                if (pressedSquares.length < 4) {
                    //change square color to selected
                    selectedSquare.style.backgroundColor = 'gray'
                    pressedSquares.push(id);
                    //console.log(id)
                }
                else {
                  //don't select squares if 4 have already been selected  
                }}}
                else {
                    //don't do anything to squares that were disabled
                }
                
               
            });
        }

        function areEqual(array1, array2) {
            if (array1.length === array2.length) {
              return array1.every(element => {
                if (array2.includes(element)) {
                  return true;
                }
          
                return false;
              });
            }
          
            return false;
          }
        
    
        var matchList = [];
        var wordList = [];

        var idNumber = '';
        var colorList = ['#88CCEE', '#DDCC77', '#CC6677', '#44AA99'];
        var catCount = 0;
        //event listener for submit button
          display_element
                  .querySelector("#submit-btn")
                  .addEventListener("click", (e) => {
                    for (var i = 0; i < pressedSquares.length; i++) {
                        var word = document.getElementById(pressedSquares[i]);
                        word = word.textContent; 
                        wordList.push(word)
                        idNumber = pressedSquares[i].toString()
                        idNumber = idNumber.substring(1)
                        console.log(idNumber)
                    }
                    
                    correctSquares.length === 16 ? end_trial() : null;
                        matchList.push(areEqual(wordList, trial.category1));
                        matchList.push(areEqual(wordList, trial.category2));
                        matchList.push(areEqual(wordList, trial.category3));
                        matchList.push(areEqual(wordList, trial.category4));
                     
                    if (matchList.includes(true)) {
                        catCount++;
                        for (var i = 0; i < pressedSquares.length; i++) {
                        var square = document.getElementById(pressedSquares[i]);
                        
                        /*if (matchList[i] === true) {
                            var idstr = '';
                            catCount === 1 ? idstr = i.toString() : idstr = (i * catCount - 1).toString()
                            var switchSquare = document.getElementById("s" + idstr);
                            switchSquare.style.backgroundColor = colorList[i]
                            switchSquare.setAttribute("disabled", "disabled"); 
                            if (wordList.includes(switchSquare.textContent)) {
                                switchSquare.textContent = switchSquare.textContent 
                            }
                            else {
                                switchSquare.textContent = wordList[i]
                                square.textContent = switchSquare.textContent
                            }
                            //put in first grid row
                        } */
                        if (catCount === 1) {
                            var idstr = i;
                            var topSquare = document.getElementById("s" + idstr.toString());
                            topSquare.style.backgroundColor = colorList[catCount -1]
                            topSquare.style.color = colorList[catCount -1]
                            topSquare.style.border = colorList[catCount -1]
                           // wordList.includes(topSquare.textContent) ? topSquare.textContent = topSquare.textContent : topSquare.textContent = wordList[i];
                            if (wordList.includes(topSquare.textContent)) {
                                topSquare.textContent = topSquare.textContent 
                            }
                            else {
                                square.textContent = topSquare.textContent
                                topSquare.textContent = wordList[i]
                                square.style.backgroundColor = '#d3d3d3f5'
                            }
                            topSquare.setAttribute("disabled", "disabled");
                            //put in second grid row
                        }
                        else if (catCount === 2) {
                            var idstr = i + 4;
                            var midSquare = document.getElementById("s" + (i + 4));
                            midSquare.style.backgroundColor = colorList[catCount -1]
                            midSquare.style.color = colorList[catCount -1]
                            midSquare.style.border = colorList[catCount -1]
                            if (wordList.includes(midSquare.textContent)) {
                                midSquare.textContent = midSquare.textContent 
                            }
                            else {
                                square.textContent = midSquare.textContent
                                midSquare.textContent = wordList[i]
                                square.style.backgroundColor = '#d3d3d3f5'
                            }
                            midSquare.setAttribute("disabled", "disabled");
                            //put in second grid row
                        }
                        else if (catCount === 3) {
                            var idstr1 = i + 8;
                            var thirdSquare = document.getElementById("s" + (i + 8));
                            thirdSquare.style.backgroundColor = colorList[catCount -1]
                            thirdSquare.style.color = colorList[catCount -1]
                            thirdSquare.style.border = colorList[catCount -1]
                            if (wordList.includes(thirdSquare.textContent)) {
                                thirdSquare.textContent = thirdSquare.textContent 
                            }
                            else {
                                square.textContent = thirdSquare.textContent
                                thirdSquare.textContent = wordList[i]
                                square.style.backgroundColor = '#d3d3d3f5'
                            }
                            thirdSquare.setAttribute("disabled", "disabled");
                            //put in third grid row
                        }
                        else {
                            square.style.backgroundColor = colorList[catCount -1]
                            square.style.color = colorList[catCount -1]
                            square.style.border = colorList[catCount -1]
                            square.setAttribute("disabled", "disabled");
                        } 
                         
                        correctSquares.push(pressedSquares[i]);
                    }
                        
                        //add to correctsquares list
                        pressedSquares = [];
                    }
                    else {
                        //clear list of squares
                        //TO DO: change square colors back to light gray
                        for (var i = 0; i < pressedSquares.length; i++) { 
                            var square = document.getElementById(pressedSquares[i]);
                            square.style.backgroundColor = '#d3d3d3f5'
                        }
                        pressedSquares = [];
                        
                    }
                   //to do later when i get basic functionality working: switch squares to to be in row once guessed
                   pressedSquares = [];
                   wordList = [];
                   matchList = [];
    
              });
          
          var response = {
              rt: null,
          };
          // function to end trial when it is time
          const end_trial = () => {
            //console.log(pressedSquares)
            // measure rt
            var end_time = performance.now();
            var rt = Math.round(end_time - start_time);
            //response.button = parseInt(choice);
            response.rt = rt;
              // kill any remaining setTimeout handlers
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // gather the data to store for the trial
              var trial_data = {
                //possibilities to add: 
                  rt: response.rt,
                  stimulus: trial.stimulus,
                  pressed: pressTimes,
                
              };
              // clear the display
              display_element.innerHTML = "";
              // move on to the next trial
              this.jsPsych.finishTrial(trial_data);
          };
    
          // hide image if timing is set
          if (trial.stimulus_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  display_element.querySelector("#ist-grid").style.visibility = "hidden";
              }, trial.stimulus_duration);
          }
          // end trial if time limit is set
          if (trial.trial_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
          }
      }
  }
  ConnectionsPlugin.info = info;

  return ConnectionsPlugin;

})(jsPsychModule);

