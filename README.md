# generator-pluginboilerplate [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Yeoman generator for scaffolding a WordPress Plugin Boilerplate and a Grunt based build system



## Installation

First, install [Yeoman](http://yeoman.io) and generator-pluginboilerplate using [npm](https://www.npmjs.com/) (I assume you have pre-installed [node.js](https://nodejs.org/)).

```bash
npm install -g yo
npm install -g generator-pluginboilerplate
```

Requires:
* Ubuntu  (grunt will set the paths relative to home)
* node
* npm
* yeoman
* grunt-cli
* composer
* git
* sass
* ... sorry something missing here. coming soon.

It Works well with this configuration (sorry, never tested somewhere else):
* Ubuntu 16.04
* node 4.2.6
* npm 3.5.2
* yeoman 1.8.5
* grunt-cli 1.2.0
* XAMPP 5.6.21-0
* composer 1.2.2
* git 2.7.4
* sass 3.4.22


## Introduction

Develop a Plugin locally and synchronize it automatically with a local WordPress installation.

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
├── dist
│   ├── tags
│   └── trunk
├── node_modules
│   └── ...
├── src
│   ├── functions
│   │   ├── init.php
│   │   ├── Tstg_defaults.php
│   │   ├── Tstg_localize.php
│   │   └── tstg_options_page.php
│   ├── js
│   │   ├── admin
│   │   │   └── init.js
│   │   └── frontend
│   │       └── init.js
│   ├── languages
│   │   └── testing-text.pot
│   ├── plugin_main_file
│   │   ├── cmb2_init.php
│   │   ├── init.php
│   │   └── load_functions.php
│   ├── readme
│   │   ├── readme.txt
│   │   └── commit_msg.json
│   └── sass
│       ├── custom_modules
│       │   ├── admin
│       │   │   └── init.scss
│       │   └── frontend
│       │       └── init.scss
│       ├── style_admin.scss
│       ├── style_frontend.scss
│       └── tstg_options_page.scss
├── test
│   └── ...
├── vendor
│   └── ...
├── composer.json
├── composer.lock
├── Gruntfile.js
├── package.json
├── wp_installs.json
└── .gitignore
```


All files of some folders need a special header (its not really an header. Its after the ```<?php```, and after phpDoc stuff and after ... but should be somewhere close to the begining).
It looks like some js object, but is a string and grunt will just search that string. So it can/should be a comment.
If you need your files concatenated in a specific order (eg for scss), duplicate the "require" row as often as needed and change it accordingly.
So that's the header:
```
/*
	grunt.concat_in_order.declare('any_kind_of_unique_name');
	grunt.concat_in_order.require('init');
*/
```


* ```./wp_installs.json``` This File contains the paths to your local WP installations (relative to your home path on ubuntu).

* ```./package.json``` This File contains project information. Some of this will be used to generate the readme and the header in plugin main file. Don't change the version by yourself. The Grunt dist task will do that!

* ```./vendor``` This Folder contains remote ressouces added by composer. You shouldn't do anything inside this. Composer will do it.

* ```./test``` Contains the plugin in development state.
  * This Folder will be used as destination for all build and watch tasks.
  * It may be synchronized with local wp installation (depends on grunt task).

* ```./dist``` Contains the Plugin releases.
  * This folder will be generated on dist task. It has the same structure as the WP plugin repository.
  * Don't make changes in ```tags``` or ```trunk``` folder.

* ```./src``` This Folder contains the source code.
  * That's the folder where all/most of the development is done!

  * ```./src/plugin_main_file``` It will be the Plugin main File. In case of this example, it will be ```./test/testing-plugin.php```
    * Everything inside that folder will be concatenated in an specific order. All files need that header!
    * It will init the Plugin and load ```./test/functions.php```
    * Don't forget the ```<?php``` tag as first characters and the ```?>``` at the very last end of each file!

  * ```./src/functions``` Use this folder for all the plugin php code. It will be ```./test/functions.php```
    * Everything inside that folder will be concatenated in an specific order. All files need that header!
    * Don't forget the ```<?php``` tag as first characters and the ```?>``` at the very last end of each file!
    * Depending on generating process, this folder already contains some files:
      *  _defaults.php: A class to manage all default values (documentation coming sometime).
      *  _localize.php A class to manage all that stuff that will be accessible for the js (documentation coming sometime).
      *  _options_page.php An Options page, based on cmb2 (documentation coming sometime).

  * ```./js``` Contains all the JavaScript source.
    * ```./js/frontend``` Will be a single js file enqueued in wp_footer on frontend and has access to all that stuff managed by functions/localize class.
    * Everything inside that folder will be concatenated in an specific order. All files need that header!

  * ```./readme/readme.txt``` Contains the readme body. The header and changelog will be added automatically.

  * ```./readme/commit_msg.json``` Will be used as git commit message and added to the change log.
    * Required for dist task.
    * Put as many entries as you want, but any other key then "test".
    * Will be reseted when dist task finished.

  * ```./sass/tstg_options_page.scss``` Style for options page.

  * ```./sass/custom_modules/admin``` and ```./sass/custom_modules/frontend``` Will be the stylesheet, enqueued on frontend or admin.
    * Everything inside that folder will be concatenated in an specific order. All files need that header!

* ```./../dont_touch``` Contains some temporary stuff (and readme change log). Just don't touch it.



## Grunt tasks:
Most tasks are just sub tasks and will be used by the following main tasks:

* ```build``` will build the plugin into ./test

* ```watch_sync``` will watch file changes and build changes into ```./test```
  * ```watch_sync:example``` will synchronize after build to the "example" installation specified in ```./wp_installs.json```

* ```local_sync``` must be specified like this ```local_sync:example``` to sync it to the "example" installation specified in ```./wp_installs.json```
  * by default it will sync the ```./test``` folder. Use ```local_sync:example:0.0.1``` to push a specific version to the local wp.

* ```dist``` will do all the tasks for distribution
  * Version increment must be specified ```major|minor|patch```. for example ```dist:patch```
  * will update the version (in package.json, in readme ... ).
  * Will create the Plugin readme.
  * Will build the plugin into ```./dist/trunk``` and ```./dist/tag/VERSION```
  * Will add all to git and commit it (using the new version as commit message and all entries in ```./readme/commit_msg.json```)


## License

GNU General Public License v3 [jhotadhari](http://waterproof-webdesign.info/)


[npm-image]: https://badge.fury.io/js/generator-pluginboilerplate.svg
[npm-url]: https://npmjs.org/package/generator-pluginboilerplate
[travis-image]: https://travis-ci.org//generator-pluginboilerplate.svg?branch=master
[travis-url]: https://travis-ci.org//generator-pluginboilerplate
[daviddm-image]: https://david-dm.org//generator-pluginboilerplate.svg?theme=shields.io
[daviddm-url]: https://david-dm.org//generator-pluginboilerplate
