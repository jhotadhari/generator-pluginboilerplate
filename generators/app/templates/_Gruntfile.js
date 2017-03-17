

module.exports = function(grunt){

	grunt.initConfig({
			
		/*	config	*/
		pattern: {
			global_exclude: [
				'!*~',
				'!**/*~',
				'!_test*',
				'!**/_test*',
				'!_del*',
				'!**/_del*',
			]
		},
		pkg: grunt.file.readJSON("package.json"),
		wp_installs: grunt.file.readJSON("wp_installs.json"),
		
		abs_path_pkg: require('path').resolve(),
		abs_path_home: process.env['HOME'],
		
		dist_path: "<%%= global['dist_path'] %>",
		test_path: "<%%= pkg.dirs.test %>",
		
		commit_msg: "<%%= global['commit_msg'] %>",
		
		/*	version	*/
		bump: {
			options: {
				files: ['package.json'],	// default
				updateConfigs: ['pkg'],
				commit: false,
				createTag: false,
				push: false,
			}
		},	
		
		/*	clean	*/
		clean: {
			build: {
				src: [
					// del all in test_path
					'<%%= test_path %>/*',
					
					// skip git
					'!.gitignore',
					'!.git',
					// skip node & grunt
					'!node_modules',
					'!Gruntfile.js',
					'!package.json',
					'!pkg.json',
					'!README.md',
					// skip dir src & dist
					'!src/**',
					'!dist/**'
				]
			},
			dist: {
				src: ['<%%= dist_path %>']
			},
		},
		
		/*	watch	*/
		watch: {
			// watch task does the same like build...
			
			// copy from src to root
				copy_root_files: {
					files: [
						'<%%= pkg.dirs.src %>/root_files/**/*',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'copy:root_files',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},
				<%if ( hasComposer ) { %>
				copy_vendor: {
					files: [
						'vendor/**/*',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'copy:vendor',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},
				<% } %>
				<%if ( hasImages ) { %>
				copy_images: {
					files: [
						'<%%= pkg.dirs.src %>/images/**/*',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'copy:images',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},
				<% } %>
				<%if ( hasFonts ) { %>
				copy_fonts: {
					files: [
						'<%%= pkg.dirs.src %>/fonts/**/*',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'copy:fonts',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},
				<% } %>
				copy_readme: {
					files: [
						'<%%= pkg.dirs.src %>/readme/**/*',
						'!**/dont_touch/**/*',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'copy:readme',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},	
				
				
			// assets
				<%if ( scriptFrontend ) { %>
				assets_js_frontend: {
					files: [
							'<%%= pkg.dirs.src %>/js/frontend/**/*.js',
							'!**/dont_touch/**/*',
							'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'jshint',
						'concat_in_order:js_frontend',
						'uglify:js_frontend',
						'local_sync:<%%= local_sync.wp_install %>:<%%= local_sync.version %>'
					]
				},
				<% } %>
				<%if ( scriptAdmin ) { %>
				assets_js_admin: {
					files: [
							'<%%= pkg.dirs.src %>/js/admin/**/*.js',
							'!**/dont_touch/**/*',
							'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'jshint',
						'concat_in_order:js_admin',
						'uglify:js_admin',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},
				<% } %>
				<%if ( styleFrontend || styleAdmin || styleOptionsPage ) { %>
				assets_styles: {
					files: [
						'<%%= pkg.dirs.src %>/sass/**/*.scss',
						'!**/dont_touch/**/*',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						<%if ( styleFrontend || styleAdmin ) { %>
						'concat_in_order:sass_custom_modules_frontend',
						<% } %>
						'sass:build',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},
				<% } %>
			
			// concat functions from src to root
				concat_functions: {
					files: [
						'<%%= pkg.dirs.src %>/functions/**/*.php',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'concat_in_order:functions',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},
				
			// 'concat_in_order:plugin_main_file',
				plugin_main_file: {
					files: [
						'<%%= pkg.dirs.src %>/plugin_main_file/**/*.php',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'concat_in_order:plugin_main_file',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				},

			// potomo
				potomo_pos: {
					files: [
						'<%%= pkg.dirs.src %>/languages/**/*.po',
						'<%%= pattern.global_exclude %>',
					],
					tasks: [
						'potomo:build',
						'local_sync:<%%= local_sync.wp_install %>'
					]
				}
		},
		
		
		rsync: {
			options: {
				// args: ["--verbose"],
				// exclude: [".git*","node_modules"],
				recursive: true
			},
			local_sync: {
				options: {
					src: '<%%= local_sync.src %>',
					dest: '<%%= local_sync.dest %>',
					delete: true                               
				}
			}
		},
	
		/*	transcompile	*/
		
		<%if ( scriptFrontend || scriptAdmin ) { %>
		jshint: {
			all: [
				'<%%= pkg.dirs.src %>/js/**/*.js',
				'!<%%= pkg.dirs.src %>/js/**/noLint/**/*.js',
				'!<%%= pkg.dirs.src %>/js/**/dont_touch/**/*.js',
				'<%%= pattern.global_exclude %>',
			]
		},
		<% } %>
		<%if ( scriptFrontend || scriptAdmin ) { %>
		uglify: {
			<%if ( scriptFrontend ) { %>
			js_frontend: {
				files: {
						'<%%= test_path %>/js/script.min.js': '<%%= pkg.dirs.src %>/js/frontend/dont_touch/_script_frontend.js'
					}
			},
			<% } %>
			<%if ( scriptFrontend ) { %>
			js_frontend_dist: {
				files: {
						'<%%= dist_path %>/js/script.min.js': '<%%= pkg.dirs.src %>/js/frontend/dont_touch/_script_frontend.js'
					}              
			},
			<% } %>
			<%if ( scriptAdmin ) { %>
			js_admin: {
				files: {
						'<%%= test_path %>/js/script_admin.min.js': '<%%= pkg.dirs.src %>/js/admin/dont_touch/_script_admin.js'
					}
			},
			<% } %>
			<%if ( scriptAdmin ) { %>
			js_admin_dist: {
				files: {
						'<%%= dist_path %>/js/script_admin.min.js': '<%%= pkg.dirs.src %>/js/admin/dont_touch/_script_admin.js'
					}              
			},	
			<% } %>
		},
		<% } %>
		
		<%if ( styleFrontend || styleAdmin || styleOptionsPage ) { %>
		sass:{
			options: {

				<%if ( sass_susy || sass_breakpoint ) { %>
				require: [
					<%if ( sass_susy ) { %>
					'susy',
					<% } %>
					<%if ( sass_breakpoint ) { %>
					'breakpoint'
					<% } %>
				],
				<% } %>
				<%if ( sass_bourbon ) { %>
				loadPath: require('node-bourbon').includePaths,
				<% } %>
			},
			
			build: {
				options: {
					// style: 'compressed'
				},
				files:{
					<%if ( styleFrontend ) { %>
					'<%%= test_path %>/css/style.css': '<%%= pkg.dirs.src %>/sass/style_frontend.scss',
					<% } %>
					<%if ( styleAdmin ) { %>
					'<%%= test_path %>/css/style_admin.css': '<%%= pkg.dirs.src %>/sass/style_admin.scss',
					<% } %>
					<%if ( styleOptionsPage ) { %>

					
'<%%= test_path %>/css/<%= funcPrefix %>_options_page.css': '<%%= pkg.dirs.src %>/sass/<%= funcPrefix %>_options_page.scss',
					<% } %>
				}
			},
			dist: {
				options: {
					sourcemap: 'none',
					style: 'compressed'
				},
				files:{
					<%if ( styleFrontend ) { %>
					'<%%= dist_path %>/css/style.css': '<%%= pkg.dirs.src %>/sass/style_frontend.scss',
					<% } %>
					<%if ( styleAdmin ) { %>
					'<%%= dist_path %>/css/style_admin.css': '<%%= pkg.dirs.src %>/sass/style_admin.scss',
					<% } %>
					<%if ( styleOptionsPage ) { %>

					
'<%%= dist_path %>/css/<%= funcPrefix %>_options_page.css': '<%%= pkg.dirs.src %>/sass/<%= funcPrefix %>_options_page.scss',
					<% } %>
				}
			}
		},
		<% } %>
		
		/*	copy	*/
		copy: {
			//	src/root_files to ...
			root_files: {		
				expand: true,
				cwd: '<%%= pkg.dirs.src %>/root_files/',
				src: ['**/*','<%%= pattern.global_exclude %>'],
				dest: '<%%= test_path %>'	
			},
			root_files_dist: {		
				expand: true,
				cwd: '<%%= pkg.dirs.src %>/root_files/',
				src: ['**/*', '<%%= pattern.global_exclude %>'],
				dest: '<%%= dist_path %>'	
			},			
			<%if ( hasComposer ) { %>
			//	vendor to ...
			vendor: {		
				expand: true,
				cwd: 'vendor/',
				src: ['**/*', '<%%= pattern.global_exclude %>'],
				dest: '<%%= test_path %>/includes/'	
			},
			vendor_dist: {		
				expand: true,
				cwd: 'vendor/',
				src: ['**/*', '<%%= pattern.global_exclude %>'],
				dest: '<%%= dist_path %>/includes/'	
			},
			<% } %>
			<%if ( hasImages ) { %>
			//	images to ...
			images: {		
				expand: true,
				cwd: '<%%= pkg.dirs.src %>/images/',
				src: ['**/*', '<%%= pattern.global_exclude %>'],
				dest: '<%%= test_path %>/images/'	
			},
			images_dist: {		
				expand: true,
				cwd: '<%%= pkg.dirs.src %>/images/',
				src: ['**/*', '<%%= pattern.global_exclude %>'],
				dest: '<%%= dist_path %>/images/'	
			},	
			<% } %>
			<%if ( hasFonts ) { %>			
			//	fonts to ...
			fonts: {		
				expand: true,
				cwd: '<%%= pkg.dirs.src %>/fonts/',
				src: ['**/*', '<%%= pattern.global_exclude %>'],
				dest: '<%%= test_path %>/fonts/'	
			},
			fonts_dist: {		
				expand: true,
				cwd: '<%%= pkg.dirs.src %>/fonts/',
				src: ['**/*', '<%%= pattern.global_exclude %>'],
				dest: '<%%= dist_path %>/fonts/'	
			},
			<% } %>
			
			
			//	readme to ...
			readme: {		
				src: ['<%%= pkg.dirs.src %>/readme/dont_touch/_readme.txt'],
				dest: '<%%= test_path %>/readme.txt'
			},
			readme_dist: {		
				src: ['<%%= pkg.dirs.src %>/readme/dont_touch/_readme.txt'],
				dest: '<%%= dist_path %>/readme.txt'
			}
		},		

		
			
		/*	concat	*/
		concat_in_order: {
			//	src/functions to root
			options: {
				extractRequired: function (filepath, filecontent) {
					return this.getMatches(/grunt\.concat_in_order\.require\(['"]([^'"]+)['"]/g, filecontent);
				},
				extractDeclared: function (filepath, filecontent) {
					return this.getMatches(/grunt\.concat_in_order\.declare\(['"]([^'"]+)['"]/g, filecontent);
				}
			},
			// functions
			functions: {
				files: {
					'<%%= test_path %>/functions.php': [
							'<%%= pkg.dirs.src %>/functions/**/*.php',
							'<%%= pattern.global_exclude %>',
						]
				}
				
			},
			functions_dist: {
				files: {
					'<%%= dist_path %>/functions.php': [
							'<%%= pkg.dirs.src %>/functions/**/*.php',
							'<%%= pattern.global_exclude %>',
						]
				}
				
			},
			
			
			plugin_main_file: {
				files: {
					'<%%= test_path %>/<%%= pkg.name %>.php': [
					//'<%%= pkg.dirs.src %>/plugin_main_file/dont_touch/plugin_main_file.php': [
							'<%%= pkg.dirs.src %>/plugin_main_file/**/*.php',
							'<%%= pattern.global_exclude %>',
						]
				}
				
			},			
			
			plugin_main_file_dist: {
				files: {
					'<%%= dist_path %>/<%%= pkg.name %>.php': [
					//'<%%= pkg.dirs.src %>/plugin_main_file/dont_touch/plugin_main_file.php': [
							'<%%= pkg.dirs.src %>/plugin_main_file/**/*.php',
							'<%%= pattern.global_exclude %>',
						]
				}
				
			},		
			<%if ( scriptFrontend ) { %>
			// js
			js_frontend: {
				files: {
					'<%%= pkg.dirs.src %>/js/frontend/dont_touch/_script_frontend.js': [
							'<%%= pkg.dirs.src %>/js/frontend/**/*.js',
							'!**/dont_touch/**/*.js',
							'<%%= pattern.global_exclude %>',
						]
				}
			},	
			<% } %>
			<%if ( scriptAdmin ) { %>
			js_admin: {
				files: {
					'<%%= pkg.dirs.src %>/js/admin/dont_touch/_script_admin.js': [
							'<%%= pkg.dirs.src %>/js/admin/**/*.js',
							'!**/dont_touch/**/*.js',
							'<%%= pattern.global_exclude %>',
						]
				}
			},	
			<% } %>
			<%if ( styleFrontend ) { %>
			sass_custom_modules_frontend: {
				files: {
					'<%%= pkg.dirs.src %>/sass/custom_modules/frontend/dont_touch/custom_modules.scss': [
							'<%%= pkg.dirs.src %>/sass/custom_modules/frontend/**/*.scss',
							'!**/dont_touch/**/*.scss',
							'<%%= pattern.global_exclude %>',
						]
				}			
			},
			<% } %>
			<%if ( styleAdmin ) { %>
			sass_custom_modules_admin: {
				files: {
					'<%%= pkg.dirs.src %>/sass/custom_modules/admin/dont_touch/custom_modules.scss': [
							'<%%= pkg.dirs.src %>/sass/custom_modules/admin/**/*.scss',
							'!**/dont_touch/**/*.scss',
							'<%%= pattern.global_exclude %>',
						]
				}			
			}
			<% } %>

		},
			
		concat: {
			prepend_to__readme_hist: {
				options: {
					banner: '= <%%= pkg.version %> =\n<%%= global["commit_msg"] %>\n',
				},
				src: 'src/readme/dont_touch/_readme_hist.txt',
				dest: 'src/readme/dont_touch/_readme_hist.txt'
			},
			readme_and_hist: {
				options: {
					banner: '=== <%%= pkg.fullName %> ===\nTags: <%%= pkg.tags %>\nDonate link: <%%= pkg.donateLink %>\nContributors: <%%= pkg.contributors %>\nTested up to: <%%= pkg.wpVersionTested %>\nRequires at least: <%%= pkg.wpRequiresAtLeast%>\nStable tag: trunk\nLicense: <%%= pkg.license %>\nLicense URI: <%%= pkg.licenseUri %>\n\n<%%= pkg.description %>\n',
					separator: '\n\n== Changelog ==\n\n'
				},
				src: [
					'src/readme/readme.txt',
					'src/readme/dont_touch/_readme_hist.txt'
				],
				dest: 'src/readme/dont_touch/_readme.txt'			
			}
		},		
		
		
		/*	languages, po to mo */
		potomo: {
			options: {
				poDel: false
			},			
			build: { 
				files: [{
					expand: true,
					cwd: '<%%= pkg.dirs.src %>/languages/',
					src: ['*.po'],
					dest: '<%%= test_path %>/languages',
					ext: '.mo',
					nonull: true
				}]				
			},
			dist: { 
				files: [{
					expand: true,
					cwd: '<%%= pkg.dirs.src %>/languages/',
					src: ['*.po'],
					dest: '<%%= dist_path %>/languages',
					ext: '.mo',
					nonull: true
				}]				
			}
		},
		
		
		/*	git	*/
		git: {
			add: {
				options: {
					A: true,
				},
			},
			commit: {
				options: {
					m: 'version <%%= pkg.version %>\n\n<%%= commit_msg %>'
				}
			}
		},
		
		
		/*	other tasks, not used in watch/build/dist	*/
		pot: {	// create pot file, scan all php in src
			options:{
				text_domain: '<%%= pkg.textDomain %>',
				msgmerge: false,	// true will merge it into existing po file, but with fuzzy translations
				dest: '<%%= pkg.dirs.src %>/languages/',
				keywords: ['__','_e','esc_html__','esc_html_e','esc_attr__', 'esc_attr_e', 'esc_attr_x', 'esc_html_x', 'ngettext', '_n', '_ex', '_nx' ],
			},
			files:{
			src:  [
				'<%%= pkg.dirs.src %>/**/*.php',
				'<%%= pattern.global_exclude %>',
			],
			expand: true,
			}
		},
		
	

	});

	
	// load plugins
		require('load-grunt-tasks')(grunt);
	
	// register tasks
		
		// default
			grunt.registerTask('default', 'default task', [
				'watch_sync'
			]);
			
		// build - build into testingDir ... to test in development environment
			grunt.registerTask('build', 'build into test', function(){
			
				var pkg = grunt.file.readJSON("package.json");
				// var test_path = pkg.dirs.test;
				var src_path = pkg.dirs.src;
		
				grunt.task.run([
					// clean up	
						'clean:build',
					<%if ( hasComposer ) { %>
					//	composer
						'composer:update',
					<% } %>

					// copy from src to testingDir
						'copy:root_files',
						<%if ( hasComposer ) { %>
						'copy:vendor',
						<% } %>

						<%if ( hasImages ) { %>
						'copy:images',
						<% } %>

						<%if ( hasFonts ) { %>
						'copy:fonts',
						<% } %>

						'copy:readme',
						
					// assets from src to testingDir
						<%if ( scriptAdmin || scriptFrontend ) { %>
						'jshint',
						<% } %>

						<%if ( scriptFrontend ) { %>
						'concat_in_order:js_frontend',
						'uglify:js_frontend',

						<% } %>

						<%if ( scriptAdmin ) { %>
						'concat_in_order:js_admin',
						'uglify:js_admin',
						<% } %>

						<%if ( styleFrontend ) { %>
						'concat_in_order:sass_custom_modules_frontend',
						<% } %>

						<%if ( styleAdmin ) { %>
						'concat_in_order:sass_custom_modules_admin',
						<% } %>

						<%if ( styleAdmin || styleFrontend) { %>
						'sass:build',
						<% } %>


					// concat functions from src to testingDir

						'_create_plugin_info:' + src_path + '/',
						'concat_in_order:functions',
						

						'concat_in_order:plugin_main_file',

						
					// potomo
						'_pot',
						'_potomo:build',
						
				]);
			});
			
		// watch and sync to local wp install
		grunt.registerTask('watch_sync', 'watch file changes, build them to test, and sync test to local wp install', function( install, version ){
		
			var wp_installs;
			
			// check if args
			if ( arguments.length === 0 ){
				// grunt.warn("local install must be specified");
				install = '';
			}
			// check if arg install is empty str
			if ( install === '' ){
				grunt.log.writeln('sync dest is empty ... no sync, just watch');
			}
			// set version 'test' if empty or undefined
			if ( version === '' || typeof version === 'undefined'){
				version = 'test';
			}
			// check if arg install is specified in wp_installs


			wp_installs = grunt.file.readJSON('wp_installs.json');
			if ( install != '' && typeof wp_installs[install] != 'object' ){
				grunt.warn("unknown local install");
			}
			
			// set config
			grunt.config.set('local_sync',{
				wp_install: install,
				version: version
			});
			
			// run tasks
			grunt.task.run([     
				'watch'
			]);
			
		});
		
		grunt.registerTask('local_sync', 'sync to local wp install', function( install, version ){

			var pkg, wp_installs, install, abs_path_pkg, abs_path_home, src, dest;
			// check if args
			if ( arguments.length === 0 ){
				grunt.warn("local install must be specified");
			}
			// check if arg install is empty str
			if ( install === '' ){
				grunt.log.writeln('sync dest is empty ... no sync');
				return;
			}
			// set version 'test' if empty or undefined
			if ( version === '' || typeof version === 'undefined'){
				grunt.log.writeln('version empty or  undefined ... set to "test"');
				version = 'test';
			}
			// check if arg install is specified in wp_installs


			wp_installs = grunt.file.readJSON('wp_installs.json');
			if ( install != '' && typeof wp_installs[install] != 'object' ){
				grunt.warn("unknown local install");
			}
			
			pkg = grunt.file.readJSON('package.json');
			
			// set paths
			abs_path_pkg = require('path').resolve();
			abs_path_home = process.env['HOME'];
			dest = abs_path_home + wp_installs[install].local + pkg.name + '/';

			if ( version === 'test' ){
				src = abs_path_pkg + '/' + pkg.dirs.test + '/';

			} else if ( version === 'trunk'){
				src = abs_path_pkg + '/' + pkg.dirs.dist + '/' + 'trunk' + '/';

			} else if ( /((\d)\.(\d)\.(\d))/.test(version)){
				src = abs_path_pkg + '/' + pkg.dirs.dist + '/tags/' + version + '/';
				
				if (! grunt.file.exists(src)){
					grunt.warn('"' + version + '" is no valid version');
				}
			} else {
				grunt.warn('"' + version + '" is no valid version');
			}
			
			// set config
			grunt.config.merge({
				local_sync: {
					src: src,
					dest: dest,
				}
			});
			
			// run tasks
			grunt.task.run([     
				'rsync:local_sync'
			]);
			
		});	
				
		// dist - build into dist, in versioned subfolder
			grunt.registerTask('dist', 'build into dist', function(vInc) {
				if ( (arguments.length === 0) || (! /^(major|minor|patch)$/.exec(vInc))) {
					grunt.warn("Version increment must be specified\n['major','minor','patch']\nlike: " + this.name + ":patch\n");
				}
				
				var msg_obj_path = 'src/readme/commit_msg.json';
				global['msg_obj_path'] = msg_obj_path;
				var msg_obj = grunt.file.readJSON( msg_obj_path );
				
				var commit_msg = '';
				

				var key;

				for (key in msg_obj) {
					if ( (msg_obj.hasOwnProperty(key)) && ( key != 'test') ) {
						commit_msg += msg_obj[key] + '\n';
					}
				}
				
				if ( commit_msg.length == 0 ) {
					grunt.warn("No commit info found in: " + msg_obj_path + "\n");
				}
				
				global['commit_msg'] = commit_msg;
				
				/*
					run tasks
				*/
				
				grunt.task.run([
					// version bump
						'bump:' + vInc,
					// run other dist tasks ... needs to be seperated for bumb versioning
						'_create_readme',
						'_dist_setPaths',
											
					]);
						
			});

		// _create_plugin_info
			grunt.registerTask('_create_plugin_info', 'sub task', function(dest) {
				if (arguments.length === 0) {
					grunt.log.writeln("ERROR " + this.name + " needs an destionationPath as argument");
					return;
				}
				
				var pkg = grunt.file.readJSON("package.json");
				var infoStr = '';
				infoStr += '<?php' + '\n';
				infoStr += '/*' + '\n';
				infoStr += 'Plugin Name: ' + pkg.fullName + '\n';
				infoStr += 'Plugin URI: ' + pkg.uri + '\n';
				infoStr += 'Description: ' + pkg.description + '\n';


				infoStr += 'Version: ' + pkg.version + '\n';
				infoStr += 'Author: ' + pkg.author + '\n';
				infoStr += 'Author URI: ' + pkg.authorUri + '\n';
				infoStr += 'License: ' + pkg.license + '\n';
				infoStr += 'License URI: ' + pkg.licenseUri + '\n';
				infoStr += 'Text Domain: ' + pkg.textDomain + '\n';
				infoStr += 'Domain Path: ' + pkg.domainPath + '\n';
				infoStr += 'Tags: ' + pkg.tags + '\n';
				infoStr += '*/' + '\n';
				infoStr += '\n';

				infoStr += '/*' + '\n';
				infoStr += "	grunt.concat_in_order.declare('_plugin_info');" + '\n';
				infoStr += '*/' + '\n';
				
				infoStr += '\n';
				infoStr += '?>';
	
				// grunt.file.write( dest + 'style.css', infoStr);
				grunt.file.write( dest + 'plugin_main_file/dont_touch/_plugin_info.php', infoStr);
				
				grunt.log.writeln("version: " + pkg.version);
			});	
			
		// _create_readme
			grunt.registerTask('_create_readme', 'sub task', function() {
			
					grunt.task.run([
						// append commit msg to _readme_hist.txt
						'concat:prepend_to__readme_hist',
						// concat readme parts to _readme.txt
						'concat:readme_and_hist'
					]);
			});
			
		// _dist_setPaths
			grunt.registerTask('_dist_setPaths', 'sub task', function() {
					
				// set paths
				var i;

				var pkg = grunt.file.readJSON("package.json");
				
				grunt.log.writeln('dist version: ' + pkg.version);
				
				var dist_path = [
					pkg.dirs.dist + '/tags/' + pkg.version,
					pkg.dirs.dist + '/' + 'trunk'
				];
				
				// run tasks
				for ( i = 0, len = dist_path.length; i < len; i++) {
					grunt.task.run('_dist_tasks:' + dist_path[i]);
				}
				grunt.task.run([
					'_dist_git_tasks',
					'_reset_commit_msg_json',
				]);
			});

		// _dist_tasks
			grunt.registerTask('_dist_tasks', 'sub task', function(dist_path) {
				
				var pkg = grunt.file.readJSON("package.json");
				var src_path = pkg.dirs.src;
				
				global['dist_path'] = dist_path;
				
				grunt.task.run([
					// clean up dist folder
						'clean:dist',
					<%if ( hasComposer ) { %>
					//	composer
						'composer:update',
					<% } %>

					// copy from src to testingDir
						'copy:root_files_dist',
						<%if ( hasComposer ) { %>
						'copy:vendor_dist',
						<% } %>

						<%if ( hasImages ) { %>
						'copy:images_dist',
						<% } %>

						<%if ( hasFonts ) { %>
						'copy:fonts_dist',
						<% } %>

						'copy:readme_dist',
						
					// assets from src to testingDir
						<%if ( scriptAdmin || scriptFrontend ) { %>
						'jshint',
						<% } %>

						<%if ( scriptFrontend ) { %>
						'concat_in_order:js_frontend',
						'uglify:js_frontend_dist',

						<% } %>

						<%if ( scriptAdmin ) { %>
						'concat_in_order:js_admin',
						'uglify:js_admin_dist',
						<% } %>

						<%if ( styleFrontend ) { %>
						'concat_in_order:sass_custom_modules_frontend',
						<% } %>

						<%if ( styleAdmin ) { %>
						'concat_in_order:sass_custom_modules_admin',
						<% } %>

						<%if ( styleAdmin || styleFrontend) { %>
						'sass:dist',
						<% } %>


					// concat functions from src to dist

						'_create_plugin_info:' + src_path + '/',
						'concat_in_order:functions_dist',
						
						'concat_in_order:plugin_main_file_dist',

						
					// potomo
						'_pot',
						'_potomo:dist',
						
						
					
				]);
				
			});
			
		// _potomo
		grunt.registerTask('_potomo', 'sub task', function( _task ) {
		
				if ( ! _task) {
					var _task = 'build';
				}
				
				var dir = grunt.config.get('potomo')[_task].files[0].cwd;
				var filePattern = grunt.config.get('potomo')[_task].files[0].src[0];
				
				if ( grunt.file.expand( dir + '**/' + filePattern ).length ) {
					grunt.task.run(['potomo:' + _task ]);
				}
				
		});
		
		// _pot
		grunt.registerTask('_pot', 'sub task', function() {
			var dir = grunt.config.get('potomo').build.files[0].cwd;
			
			if( grunt.file.expand( dir ).length === 0 ){
				grunt.file.mkdir( dir )
			}	
			
			grunt.task.run(['pot']);
		});
			
		// _dist_git_tasks
			grunt.registerTask('_dist_git_tasks', 'sub task', function() {

				grunt.task.run([
					'git:add',
					'git:commit',
				]);

			});
			
		// _reset_commit_msg_json
			grunt.registerTask('_reset_commit_msg_json', 'sub task', function() {
				var reseted_commit_msg_json =
					{
						"test": "test",
					};
					
					grunt.file.write(global['msg_obj_path'], JSON.stringify(reseted_commit_msg_json, null, 2));
			
			});
			
			
};