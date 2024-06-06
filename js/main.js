// Customize right-click menu

/* VARIABLES */
const TEXT_OFFSET = 0;
const CHAR_SIZE = 9.594;

const version = "v0.4.1";

// 20 chars
// 191.5px
// 20 chars * 9.1203 = 182.406
// 182.406 + 10.094
const prefixText = `[t1]you[/t1][t2]@[/t2][t3]samconsole-${version} $ [/t3]`;
/* END OF VARIABLES */

const output = document.getElementById("output");
const input = document.getElementById("terminalInput");
const prefix = document.getElementById("prefix");
const autocomplete = document.querySelector("div#autocomplete");
let lengthOfPrefix = 0;

let availableCommands = [
  "help",
  "doggo",
  "changelog",
  "education",
  "career",
  "overview",
  "credits",
  "history",
  "open",
  "repo",
  "penguins",
]; // Sets the available commands for the red stuff to work.

let advancedAvailableCommands = ["open "];

let commands = [];
let backIndex = 0;

function addRawLine(text) {
  output.innerHTML = output.innerHTML + text;
}
function colorize(text) {
  let colorizedText = text;
  colorizedText = colorizedText
    .replaceAll("[cr]", '<div class="colour red-stuff">')
    .replaceAll("[/cr]", "</div>"); // RED
  colorizedText = colorizedText
    .replaceAll("[cb]", '<div class="colour blue-stuff">')
    .replaceAll("[/cb]", "</div>"); // BLUE
  colorizedText = colorizedText
    .replaceAll("[cy]", '<div class="colour yellow-stuff">')
    .replaceAll("[/cy]", "</div>"); // YELLOW
  colorizedText = colorizedText
    .replaceAll("[cg]", '<div class="colour green-stuff">')
    .replaceAll("[/cg]", "</div>"); // GREEN
  colorizedText = colorizedText
    .replaceAll("[clb]", '<div class="colour lightblue-stuff">')
    .replaceAll("[/clb]", "</div>"); // LIGHT BLUE
  colorizedText = colorizedText
    .replaceAll("[clg]", '<div class="colour lightgreen-stuff">')
    .replaceAll("[/clg]", "</div>"); // LIGHT BLUE
  colorizedText = colorizedText
    .replaceAll("[t1]", '<div class="colour term1-stuff">')
    .replaceAll("[/t1]", "</div>");
  colorizedText = colorizedText
    .replaceAll("[t2]", '<div class="colour term2-stuff">')
    .replaceAll("[/t2]", "</div>");
  colorizedText = colorizedText
    .replaceAll("[t3]", '<div class="colour term3-stuff">')
    .replaceAll("[/t3]", "</div>");

  if (colorizedText.match(/\[click-\w+\]/g)) {
    // console.log("clicky");
    // console.log(
    //   colorizedText
    //     .match(/\[click-\w+\]/g)[0]
    //     .replace("[click-", "")
    //     .replace("]", "")
    // );
    const cmdName = colorizedText
      .match(/\[click-\w+\]/g)[0]
      .replace("[click-", "")
      .replace("]", "");
    // console.log(cmdName);
    colorizedText = colorizedText.replaceAll(
      `[click-${cmdName}]`,
      `<div class='inline click' woofclick='${cmdName}'>`
    );
  }
  if (
    colorizedText.match(
      /\[link-https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\]/g
    )
  ) {
    // console.log("clicky");
    // console.log(
    //   colorizedText
    //     .match(/\[click-\w+\]/g)[0]
    //     .replace("[click-", "")
    //     .replace("]", "")
    // );
    colorizedText
      .match(
        /\[link-https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)\]/g
      )
      .forEach((element) => {
        const linkUrl = element.replace("[link-", "").replace("]", "");
        // console.log(cmdName);
        colorizedText = colorizedText.replaceAll(
          `[link-${linkUrl}]`,
          `<a href="${linkUrl}" target=\"_blank">`
        );
      });
  }
  colorizedText = colorizedText.replaceAll("[/link]", "</a>");
  colorizedText = colorizedText.replaceAll("[/click]", "</div>");
  if (colorizedText.match(/\[\d+s\/\]/g)) {
    colorizedText.match(/\[\d+s\/\]/g).forEach((element) => {
      let numOfSpaces = element.replace(/(\[|s|\/|\])/g, "");

      if (numOfSpaces.match(/\d+/g)) {
        let spaces = "";
        for (var i = 0; i < parseInt(numOfSpaces); i++) {
          spaces = spaces + "[s/]";
          //   console.log(spaces);
        }
        colorizedText = colorizedText.replace(
          "[" + numOfSpaces + "s/]",
          spaces
        );
      }
    });
  }

  colorizedText = colorizedText.replaceAll("[n/]", "<br/>");
  colorizedText = colorizedText.replaceAll("[s/]", "&nbsp;");
  colorizedText = colorizedText.replaceAll("[&09&]", "");

  return colorizedText;
}
function addLine(text) {
  addRawLine('<div class="line">' + colorize(text) + "</div>");
}
function clearOutput() {
  output.innerHTML = "";
}
function setInput(text) {
  input.value = text;
  var that = input;
  setTimeout(function () {
    that.selectionStart = that.selectionEnd = 10000;
  }, 0);
  const event = new Event("input");
  input.dispatchEvent(event);
}
function refocus() {
  input.focus();
}
function checkIfStringStartsWith(str, substrs) {
  return substrs.some((substr) => str.startsWith(substr));
}

function commandExists(command) {
  return (
    availableCommands.indexOf(command) >= 0 ||
    checkIfStringStartsWith(command, advancedAvailableCommands)
  );
}
commandExists("hello");
function addCommandLine() {
  const doesCommandExists = commandExists(input.value);
  addLine(
    prefixText +
      (doesCommandExists
        ? input.value
        : "<div class='error inline'>" + input.value + "</div>")
  );
}
function openTab(url) {
  window.open(url, "_blank").focus();
}
function helpCommand(cmd, desc) {
  addLine(`[clb][click-${cmd}]${cmd}[/click][/clb][n/][3s/]${desc}`);
}
function stextLength(text) {
  cleanText = colorize(text).replace(/<\/?[^>]+(>|$)/g, "");
  return cleanText.length;
}
input.addEventListener("input", (event) => {
  event.target.setAttribute(
    "size",
    event.target.value.length < 1 ? 1 : event.target.value.length
  );
  event.target.setAttribute(
    "maxlength",
    event.target.value.length < 1 ? 3 : event.target.value.length + 2
  );
  //   console.log(event.target.value);
  if (commandExists(event.target.value)) {
    try {
      event.target.classList.remove("error");
    } catch {}
  } else {
    event.target.classList.add("error");
  }
  let clear = true;

  if (clear) {
    autocomplete.innerHTML = "";
  }

  if (input.value != "") {
    for (var i = 0; i < availableCommands.length; i++) {
      if (
        availableCommands[i].startsWith(input.value) &&
        availableCommands[i] != input.value
      ) {
        // console.log(availableCommands[i]);
        autocomplete.innerHTML = availableCommands[i];
        break;
      }
    }
  } else {
    autocomplete.innerHTML = "";
  }
});

refocus();

clearOutput();

prefix.innerHTML = colorize(prefixText);
function advancedCommands(cmd) {
  let command = cmd.split(" ")[0];
  let args = cmd.split(" ");
  args.shift();

  //   addLine("CMD: " + command);
  //   addLine("Args: " + args);

  switch (command) {
    case "open":
      addLine(
        `[cg]Opening ${
          args.join("%20") == "" ? "nothing??" : args.join("%20")
        }...[/cg]`
      );
      openTab(args.join("%20"));
      break;
    default:
      return false;
  }
  return true;
}
function commandHandler(command, cmdline = true) {
  if (cmdline) addCommandLine();
  backIndex = 0;

  switch (command) {
    case "help":
      helpCommand("help", "Outputs help message (AKA [cb]this[/cb])");
      helpCommand("doggo", "Who is the doggo");
      helpCommand("changelog", "A Brief History of Sam");
      helpCommand("education", "Education History");
      helpCommand("career", "Career History");
      helpCommand("cv", "Opens CV");
      helpCommand("overview", "overview with links");
      helpCommand("startup", "Says startup message");
      helpCommand("credits", "Displays credits");
      helpCommand("penguins", "Generate new penguin image");
      helpCommand("history", "Shows command history of current session");
      helpCommand("open", "Opens a new tab with passed in url");
      helpCommand("repo", "Shows the github repos link");
      break;
    
    case "doggo":
      addLine("Arlo is my pet cockapoo! He is as adorable as he is clingy");
      addLine("Known aliases:");
      addLine("[cy]Bud[/cy]");
      addLine("[cy]Monkey Man[/cy]");
      addLine("[cy]Señor Monk[/cy]");
      addLine("[cy]Ewok no.3[/cy]");
      break;

    case "changelog":
      addLine("Changelog:");
      addLine("[n/]");

      addLine("[2s/]1997:");
      addLine("[4s/]Born");
      addLine("[n/]");

      addLine("[2s/]2015-2018:");
      addLine("[4s/]Portsmouth University");
      addLine("[6s/]BSc Psychology");
      addLine("[n/]");

      addLine("[2s/]2018-2019:");
      addLine("[4s/]York University");
      addLine("[6s/]MSc Cognitive Neuroscience");
      addLine("[n/]");

      addLine("[2s/]2019-2020:");
      addLine("[4s/]Sparta Global");
      addLine("[6s/]Trainee DevOps Engineer");
      addLine("[n/]");

      addLine("[2s/]2020-2022:");
      addLine("[4s/]CGI");
      addLine("[6s/]DevOps Engineer");
      addLine("[n/]");

      addLine("[2s/]2022-Present:");
      addLine("[4s/]Insurwave");
      addLine("[6s/]Senior Platform Engineer");
      addLine("[n/]");
      break;

    case "cv":
      const iframe = document.createElement('iframe');
        iframe.src = './files/SamuelWatsonCV.pdf';
        iframe.width = '100%';
        iframe.height = '600px';
        document.body.appendChild(iframe);

        // Add a button to close the iframe
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.addEventListener('click', function() {
            document.body.removeChild(iframe);
            document.body.removeChild(closeButton);
        });
        document.body.appendChild(closeButton);
      break;

    case "career":
      addLine("[cy]History:[/cy]");
      addLine(commands.join("[n/]"));
      break;

    case "startup":
      addLine("Welcome to My Terminal " + version + "!");
      addLine(
        "[cy]TIPS:[/cy] Use the [clb][click-help]help[/click][/clb] command to recieve help!"
      );
      break;
    case "credits":
      addLine("Thanks to ");
      addLine("[3s/][cy]Absolutely nobody[/cy] ");
      addLine("[6s/]Just kidding...");
      addLine(
        "[n/][clb]GitHub Source Repo: [link-https://github.com/woooferz/terminalweb] Link[/link]"
      )
      break;
    case "overview":
      const overview = `
    [cy][4s/].---.[/cy]
    [n/]        
    [cy][3s/]/[5s/]\\[/cy]
    [n/]    
    [cy][3s/]\\.@-@./[/cy] [clb]Terminal:[/clb] [cg]Woof Terminal ${version}[/cg] 
    [n/]
    [cy][3s/]/[s/]\\_/[s/]\\[/cy]  [clb]Theme:[/clb] [cg]Waffle Basic Theme[/cg]
    [n/]
    [cy][2s/]//[2s/]_[2s/]\\\\[/cy]     [clb]My Website:[/clb] [cg][link-https://wooferz.dev]wooferz.dev[/link][/cg]
    [n/]      
    [cy][s/]| \\[5s/])|_[/cy]   [clb]Hardware:[/clb] [cg]Browser[/cg]
    [n/]      
    [cy][s/]/[s/]\\_> [s/]<_/ \\[/cy]   [clb]Repo:[/clb] [cg][link-https://github.com/woooferz/terminalweb]Github[/link][/cg]
    [n/]     
    [cy][s/]\\__/'--'\\__/[/cy]
    [n/]      
      `;
      addLine(overview);
      break;
    case "clear":
      clearOutput();
      break;
    case "penguins":

      function removePenguinImage() {
      const imgElement = document.getElementById("penguin-image");
      if (imgElement) {
          imgElement.remove();
        }
      }
      function updatePenguinImage(imgUrl) {
        const imgElement = document.getElementById("penguin-image");
        if (imgElement) {
            imgElement.src = imgUrl;
        } else {
            const newImgElement = document.createElement("img");
            newImgElement.id = "penguin-image";
            newImgElement.src = imgUrl;
            document.body.appendChild(newImgElement);
        }
      }
      fetch('https://penguin.sjsharivker.workers.dev/api')
        .then(response => response.json())
        .then(({ img, species }) => {
          addLine(`Species: ${species}`);
          updatePenguinImage(img);
        })
      .catch(error => console.error('Error fetching data:', error));
      break;
    default:
      if (!advancedCommands(command))
        addLine(
          "[cr]Unknown Command! Use [click-help]help[/click] for help![/cr]"
        );
      removePenguinImage();
      break;
  }
  window.scrollTo(0, document.body.scrollHeight);
}

input.onkeydown = function (e) {
  if (e.key == "Enter") {
    commandHandler(input.value);
    if (input.value != "") {
      commands.push(input.value);
    }
    setInput("");
    refocus();
  } else if (e.key == "ArrowUp") {
    backIndex = backIndex >= commands.length ? backIndex : backIndex + 1;
    setInput(backIndex <= 0 ? "" : commands[commands.length - backIndex]);
    refocus();
  } else if (e.key == "ArrowDown") {
    backIndex = backIndex <= 0 ? 0 : backIndex - 1;

    setInput(backIndex <= 0 ? "" : commands[commands.length - backIndex]);
    refocus();
  } else if (e.key == "Tab") {
    if (input.value != "") {
      for (var i = 0; i < availableCommands.length; i++) {
        if (
          availableCommands[i].startsWith(input.value) &&
          availableCommands[i] != input.value
        ) {
          // console.log(availableCommands[i]);
          setInput(availableCommands[i]);
          break;
        }
      }
    }
    e.preventDefault();
  }
  // console.log(e.key);
  // e.preventDefault();
  //   addLine(backIndex);
};

commandHandler("startup", false);

// document.getElementsByTagName("body")[0].addEventListener("change", (event) => {
//   const woofclicks = document.querySelectorAll(".click");
//   console.log(woofclicks);
//   woofclicks.forEach((woofclick) => {
//     woofclick.onclick = function (event) {
//       setInput(this.getAttribute("woofclick"));
//     };
//   });
// });
const woofclicks = document.querySelectorAll(".click");
woofclicks.forEach((woofclick) => {
  woofclick.onclick = function (event) {
    setInput(this.getAttribute("woofclick"));
  };
});
document.addEventListener("DOMSubtreeModified", (e) => {
  const woofclicks = document.querySelectorAll(".click");
  woofclicks.forEach((woofclick) => {
    woofclick.onclick = function (event) {
      setInput(this.getAttribute("woofclick"));
    };
  });
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
lengthOfPrefix = stextLength(prefixText);
marginPrefix = lengthOfPrefix * CHAR_SIZE + TEXT_OFFSET;
autocomplete.style.cssText += "margin-left:" + marginPrefix + "px;";
