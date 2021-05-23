const { exec } = require("child_process");
const rootPath = __dirname;
const fs = require("fs");

const formattingSettings = {
  header: (title) => {
    return `# ${title}\n## Source File\n[sourceFile](./${title}/src/${title})\n\n<br/>\n\n`;
  },
  body: (link) => {
    return `- - -\n\n<br/>\n\n${link}\n* \n\n<br/>\n\n`;
  },
};

function formatTemplate(stringArray, title) {
  const header = formattingSettings.header(title);
  const body = stringArray.map((element) => {
    return formattingSettings.body(element);
  });

  let document = "";
  document = document.concat(header);

  body.forEach((element) => {
    document = document.concat(element);
  });

  return document;
}

const embedLinkIntoFile = (fileArray) => {
  return fileArray.map((file, index) => `![${index}](./images/${file})`);
};

function convertImagesToStrings(folder) {
  const folderPath = folder;
  const fileArray = fs.readdirSync(folderPath);

  return fileArray;
}

function populateMarkdown({ projectName = "" }) {
  const fileArray = convertImagesToStrings(`${projectName}/images`);
  const fileArrayWithEmbeddedLinks = embedLinkIntoFile(fileArray);
  const styledString = formatTemplate(fileArrayWithEmbeddedLinks, projectName);

  fs.writeFile(`${projectName}/${projectName}.md`, styledString, (err) => {
    if (err) return console.log("Error while writing to file");
  });

}

function pdf2svg() {
  this.runConversion = function ({ projectName = "", callback = {} }) {
    exec(
      `pdftocairo -png ${projectName}/src/${projectName}.pdf ${projectName}/images/${projectName}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log("There was an error while converting the pdf", error);
          return;
        }
        if (stderr) {
          console.log(`There was an error while converting the pdf: ${stderr}`);
          return;
        }
        callback();
      }
    );
  };
}

function createFolderStructure({ folderName = "", pdfFileName = "" }) {
  try {
    if (!fs.existsSync(pdfFileName)) {
      process.exit(7);
    }
    if (fs.existsSync(folderName)) {
      process.exit(8);
    }

    fs.mkdirSync(folderName);
    fs.mkdirSync(`${folderName}/images`);
    fs.mkdirSync(`${folderName}/src`);
    fs.writeFileSync(`${folderName}/${folderName}.md`, "");
    fs.renameSync(pdfFileName, `${folderName}/src/${folderName}.pdf`);
  } catch (err) {
    console.error("Error in folder creation: ", err);
  }
}

function inputSanitation(argArray) {
  const argArrayLength = argArray.length;

  // Errors for too few or too many arguments
  switch (argArrayLength) {
    case 0:
      process.exit(2);
      break;
    case 1:
      process.exit(3);
      break;
    case 3:
      process.exit(4);
      break;
  }

  // No pdf as input
  if (!argArray[0].includes(".pdf")) {
    process.exit(5);
  }

  // Spaces in input file
  if (argArray[0] != argArray[0].replace(" ", "")) {
    process.exit(6);
  }
}

const errorMessages = (errorNumber) => {
  switch (errorNumber) {
    case 0:
      return "Application finished";
    case 1:
      return "There was a general error";
    case 2:
      return "You did not provide any arguments; expected: pdf2md <file.pdf> <projectname>";
    case 3:
      return "Only provided one argument, needs two; expected: pdf2md <file.pdf> <projectname>";
    case 4:
      return "You provided 3 arguments, only 2 are allowed; expected: pdf2md <file.pdf> <projectname>";
    case 5:
      return "First argument should be the pdf file (input)";
    case 6:
      return "No spaces allowed in pdf file";
    case 7:
      return "Specified pdf file does not exist";
    case 8:
      return "Specified project folder already exists";
  }
};

function initiateErrorMessages() {
  process.on("exit", (number) => {
    number === 0
      ? console.error(`NICE: ${errorMessages(number)}`)
      : console.error(`ERROR: ${errorMessages(number)}`);
  });
}

exports.convert = function () {
  const argArray = process.argv.splice(2);

  initiateErrorMessages();
  inputSanitation(argArray);

  const name = argArray.pop();
  const file = argArray.pop();

  createFolderStructure({ folderName: name, pdfFileName: file });

  console.log("PDF File     :", file);
  console.log("Project Name :", name);

  const pdf2svgRunner = new pdf2svg();

  const callback = () => {
    console.log("Finished image conversion");
    populateMarkdown({ projectName: name });
  };

  pdf2svgRunner.runConversion({
    projectName: name,
    callback: callback,
  });
};
