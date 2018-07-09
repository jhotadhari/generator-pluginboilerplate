# generator-pluginboilerplate [![NPM version][npm-image]][npm-url]
> Yeoman generator for scaffolding a WordPress Plugin Boilerplate and a Grunt based build system

[![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]


## Installation

First, install [Yeoman](http://yeoman.io) and generator-pluginboilerplate using [npm](https://www.npmjs.com/) (I assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-pluginboilerplate
```

Requires:
* It's only tested on Ubuntu and might not work on other OS
* node & npm
* yeoman
* grunt
* composer
* git

## Introduction

> Develop a Plugin locally and synchronize it automatically with a local WordPress installation.

* Generates an development environment based on Grunt. Structured in source (```./src/```), build (```./test/```) and distribution. Distribution (```./dist/```) directory is structured to match the WP plugin svn repository.
* Grunt watches file changes in source and performs the required tasks to update the build directory and optionally syncs it to another folder on your system (eg. the plugin directory of your local WordPress installation)
* Inits a git repository for your plugin (by default)
* Everything is ready to write js with node, commonJs and es6. Supports *.jst templates and React's *.jsx
* Uses Scss to build the stylesheets
* Subgenerators to easily add option-pages (based on cmb2), custom-post-types, gutenberg-blocks, styles, scripts ...
* Easy to add plugin dependencies (check the code of a generated plugin main file in .src/root_files/)
* Includes a composer Project Setup to include packages and repositories (check out the example plugins)

## Example Usage

Generate your new project:

```bash
cd your-new-plugin
yo pluginboilerplate
```

An Example Project with this kind of input:
* Tilte: "Testing Plugin"
* Slug: "testing-plugin"
* Function Prefix: "tstg"
* Text Domain: "testing-text"
* and agreed to all options

will output a project like this:

```
.
├── changelog.json
├── composer.json
├── dist
│   ├── assets
│   ├── branches
│   ├── tags
│   └── trunk
├── .git
│   └── ...
├── .gitignore
├── grunt
│   └── ...
├── Gruntfile.js
├── node_modules
│   └── ...
├── package.json
├── src
│   ├── commonJS
│   │   ├── vendor
│   │       └── vendor.js
│   ├── fonts
│   ├── images
│   ├── inc
│   │   ├── dep
│   │   │   └── autoload
│   │   ├── fun
│   │   │   └── autoload
│   │   │       └── class-tstg_defaults.php
│   │   ├── post_types_taxs
│   │   │   └── autoload
│   │   └── roles_capabilities
│   │       └── autoload
│   ├── js
│   │   └── noLint
│   ├── languages
│   │   └── testing-plugin.pot
│   ├── readme
│   │   └── readme.txt
│   ├── root_files
│   │   └── testing-plugin.php
│   └── sass
├── test
│   └── ...
├── vendor
│   └── ...
└── wp_installs.json
```


* ```./wp_installs.json``` This File contains the paths to your local WP installations.

* ```./package.json``` This File contains project information. Some of this will be used to generate the readme and the header in plugin main file. Don't change the version by yourself. Grunt tasks will do that!

* ```./changelog.json``` This File contains the changelog.
  * Only edit the 'next' array, don't edit other parts of the file
  * On Grunt dist task the plugin version will be increased, and the 'next' will be used for git commit message as well.

* ```./vendor/``` This Folder contains remote ressouces added by composer. You shouldn't do anything inside this. Composer will do it.

* ```./test/``` Contains the plugin in development state.
  * This Folder will be used as destination for all build and watch tasks.
  * It may be synchronized with local wp installation (depends on grunt task).

* ```./dist/``` Folder contains the Plugin releases.
  * It has the same structure as the WP plugin svn repository.
  * Don't make changes in ```tags``` or ```trunk``` folder.

* ```./grunt/``` Folder contains the Grunt tasks and config

* ```./src/``` This Folder contains the source code.
  * That's the folder where all/most of the development is done!

  * ```./src/inc/```
  	* Folder for files to be included.
  	* all ```./../autolaod/../*.php``` will be included automatically by the plugin main file.
  	* ```./dep/``` contains some files to load dependencies. Eg: The addPkg subgenerator uses this directory.
  	* ```./fun/``` contains all the fun, like classes and functions. Files in ```./fun/autoload/``` are included after files from ```./dep/autoload/```
  	* ```./post_types_taxs/``` contains files to register post types. You can add PostTypes with the ```pluginboilerplate:addPostType``` command
  	* ```./roles_capabilities/``` contains files to register roles and capabilities.

  * ```./src/js/```
  	* Contains all the JavaScript source.
  	* They will be linted and mangled by Grunt

  * ```./src/commonJS/```
  	* Contains all the node, commonJS and e6 source. Setup is ready to support *.jst templates and React's *.jsx
  	* Scripts will be linted by Grunt
  	* Scripts (not including subfolders) will be browserified, using some transforms. See ./grunt/config/_browserify.js
  	* Use a single js file as an entry point to your app and require/import files in subfolders
  	* Configure the "browserify-shim" property in your ```./package.json``` to make window variables accessable in your bundles scope
  	* Check the ```pluginboilerplate:addGbBlock``` subgenerator

  * ```./src/languages/```
  	* The pot file gets updated by Grunt tasks
  	* po files will be processed to mo files by Grunt

  * ```./src/readme/readme.txt```
  	* Contains the readme body. The header and changelog will be added automatically.

  * ```./src/root_files/```
  	* Contains all the files in your Plugins root folder. E.g. the plugin main file.
  	* The string 'taskRunner_setVersion' will be replaced by Grunt tasks
  	* The Plugin main file will init the Plugin if no required dependencies is missing and will include other plugin files. The ```$deps``` property contains an array with all dependencies. Usually no other changes to that file have to be done.

  * ```./src/sass/```
  	* Contains all scss files. They will be compiled and minified by grunt


## Grunt tasks:
Most tasks are just sub tasks and will be used by the following main tasks:

* ```build``` will build the plugin into ```./test/```

* ```watch_sync``` will watch file changes and build changes into ```./test/```
  * ```watch_sync:example``` will synchronize after build to the "example" installation specified in ```./wp_installs.json```

* ```local_sync``` must be specified like this ```local_sync:example``` to sync it to the "example" installation specified in ```./wp_installs.json```
  * by default it will sync the ```./test/``` folder. Use ```local_sync:example:0.0.1``` to push a specific version to the local wp.

* ```dist``` will do all the tasks for distribution
  * Version increment must be specified ```major|minor|patch```. for example ```dist:patch```
  * will update the version (in package.json, in readme ... ).
  * Will create the Plugin readme.
  * Will build the plugin into ```./dist/trunk/``` and ```./dist/tag/VERSION/```
  * Will add all to git and commit it (using the new version as commit message and all entries in ```./changelog.json 'next' ```)

### Skip tasks
You can pass options to skip the composer or git tasks. Eg.:
* ```grunt build --composer=false```
* ```grunt dist --git=false```

## Subgenerators:
  * ```pluginboilerplate:addGbBlock``` Generates a new Gutenberg Block. Options to include some basic es6 examples.
  * ```pluginboilerplate:addPkg``` Helps to add some often used packages to the plugin. E.g.: CMB2
  * ```pluginboilerplate:addOptionsPage``` Adds a boilerplate Options/Settings Page. Requires the CMB2 package. You can make changes to the Settings Page in the generated file.
  * ```pluginboilerplate:addPostType``` Adds a Custom Post Type
  * ```pluginboilerplate:addScript``` Will add a new script to the js or commonJS folder and a file to enqueue and localize the script.
  * ```pluginboilerplate:addStyle``` Adds a new scss file and a file to enqueue the style



## Example Plugins
* [Geo Masala](https://github.com/jhotadhari/geo-masala) Add interactive Leaflet Maps to your blog
  * Gutenberg Block that renders a Leaflet Map
  * Custom-post-type with some (serialized) meta exposed api and custom ui (all crud actions a done within the block)
  * Based on v1.2.0
* [Posts 2 Posts API](https://github.com/jhotadhari/posts-2-posts-api) REST API extension for Posts 2 Posts plugin
  * Custom REST controllers to provide API routes and endpoints for Connection-Types and Connections registered by [Posts 2 Posts](https://github.com/scribu/wp-posts-to-posts) Plugin.
  * Based on v1.2.0
* [Rain Effect](https://github.com/jhotadhari/rain-effect) Apply a rain effect to images using webGL
  * With customizer options. Can apply rain to header images (and other images), depending on the theme.
  * The rain effect is based on [Lucas Bebbers](http://gardenestudio.com.br/) script on [Codrops](https://tympanus.net/codrops/2015/11/04/rain-water-effect-experiments/).
  * Based on v1.0.3
* [export2word](https://github.com/jhotadhari/export2word) Export a website as a docx document
  * includes some packages and repositories with composer
  * Custom-post-types
  * Menu pages based on cmb2 with custom fields
  * Custom list tables
  * Based on v1.0.0 ... as far as I remember :)

## License

GNU General Public License v3 [jhotadhari](http://waterproof-webdesign.info/)


[npm-image]: https://badge.fury.io/js/generator-pluginboilerplate.svg
[npm-url]: https://npmjs.org/package/generator-pluginboilerplate
[travis-image]: https://travis-ci.org//generator-pluginboilerplate.svg?branch=master
[travis-url]: https://travis-ci.org//generator-pluginboilerplate
[daviddm-image]: https://david-dm.org//generator-pluginboilerplate.svg?theme=shields.io
[daviddm-url]: https://david-dm.org//generator-pluginboilerplate
