# pdf2md

A command line tool that converts a pdf into pngs and embedds those into a markdown file.

## Getting Started

These instructions will get you up and running on your machine

## Prerequisites

What things you need to install the software and how to install them

```
poppler
npm
```

## Installing

1. Install Poppler
2. Install pdf2md


### 1. Install Poppler

**Linux (not tested)**

```
sudo apt-get install poppler-data
sudo apt-get install poppler-utils
```

**MacOS**
```
brew install poppler
```

**Windows**
```
not supported
```

### 2. Install pdf2md
#### Method: 1
Download the npm package from the official repo:

```
npm install -g pdf2md
```
#### Method: 2
You can install pdf2md by cloning the github repo and installing it globally:

```
git clone https://github.com/m0ne/pdf2md
cd pdf2md

npm install -g .
```

## Usage
The usage is super simple:

```
pdf2md <inputFile.pdf> <projectName>
```

It creates the following folder structure:
```
[projectName]
  [imgages]
    [projectName-01.png]
    [projectName-02.png]
    ...
  [src]
    [projectName.pdf]
  [projectName.md]
```

## Contributing

If you find a bug or want to add a feature, feel free to create an issue or create pull request.

## Authors

* **[m0ne](https://github.com/m0ne)** - *Initial work*

<a href="https://www.buymeacoffee.com/m0ne" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
